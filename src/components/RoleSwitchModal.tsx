import React, { useState } from 'react';
import { UserRole } from '../types/induction';
import { ShieldCheck, GraduationCap, ArrowRight, X } from 'lucide-react';

interface RoleSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSwitchModal: React.FC<RoleSwitchModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
}) => {
  const [targetRole, setTargetRole] = useState<UserRole>(currentRole === 'instructor' ? 'aprendiz' : 'instructor');

  if (!isOpen) return null;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectRole(targetRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Selección de Rol Institucional
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Alterna entre la vista de seguimiento y la experiencia del aprendiz
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role options selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTargetRole('aprendiz')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              targetRole === 'aprendiz'
                ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <GraduationCap className="w-5 h-5 text-emerald-600 mb-2" />
            <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
              Aprendiz SENA
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Ruta formativa, módulos y evaluación
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTargetRole('instructor')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              targetRole === 'instructor'
                ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-blue-600 mb-2" />
            <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
              Instructor / Admin
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Control total, Sheets y seguimiento
            </div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleConfirm} className="space-y-4">
          {targetRole === 'instructor' ? (
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Al entrar como <strong>Instructor</strong>, tendrás acceso completo al panel de control, seguimiento de aprendices, auditoría de certificados y sincronización con Google Drive / Sheets.
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Al entrar como <strong>Aprendiz</strong>, verás la experiencia de inducción interactiva tal como la ven tus alumnos, sin botones administrativos ni acceso a hojas de cálculo.
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
            >
              <span>{targetRole === 'instructor' ? 'Ingresar como Instructor' : 'Activar Vista de Aprendiz'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
