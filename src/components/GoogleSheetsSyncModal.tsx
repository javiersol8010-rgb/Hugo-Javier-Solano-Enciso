import React, { useState, useEffect } from 'react';
import { ApprenticeProfile, GamificationState } from '../types/induction';
import {
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  initAuth,
  auth,
} from '../services/googleAuth';
import {
  appendApprenticeRecord,
  fetchSheetRecords,
  SheetApprenticeRow,
  SPREADSHEET_TITLE,
  SHEET_TAB_NAME,
} from '../services/sheetsSync';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Database,
  UserCheck,
  LogOut,
  RefreshCw,
  FolderOpen,
  Info,
  Copy,
  Check,
} from 'lucide-react';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApprenticeProfile;
  gamification: GamificationState;
  onSuccessNotification?: (msg: string) => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  profile,
  gamification,
  onSuccessNotification,
}) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingRows, setIsLoadingRows] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [lastSavedUrl, setLastSavedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sheetRows, setSheetRows] = useState<SheetApprenticeRow[]>([]);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);
  const [showConfirmStep, setShowConfirmStep] = useState<boolean>(true);
  const [isCopiedUrl, setIsCopiedUrl] = useState<boolean>(false);

  const handleCopySpreadsheetUrl = (urlToCopy: string) => {
    navigator.clipboard.writeText(urlToCopy);
    setIsCopiedUrl(true);
    setTimeout(() => setIsCopiedUrl(false), 2500);
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setIsAuthenticated(true);
        setUserEmail(user.email);
        setUserDisplayName(user.displayName);
        setUserPhoto(user.photoURL);
        loadRows();
      },
      () => {
        setIsAuthenticated(false);
        setUserEmail(null);
        setUserDisplayName(null);
        setUserPhoto(null);
        setSheetRows([]);
      }
    );
    return () => unsubscribe();
  }, []);

  // Check if token exists on open
  useEffect(() => {
    if (isOpen) {
      setSyncSuccess(false);
      setErrorMessage(null);
      getAccessToken().then((token) => {
        if (token && auth.currentUser) {
          setIsAuthenticated(true);
          setUserEmail(auth.currentUser.email);
          setUserDisplayName(auth.currentUser.displayName);
          setUserPhoto(auth.currentUser.photoURL);
          loadRows();
        }
      });
    }
  }, [isOpen]);

  const loadRows = async () => {
    setIsLoadingRows(true);
    try {
      const data = await fetchSheetRecords();
      setSheetRows(data.rows);
      if (data.spreadsheetUrl) {
        setSpreadsheetUrl(data.spreadsheetUrl);
      }
    } catch (err: any) {
      console.warn('Error loading rows:', err);
    } finally {
      setIsLoadingRows(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoadingAuth(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setIsAuthenticated(true);
        setUserEmail(result.user.email);
        setUserDisplayName(result.user.displayName);
        setUserPhoto(result.user.photoURL);
        await loadRows();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al iniciar sesión con Google.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserDisplayName(null);
    setUserPhoto(null);
    setSheetRows([]);
    setSpreadsheetUrl(null);
  };

  // Explicit user confirmation before saving data
  const handleConfirmSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const res = await appendApprenticeRecord(profile, gamification, userEmail || undefined);
      setSyncSuccess(true);
      setLastSavedUrl(res.spreadsheetUrl);
      setSpreadsheetUrl(res.spreadsheetUrl);
      setShowConfirmStep(false);
      if (onSuccessNotification) {
        onSuccessNotification('¡Datos del aprendiz almacenados exitosamente en Google Drive!');
      }
      await loadRows();
    } catch (err: any) {
      setErrorMessage(err.message || 'Ocurrió un error al guardar en la hoja de cálculo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg">
                Sincronización con Google Drive & Sheets
              </h3>
              <p className="text-xs text-emerald-100/90">
                Almacena el registro oficial de la inducción y el certificado en la nube.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200 text-sm">
          {/* Target File Information */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
            <FolderOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-bold text-emerald-950 dark:text-emerald-200">
                Hoja de Cálculo Destino en Google Drive:
              </div>
              <div className="font-mono text-emerald-800 dark:text-emerald-300 bg-white/70 dark:bg-slate-900/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/50 inline-block font-medium">
                {SPREADSHEET_TITLE} · Pestaña: &quot;{SHEET_TAB_NAME}&quot;
              </div>
              <p className="text-emerald-700 dark:text-emerald-400">
                Si el archivo aún no existe en tu Google Drive, la aplicación lo creará automáticamente con los encabezados institucionales del SENA.
              </p>
            </div>
          </div>

          {/* Authentication State */}
          {!isAuthenticated ? (
            <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700/60 flex items-center justify-center mx-auto text-slate-600 dark:text-slate-300">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Conecta tu cuenta de Google
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Para guardar el registro del aprendiz en Google Drive se requiere autorización para crear y actualizar la hoja de cálculo institucional.
                </p>
              </div>

              {/* Official Google Sign-In Button */}
              <button
                onClick={handleSignIn}
                disabled={isLoadingAuth}
                className="gsi-material-button inline-flex items-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-xl border border-slate-300 dark:border-slate-600 shadow-sm transition-all hover:shadow active:scale-95 disabled:opacity-50"
              >
                {isLoadingAuth ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                )}
                <span>{isLoadingAuth ? 'Conectando...' : 'Acceder con Google'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Connected User Pill */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={userDisplayName || 'Usuario'}
                      className="w-9 h-9 rounded-full border border-emerald-500"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      {userDisplayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{userDisplayName || 'Cuenta Google'}</span>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{userEmail}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Cerrar sesión de Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Desconectar</span>
                </button>
              </div>

              {/* Data Confirmation Box (Mandatory explicit user consent for Drive/Sheets operations) */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Datos del Aprendiz a Registrar:
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {gamification.assessmentPassed ? 'Constancia Aprobada' : 'En Inducción'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Nombre Completo:</span>
                    <strong className="text-slate-900 dark:text-white">{profile.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Documento:</span>
                    <strong className="text-slate-900 dark:text-white">{profile.documentType} {profile.documentNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Programa & Ficha:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Ficha {profile.fichaNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Código Certificado:</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-300">
                      {gamification.certificateCode || 'Pendiente'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Calificación:</span>
                    <strong className="text-slate-900 dark:text-white">
                      {gamification.assessmentScore || 100}% ({gamification.xp} XP)
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Centro / Regional:</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate block">
                      {profile.regional}
                    </span>
                  </div>
                </div>

                {/* Explicit Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    onClick={handleConfirmSave}
                    disabled={isSaving}
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando en Google Drive...</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Confirmar y Guardar en Drive</span>
                      </>
                    )}
                  </button>

                  {spreadsheetUrl && (
                    <a
                      href={spreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Abrir Hoja</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Direct Full URL Card */}
              {(spreadsheetUrl || lastSavedUrl) && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Enlace Directo a tu Hoja de Cálculo:</span>
                    </span>
                    <button
                      onClick={() => handleCopySpreadsheetUrl(spreadsheetUrl || lastSavedUrl || '')}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      {isCopiedUrl ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar Enlace</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={spreadsheetUrl || lastSavedUrl || ''}
                      className="flex-1 text-[11px] font-mono bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 focus:outline-none select-all"
                    />
                    <a
                      href={spreadsheetUrl || lastSavedUrl || ''}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Success Notification */}
              {syncSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>¡Registro guardado con éxito en tu Google Drive!</span>
                  </div>
                </div>
              )}

              {/* Live Preview of Registered Apprentices in Sheet */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      Registros en la Hoja ({sheetRows.length})
                    </h5>
                    {isLoadingRows && <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />}
                  </div>
                  <button
                    onClick={loadRows}
                    disabled={isLoadingRows}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
                    title="Actualizar listado"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRows ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {sheetRows.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    Aún no hay registros en la hoja de cálculo. Haz clic en &quot;Confirmar y Guardar en Drive&quot; para registrar el primer aprendiz.
                  </div>
                ) : (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold sticky top-0">
                        <tr>
                          <th className="px-3 py-2">Aprendiz</th>
                          <th className="px-3 py-2">Documento</th>
                          <th className="px-3 py-2">Ficha</th>
                          <th className="px-3 py-2">Calificación</th>
                          <th className="px-3 py-2">Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {sheetRows.map((row, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">
                              {row.fullName}
                            </td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400 font-mono">
                              {row.documentType} {row.documentNumber}
                            </td>
                            <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                              {row.fichaNumber}
                            </td>
                            <td className="px-3 py-2">
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {row.score}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-slate-400 text-[10px]">
                              {row.timestamp}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Almacenamiento seguro en Google Drive institucional</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
