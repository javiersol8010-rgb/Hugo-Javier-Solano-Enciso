import React from 'react';
import { SheetApprenticeRow } from '../services/sheetsSync';
import { SenaLogo } from './SenaLogo';
import { X, Printer, ShieldCheck, QrCode, CheckCircle2 } from 'lucide-react';

interface StudentCertificateViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: SheetApprenticeRow | null;
}

export const StudentCertificateViewerModal: React.FC<StudentCertificateViewerModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Action Bar */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Auditoría de Constancia Institucional · Aprendiz SENA
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verificación oficial de inducción en base de datos Google Drive
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Rendering Area */}
        <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto bg-slate-100 dark:bg-slate-950/50">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-4 border-double border-emerald-800/40 shadow-xl relative overflow-hidden text-slate-900 max-w-3xl mx-auto">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <SenaLogo className="w-[500px] h-[500px]" variant="symbol" />
            </div>

            {/* Corner Borders */}
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-emerald-800 pointer-events-none" />
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-emerald-800 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-emerald-800 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-emerald-800 pointer-events-none" />

            <div className="text-center space-y-3 relative z-10">
              <div className="flex items-center justify-center">
                <SenaLogo className="h-12" variant="full" />
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase block">
                  República de Colombia · Ministerio del Trabajo
                </span>
                <span className="text-xs font-extrabold tracking-wider text-[#00324D] uppercase block">
                  Servicio Nacional de Aprendizaje — SENA
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {student.regional} · {student.trainingCenter}
                </span>
              </div>

              <div className="pt-2">
                <div className="inline-block border-y-2 border-emerald-700/60 py-1.5 px-6">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-800 uppercase block">
                    Constancia Oficial de Cumplimiento de Inducción
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#00324D] tracking-tight">
                    CERTIFICADO DE APROBACIÓN
                  </h2>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center space-y-4 relative z-10">
              <p className="text-xs text-slate-600 font-serif italic">
                El Subdirector del Centro de Formación y la Coordinación Académica hacen constar que el (la) aprendiz:
              </p>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-950 uppercase tracking-tight">
                  {student.fullName}
                </h3>
                <p className="text-xs font-mono text-slate-600 mt-1">
                  Identificado(a) con {student.documentType} No. <strong>{student.documentNumber}</strong>
                </p>
              </div>

              <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed">
                Ha completado satisfactoriamente la inducción integral sobre el{' '}
                <strong>Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024)</strong>, demostrando competencia y apropiación
                de sus deberes, derechos y normativa institucional.
              </p>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 max-w-lg mx-auto">
                <div className="text-xs font-bold text-emerald-950">{student.programName}</div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  Ficha No. <strong>{student.fichaNumber}</strong> · Calificación: <strong>{student.score} (Aprobado)</strong>
                </div>
              </div>
            </div>

            {/* Footer verification */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 relative z-10">
              <div className="flex items-center gap-2">
                <QrCode className="w-7 h-7 text-slate-800" />
                <div className="text-left">
                  <div>Código de Certificado: <strong className="font-mono text-slate-800">{student.certificateCode}</strong></div>
                  <div>Fecha de Emisión: <strong>{student.certificateDate}</strong></div>
                </div>
              </div>

              <div className="text-right flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verificado en Registro Central SENA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
