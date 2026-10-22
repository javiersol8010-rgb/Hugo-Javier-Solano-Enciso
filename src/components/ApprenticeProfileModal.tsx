import React, { useState } from 'react';
import { ApprenticeProfile, GamificationState } from '../types/induction';
import {
  SENA_REGIONALES,
  SENA_CENTROS_EJEMPLO,
  SENA_PROGRAMAS_EJEMPLO,
  BADGES_DATA,
} from '../data/regulationData';
import { X, CheckCircle2, UserCheck, ShieldCheck, Compass, Scale, Briefcase, Award, BookOpenCheck, FileSpreadsheet } from 'lucide-react';

interface ApprenticeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApprenticeProfile;
  onSaveProfile: (updated: ApprenticeProfile) => void;
  gamification: GamificationState;
  onOpenSheetsSync?: () => void;
}

const BADGE_ICONS: Record<string, React.ElementType> = {
  Compass,
  ShieldCheck,
  BookOpenCheck,
  Scale,
  Briefcase,
  Award,
};

export const ApprenticeProfileModal: React.FC<ApprenticeProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  gamification,
  onOpenSheetsSync,
}) => {
  const [formData, setFormData] = useState<ApprenticeProfile>({ ...profile });
  const [activeTab, setActiveTab] = useState<'perfil' | 'insignias'>('perfil');
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">
              Ficha del Aprendiz SENA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configura tus datos oficiales para la expedición de tu certificado de inducción.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`py-3 transition-colors ${
              activeTab === 'perfil'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Datos Personales e Institucionales
          </button>
          <button
            onClick={() => setActiveTab('insignias')}
            className={`py-3 transition-colors flex items-center gap-2 ${
              activeTab === 'insignias'
                ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>Mis Insignias</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold">
              {gamification.unlockedBadges.length} / {BADGES_DATA.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {activeTab === 'perfil' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Nombres y Apellidos Completos
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej. Juan Carlos Rodríguez Morales"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Tipo de Documento
                  </label>
                  <select
                    value={formData.documentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        documentType: e.target.value as ApprenticeProfile['documentType'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="CC">Cédula de Ciudadanía (C.C.)</option>
                    <option value="TI">Tarjeta de Identidad (T.I.)</option>
                    <option value="CE">Cédula de Extranjería (C.E.)</option>
                    <option value="PPT">Permiso por Protección Temporal (PPT)</option>
                    <option value="PEP">Permiso Especial de Permanencia (PEP)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Número de Identificación
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.documentNumber}
                    onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                    placeholder="Ej. 1024589321"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Regional SENA
                  </label>
                  <select
                    value={formData.regional}
                    onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {SENA_REGIONALES.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Número de Ficha de Caracterización
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fichaNumber}
                    onChange={(e) => setFormData({ ...formData, fichaNumber: e.target.value })}
                    placeholder="Ej. 2874102"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Centro de Formación
                </label>
                <input
                  type="text"
                  required
                  list="centros-list"
                  value={formData.trainingCenter}
                  onChange={(e) => setFormData({ ...formData, trainingCenter: e.target.value })}
                  placeholder="Ej. Centro de Gestión de Mercados, Logística y TIC"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
                />
                <datalist id="centros-list">
                  {SENA_CENTROS_EJEMPLO.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Programa de Formación
                </label>
                <input
                  type="text"
                  required
                  list="programas-list"
                  value={formData.programName}
                  onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                  placeholder="Ej. Tecnólogo en Análisis y Desarrollo de Software (ADSO)"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800"
                />
                <datalist id="programas-list">
                  {SENA_PROGRAMAS_EJEMPLO.map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancelar
                </button>
                {onOpenSheetsSync && (
                  <button
                    type="button"
                    onClick={() => {
                      onSaveProfile(formData);
                      onClose();
                      onOpenSheetsSync();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 rounded-lg transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Guardar y Sincronizar Drive</span>
                  </button>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Guardar Datos</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                ¡Cada módulo completado y dilema resuelto desbloquea insignias que acreditan tu
                compromiso con el Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024)!
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BADGES_DATA.map((badge) => {
                  const isUnlocked = gamification.unlockedBadges.includes(badge.id);
                  const IconComp = BADGE_ICONS[badge.icon] || Award;

                  return (
                    <div
                      key={badge.id}
                      className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                        isUnlocked
                          ? 'bg-white dark:bg-slate-800/80 border-emerald-300 dark:border-emerald-700 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          isUnlocked
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {badge.title}
                          </h4>
                          {isUnlocked ? (
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold uppercase">
                              Obtenida
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">Bloqueada</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {badge.description}
                        </p>
                        <span className="inline-block text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                          Requisito: {badge.criteria}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Toast */}
        {showSavedToast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Datos del aprendiz actualizados correctamente</span>
          </div>
        )}
      </div>
    </div>
  );
};
