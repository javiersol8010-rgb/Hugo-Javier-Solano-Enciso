import React, { useState } from 'react';
import { PRODUCTIVE_STAGES } from '../data/regulationData';
import { ProductiveStageModal } from '../types/induction';
import { Briefcase, Building2, FileCheck, Rocket, GraduationCap, CheckCircle2, ShieldAlert, Sparkles, Clock } from 'lucide-react';

interface ModuleProductiveStageProps {
  onCompleteModule: (moduleId: string, xpEarned: number, badgeId?: string) => void;
  isCompleted: boolean;
}

const MODALITY_ICONS: Record<string, React.ElementType> = {
  Building2,
  FileCheck,
  Rocket,
  GraduationCap,
};

export const ModuleProductiveStage: React.FC<ModuleProductiveStageProps> = ({
  onCompleteModule,
  isCompleted,
}) => {
  const [selectedStage, setSelectedStage] = useState<ProductiveStageModal>(PRODUCTIVE_STAGES[0]);
  const [understoodDuties, setUnderstoodDuties] = useState<Record<string, boolean>>({
    bitacoras: false,
    visitas: false,
    conducta: false,
    plazos: false,
  });

  const allDutiesChecked = Object.values(understoodDuties).every(Boolean);

  const toggleDuty = (key: string) => {
    const updated = { ...understoodDuties, [key]: !understoodDuties[key] };
    setUnderstoodDuties(updated);
    if (Object.values(updated).every(Boolean) && !isCompleted) {
      onCompleteModule('etapa-productiva', 60, 'badge-etapa-productiva');
    }
  };

  const IconComp = MODALITY_ICONS[selectedStage.iconName] || Briefcase;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Capítulo V · Acuerdo 0009 de 2024</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Etapa Productiva: Aplicación Real en el Sector Laboral
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              La etapa productiva es el componente práctico donde consolidas tus competencias en una
              empresa u organización. Debe culminarse satisfactoriamente para acceder a la titulación oficial.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isCompleted || allDutiesChecked ? (
              <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Módulo Completado</span>
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Verifica los compromisos clave para ganar <strong className="text-emerald-700 dark:text-emerald-400">60 XP</strong>
              </div>
            )}
          </div>
        </div>

        {/* Modality Selector Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRODUCTIVE_STAGES.map((stage) => {
            const isSelected = selectedStage.id === stage.id;
            const Comp = MODALITY_ICONS[stage.iconName] || Briefcase;

            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <div
                    className={`p-2 w-fit rounded-lg mb-2.5 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Comp className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {stage.title}
                  </h3>
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Duración: {stage.durationMonths} meses</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Modality Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              <IconComp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                Modalidad Seleccionada
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {selectedStage.title}
              </h3>
            </div>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            {selectedStage.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 block mb-1">
                Apoyo Económico:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedStage.economicSupport}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/60">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 block mb-1">
                Seguridad Social (EPS / ARL):
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedStage.socialSecurity}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-amber-950 dark:text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Error Frecuente que debes Evitar:</span>
            </div>
            <p className="leading-relaxed pl-5">
              {selectedStage.frequentMistakeToAvoid}
            </p>
          </div>
        </div>

        {/* Right Column: Practical Checklist of Duties */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100">
              Checklist de Compromisos en la Práctica
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Marca cada compromiso reglamentario para confirmar tu comprensión y sumar los puntos del módulo:
          </p>

          <div className="space-y-3">
            {[
              {
                key: 'bitacoras',
                title: 'Bitácoras Quincenales',
                desc: 'Diligenciar y subir a la plataforma institucional las bitácoras firmadas por el coformador de la empresa cada 15 días.',
              },
              {
                key: 'visitas',
                title: 'Concertación y Visitas de Seguimiento',
                desc: 'Atender las 2 visitas oficiales del instructor de seguimiento (visita inicial de concertación y visita final de evaluación).',
              },
              {
                key: 'conducta',
                title: 'Conducta Ética y Confidencialidad',
                desc: 'Guardar reserva de los secretos comerciales e industriales de la empresa y mantener conducta intachable.',
              },
              {
                key: 'plazos',
                title: 'Plazo Máximo de Inicio',
                desc: 'Iniciar la alternativa productiva dentro de los plazos reglamentarios tras culminar la etapa lectiva.',
              },
            ].map((item) => {
              const checked = understoodDuties[item.key];

              return (
                <button
                  key={item.key}
                  onClick={() => toggleDuty(item.key)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    checked
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      checked
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {checked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {allDutiesChecked && (
            <div className="p-3 bg-emerald-100/70 dark:bg-emerald-950/50 rounded-xl text-xs font-semibold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>¡Has validado todos los requisitos de la Etapa Productiva! (+60 XP)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
