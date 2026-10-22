import React, { useState } from 'react';
import { DILEMMAS_DATA } from '../data/regulationData';
import { DilemmaCase } from '../types/induction';
import { Scale, CheckCircle2, AlertCircle, ArrowRight, Sparkles, BookOpen } from 'lucide-react';

interface ModuleDilemmasProps {
  onCompleteModule: (moduleId: string, xpEarned: number, badgeId?: string) => void;
  isCompleted: boolean;
}

export const ModuleDilemmas: React.FC<ModuleDilemmasProps> = ({ onCompleteModule, isCompleted }) => {
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answeredCases, setAnsweredCases] = useState<Record<string, { optionId: string; isCorrect: boolean }>>({});
  const [totalEarnedXP, setTotalEarnedXP] = useState(0);

  const dilemma: DilemmaCase = DILEMMAS_DATA[currentDilemmaIndex];
  const currentAnswer = answeredCases[dilemma.id];

  const handleSelectOption = (optId: string) => {
    if (currentAnswer) return; // already answered
    setSelectedOptionId(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || currentAnswer) return;

    const opt = dilemma.options.find((o) => o.id === selectedOptionId);
    if (!opt) return;

    const newAnswered = {
      ...answeredCases,
      [dilemma.id]: {
        optionId: selectedOptionId,
        isCorrect: opt.isCorrect,
      },
    };
    setAnsweredCases(newAnswered);
    setTotalEarnedXP((prev) => prev + opt.xpEarned);

    // If all dilemmas solved, complete module
    const answeredCount = Object.keys(newAnswered).length;
    if (answeredCount === DILEMMAS_DATA.length) {
      onCompleteModule('casos', 80, 'badge-dilemas');
    }
  };

  const handleNextCase = () => {
    setSelectedOptionId(null);
    if (currentDilemmaIndex + 1 < DILEMMAS_DATA.length) {
      setCurrentDilemmaIndex((prev) => prev + 1);
    }
  };

  const handlePrevCase = () => {
    setSelectedOptionId(null);
    if (currentDilemmaIndex > 0) {
      setCurrentDilemmaIndex((prev) => prev - 1);
    }
  };

  const allCompleted = Object.keys(answeredCases).length === DILEMMAS_DATA.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4" />
              <span>Simulador de Casos Reales del Comité</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Dilemas de Convivencia y Régimen Normativo
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              El Comité de Evaluación y Seguimiento analiza situaciones cotidianas en los centros de
              formación. Asume el rol de asesor y decide el camino correcto según el Acuerdo 0009 de 2024.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isCompleted || allCompleted ? (
              <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Casos Resueltos (+{totalEarnedXP || 80} XP)</span>
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Resuelve los 4 casos para ganar <strong className="text-emerald-700 dark:text-emerald-400">80 XP</strong>
              </div>
            )}
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mt-6 flex items-center gap-2">
          {DILEMMAS_DATA.map((d, index) => {
            const isDone = !!answeredCases[d.id];
            const isCurrent = index === currentDilemmaIndex;

            return (
              <button
                key={d.id}
                onClick={() => {
                  setCurrentDilemmaIndex(index);
                  setSelectedOptionId(null);
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all text-left border ${
                  isCurrent
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs'
                    : isDone
                    ? 'border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Caso {index + 1}</span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <div className="truncate text-[10px] opacity-80 mt-0.5">{d.module}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dilemma Story & Decision Card */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div>
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">
            {dilemma.module}
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {dilemma.title}
          </h3>
        </div>

        {/* Story context */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-2">
          <p className="font-normal">{dilemma.storyContext}</p>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-semibold text-xs sm:text-sm">
            {dilemma.problem}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Opciones de Decisión:
          </div>

          {dilemma.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id || currentAnswer?.optionId === opt.id;
            const isSubmitted = !!currentAnswer;

            let cardStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/50';
            if (isSubmitted) {
              if (opt.isCorrect) {
                cardStyle = 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-medium';
              } else if (isSelected && !opt.isCorrect) {
                cardStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100';
              } else {
                cardStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 opacity-60';
              }
            } else if (isSelected) {
              cardStyle = 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20';
            }

            return (
              <button
                key={opt.id}
                disabled={isSubmitted}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${cardStyle}`}
              >
                <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <div className="flex-1 min-w-0 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {opt.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Section if answered */}
        {currentAnswer ? (
          <div
            className={`p-5 rounded-xl border space-y-3 ${
              currentAnswer.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {currentAnswer.isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>¡Decisión Alineada con el Reglamento! (+50 XP)</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>Decisión No Recomendada (+10 XP de aprendizaje)</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm leading-relaxed">
              {dilemma.options.find((o) => o.id === currentAnswer.optionId)?.feedback}
            </p>

            <div className="text-xs font-mono font-medium opacity-85 pt-2 border-t border-current/20 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Base Jurídica: {dilemma.options.find((o) => o.id === currentAnswer.optionId)?.legalBasis}</span>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                disabled={currentDilemmaIndex === 0}
                onClick={handlePrevCase}
                className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
              >
                Caso Anterior
              </button>

              {currentDilemmaIndex + 1 < DILEMMAS_DATA.length ? (
                <button
                  onClick={handleNextCase}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <span>Siguiente Caso</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>¡Has completado todos los dilemas!</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="pt-2 flex justify-end">
            <button
              disabled={!selectedOptionId}
              onClick={handleSubmitAnswer}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
            >
              <span>Confirmar Dictamen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
