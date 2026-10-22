import React, { useState } from 'react';
import { RIGHTS_DATA } from '../data/regulationData';
import { RightItem } from '../types/induction';
import { ShieldCheck, CheckCircle2, BookOpen, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

interface ModuleRightsProps {
  onCompleteModule: (moduleId: string, xpEarned: number, badgeId?: string) => void;
  isCompleted: boolean;
}

export const ModuleRights: React.FC<ModuleRightsProps> = ({ onCompleteModule, isCompleted }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedRight, setSelectedRight] = useState<RightItem>(RIGHTS_DATA[0]);
  const [miniChallengeAnswer, setMiniChallengeAnswer] = useState<number | null>(null);
  const [miniChallengeSubmitted, setMiniChallengeSubmitted] = useState<boolean>(false);

  const categories = [
    'todos',
    'Formación y Calidad',
    'Bienestar y Apoyos',
    'Representación y Libertad',
    'Certificación',
  ];

  const filteredRights =
    selectedCategory === 'todos'
      ? RIGHTS_DATA
      : RIGHTS_DATA.filter((r) => r.category === selectedCategory);

  const handleChallengeSubmit = () => {
    setMiniChallengeSubmitted(true);
    if (miniChallengeAnswer === 1) {
      onCompleteModule('derechos', 60, 'badge-derechos');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Module Intro Header */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Capítulo II · Acuerdo 0009 de 2024</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Derechos Fundamentales del Aprendiz SENA
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Como aprendiz del Servicio Nacional de Aprendizaje, la Constitución y el reglamento
              institucional te garantizan el acceso a una formación con dignidad, equidad,
              herramientas de calidad, bienestar y participación democrática.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isCompleted ? (
              <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Módulo Completado</span>
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Revisa los derechos y resuelve el reto para ganar <strong className="text-emerald-700 dark:text-emerald-400">60 XP</strong>
              </div>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'todos' ? 'Todos los Derechos (10)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Column Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Rights List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Artículos y Garantías ({filteredRights.length})
          </div>

          <div className="space-y-2">
            {filteredRights.map((right) => {
              const isSelected = selectedRight.id === right.id;

              return (
                <button
                  key={right.id}
                  onClick={() => setSelectedRight(right)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                      {right.articleRef}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                      {right.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {right.summary}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform mt-1 ${
                      isSelected ? 'text-emerald-700 dark:text-emerald-400 translate-x-1' : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Right Focus Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-2">
              <BookOpen className="w-4 h-4" />
              <span>{selectedRight.articleRef}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal">{selectedRight.category}</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              {selectedRight.title}
            </h3>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="block text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Garantía Normativa:
              </strong>
              {selectedRight.summary}
            </div>

            {/* Practical Application in SENA daily life */}
            <div className="mt-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                ¿Cómo se vive este derecho en tu centro de formación?
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">
                {selectedRight.practicalExample}
              </div>
            </div>

            {/* Key normative highlight */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-700 dark:text-slate-300 font-semibold">Aspecto Clave:</strong>{' '}
                {selectedRight.statuteHighlight}
              </span>
            </div>
          </div>

          {/* Gamified Mini-Challenge */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-2xl p-6 text-white shadow-md border border-slate-700 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Mini-Reto Rápido: Evaluación de Derechos</span>
              </div>
              <span className="text-xs text-slate-300 font-mono">+60 XP</span>
            </div>

            <h4 className="text-sm sm:text-base font-semibold text-white mt-1">
              Si un instructor no retroalimenta oportunamente tus evidencias entregadas a tiempo,
              ¿cuál es el plazo reglamentario con el que cuenta?
            </h4>

            <div className="mt-4 space-y-2">
              {[
                'No hay plazo, puede calificar hasta el final del trimestre',
                'Máximo 8 días hábiles siguientes a la entrega de la evidencia',
                '30 días hábiles calendario',
              ].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMiniChallengeAnswer(idx);
                    setMiniChallengeSubmitted(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs sm:text-sm transition-all border ${
                    miniChallengeAnswer === idx
                      ? 'bg-emerald-500/20 border-emerald-400 text-white font-medium'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className="font-mono text-emerald-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between pt-2">
              <div className="text-xs">
                {miniChallengeSubmitted && (
                  miniChallengeAnswer === 1 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> ¡Correcto! Plazo máximo de 8 días hábiles (Capítulo II).
                    </span>
                  ) : (
                    <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> La respuesta correcta es 8 días hábiles.
                    </span>
                  )
                )}
              </div>

              <button
                disabled={miniChallengeAnswer === null}
                onClick={handleChallengeSubmit}
                className="px-4 py-2 text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Validar Respuesta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
