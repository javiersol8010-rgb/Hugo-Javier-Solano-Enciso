import React, { useState } from 'react';
import { ApprenticeProfile, GamificationState, UserRole } from '../types/induction';
import { SenaLogo } from './SenaLogo';
import { Printer, Check, QrCode, ShieldCheck, ArrowLeft, FileSpreadsheet, ExternalLink, Loader2, CheckCircle2, Cloud } from 'lucide-react';

interface OfficialCertificateProps {
  profile: ApprenticeProfile;
  gamification: GamificationState;
  onOpenVerifier: () => void;
  onBackToHome: () => void;
  onOpenSheetsSync?: () => void;
  sheetUrl?: string | null;
  isGoogleConnected?: boolean;
  onOneClickConnectAndSync?: () => Promise<void>;
  isSyncing?: boolean;
  userRole?: UserRole;
}

export const OfficialCertificate: React.FC<OfficialCertificateProps> = ({
  profile,
  gamification,
  onOpenVerifier,
  onBackToHome,
  onOpenSheetsSync,
  sheetUrl,
  isGoogleConnected,
  onOneClickConnectAndSync,
  isSyncing,
  userRole = 'aprendiz',
}) => {
  const [copied, setCopied] = useState(false);

  const certCode = gamification.certificateCode || 'SENA-IND-2024-X89K-4102';
  const issueDate = gamification.certificateIssuedDate || new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(certCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Action Bar (hidden on print) */}
      <div className="no-print bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Volver a la ruta de inducción"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              Certificado Institucional de Inducción
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Documento oficial probatorio para anexar a tu carpeta de etapa lectiva en el SENA.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent dark:border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>{copied ? 'Código Copiado' : 'Copiar Código'}</span>
          </button>

          <button
            onClick={onOpenVerifier}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-lg transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Validar en Sistema</span>
          </button>

          {/* Google Drive button ONLY visible to Instructor */}
          {userRole === 'instructor' && (
            sheetUrl ? (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-900/60 hover:bg-emerald-200 dark:hover:bg-emerald-800/80 rounded-lg transition-colors border border-emerald-300 dark:border-emerald-700 shadow-xs"
                title="Abrir la hoja de cálculo de aprendices en Google Drive"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Abrir Hoja Google Drive</span>
                <ExternalLink className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </a>
            ) : onOpenSheetsSync ? (
              <button
                onClick={onOpenSheetsSync}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100/90 dark:bg-emerald-900/60 hover:bg-emerald-200 dark:hover:bg-emerald-800/80 rounded-lg transition-colors border border-emerald-300 dark:border-emerald-700 shadow-xs"
                title="Guardar registro en hoja de cálculo institucional de Google Drive"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Guardar en Google Drive</span>
              </button>
            ) : null
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>
      </div>

      {/* Role-tailored Banner (no-print) */}
      <div className="no-print">
        {userRole === 'instructor' ? (
          sheetUrl ? (
            <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 px-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 dark:text-emerald-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block">
                    ✓ Registro Sincronizado en Google Drive (Panel Instructor)
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Hoja institucional: &ldquo;SENA - Registro de Aprendices Inducción (Acuerdo 0009)&rdquo;
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={sheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-100 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 border border-emerald-300 dark:border-emerald-700 rounded-lg transition-colors shadow-2xs"
                >
                  <span>Inspeccionar Hoja de Cálculo</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </a>
              </div>
            </div>
          ) : !isGoogleConnected && onOneClickConnectAndSync ? (
            <div className="bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-3.5 px-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-950 dark:text-blue-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block">
                    Sincronización Automática con Google Drive
                  </span>
                  <span className="text-[11px] text-blue-700 dark:text-blue-300">
                    Conecta tu cuenta institucional una sola vez para enviar tus datos a la hoja de cálculo oficial sin tocar configuraciones.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onOneClickConnectAndSync}
                  disabled={isSyncing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors shadow-xs"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Conectando y Guardando...</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Conectar y Guardar Automáticamente</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : null
        ) : (
          /* Clean Institutional Badge for Apprentice */
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800 rounded-xl p-3 px-4 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block text-xs">
                  Constancia Asentada en el Sistema de Formación Profesional Integral
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Tu inducción al Reglamento del Aprendiz (Acuerdo 0009 de 2024) ha quedado registrada para la ficha {profile.fichaNumber}.
                </span>
              </div>
            </div>
            <div className="hidden sm:block text-right font-mono text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/40 px-2.5 py-1 rounded-md">
              Aprobado · 100% Válido
            </div>
          </div>
        )}
      </div>

      {/* Official Certificate Card - Optimized for screen and paper print */}
      <div className="print-card bg-white rounded-3xl p-8 sm:p-14 border-4 border-double border-emerald-800/40 dark:border-emerald-600/70 shadow-2xl relative overflow-hidden max-w-4xl mx-auto text-slate-900">
        {/* Subtle Watermark SENA Symbol */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <SenaLogo className="w-[600px] h-[600px]" variant="symbol" />
        </div>

        {/* Decorative Corner Ornaments */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-800 pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-800 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-800 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-800 pointer-events-none" />

        {/* Certificate Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="flex items-center justify-center gap-4">
            <SenaLogo className="h-12 sm:h-14" variant="full" />
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] text-slate-500 uppercase block">
              República de Colombia · Ministerio del Trabajo
            </span>
            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-[#00324D] uppercase block">
              Servicio Nacional de Aprendizaje — SENA
            </span>
            <span className="text-[11px] text-slate-500 block">
              {profile.regional} · {profile.trainingCenter}
            </span>
          </div>

          <div className="pt-4">
            <div className="inline-block border-y-2 border-emerald-700/60 py-2 px-8">
              <span className="text-[11px] font-bold tracking-[0.2em] text-emerald-800 uppercase block">
                Constancia Oficial de Cumplimiento de Inducción
              </span>
              <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#00324D] tracking-tight mt-0.5">
                CERTIFICADO DE APROBACIÓN
              </h1>
            </div>
          </div>
        </div>

        {/* Body Text */}
        <div className="mt-8 text-center space-y-6 relative z-10">
          <p className="text-xs sm:text-sm text-slate-600 font-serif italic">
            El Subdirector del Centro de Formación y la Coordinación Académica hacen constar que el (la) aprendiz:
          </p>

          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-emerald-950 uppercase">
              {profile.fullName}
            </h2>
            <p className="text-xs sm:text-sm font-mono text-slate-600">
              Identificado(a) con {profile.documentType} No. <strong className="text-slate-900">{profile.documentNumber}</strong>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
            Ha participado activamente y superado satisfactoriamente los módulos de inducción integral sobre el{' '}
            <strong className="text-slate-900 font-semibold">Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024)</strong>,
            apropiando sus derechos fundamentales, deberes académicos y disciplinarios, régimen de convivencia,
            alternativas de etapa productiva y ética formativa correspondiente al programa:
          </p>

          {/* Program & Ficha Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 max-w-xl mx-auto space-y-1">
            <div className="text-xs sm:text-sm font-bold text-emerald-950">
              {profile.programName}
            </div>
            <div className="text-xs text-emerald-800 flex items-center justify-center gap-2">
              <span>Ficha de Caracterización: <strong>{profile.fichaNumber}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Calificación: <strong>{gamification.assessmentScore || 100}% (Aprobado)</strong></span>
            </div>
          </div>
        </div>

        {/* Certificate Seal & Signatures Grid */}
        <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center relative z-10">
          {/* Signature 1 */}
          <div className="space-y-2">
            <div className="h-10 flex items-center justify-center">
              <span className="font-serif italic text-lg sm:text-xl text-slate-700 select-none opacity-80">
                Alvaro Rodriguez P.
              </span>
            </div>
            <div className="border-t border-slate-400 pt-1.5">
              <div className="text-xs font-bold text-slate-900">Subdirección de Centro</div>
              <div className="text-[10px] text-slate-500">SENA — Regional {profile.regional.split('(')[0].trim()}</div>
            </div>
          </div>

          {/* Center Official Gold Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-md border-2 border-amber-400">
              <img
                src="/src/assets/images/sena_certificate_crest_1792526741221.jpg"
                alt="Sello Oficial de Excelencia Formativa SENA"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[9px] font-bold tracking-widest uppercase text-emerald-900 mt-1">
              Acreditado FPI SENA
            </span>
          </div>

          {/* Signature 2 */}
          <div className="space-y-2">
            <div className="h-10 flex items-center justify-center">
              <span className="font-serif italic text-lg sm:text-xl text-slate-700 select-none opacity-80">
                Dra. Claudia M. Vargas
              </span>
            </div>
            <div className="border-t border-slate-400 pt-1.5">
              <div className="text-xs font-bold text-slate-900">Coordinación de Formación Profesional</div>
              <div className="text-[10px] text-slate-500">Comité de Inducción y Bienestar</div>
            </div>
          </div>
        </div>

        {/* Security & Verification Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 relative z-10">
          <div className="flex items-center gap-3">
            {/* Mock QR Representation */}
            <div className="p-1 bg-white border border-slate-300 rounded shrink-0">
              <QrCode className="w-8 h-8 text-slate-800" />
            </div>
            <div className="text-left space-y-0.5">
              <div>
                Código de Verificación Único:{' '}
                <strong className="font-mono text-slate-800">{certCode}</strong>
              </div>
              <div>
                Fecha de Emisión: <strong>{issueDate}</strong>
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-0.5">
            <div className="font-medium text-slate-600">
              Verificable en la plataforma institucional del SENA
            </div>
            <div className="text-emerald-700 font-semibold flex items-center justify-center sm:justify-end gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Registro de Inducción FPI Digital Certificado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
