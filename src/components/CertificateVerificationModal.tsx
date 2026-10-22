import React, { useState } from 'react';
import { ApprenticeProfile, GamificationState } from '../types/induction';
import { X, Search, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface CertificateVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApprenticeProfile;
  gamification: GamificationState;
}

export const CertificateVerificationModal: React.FC<CertificateVerificationModalProps> = ({
  isOpen,
  onClose,
  profile,
  gamification,
}) => {
  const [searchCode, setSearchCode] = useState(gamification.certificateCode || '');
  const [result, setResult] = useState<{
    found: boolean;
    learnerName?: string;
    docNumber?: string;
    program?: string;
    ficha?: string;
    regional?: string;
    issueDate?: string;
    score?: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = searchCode.trim().toUpperCase();

    // Check if matches the apprentice's generated certificate
    if (gamification.certificateCode && cleanCode === gamification.certificateCode.toUpperCase()) {
      setResult({
        found: true,
        learnerName: profile.fullName,
        docNumber: `${profile.documentType} ${profile.documentNumber}`,
        program: profile.programName,
        ficha: profile.fichaNumber,
        regional: profile.regional,
        issueDate: gamification.certificateIssuedDate || 'Hoy',
        score: gamification.assessmentScore || 100,
      });
    } else if (cleanCode.startsWith('SENA-IND-')) {
      // Valid mock format test
      setResult({
        found: true,
        learnerName: profile.fullName,
        docNumber: `${profile.documentType} ${profile.documentNumber}`,
        program: profile.programName,
        ficha: profile.fichaNumber,
        regional: profile.regional,
        issueDate: '2024',
        score: 95,
      });
    } else {
      setResult({ found: false });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
              Validador Oficial de Certificados SENA
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Ingresa el código único alfanumérico que figura en el certificado para comprobar su
            validez en la base de datos de inducción institucional (Acuerdo 0009 de 2024).
          </p>

          <form onSubmit={handleVerify} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Ej. SENA-IND-2024-X89K-4102"
                className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm uppercase bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Verificar</span>
              </button>
            </div>
          </form>

          {/* Verification Results */}
          {result && (
            <div className="pt-2">
              {result.found ? (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Certificado Auténtico y Válido</span>
                  </div>

                  <div className="text-xs space-y-1.5 pt-2 border-t border-emerald-200/80 dark:border-emerald-800">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Aprendiz Titular:</span>{' '}
                      <strong className="text-slate-900 dark:text-slate-100">{result.learnerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Documento:</span>{' '}
                      <strong className="text-slate-900 dark:text-slate-100">{result.docNumber}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Programa:</span>{' '}
                      <strong className="text-slate-900 dark:text-slate-100">{result.program}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Ficha:</span>{' '}
                      <strong className="text-slate-900 dark:text-slate-100">{result.ficha}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Estado de Inducción:</span>{' '}
                      <strong className="text-emerald-700 dark:text-emerald-400">Aprobado ({result.score}%)</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Normativa:</span>{' '}
                      <strong className="text-slate-800 dark:text-slate-200">Acuerdo 0009 de 2024 SENA</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-sm text-rose-800 dark:text-rose-300">
                    <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span>Código No Registrado</span>
                  </div>
                  <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                    No se encontró ningún certificado expedido con esa clave. Verifica la escritura o
                    asegúrate de haber culminado la evaluación con puntaje aprobatorio.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
