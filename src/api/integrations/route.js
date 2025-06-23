async function handler({ action, ...params }) {
  try {
    switch (action) {
      case "oggo_simulation":
        return await handleOggoSimulation(params);
      case "ringover_call":
        return await handleRingoverCall(params);
      case "google_sheets_sync":
        return await handleGoogleSheetsSync(params);
      case "get_integrations_status":
        return await getIntegrationsStatus();
      default:
        return { error: "Action non supportée" };
    }
  } catch (error) {
    return { error: error.message };
  }
}

async function handleOggoSimulation({
  lead_id,
  postal_code,
  birth_date,
  situation_familiale,
  nombre_enfants,
  revenus_annuels,
}) {
  if (!lead_id || !postal_code || !birth_date) {
    return {
      error: "Paramètres requis manquants: lead_id, postal_code, birth_date",
    };
  }

  try {
    const lead = await sql`SELECT * FROM leads WHERE id = ${lead_id}`;
    if (lead.length === 0) {
      return { error: "Lead non trouvé" };
    }

    const simulationData = {
      postal_code,
      birth_date,
      situation_familiale: situation_familiale || "celibataire",
      nombre_enfants: nombre_enfants || 0,
      revenus_annuels: revenus_annuels || 0,
    };

    const oggoResponse = await fetch("https://api.oggo.fr/simulations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OGGO_API_KEY}`,
      },
      body: JSON.stringify(simulationData),
    });

    if (!oggoResponse.ok) {
      throw new Error(`Erreur API Oggo: ${oggoResponse.status}`);
    }

    const results = await oggoResponse.json();
    const simulationId = results.simulation_id || `sim_${Date.now()}`;

    await sql`
      INSERT INTO oggo_simulations (
        lead_id, simulation_id, postal_code, birth_date, 
        situation_familiale, nombre_enfants, revenus_annuels,
        simulation_data, results, status
      ) VALUES (
        ${lead_id}, ${simulationId}, ${postal_code}, ${birth_date},
        ${situation_familiale}, ${nombre_enfants}, ${revenus_annuels},
        ${JSON.stringify(simulationData)}, ${JSON.stringify(
      results
    )}, 'completed'
      )
    `;

    await sql`
      UPDATE leads 
      SET oggo_data_simulation_id = ${simulationId},
          simulation_results = ${JSON.stringify(results)},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${lead_id}
    `;

    await sql`
      INSERT INTO activities (
        activity_type, title, description, lead_id, 
        status, metadata
      ) VALUES (
        'simulation', 'Simulation mutuelle Oggo',
        'Simulation réalisée avec succès', ${lead_id},
        'completed', ${JSON.stringify({
          simulation_id: simulationId,
          results_count: results.offers?.length || 0,
        })}
      )
    `;

    return {
      success: true,
      simulation_id: simulationId,
      results: results,
      message: "Simulation créée avec succès",
    };
  } catch (error) {
    await sql`
      INSERT INTO oggo_simulations (
        lead_id, postal_code, birth_date, 
        situation_familiale, nombre_enfants, revenus_annuels,
        simulation_data, status
      ) VALUES (
        ${lead_id}, ${postal_code}, ${birth_date},
        ${situation_familiale}, ${nombre_enfants}, ${revenus_annuels},
        ${JSON.stringify({
          postal_code,
          birth_date,
          situation_familiale,
          nombre_enfants,
          revenus_annuels,
        })}, 'error'
      )
    `;

    return { error: `Erreur simulation Oggo: ${error.message}` };
  }
}

async function handleRingoverCall({
  lead_id,
  contact_id,
  phone_number,
  action_type,
}) {
  if (!phone_number || !action_type) {
    return { error: "Paramètres requis: phone_number, action_type" };
  }

  try {
    let entityId = lead_id || contact_id;
    let entityType = lead_id ? "lead" : "contact";

    if (action_type === "initiate_call") {
      const ringoverResponse = await fetch(
        "https://api.ringover.com/v2/calls",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RINGOVER_API_KEY}`,
          },
          body: JSON.stringify({
            to: phone_number,
            from: process.env.RINGOVER_CALLER_ID,
          }),
        }
      );

      if (!ringoverResponse.ok) {
        throw new Error(`Erreur API Ringover: ${ringoverResponse.status}`);
      }

      const callData = await ringoverResponse.json();

      const callRecord = await sql`
        INSERT INTO phone_calls (
          lead_id, contact_id, phone_number, call_type, status,
          ringover_call_id, started_at
        ) VALUES (
          ${lead_id}, ${contact_id}, ${phone_number}, 'outbound', 'initiated',
          ${callData.call_id}, CURRENT_TIMESTAMP
        ) RETURNING id
      `;

      if (lead_id) {
        await sql`
          UPDATE leads 
          SET last_call_attempt = CURRENT_TIMESTAMP,
              call_attempts_count = call_attempts_count + 1
          WHERE id = ${lead_id}
        `;
      }

      return {
        success: true,
        call_id: callRecord[0].id,
        ringover_call_id: callData.call_id,
        message: "Appel initié avec succès",
      };
    }

    if (action_type === "update_call_status") {
      const { call_id, status, duration_seconds, outcome, notes } = params;

      await sql`
        UPDATE phone_calls 
        SET status = ${status},
            duration_seconds = ${duration_seconds},
            outcome = ${outcome},
            notes = ${notes},
            ended_at = CURRENT_TIMESTAMP
        WHERE id = ${call_id}
      `;

      await sql`
        INSERT INTO activities (
          activity_type, title, description, lead_id, contact_id,
          status, duration_minutes, metadata
        ) VALUES (
          'call', 'Appel téléphonique',
          ${notes || `Appel ${status}`}, ${lead_id}, ${contact_id},
          'completed', ${Math.round((duration_seconds || 0) / 60)},
          ${JSON.stringify({ outcome, call_status: status })}
        )
      `;

      return {
        success: true,
        message: "Statut d'appel mis à jour",
      };
    }

    return { error: "Action non supportée pour Ringover" };
  } catch (error) {
    return { error: `Erreur Ringover: ${error.message}` };
  }
}

async function handleGoogleSheetsSync({
  action_type,
  sheet_id,
  sheet_name,
  range_config,
  column_mapping,
}) {
  try {
    if (action_type === "setup_sync") {
      if (!sheet_id || !column_mapping) {
        return { error: "Paramètres requis: sheet_id, column_mapping" };
      }

      const syncConfig = await sql`
        INSERT INTO google_sheet_sync (
          sheet_id, sheet_name, range_config, column_mapping, is_active
        ) VALUES (
          ${sheet_id}, ${sheet_name || "Leads"}, ${range_config || "A:Z"}, 
          ${JSON.stringify(column_mapping)}, true
        ) RETURNING id
      `;

      return {
        success: true,
        sync_id: syncConfig[0].id,
        message: "Configuration de synchronisation créée",
      };
    }

    if (action_type === "sync_leads") {
      const { sync_id } = params;

      const syncConfigs = sync_id
        ? await sql`SELECT * FROM google_sheet_sync WHERE id = ${sync_id} AND is_active = true`
        : await sql`SELECT * FROM google_sheet_sync WHERE is_active = true`;

      if (syncConfigs.length === 0) {
        return {
          error: "Aucune configuration de synchronisation active trouvée",
        };
      }

      let totalSynced = 0;
      let errors = [];

      for (const config of syncConfigs) {
        try {
          const sheetsResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${config.sheet_id}/values/${config.range_config}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.GOOGLE_SHEETS_API_KEY}`,
              },
            }
          );

          if (!sheetsResponse.ok) {
            throw new Error(`Erreur Google Sheets: ${sheetsResponse.status}`);
          }

          const sheetData = await sheetsResponse.json();
          const rows = sheetData.values || [];

          if (rows.length < 2) continue;

          const headers = rows[0];
          const dataRows = rows.slice(1);
          const mapping = config.column_mapping;

          for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            const leadData = {};

            Object.keys(mapping).forEach((field) => {
              const columnIndex = headers.indexOf(mapping[field]);
              if (columnIndex !== -1 && row[columnIndex]) {
                leadData[field] = row[columnIndex];
              }
            });

            if (leadData.email) {
              const existingLead = await sql`
                SELECT id FROM leads WHERE email = ${leadData.email}
              `;

              if (existingLead.length === 0) {
                await sql`
                  INSERT INTO leads (
                    first_name, last_name, email, phone, company,
                    postal_code, birth_date, situation_familiale,
                    nombre_enfants, revenus_annuels, lead_source,
                    google_sheet_row_id, sync_status
                  ) VALUES (
                    ${leadData.first_name || ""}, ${leadData.last_name || ""}, 
                    ${leadData.email}, ${leadData.phone || ""}, ${
                  leadData.company || ""
                },
                    ${leadData.postal_code || ""}, ${
                  leadData.birth_date || null
                },
                    ${leadData.situation_familiale || ""}, ${
                  leadData.nombre_enfants || 0
                },
                    ${leadData.revenus_annuels || 0}, 'google_sheets',
                    ${`row_${i + 2}`}, 'synced'
                  )
                `;
                totalSynced++;
              }
            }
          }

          await sql`
            UPDATE google_sheet_sync 
            SET last_sync_at = CURRENT_TIMESTAMP,
                last_sync_status = 'success'
            WHERE id = ${config.id}
          `;
        } catch (error) {
          errors.push(`Erreur sync ${config.sheet_id}: ${error.message}`);

          await sql`
            UPDATE google_sheet_sync 
            SET last_sync_at = CURRENT_TIMESTAMP,
                last_sync_status = 'error',
                sync_errors = ${JSON.stringify([error.message])}
            WHERE id = ${config.id}
          `;
        }
      }

      return {
        success: true,
        synced_leads: totalSynced,
        errors: errors.length > 0 ? errors : null,
        message: `${totalSynced} leads synchronisés`,
      };
    }

    return { error: "Action non supportée pour Google Sheets" };
  } catch (error) {
    return { error: `Erreur Google Sheets: ${error.message}` };
  }
}

async function getIntegrationsStatus() {
  try {
    const oggoStats = await sql`
      SELECT 
        COUNT(*) as total_simulations,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_simulations,
        COUNT(*) FILTER (WHERE status = 'error') as failed_simulations
      FROM oggo_simulations
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `;

    const callStats = await sql`
      SELECT 
        COUNT(*) as total_calls,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_calls,
        AVG(duration_seconds) as avg_duration
      FROM phone_calls
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `;

    const syncStats = await sql`
      SELECT 
        COUNT(*) as active_syncs,
        COUNT(*) FILTER (WHERE last_sync_status = 'success') as successful_syncs,
        MAX(last_sync_at) as last_sync_time
      FROM google_sheet_sync
      WHERE is_active = true
    `;

    const recentLeads = await sql`
      SELECT COUNT(*) as google_sheets_leads
      FROM leads 
      WHERE lead_source = 'google_sheets' 
      AND created_at >= CURRENT_DATE - INTERVAL '7 days'
    `;

    return {
      success: true,
      integrations: {
        oggo_data: {
          total_simulations: parseInt(oggoStats[0].total_simulations),
          completed_simulations: parseInt(oggoStats[0].completed_simulations),
          failed_simulations: parseInt(oggoStats[0].failed_simulations),
          success_rate:
            oggoStats[0].total_simulations > 0
              ? Math.round(
                  (oggoStats[0].completed_simulations /
                    oggoStats[0].total_simulations) *
                    100
                )
              : 0,
        },
        ringover: {
          total_calls: parseInt(callStats[0].total_calls),
          completed_calls: parseInt(callStats[0].completed_calls),
          avg_duration_minutes: callStats[0].avg_duration
            ? Math.round(callStats[0].avg_duration / 60)
            : 0,
        },
        google_sheets: {
          active_syncs: parseInt(syncStats[0].active_syncs),
          successful_syncs: parseInt(syncStats[0].successful_syncs),
          last_sync_time: syncStats[0].last_sync_time,
          recent_leads: parseInt(recentLeads[0].google_sheets_leads),
        },
      },
    };
  } catch (error) {
    return { error: `Erreur récupération statuts: ${error.message}` };
  }
}
export async function POST(request) {
  return handler(await request.json());
}