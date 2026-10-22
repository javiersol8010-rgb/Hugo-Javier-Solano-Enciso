import React from 'react';
import { ApprenticeProfile, GamificationState } from '../types/induction';
import { BADGES_DATA } from '../data/regulationData';
import { JuvenileAvatar } from './JuvenileAvatar';
import {
  ShieldCheck,
  BookOpenCheck,
  Scale,
  Briefcase,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
  Compass,
  Sparkles,
} from 'lucide-react';

interface InductionDashboardProps {
  profile: ApprenticeProfile;
  gamification: GamificationState;
  onNavigate: (tab: string) => void;
  onOpenProfile: () => void;
}

const BADGE_ICONS: Record<string, React.ElementType> = {
  Compass,
  ShieldCheck,
  BookOpenCheck,
  Scale,
  Briefcase,
  Award,
};

export const InductionDashboard: React.FC<InductionDashboardProps> = ({
  profile,
  gamification,
  onNavigate,
  onOpenProfile,
}) => {
  const steps = [
    {
      id: 'derechos',
      stepNumber: '01',
      title: 'Derechos Fundamentales',
      desc: '10 garantías esenciales: formación de calidad, bienestar, carné, EPP y no discriminación.',
      icon: ShieldCheck,
      xp: 60,
      isCompleted: gamification.completedModules.includes('derechos'),
    },
    {
      id: 'deberes',
      stepNumber: '02',
      title: 'Deberes y Clasificador Ético',
      desc: 'Obligaciones académicas, cuidado del patrimonio público, honestidad con IA y prohibiciones.',
      icon: BookOpenCheck,
      xp: 70,
      isCompleted: gamification.completedModules.includes('deberes'),
    },
    {
      id: 'casos',
      stepNumber: '03',
      title: 'Casos Reales del Comité',
      desc: 'Dilemas prácticos de justificaciones médicas, derechos de autor y medidas formativas.',
      icon: Scale,
      xp: 80,
      isCompleted: gamification.completedModules.includes('casos'),
    },
    {
      id: 'etapa-productiva',
      stepNumber: '04',
      title: 'Etapa Productiva',
      desc: 'Modalidades de práctica (contrato de aprendizaje, proyecto productivo, pasantías) y bitácoras.',
      icon: Briefcase,
      xp: 60,
      isCompleted: gamification.completedModules.includes('etapa-productiva'),
    },
    {
      id: 'evaluacion',
      stepNumber: '05',
      title: 'Evaluación y Certificado',
      desc: 'Prueba final de inducción al reglamento para acreditarte y obtener tu constancia oficial.',
      icon: Award,
      xp: 160,
      isCompleted: gamification.assessmentPassed,
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Route Map Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Ruta de Aprendizaje Gamificada</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Las 5 Estaciones de la Inducción al Reglamento
            </h2>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Avanza a tu ritmo y acumula experiencia institucional
          </div>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((step) => {
            return (
              <div
                key={step.id}
                onClick={() => onNavigate(step.id)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  step.isCompleted
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 hover:border-emerald-400 dark:hover:border-emerald-700'
                    : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {step.stepNumber}
                    </span>
                    {step.isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completado
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        +{step.xp} XP
                      </span>
                    )}
                  </div>

                  <div className="w-12 h-12 rounded-full overflow-hidden mb-3">
                    <JuvenileAvatar imagePath={`/src/assets/images/juvenile_avatar_${parseInt(step.stepNumber)}.jpg`} className="w-full h-full" />
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                  <span>{step.isCompleted ? 'Repasar Módulo' : 'Iniciar Módulo'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}

          {/* Certificate Fast-Pass Card */}
          <div
            onClick={() => onNavigate(gamification.assessmentPassed ? 'certificado' : 'evaluacion')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              gamification.assessmentPassed
                ? 'bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/40 border-amber-300 dark:border-amber-800/80 shadow-sm'
                : 'bg-slate-900 dark:bg-slate-900 text-white border-slate-800 dark:border-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                  Documento Final
                </span>
                {gamification.assessmentPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <div className="w-12 h-12 rounded-full overflow-hidden mb-3">
                <JuvenileAvatar imagePath="/src/assets/images/juvenile_avatar_5_1792613613645.jpg" className="w-full h-full" />
              </div>

              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Certificado Oficial de Inducción
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                {gamification.assessmentPassed
                  ? 'Tu constancia está expedida con firma y código de verificación único para descargar en PDF.'
                  : 'Se habilitará automáticamente al aprobar la evaluación final con un puntaje mínimo del 80%.'}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200/40 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>{gamification.assessmentPassed ? 'Ver y Descargar' : 'Presentar Prueba'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid: Institutional Spotlight & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (7 cols): Apprentices in Action Showcase */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between overflow-hidden relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                Comunidad Formativa
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Formación Integral para el Trabajo Productivo
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                El SENA transforma vidas en más de 117 centros de formación en las 33 regionales
                del país. El cumplimiento del reglamento asegura un ambiente de convivencia y excelencia técnica.
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenProfile}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                >
                  <span>Revisar Ficha: {profile.fichaNumber}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-md aspect-4/3 border border-slate-200 dark:border-slate-800">
              <img
                src="/src/assets/images/sena_apprentices_success_1792526741434.jpg"
                alt="Aprendices SENA trabajando en equipo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Quick Pillars strip */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Dignidad Humana</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Cero discriminación</div>
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Libertad Responsable</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Ética y compromiso</div>
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Calidad FPI</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Aptitud técnica</div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Unlocked Badges Showcase */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Insignias de Inducción</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                {gamification.unlockedBadges.length}/{BADGES_DATA.length}
              </span>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-slate-100">
              Logros y Reconocimientos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Desbloquea insignias al avanzar en los módulos y clasificar dilemas.
            </p>

            {/* Badges Grid */}
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {BADGES_DATA.map((badge) => {
                const isUnlocked = gamification.unlockedBadges.includes(badge.id);
                const IconC = BADGE_ICONS[badge.icon] || Award;

                return (
                  <div
                    key={badge.id}
                    title={`${badge.title}: ${badge.description}`}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                      isUnlocked
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-40'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg mb-1.5 ${
                        isUnlocked
                          ? 'bg-emerald-200/80 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      <IconC className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold truncate max-w-full block">
                      {badge.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Rango Actual: <strong className="text-slate-900 dark:text-slate-100">Aprendiz Nivel {gamification.level}</strong></span>
            <button
              onClick={onOpenProfile}
              className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              Ver todas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
