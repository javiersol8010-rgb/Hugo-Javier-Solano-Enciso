import React from 'react';
import { ApprenticeProfile, GamificationState } from '../types/induction';
import { Award, ArrowRight, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  profile: ApprenticeProfile;
  gamification: GamificationState;
  onStartLearning: () => void;
  onOpenEvaluation: () => void;
  onOpenCertificate: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  profile,
  gamification,
  onStartLearning,
  onOpenEvaluation,
  onOpenCertificate,
}) => {
  // Modules count
  const totalCoreModules = 4;
  const progressPercent = Math.min(
    100,
    Math.round(((gamification.completedModules.length + (gamification.assessmentPassed ? 1 : 0)) / (totalCoreModules + 1)) * 100)
  );

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/sena_campus_induction_1792526741030.jpg"
          alt="Ambientes de Formación Profesional Integral SENA"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-5xl">
        {/* Subtle unboxed metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 font-medium mb-3">
          <span>Servicio Nacional de Aprendizaje</span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span>Acuerdo 0009 de 2024</span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span>Inducción Integral</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15] text-balance">
          Reglamento del Aprendiz SENA: Conoce tus Derechos, Honra tus Deberes
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
          Bienvenido(a), <span className="font-semibold text-emerald-300">{profile.fullName}</span>.
          Estás cursando <span className="text-white font-medium">{profile.programName}</span> (Ficha {profile.fichaNumber}) en la <span className="text-white font-medium">{profile.regional}</span>. Esta plataforma interactiva te guiará en tu ruta de inducción para dominar el nuevo reglamento institucional y certificar tu aprendizaje.
        </p>

        {/* Progress & Quick Stats Bar */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 max-w-3xl">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300">Progreso de Inducción</span>
              <span className="font-mono tabular-nums font-bold text-emerald-400">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:border-l sm:border-white/10 sm:pl-4">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Experiencia Ganada</div>
              <div className="text-sm font-bold font-mono tabular-nums text-white">
                {gamification.xp} XP <span className="text-xs font-normal text-slate-400">(Nivel {gamification.level})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:border-l sm:border-white/10 sm:pl-4">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Estado de Certificación</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                {gamification.assessmentPassed ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Aprobado
                  </span>
                ) : (
                  <span className="text-amber-300">Pendiente Evaluación</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onStartLearning}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 whitespace-nowrap"
          >
            <span>Iniciar Ruta de Módulos</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenEvaluation}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors whitespace-nowrap"
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Presentar Evaluación Final</span>
          </button>

          {gamification.assessmentPassed && (
            <button
              onClick={onOpenCertificate}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-emerald-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors whitespace-nowrap shadow-md"
            >
              <Award className="w-4 h-4" />
              <span>Ver y Descargar Certificado</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
