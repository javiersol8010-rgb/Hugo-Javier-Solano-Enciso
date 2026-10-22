import React, { useState } from 'react';
import { FINAL_QUIZ_QUESTIONS } from '../data/regulationData';
import { QuizQuestion } from '../types/induction';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, BookOpen, ShieldCheck } from 'lucide-react';

interface FinalAssessmentProps {
  onPassAssessment: (scorePercentage: number, certificateCode: string) => void;
  alreadyPassed: boolean;
  previousScore: number;
  onOpenCertificate: () => void;
}

export const FinalAssessment: React.FC<FinalAssessmentProps> = ({
  onPassAssessment,
  alreadyPassed,
  previousScore,
  onOpenCertificate,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptIdx, setSelectedOptIdx] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selectedIdx: number; isCorrect: boolean }>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const question: QuizQuestion = FINAL_QUIZ_QUESTIONS[currentIdx];
  const totalQuestions = FINAL_QUIZ_QUESTIONS.length;

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptIdx(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOptIdx === null || isAnswerSubmitted) return;

    const isCorrect = selectedOptIdx === question.correctIndex;
    setIsAnswerSubmitted(true);
    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: { selectedIdx: selectedOptIdx, isCorrect },
    }));
  };

  const handleNextQuestion = () => {
    setSelectedOptIdx(null);
    setIsAnswerSubmitted(false);

    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate final score
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    // count correct answers
    const correctCount = Object.values(answers).filter((a) => a.isCorrect).length + (selectedOptIdx === question.correctIndex ? 1 : 0);
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    if (scorePercentage >= 80) {
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#39A900', '#00324D', '#FBBF24', '#10B981'],
        });
      } catch (e) {
        console.warn('Confetti unavailable', e);
      }

      // Generate unique verification code
      const randomSuffix1 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const randomSuffix2 = Math.random().toString(36).substring(2, 6).toUpperCase();
      const certCode = `SENA-IND-2024-${randomSuffix1}-${randomSuffix2}`;

      onPassAssessment(scorePercentage, certCode);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOptIdx(null);
    setIsAnswerSubmitted(false);
    setAnswers({});
    setQuizFinished(false);
  };

  const correctAnswersCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const currentPercentage = Math.round((correctAnswersCount / totalQuestions) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Assessment Header Card */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Evaluación de Competencias · Reglamento del Aprendiz</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Evaluación Final de Inducción SENA
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              Responde las 8 preguntas oficiales basadas en el Acuerdo 0009 de 2024. Obtén un puntaje
              mínimo del <strong>80%</strong> para aprobar y generar tu certificado institucional verificable.
            </p>
          </div>

          <div className="shrink-0">
            {alreadyPassed && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold">Aprobado con {previousScore}%</div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">Certificado activo y disponible</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {!quizFinished ? (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
          {/* Progress & Tracker Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">
              Pregunta <strong className="text-slate-900 dark:text-slate-100 font-bold">{currentIdx + 1}</strong> de {totalQuestions}
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{question.category}</span>
            <span className="font-mono tabular-nums">Valor: 20 XP</span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question text */}
          <div className="pt-2">
            <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {question.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((optText, idx) => {
              const isSelected = selectedOptIdx === idx;
              const isCorrectAnswer = idx === question.correctIndex;

              let optionClass = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/70 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  optionClass = 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrectAnswer) {
                  optionClass = 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100';
                } else {
                  optionClass = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 opacity-50';
                }
              } else if (isSelected) {
                optionClass = 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20 font-medium';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${optionClass}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                    {optText}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback & explanation if submitted */}
          {isAnswerSubmitted ? (
            <div
              className={`p-5 rounded-xl border space-y-3 ${
                selectedOptIdx === question.correctIndex
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedOptIdx === question.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>¡Respuesta Correcta! (+20 XP)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <span>Respuesta Incorrecta</span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm leading-relaxed">
                {question.explanation}
              </p>

              <div className="text-xs font-mono font-medium opacity-80 pt-2 border-t border-current/20 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Referencia: {question.normativeRef}</span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <span>{currentIdx + 1 < totalQuestions ? 'Siguiente Pregunta' : 'Ver Resultados'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 flex justify-end">
              <button
                disabled={selectedOptIdx === null}
                onClick={handleCheckAnswer}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
              >
                <span>Validar Juicio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900/90 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-5 transition-colors">
          <div
            className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
              currentPercentage >= 80
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
            }`}
          >
            {currentPercentage >= 80 ? <Award className="w-10 h-10" /> : <RotateCcw className="w-8 h-8" />}
          </div>

          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {currentPercentage >= 80 ? '¡Felicitaciones! Has Aprobado la Inducción' : 'No Alcanzaste el Puntaje Mínimo Requerido'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
              {currentPercentage >= 80
                ? 'Demostraste pleno dominio de tus derechos, deberes y el régimen normativo del SENA.'
                : 'Se requiere al menos un 80% (7 de 8 respuestas correctas) para obtener el certificado. Puedes repasar los módulos y reintentar.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-xs mx-auto">
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              Puntaje Obtenido
            </div>
            <div className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-1">
              {currentPercentage}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {correctAnswersCount} de {totalQuestions} respuestas correctas
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Presentar de Nuevo</span>
            </button>

            {currentPercentage >= 80 && (
              <button
                onClick={onOpenCertificate}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>Ver y Descargar Certificado</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
