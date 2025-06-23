async function handler({
  action,
  sheetId,
  sheetName,
  columnMapping,
  syncFrequency,
  range,
}) {
  try {
    switch (action) {
      case "configure":
        return await configureSync({
          sheetId,
          sheetName,
          columnMapping,
          syncFrequency,
          range,
        });

      case "sync":
        return await performSync({ sheetId });

      case "status":
        return await getSyncStatus({ sheetId });

      case "history":
        return await getSyncHistory({ sheetId });

      case "list":
        return await listSyncConfigurations();

      case "delete":
        return await deleteSyncConfiguration({ sheetId });

      default:
        return { error: "Action non supportée" };
    }
  } catch (error) {
    return { error: error.message };
  }
}

async function configureSync({
  sheetId,
  sheetName,
  columnMapping,
  syncFrequency = "manual",
  range = "A:Z",
}) {
  if (!sheetId || !columnMapping) {
    return { error: "sheetId et columnMapping sont requis" };
  }

  const existingConfig = await sql`
    SELECT id FROM google_sheet_sync WHERE sheet_id = ${sheetId}
  `;

  if (existingConfig.length > 0) {
    await sql`
      UPDATE google_sheet_sync 
      SET sheet_name = ${sheetName}, 
          column_mapping = ${JSON.stringify(columnMapping)}, 
          sync_frequency = ${syncFrequency},
          range_config = ${range},
          updated_at = CURRENT_TIMESTAMP
      WHERE sheet_id = ${sheetId}
    `;

    return {
      success: true,
      message: "Configuration mise à jour",
      configId: existingConfig[0].id,
    };
  } else {
    const result = await sql`
      INSERT INTO google_sheet_sync (sheet_id, sheet_name, column_mapping, sync_frequency, range_config)
      VALUES (${sheetId}, ${sheetName}, ${JSON.stringify(
      columnMapping
    )}, ${syncFrequency}, ${range})
      RETURNING id
    `;

    return {
      success: true,
      message: "Configuration créée",
      configId: result[0].id,
    };
  }
}

async function performSync({ sheetId }) {
  const config = await sql`
    SELECT * FROM google_sheet_sync WHERE sheet_id = ${sheetId} AND is_active = true
  `;

  if (config.length === 0) {
    return { error: "Configuration non trouvée ou inactive" };
  }

  const syncConfig = config[0];

  try {
    await sql`
      UPDATE google_sheet_sync 
      SET last_sync_status = 'running', sync_errors = NULL
      WHERE id = ${syncConfig.id}
    `;

    const sheetData = await fetchGoogleSheetData(syncConfig);
    const syncResults = await processSheetData(sheetData, syncConfig);

    await sql`
      UPDATE google_sheet_sync 
      SET last_sync_at = CURRENT_TIMESTAMP,
          last_sync_status = 'success'
      WHERE id = ${syncConfig.id}
    `;

    return {
      success: true,
      message: "Synchronisation terminée",
      results: syncResults,
    };
  } catch (error) {
    await sql`
      UPDATE google_sheet_sync 
      SET last_sync_status = 'error',
          sync_errors = ${JSON.stringify({
            error: error.message,
            timestamp: new Date(),
          })}
      WHERE id = ${syncConfig.id}
    `;

    return { error: `Erreur de synchronisation: ${error.message}` };
  }
}

async function fetchGoogleSheetData(config) {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) {
    throw new Error("Clé API Google Sheets manquante");
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${
    config.sheet_id
  }/values/${config.sheet_name || "Sheet1"}!${
    config.range_config
  }?key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur API Google Sheets: ${response.status}`);
  }

  const data = await response.json();
  return data.values || [];
}

async function processSheetData(sheetData, config) {
  if (sheetData.length === 0) {
    return { processed: 0, created: 0, updated: 0, errors: [] };
  }

  const headers = sheetData[0];
  const rows = sheetData.slice(1);
  const columnMapping = config.column_mapping;

  let processed = 0;
  let created = 0;
  let updated = 0;
  const errors = [];

  for (let i = 0; i < rows.length; i++) {
    try {
      const row = rows[i];
      const leadData = mapRowToLead(row, headers, columnMapping, i + 2);

      if (!leadData.email) {
        errors.push({ row: i + 2, error: "Email manquant" });
        continue;
      }

      const existingLead = await sql`
        SELECT id FROM leads WHERE email = ${leadData.email}
      `;

      if (existingLead.length > 0) {
        await updateLead(existingLead[0].id, leadData);
        updated++;
      } else {
        await createLead(leadData, i + 2);
        created++;
      }

      processed++;
    } catch (error) {
      errors.push({ row: i + 2, error: error.message });
    }
  }

  return { processed, created, updated, errors };
}

function mapRowToLead(row, headers, columnMapping, rowNumber) {
  const leadData = {
    google_sheet_row_id: rowNumber.toString(),
    sync_status: "synced",
  };

  for (const [leadField, sheetColumn] of Object.entries(columnMapping)) {
    const columnIndex = headers.indexOf(sheetColumn);
    if (columnIndex !== -1 && row[columnIndex]) {
      let value = row[columnIndex].trim();

      if (leadField === "birth_date" || leadField === "date_fin_contrat") {
        value = parseDate(value);
      } else if (leadField === "revenus_annuels") {
        value =
          parseFloat(value.replace(/[^\d.,]/g, "").replace(",", ".")) || null;
      } else if (
        leadField === "nombre_enfants" ||
        leadField === "call_attempts_count"
      ) {
        value = parseInt(value) || 0;
      }

      leadData[leadField] = value;
    }
  }

  return leadData;
}

function parseDate(dateString) {
  if (!dateString) return null;

  const formats = [
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
  ];

  for (const format of formats) {
    const match = dateString.match(format);
    if (match) {
      let day, month, year;
      if (format.source.startsWith("^(\\d{4})")) {
        [, year, month, day] = match;
      } else {
        [, day, month, year] = match;
      }

      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }
  }

  return null;
}

async function createLead(leadData, rowNumber) {
  const fields = [];
  const values = [];
  let paramCount = 0;

  for (const [key, value] of Object.entries(leadData)) {
    if (value !== undefined && value !== null) {
      fields.push(key);
      values.push(value);
      paramCount++;
    }
  }

  const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
  const query = `INSERT INTO leads (${fields.join(
    ", "
  )}) VALUES (${placeholders})`;

  await sql(query, values);
}

async function updateLead(leadId, leadData) {
  const setClauses = [];
  const values = [];
  let paramCount = 0;

  for (const [key, value] of Object.entries(leadData)) {
    if (
      value !== undefined &&
      value !== null &&
      key !== "google_sheet_row_id"
    ) {
      setClauses.push(`${key} = $${++paramCount}`);
      values.push(value);
    }
  }

  if (setClauses.length > 0) {
    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(leadId);

    const query = `UPDATE leads SET ${setClauses.join(
      ", "
    )} WHERE id = $${++paramCount}`;
    await sql(query, values);
  }
}

async function getSyncStatus({ sheetId }) {
  const config = await sql`
    SELECT * FROM google_sheet_sync WHERE sheet_id = ${sheetId}
  `;

  if (config.length === 0) {
    return { error: "Configuration non trouvée" };
  }

  return {
    success: true,
    status: config[0],
  };
}

async function getSyncHistory({ sheetId }) {
  const history = await sql`
    SELECT 
      last_sync_at,
      last_sync_status,
      sync_errors
    FROM google_sheet_sync 
    WHERE sheet_id = ${sheetId}
    ORDER BY last_sync_at DESC
  `;

  return {
    success: true,
    history: history,
  };
}

async function listSyncConfigurations() {
  const configs = await sql`
    SELECT 
      id,
      sheet_id,
      sheet_name,
      sync_frequency,
      last_sync_at,
      last_sync_status,
      is_active
    FROM google_sheet_sync
    ORDER BY created_at DESC
  `;

  return {
    success: true,
    configurations: configs,
  };
}

async function deleteSyncConfiguration({ sheetId }) {
  const result = await sql`
    DELETE FROM google_sheet_sync WHERE sheet_id = ${sheetId}
    RETURNING id
  `;

  if (result.length === 0) {
    return { error: "Configuration non trouvée" };
  }

  return {
    success: true,
    message: "Configuration supprimée",
  };
}
export async function POST(request) {
  return handler(await request.json());
}