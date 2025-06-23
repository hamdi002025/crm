async function handler({ action, ...params }) {
  try {
    switch (action) {
      case "getCampaigns":
        return await getCampaigns(params);
      case "createCampaign":
        return await createCampaign(params);
      case "updateCampaign":
        return await updateCampaign(params);
      case "deleteCampaign":
        return await deleteCampaign(params);
      case "startCampaign":
        return await startCampaign(params);
      case "pauseCampaign":
        return await pauseCampaign(params);
      case "getTemplates":
        return await getTemplates(params);
      case "createTemplate":
        return await createTemplate(params);
      case "updateTemplate":
        return await updateTemplate(params);
      case "deleteTemplate":
        return await deleteTemplate(params);
      case "getSequences":
        return await getSequences(params);
      case "createSequence":
        return await createSequence(params);
      case "updateSequence":
        return await updateSequence(params);
      case "deleteSequence":
        return await deleteSequence(params);
      case "sendEmail":
        return await sendEmail(params);
      case "getCampaignStats":
        return await getCampaignStats(params);
      case "getEmailSends":
        return await getEmailSends(params);
      case "processAutomation":
        return await processAutomation(params);
      case "getLeadEngagement":
        return await getLeadEngagement(params);
      default:
        return { error: "Action non reconnue" };
    }
  } catch (error) {
    return { error: error.message };
  }
}

async function getCampaigns({ status, type, limit = 50, offset = 0 }) {
  let query = "SELECT * FROM marketing_campaigns WHERE 1=1";
  const values = [];
  let paramCount = 0;

  if (status) {
    paramCount++;
    query += ` AND status = $${paramCount}`;
    values.push(status);
  }

  if (type) {
    paramCount++;
    query += ` AND campaign_type = $${paramCount}`;
    values.push(type);
  }

  paramCount++;
  query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
  values.push(limit);

  paramCount++;
  query += ` OFFSET $${paramCount}`;
  values.push(offset);

  const campaigns = await sql(query, values);
  return { campaigns };
}

async function createCampaign({
  name,
  description,
  campaign_type,
  target_audience,
  email_template_id,
  schedule_config,
  automation_rules,
}) {
  const campaign = await sql`
    INSERT INTO marketing_campaigns (
      name, description, campaign_type, target_audience, 
      email_template_id, schedule_config, automation_rules, status
    ) VALUES (
      ${name}, ${description}, ${campaign_type}, ${JSON.stringify(
    target_audience
  )},
      ${email_template_id}, ${JSON.stringify(
    schedule_config
  )}, ${JSON.stringify(automation_rules)}, 'draft'
    ) RETURNING *
  `;

  return { campaign: campaign[0] };
}

async function updateCampaign({
  id,
  name,
  description,
  target_audience,
  email_template_id,
  schedule_config,
  automation_rules,
}) {
  const setClauses = [];
  const values = [];
  let paramCount = 0;

  if (name !== undefined) {
    paramCount++;
    setClauses.push(`name = $${paramCount}`);
    values.push(name);
  }

  if (description !== undefined) {
    paramCount++;
    setClauses.push(`description = $${paramCount}`);
    values.push(description);
  }

  if (target_audience !== undefined) {
    paramCount++;
    setClauses.push(`target_audience = $${paramCount}`);
    values.push(JSON.stringify(target_audience));
  }

  if (email_template_id !== undefined) {
    paramCount++;
    setClauses.push(`email_template_id = $${paramCount}`);
    values.push(email_template_id);
  }

  if (schedule_config !== undefined) {
    paramCount++;
    setClauses.push(`schedule_config = $${paramCount}`);
    values.push(JSON.stringify(schedule_config));
  }

  if (automation_rules !== undefined) {
    paramCount++;
    setClauses.push(`automation_rules = $${paramCount}`);
    values.push(JSON.stringify(automation_rules));
  }

  if (setClauses.length === 0) {
    return { error: "Aucune donnée à mettre à jour" };
  }

  paramCount++;
  const query = `UPDATE marketing_campaigns SET ${setClauses.join(
    ", "
  )} WHERE id = $${paramCount} RETURNING *`;
  values.push(id);

  const campaign = await sql(query, values);
  return { campaign: campaign[0] };
}

async function deleteCampaign({ id }) {
  await sql`DELETE FROM marketing_campaigns WHERE id = ${id}`;
  return { success: true };
}

async function startCampaign({ id }) {
  const campaign = await sql`
    UPDATE marketing_campaigns 
    SET status = 'active', started_at = CURRENT_TIMESTAMP 
    WHERE id = ${id} 
    RETURNING *
  `;

  if (campaign.length === 0) {
    return { error: "Campagne non trouvée" };
  }

  await processAutomation({ campaign_id: id });
  return { campaign: campaign[0] };
}

async function pauseCampaign({ id }) {
  const campaign = await sql`
    UPDATE marketing_campaigns 
    SET status = 'paused' 
    WHERE id = ${id} 
    RETURNING *
  `;

  return { campaign: campaign[0] };
}

async function getTemplates({ type, active_only = true, limit = 50 }) {
  let query = "SELECT * FROM email_templates WHERE 1=1";
  const values = [];
  let paramCount = 0;

  if (active_only) {
    query += " AND is_active = true";
  }

  if (type) {
    paramCount++;
    query += ` AND template_type = $${paramCount}`;
    values.push(type);
  }

  paramCount++;
  query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
  values.push(limit);

  const templates = await sql(query, values);
  return { templates };
}

async function createTemplate({
  name,
  subject,
  html_content,
  text_content,
  template_type = "marketing",
  variables,
}) {
  const template = await sql`
    INSERT INTO email_templates (
      name, subject, html_content, text_content, template_type, variables
    ) VALUES (
      ${name}, ${subject}, ${html_content}, ${text_content}, 
      ${template_type}, ${JSON.stringify(variables)}
    ) RETURNING *
  `;

  return { template: template[0] };
}

async function updateTemplate({
  id,
  name,
  subject,
  html_content,
  text_content,
  variables,
  is_active,
}) {
  const setClauses = [];
  const values = [];
  let paramCount = 0;

  if (name !== undefined) {
    paramCount++;
    setClauses.push(`name = $${paramCount}`);
    values.push(name);
  }

  if (subject !== undefined) {
    paramCount++;
    setClauses.push(`subject = $${paramCount}`);
    values.push(subject);
  }

  if (html_content !== undefined) {
    paramCount++;
    setClauses.push(`html_content = $${paramCount}`);
    values.push(html_content);
  }

  if (text_content !== undefined) {
    paramCount++;
    setClauses.push(`text_content = $${paramCount}`);
    values.push(text_content);
  }

  if (variables !== undefined) {
    paramCount++;
    setClauses.push(`variables = $${paramCount}`);
    values.push(JSON.stringify(variables));
  }

  if (is_active !== undefined) {
    paramCount++;
    setClauses.push(`is_active = $${paramCount}`);
    values.push(is_active);
  }

  if (setClauses.length === 0) {
    return { error: "Aucune donnée à mettre à jour" };
  }

  paramCount++;
  const query = `UPDATE email_templates SET ${setClauses.join(
    ", "
  )} WHERE id = $${paramCount} RETURNING *`;
  values.push(id);

  const template = await sql(query, values);
  return { template: template[0] };
}

async function deleteTemplate({ id }) {
  await sql`DELETE FROM email_templates WHERE id = ${id}`;
  return { success: true };
}

async function getSequences({ active_only = true, limit = 50 }) {
  let query = "SELECT * FROM follow_up_sequences WHERE 1=1";
  const values = [];
  let paramCount = 0;

  if (active_only) {
    query += " AND is_active = true";
  }

  paramCount++;
  query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
  values.push(limit);

  const sequences = await sql(query, values);
  return { sequences };
}

async function createSequence({
  name,
  description,
  trigger_conditions,
  steps,
}) {
  const sequence = await sql`
    INSERT INTO follow_up_sequences (
      name, description, trigger_conditions, steps
    ) VALUES (
      ${name}, ${description}, ${JSON.stringify(
    trigger_conditions
  )}, ${JSON.stringify(steps)}
    ) RETURNING *
  `;

  return { sequence: sequence[0] };
}

async function updateSequence({
  id,
  name,
  description,
  trigger_conditions,
  steps,
  is_active,
}) {
  const setClauses = [];
  const values = [];
  let paramCount = 0;

  if (name !== undefined) {
    paramCount++;
    setClauses.push(`name = $${paramCount}`);
    values.push(name);
  }

  if (description !== undefined) {
    paramCount++;
    setClauses.push(`description = $${paramCount}`);
    values.push(description);
  }

  if (trigger_conditions !== undefined) {
    paramCount++;
    setClauses.push(`trigger_conditions = $${paramCount}`);
    values.push(JSON.stringify(trigger_conditions));
  }

  if (steps !== undefined) {
    paramCount++;
    setClauses.push(`steps = $${paramCount}`);
    values.push(JSON.stringify(steps));
  }

  if (is_active !== undefined) {
    paramCount++;
    setClauses.push(`is_active = $${paramCount}`);
    values.push(is_active);
  }

  if (setClauses.length === 0) {
    return { error: "Aucune donnée à mettre à jour" };
  }

  paramCount++;
  const query = `UPDATE follow_up_sequences SET ${setClauses.join(
    ", "
  )} WHERE id = $${paramCount} RETURNING *`;
  values.push(id);

  const sequence = await sql(query, values);
  return { sequence: sequence[0] };
}

async function deleteSequence({ id }) {
  await sql`DELETE FROM follow_up_sequences WHERE id = ${id}`;
  return { success: true };
}

async function sendEmail({
  campaign_id,
  lead_id,
  template_id,
  email_address,
  subject,
  personalization = {},
}) {
  const template =
    await sql`SELECT * FROM email_templates WHERE id = ${template_id}`;

  if (template.length === 0) {
    return { error: "Template non trouvé" };
  }

  let finalSubject = subject || template[0].subject;
  let finalContent = template[0].html_content;

  Object.keys(personalization).forEach((key) => {
    const placeholder = `{{${key}}}`;
    finalSubject = finalSubject.replace(
      new RegExp(placeholder, "g"),
      personalization[key]
    );
    finalContent = finalContent.replace(
      new RegExp(placeholder, "g"),
      personalization[key]
    );
  });

  const emailSend = await sql`
    INSERT INTO email_sends (
      campaign_id, lead_id, template_id, email_address, subject, status
    ) VALUES (
      ${campaign_id}, ${lead_id}, ${template_id}, ${email_address}, ${finalSubject}, 'pending'
    ) RETURNING *
  `;

  try {
    await sql`
      UPDATE email_sends 
      SET status = 'sent', sent_at = CURRENT_TIMESTAMP 
      WHERE id = ${emailSend[0].id}
    `;

    return {
      success: true,
      email_send: emailSend[0],
      message: "Email envoyé avec succès",
    };
  } catch (error) {
    await sql`
      UPDATE email_sends 
      SET status = 'failed', error_message = ${error.message}
      WHERE id = ${emailSend[0].id}
    `;

    return { error: "Échec de l'envoi de l'email" };
  }
}

async function getCampaignStats({ campaign_id, date_from, date_to }) {
  let query = `
    SELECT 
      COUNT(*) as total_sends,
      COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_count,
      COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count,
      COUNT(CASE WHEN status = 'opened' THEN 1 END) as opened_count,
      COUNT(CASE WHEN status = 'clicked' THEN 1 END) as clicked_count,
      COUNT(CASE WHEN status = 'bounced' THEN 1 END) as bounced_count,
      COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
    FROM email_sends 
    WHERE campaign_id = $1
  `;

  const values = [campaign_id];
  let paramCount = 1;

  if (date_from) {
    paramCount++;
    query += ` AND created_at >= $${paramCount}`;
    values.push(date_from);
  }

  if (date_to) {
    paramCount++;
    query += ` AND created_at <= $${paramCount}`;
    values.push(date_to);
  }

  const stats = await sql(query, values);

  const result = stats[0];
  result.delivery_rate =
    result.total_sends > 0
      ? ((result.delivered_count / result.total_sends) * 100).toFixed(2)
      : 0;
  result.open_rate =
    result.delivered_count > 0
      ? ((result.opened_count / result.delivered_count) * 100).toFixed(2)
      : 0;
  result.click_rate =
    result.opened_count > 0
      ? ((result.clicked_count / result.opened_count) * 100).toFixed(2)
      : 0;
  result.bounce_rate =
    result.total_sends > 0
      ? ((result.bounced_count / result.total_sends) * 100).toFixed(2)
      : 0;

  return { stats: result };
}

async function getEmailSends({
  campaign_id,
  lead_id,
  status,
  limit = 50,
  offset = 0,
}) {
  let query = "SELECT * FROM email_sends WHERE 1=1";
  const values = [];
  let paramCount = 0;

  if (campaign_id) {
    paramCount++;
    query += ` AND campaign_id = $${paramCount}`;
    values.push(campaign_id);
  }

  if (lead_id) {
    paramCount++;
    query += ` AND lead_id = $${paramCount}`;
    values.push(lead_id);
  }

  if (status) {
    paramCount++;
    query += ` AND status = $${paramCount}`;
    values.push(status);
  }

  paramCount++;
  query += ` ORDER BY created_at DESC LIMIT $${paramCount}`;
  values.push(limit);

  paramCount++;
  query += ` OFFSET $${paramCount}`;
  values.push(offset);

  const sends = await sql(query, values);
  return { sends };
}

async function processAutomation({ campaign_id }) {
  const campaign = await sql`
    SELECT * FROM marketing_campaigns 
    WHERE id = ${campaign_id} AND status = 'active'
  `;

  if (campaign.length === 0) {
    return { error: "Campagne non trouvée ou inactive" };
  }

  const targetAudience = campaign[0].target_audience;
  let leadQuery = "SELECT * FROM leads WHERE 1=1";
  const leadValues = [];
  let paramCount = 0;

  if (targetAudience.status) {
    paramCount++;
    leadQuery += ` AND status = $${paramCount}`;
    leadValues.push(targetAudience.status);
  }

  if (targetAudience.lead_source) {
    paramCount++;
    leadQuery += ` AND lead_source = $${paramCount}`;
    leadValues.push(targetAudience.lead_source);
  }

  if (targetAudience.score_min) {
    paramCount++;
    leadQuery += ` AND score >= $${paramCount}`;
    leadValues.push(targetAudience.score_min);
  }

  if (targetAudience.age_min && targetAudience.age_max) {
    paramCount++;
    leadQuery += ` AND EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN $${paramCount}`;
    leadValues.push(targetAudience.age_min);

    paramCount++;
    leadQuery += ` AND $${paramCount}`;
    leadValues.push(targetAudience.age_max);
  }

  const leads = await sql(leadQuery, leadValues);

  const results = [];
  for (const lead of leads) {
    const alreadySent = await sql`
      SELECT id FROM email_sends 
      WHERE campaign_id = ${campaign_id} AND lead_id = ${lead.id}
    `;

    if (alreadySent.length === 0) {
      const personalization = {
        first_name: lead.first_name,
        last_name: lead.last_name,
        company: lead.company || "",
        age: lead.birth_date
          ? new Date().getFullYear() - new Date(lead.birth_date).getFullYear()
          : "",
        postal_code: lead.postal_code || "",
      };

      const result = await sendEmail({
        campaign_id: campaign_id,
        lead_id: lead.id,
        template_id: campaign[0].email_template_id,
        email_address: lead.email,
        personalization: personalization,
      });

      results.push({
        lead_id: lead.id,
        email: lead.email,
        result: result,
      });
    }
  }

  return {
    processed: results.length,
    results: results,
  };
}

async function getLeadEngagement({ lead_id, days = 30 }) {
  const engagement = await sql`
    SELECT 
      COUNT(CASE WHEN status = 'sent' THEN 1 END) as emails_sent,
      COUNT(CASE WHEN status = 'opened' THEN 1 END) as emails_opened,
      COUNT(CASE WHEN status = 'clicked' THEN 1 END) as emails_clicked,
      MAX(opened_at) as last_opened,
      MAX(clicked_at) as last_clicked
    FROM email_sends 
    WHERE lead_id = ${lead_id} 
    AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
  `;

  const calls = await sql`
    SELECT COUNT(*) as total_calls, MAX(started_at) as last_call
    FROM phone_calls 
    WHERE lead_id = ${lead_id}
    AND started_at >= CURRENT_DATE - INTERVAL '${days} days'
  `;

  return {
    engagement: {
      ...engagement[0],
      total_calls: calls[0].total_calls,
      last_call: calls[0].last_call,
      engagement_score: calculateEngagementScore(engagement[0], calls[0]),
    },
  };
}

function calculateEngagementScore(emailData, callData) {
  let score = 0;

  score += parseInt(emailData.emails_opened) * 2;
  score += parseInt(emailData.emails_clicked) * 5;
  score += parseInt(callData.total_calls) * 3;

  if (emailData.last_opened) {
    const daysSinceOpen = Math.floor(
      (new Date() - new Date(emailData.last_opened)) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceOpen <= 7) score += 10;
    else if (daysSinceOpen <= 30) score += 5;
  }

  return Math.min(score, 100);
}
export async function POST(request) {
  return handler(await request.json());
}