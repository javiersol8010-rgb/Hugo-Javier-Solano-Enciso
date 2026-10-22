import { ApprenticeProfile, GamificationState } from '../types/induction';
import { getAccessToken } from './googleAuth';

export const SPREADSHEET_TITLE = 'SENA - Registro de Aprendices Inducción (Acuerdo 0009)';
export const SHEET_TAB_NAME = 'Aprendices Inducción';

// In-memory & local cache for instant URL access
let cachedSpreadsheetId: string | null = null;
let cachedSpreadsheetUrl: string | null = null;

export const getKnownSpreadsheetUrl = (): string | null => {
  if (cachedSpreadsheetUrl) return cachedSpreadsheetUrl;
  return localStorage.getItem('sena_sheets_url') || null;
};

export const setKnownSpreadsheet = (id: string, url: string) => {
  cachedSpreadsheetId = id;
  cachedSpreadsheetUrl = url;
  localStorage.setItem('sena_sheets_id', id);
  localStorage.setItem('sena_sheets_url', url);
};

export interface SyncResult {
  success: boolean;
  spreadsheetId: string;
  spreadsheetUrl: string;
  rowNumber?: number;
  message: string;
}

export interface SheetApprenticeRow {
  timestamp: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  regional: string;
  trainingCenter: string;
  programName: string;
  fichaNumber: string;
  score: string;
  status: string;
  certificateCode: string;
  certificateDate: string;
  modulesCompleted: string;
  level: string;
  xp: string;
  userEmail: string;
}

const HEADERS = [
  'Marca Temporal',
  'Nombre Completo',
  'Tipo Documento',
  'Número Documento',
  'Regional SENA',
  'Centro de Formación',
  'Programa de Formación',
  'Ficha de Caracterización',
  'Calificación Obtenida',
  'Estado de Inducción',
  'Código Verificación Certificado',
  'Fecha Emisión Certificado',
  'Módulos Completados',
  'Nivel Alcanzado',
  'Puntos XP',
  'Cuenta Google Registrante',
];

/**
 * Find an existing spreadsheet in the user's Google Drive or create a new one.
 */
export async function getOrCreateSpreadsheet(accessToken: string): Promise<{ id: string; url: string }> {
  // If we already know the spreadsheet ID from this session or local storage, verify quickly
  const existingKnownId = cachedSpreadsheetId || localStorage.getItem('sena_sheets_id');
  if (existingKnownId) {
    const checkRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${existingKnownId}?fields=id,name,webViewLink,trashed`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (checkRes.ok) {
      const fileData = await checkRes.json();
      if (!fileData.trashed) {
        const foundUrl = fileData.webViewLink || `https://docs.google.com/spreadsheets/d/${fileData.id}/edit`;
        setKnownSpreadsheet(fileData.id, foundUrl);
        return { id: fileData.id, url: foundUrl };
      }
    }
  }

  // 1. Search for existing spreadsheet created by app
  const query = encodeURIComponent(
    `name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
  );
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)&pageSize=1`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      const existing = data.files[0];
      const existingUrl = existing.webViewLink || `https://docs.google.com/spreadsheets/d/${existing.id}/edit`;
      setKnownSpreadsheet(existing.id, existingUrl);
      return {
        id: existing.id,
        url: existingUrl,
      };
    }
  }

  // 2. Create new spreadsheet with styled headers
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: SPREADSHEET_TITLE,
      },
      sheets: [
        {
          properties: {
            title: SHEET_TAB_NAME,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Error al crear la hoja de cálculo en Google Drive.');
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const spreadsheetUrl =
    createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  setKnownSpreadsheet(spreadsheetId, spreadsheetUrl);

  // 3. Write and format the header row
  await writeHeaders(spreadsheetId, accessToken);

  return { id: spreadsheetId, url: spreadsheetUrl };
}

/**
 * Write headers and apply SENA-branded green theme
 */
async function writeHeaders(spreadsheetId: string, accessToken: string) {
  // Write header values
  const range = encodeURIComponent(`'${SHEET_TAB_NAME}'!A1:P1`);
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [HEADERS],
      }),
    }
  );

  // Apply styling to header row (SENA Green #39A900, white text, bold, centered)
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 0.223, // ~#39A900
                  green: 0.662,
                  blue: 0.0,
                },
                textFormat: {
                  foregroundColor: { red: 1, green: 1, blue: 1 },
                  fontSize: 10,
                  bold: true,
                },
                horizontalAlignment: 'CENTER',
                verticalAlignment: 'MIDDLE',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)',
          },
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: 'COLUMNS',
              startIndex: 0,
              endIndex: 16,
            },
          },
        },
      ],
    }),
  });
}

/**
 * Append apprentice induction record to the Google Sheet
 */
export async function appendApprenticeRecord(
  profile: ApprenticeProfile,
  gamification: GamificationState,
  userEmail?: string
): Promise<SyncResult> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('No hay sesión de Google activa. Por favor inicia sesión primero.');
  }

  // 1. Get or create target spreadsheet
  const { id: spreadsheetId, url: spreadsheetUrl } = await getOrCreateSpreadsheet(token);

  // Format current timestamp in Colombia time
  const now = new Date();
  const timestamp = now.toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  const rowData = [
    timestamp,
    profile.fullName,
    profile.documentType,
    profile.documentNumber,
    profile.regional,
    profile.trainingCenter,
    profile.programName,
    profile.fichaNumber,
    `${gamification.assessmentScore || 100}%`,
    gamification.assessmentPassed ? 'Aprobado - Certificado Emitido' : 'En Inducción',
    gamification.certificateCode || 'Pendiente de emisión',
    gamification.certificateIssuedDate || 'Pendiente',
    `${gamification.completedModules.length} módulos (${gamification.completedModules.join(', ')})`,
    `Nivel ${gamification.level}`,
    `${gamification.xp} XP`,
    userEmail || 'Aprendiz SENA',
  ];

  // 2. Append row to sheet
  const range = encodeURIComponent(`'${SHEET_TAB_NAME}'!A:P`);
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData],
      }),
    }
  );

  if (!appendRes.ok) {
    const err = await appendRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Error al guardar los datos en la hoja de cálculo.');
  }

  const resultData = await appendRes.json();
  const updatedRange = resultData.updates?.updatedRange || '';

  return {
    success: true,
    spreadsheetId,
    spreadsheetUrl,
    message: `Datos del aprendiz sincronizados correctamente en Google Drive (${updatedRange}).`,
  };
}

/**
 * Read registered apprentices from the Google Sheet for live statistics and inspection
 */
export async function fetchSheetRecords(): Promise<{
  rows: SheetApprenticeRow[];
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
}> {
  const token = await getAccessToken();
  if (!token) {
    return { rows: [], spreadsheetId: null, spreadsheetUrl: null };
  }

  try {
    const { id: spreadsheetId, url: spreadsheetUrl } = await getOrCreateSpreadsheet(token);
    const range = encodeURIComponent(`'${SHEET_TAB_NAME}'!A2:P`);
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      return { rows: [], spreadsheetId, spreadsheetUrl };
    }

    const data = await res.json();
    const rawRows: string[][] = data.values || [];

    const rows: SheetApprenticeRow[] = rawRows.map((r) => ({
      timestamp: r[0] || '',
      fullName: r[1] || '',
      documentType: r[2] || '',
      documentNumber: r[3] || '',
      regional: r[4] || '',
      trainingCenter: r[5] || '',
      programName: r[6] || '',
      fichaNumber: r[7] || '',
      score: r[8] || '',
      status: r[9] || '',
      certificateCode: r[10] || '',
      certificateDate: r[11] || '',
      modulesCompleted: r[12] || '',
      level: r[13] || '',
      xp: r[14] || '',
      userEmail: r[15] || '',
    }));

    return { rows, spreadsheetId, spreadsheetUrl };
  } catch (err) {
    console.warn('Could not read existing sheet rows:', err);
    return { rows: [], spreadsheetId: null, spreadsheetUrl: null };
  }
}

/**
 * Background auto-sync function: checks for token silently and saves apprentice data
 */
export async function autoSyncApprenticeRecord(
  profile: ApprenticeProfile,
  gamification: GamificationState,
  userEmail?: string
): Promise<{
  success: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  requiresAuth?: boolean;
  message: string;
}> {
  const token = await getAccessToken();
  if (!token) {
    return {
      success: false,
      requiresAuth: true,
      message: 'No hay sesión de Google activa para sincronizar automáticamente.',
    };
  }

  try {
    const result = await appendApprenticeRecord(profile, gamification, userEmail);
    if (result.spreadsheetUrl) {
      setKnownSpreadsheet(result.spreadsheetId, result.spreadsheetUrl);
    }
    return {
      success: true,
      spreadsheetId: result.spreadsheetId,
      spreadsheetUrl: result.spreadsheetUrl,
      message: 'Registro sincronizado automáticamente en Google Drive.',
    };
  } catch (error: any) {
    console.error('Error en sincronización automática:', error);
    return {
      success: false,
      message: error?.message || 'Error al guardar automáticamente en Google Sheets.',
    };
  }
}

