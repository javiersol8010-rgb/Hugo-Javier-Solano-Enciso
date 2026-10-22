import React, { useState } from 'react';
import { DUTIES_DATA, PROHIBITIONS_DATA } from '../data/regulationData';
import { BookOpenCheck, CheckCircle2, ShieldAlert, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

interface ModuleDutiesProps {
  onCompleteModule: (moduleId: string, xpEarned: number, badgeId?: string) => void;
  isCompleted: boolean;
}

interface ClassifierItem {
  id: string;
  situation: string;
  category: 'deber' | 'prohibicion_grave' | 'falta_gravisima';
  articleRef: string;
  rationale: string;
}

const CLASSIFIER_ITEMS: ClassifierItem[] = [
  {
    id: 'c1',
    situation: 'Portar el carné institucional en lugar visible durante toda la permanencia en las instalaciones.',
    category: 'deber',
    articleRef: 'Capítulo III, Art. 8 - Deberes de Seguridad',
    rationale: 'Es un deber fundamental para garantizar la seguridad y control de acceso al centro de formación.',
  },
  {
    id: 'c2',
    situation: 'Ingresar o comercializar bebidas alcohólicas o sustancias psicoactivas en el centro de formación.',
    category: 'falta_gravisima',
    articleRef: 'Capítulo IV, Art. 9 - Prohibiciones Absolutas',
    rationale: 'Tipificada expresamente como Falta Gravísima, sancionada con cancelación de matrícula inmediata.',
  },
  {
    id: 'c3',
    situation: 'Copiar proyectos, informes o códigos de compañeros sin citar autoría (Plagio académico).',
    category: 'prohibicion_grave',
    articleRef: 'Capítulo IV, Art. 9 - Prohibiciones Académicas',
    rationale: 'Constituye una falta grave que atenta contra la integridad académica e invalida las evidencias.',
  },
  {
    id: 'c4',
    situation: 'Radicar justificación con soporte médico ante el instructor dentro de los 3 días hábiles tras una inasistencia.',
    category: 'deber',
    articleRef: 'Capítulo III, Art. 8 & Capítulo VII - Deberes de Asistencia',
    rationale: 'Es el procedimiento legal obligatorio para evitar el reporte formal de deserción.',
  },
  {
    id: 'c5',
    situation: 'Portar armas de fuego, armas blancas o elementos cortopunzantes en ambientes de formación.',
    category: 'falta_gravisima',
    articleRef: 'Capítulo IV, Art. 9 - Seguridad y Bienes',
    rationale: 'Falta gravísima de seguridad que pone en riesgo inminente la vida de la comunidad educativa.',
  },
  {
    id: 'c6',
    situation: 'Cuidar, limpiar y custodiar las máquinas, herramientas y equipos del taller asignado.',
    category: 'deber',
    articleRef: 'Capítulo III, Art. 8 - Cuidado de Recursos Públicos',
    rationale: 'Los bienes del SENA son patrimonio público de todos los colombianos para la formación.',
  },
];

export const ModuleDuties: React.FC<ModuleDutiesProps> = ({ onCompleteModule, isCompleted }) => {
  const [activeTab, setActiveTab] = useState<'clasificador' | 'deberes' | 'prohibiciones'>('clasificador');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<ClassifierItem | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const currentItem = CLASSIFIER_ITEMS[currentIndex];

  const handleClassify = (cat: 'deber' | 'prohibicion_grave' | 'falta_gravisima') => {
    setSelectedCategory(cat);
    const correct = currentItem.category === cat;
    setIsCorrect(correct);
    setFeedback(currentItem);
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextItem = () => {
    setSelectedCategory(null);
    setFeedback(null);
    setIsCorrect(null);

    if (currentIndex + 1 < CLASSIFIER_ITEMS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameFinished(true);
      onCompleteModule('deberes', 70, 'badge-deberes');
    }
  };

  const handleRestartGame = () => {
    setCurrentIndex(0);
    setSelectedCategory(null);
    setFeedback(null);
    setIsCorrect(null);
    setScore(0);
    setGameFinished(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <BookOpenCheck className="w-4 h-4" />
              <span>Capítulos III y IV · Acuerdo 0009 de 2024</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Deberes, Prohibiciones y Ética Profesional
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              La vida en el SENA se fundamenta en la responsabilidad ciudadana, la honestidad
              intelectual, la convivencia y el cuidado de los recursos comunes del país.
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
                Completa el clasificador para ganar <strong className="text-emerald-700 dark:text-emerald-400">70 XP</strong>
              </div>
            )}
          </div>
        </div>

        {/* View switcher */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setActiveTab('clasificador')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'clasificador'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Reto: Clasificador Ético SENA</span>
          </button>
          <button
            onClick={() => setActiveTab('deberes')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'deberes'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ver Catálogo de Deberes ({DUTIES_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab('prohibiciones')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'prohibiciones'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Ver Catálogo de Prohibiciones ({PROHIBITIONS_DATA.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'clasificador' && (
        <div className="max-w-3xl mx-auto">
          {!gameFinished ? (
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Situación <strong className="text-slate-900 dark:text-slate-100">{currentIndex + 1}</strong> de {CLASSIFIER_ITEMS.length}
                </span>
                <span className="font-mono tabular-nums">
                  Aciertos: <strong className="text-emerald-700 dark:text-emerald-400">{score}</strong>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / CLASSIFIER_ITEMS.length) * 100}%` }}
                />
              </div>

              {/* Scenario card */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-1">
                  Evalúa la siguiente situación:
                </span>
                <p className="text-base sm:text-lg font-semibold leading-snug">
                  "{currentItem.situation}"
                </p>
              </div>

              {/* 3 Classification choices */}
              {!feedback ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleClassify('deber')}
                    className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/40 hover:border-emerald-400 transition-all text-left flex flex-col justify-between group"
                  >
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-1">
                      <BookOpenCheck className="w-4 h-4" />
                      <span>Deber Obligatorio</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Compromiso ético o académico que el aprendiz debe cumplir activamente.
                    </p>
                  </button>

                  <button
                    onClick={() => handleClassify('prohibicion_grave')}
                    className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/80 dark:hover:bg-amber-950/40 hover:border-amber-400 transition-all text-left flex flex-col justify-between group"
                  >
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Prohibición / Grave</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Conducta vetada que afecta la convivencia o integridad formativa.
                    </p>
                  </button>

                  <button
                    onClick={() => handleClassify('falta_gravisima')}
                    className="p-4 rounded-xl border border-rose-200 dark:border-rose-800/80 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/80 dark:hover:bg-rose-950/40 hover:border-rose-400 transition-all text-left flex flex-col justify-between group"
                  >
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-sm mb-1">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Falta Gravísima</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Infracción severa que conlleva a cancelación inmediata de matrícula.
                    </p>
                  </button>
                </div>
              ) : (
                /* Immediate Feedback Card */
                <div
                  className={`p-5 rounded-xl border space-y-3 ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span>¡Clasificación Correcta!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                        <span>Clasificación Incorrecta</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed">
                    {feedback.rationale}
                  </p>

                  <div className="text-xs font-mono font-medium opacity-80 pt-1 border-t border-current/20">
                    Fundamento: {feedback.articleRef}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextItem}
                      className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <span>
                        {currentIndex + 1 < CLASSIFIER_ITEMS.length ? 'Siguiente Caso' : 'Finalizar Reto'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Game Results Card */
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">
                ¡Reto del Clasificador Ético Completado!
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Obtuviste <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{score}</strong> de{' '}
                {CLASSIFIER_ITEMS.length} clasificaciones correctas. Has sumado{' '}
                <strong className="text-emerald-700 dark:text-emerald-400 font-bold">+70 XP</strong> y desbloqueaste la insignia{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">Guardián del Deber</span>.
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleRestartGame}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Repetir Clasificador
                </button>
                <button
                  onClick={() => setActiveTab('deberes')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  Consultar Catálogo de Deberes
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Catalog of Duties */}
      {activeTab === 'deberes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DUTIES_DATA.map((duty) => (
            <div
              key={duty.id}
              className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{duty.articleRef}</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {duty.type}
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 leading-snug">
                  {duty.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {duty.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-700 dark:text-slate-300">Consecuencia del incumplimiento:</strong>{' '}
                  {duty.consequenceIfViolated}
                </div>
                <div className="text-emerald-800 dark:text-emerald-200 font-medium bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-transparent dark:border-emerald-800/40">
                  💡 <strong className="font-semibold">Recomendación práctica:</strong> {duty.bestPractice}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Catalog of Prohibitions */}
      {activeTab === 'prohibiciones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROHIBITIONS_DATA.map((proh) => (
            <div
              key={proh.id}
              className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-rose-700 dark:text-rose-400">{proh.articleRef}</span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      proh.severity === 'Gravísima'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        : proh.severity === 'Grave'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Falta {proh.severity}
                  </span>
                </div>
                <h4 className="font-display font-bold text-base text-slate-900 dark:text-slate-100 leading-snug">
                  {proh.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {proh.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <strong className="text-rose-800 dark:text-rose-400 font-semibold">Sanción Institucional:</strong>{' '}
                {proh.senaPrecedent}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
