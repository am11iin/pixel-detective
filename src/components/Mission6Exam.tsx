'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MissionKey, TaskDiagnosis } from '@/types';
import { EXAM_QUESTIONS } from '@/data/questions';
import { sounds } from '@/utils/sound';

interface Mission6Props {
  onScoreUpdate: (score: number) => void;
  onNavigateToTask: (task: MissionKey) => void;
  onFinishExam: () => void;
}

const TASK_INFOS: Record<
  'm1' | 'm2' | 'm3' | 'm4' | 'm5',
  { name: string; maxPts: number; tip: string; defaultAdvice: string }
> = {
  m1: {
    name: 'Tâche 1 : Les Pixels (0-255)',
    maxPts: 8,
    tip: 'Rappelle-toi : 0 = Noir complet (éteint), 128 = Gris moyen, 255 = Blanc éclatant (allumé à fond).',
    defaultAdvice: 'Revois le vocabulaire de base : chaque pixel est un nombre entre 0 et 255.',
  },
  m2: {
    name: 'Tâche 2 : Les Voisins & Moyenne',
    maxPts: 20,
    tip: 'Le filtre flou fait simplement la moyenne arithmétique des 9 cases (somme des valeurs ÷ 9).',
    defaultAdvice: 'Entraîne-toi à additionner les 9 cases et à diviser par 9 pour adoucir les pics.',
  },
  m3: {
    name: 'Tâche 3 : Coefficients & Normalisation',
    maxPts: 32,
    tip: 'N’oublie JAMAIS de diviser par la somme des coefficients, sinon le pixel dépasse 255 et brûle au blanc !',
    defaultAdvice: 'Comme un bulletin de notes : on multiplie par le coef de chaque case, puis on divise par le total des coefs.',
  },
  m4: {
    name: 'Tâche 4 : Studio Filtres (Effets Réels)',
    maxPts: 32,
    tip: 'La netteté amplifie l’écart avec les voisins. Les contours s’annulent à 0 (noir) là où l’image est uniforme.',
    defaultAdvice: 'Comprends la différence entre flou (lissage), netteté (renforcement) et contours (détection d’écarts).',
  },
  m5: {
    name: 'Tâche 5 : Détection Visuelle & Mystère',
    maxPts: 8,
    tip: 'Observe le grain : si les détails s’adoucissent c’est du flou, si les arêtes deviennent néon c’est des contours.',
    defaultAdvice: 'Développe ton intuition visuelle pour identifier quel filtre a modifié une image.',
  },
};

export function Mission6Exam({ onScoreUpdate, onNavigateToTask, onFinishExam }: Mission6Props) {
  const [qIndex, setQIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answeredState, setAnsweredState] = useState<Record<number, { chosen: number; isCorrect: boolean }>>({});
  const [taskScores, setTaskScores] = useState<Record<'m1' | 'm2' | 'm3' | 'm4' | 'm5', number>>({
    m1: 0,
    m2: 0,
    m3: 0,
    m4: 0,
    m5: 0,
  });

  const isExamFinished = qIndex >= EXAM_QUESTIONS.length;

  // Strict score reset to zero
  const resetExamToZero = () => {
    sounds.playTap();
    setQIndex(0);
    setScore(0);
    setAnsweredState({});
    setTaskScores({ m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 });
    onScoreUpdate(0);
  };

  const handleSelectOption = (optIdx: number) => {
    if (answeredState[qIndex] !== undefined) return;

    const q = EXAM_QUESTIONS[qIndex];
    const isCorrect = optIdx === q.correct;

    if (isCorrect) {
      sounds.playSuccess();
    } else {
      sounds.playWrong();
    }

    const nextAnswered = {
      ...answeredState,
      [qIndex]: { chosen: optIdx, isCorrect },
    };
    setAnsweredState(nextAnswered);

    if (isCorrect) {
      const nextScore = score + q.pts;
      setScore(nextScore);
      onScoreUpdate(nextScore);

      setTaskScores((prev) => ({
        ...prev,
        [q.task]: prev[q.task] + q.pts,
      }));
    }
  };

  const handleNext = () => {
    sounds.playTap();
    const nextIdx = qIndex + 1;
    setQIndex(nextIdx);

    if (nextIdx >= EXAM_QUESTIONS.length) {
      onFinishExam();
      sounds.playLevelUp();
      if (score >= 60) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    }
  };

  // Build Diagnostic Reports
  const getDiagnoses = (): TaskDiagnosis[] => {
    const tasks: Array<'m1' | 'm2' | 'm3' | 'm4' | 'm5'> = ['m1', 'm2', 'm3', 'm4', 'm5'];
    return tasks.map((tKey) => {
      const got = taskScores[tKey];
      const max = TASK_INFOS[tKey].maxPts;
      const passed = got >= max * 0.75;
      return {
        key: tKey,
        name: TASK_INFOS[tKey].name,
        score: got,
        maxScore: max,
        passed,
        advice: passed ? '✅ Notion parfaitement maîtrisée !' : TASK_INFOS[tKey].defaultAdvice,
        tip: TASK_INFOS[tKey].tip,
      };
    });
  };

  // ===================== ÉCRAN DU BILAN DIAGNOSTIQUE =====================
  if (isExamFinished) {
    const diagnoses = getDiagnoses();
    const weakTasks = diagnoses.filter((d) => !d.passed);
    const grade =
      score >= 85
        ? '🏆 Détective Légendaire'
        : score >= 65
        ? '🔎 Détective Confirmé'
        : score >= 45
        ? '🕵️ Détective en Progression'
        : '🌱 Apprenti Détective';

    return (
      <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
        {/* Final Score Card */}
        <div className="p-8 sm:p-10 rounded-[2.5rem] border-2 border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 text-center space-y-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 via-pink-500 to-cyan-400 text-slate-950 shadow-md">
            {grade}
          </span>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Boss Final Vaincu !
          </h2>

          <div className="flex items-baseline justify-center gap-2 font-mono py-2">
            <span className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300">
              {score}
            </span>
            <span className="text-2xl font-bold text-slate-500">/ 100</span>
          </div>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {score >= 80
              ? 'Félicitations ! Tu as brillamment compris comment la convolution et les filtres transforment les pixels d’une image.'
              : 'Beau parcours ! Examine ci-dessous ton bilan par tâche pour repérer exactement où tu as perdu des points et combler tes lacunes.'}
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={resetExamToZero}
              className="game-btn game-btn-primary px-8 py-4 text-sm sm:text-base cursor-pointer"
            >
              <span>🔄 Réinitialiser le score à 0 & Recommencer</span>
            </button>
          </div>
        </div>

        {/* Bilan Diagnostique par Tâche */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>📊 Bilan Diagnostique par Tâche</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Voici le diagnostic détaillé de tes compétences :
              </p>
            </div>
            {weakTasks.length > 0 && (
              <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                ⚠️ {weakTasks.length} {weakTasks.length > 1 ? 'tâches à revoir' : 'tâche à revoir'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {diagnoses.map((d) => (
              <div
                key={d.key}
                className={`p-5 rounded-2xl border-2 flex flex-col justify-between gap-3 transition-all ${
                  d.passed
                    ? 'bg-slate-900/80 border-emerald-500/40 border-l-4 border-l-emerald-400'
                    : 'bg-slate-900/90 border-amber-500/50 border-l-4 border-l-amber-400 shadow-lg shadow-amber-500/5'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-black text-white leading-tight">{d.name}</h4>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        d.passed
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {d.score} / {d.maxScore} pts
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2">{d.advice}</p>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-cyan-200">
                    💡 <b>Astuce :</b> {d.tip}
                  </div>

                  {!d.passed && (
                    <button
                      onClick={() => {
                        sounds.playTap();
                        onNavigateToTask(d.key);
                      }}
                      className="game-btn game-btn-panel w-full py-2.5 text-xs text-cyan-300 hover:text-white cursor-pointer"
                    >
                      <span>🚀 Réviser cette tâche maintenant</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===================== ÉCRAN QUESTION EN COURS =====================
  const curQ = EXAM_QUESTIONS[qIndex];
  const answeredInfo = answeredState[qIndex];
  const isAnswered = answeredInfo !== undefined;

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
      {/* Top Banner with Question Meta and Reset Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
            {curQ.taskName}
          </span>
          <span className="text-xs font-mono text-amber-400 font-bold">
            +{curQ.pts} pts
          </span>
        </div>

        <button
          onClick={resetExamToZero}
          className="game-btn game-btn-danger px-3 py-1.5 text-xs cursor-pointer"
          title="Remet le score à zéro"
        >
          <span>🔄 Reset à 0</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
        <div
          className="bg-gradient-to-r from-cyan-400 to-pink-500 h-full rounded-full transition-all duration-300 shadow-sm"
          style={{ width: `${(qIndex / EXAM_QUESTIONS.length) * 100}%` }}
        />
      </div>

      {/* Question Arcade Box */}
      <div className="p-6 sm:p-8 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 space-y-6 shadow-2xl">
        <div>
          <span className="text-[11px] font-mono text-slate-400 font-bold tracking-wider uppercase">
            Question {qIndex + 1} sur {EXAM_QUESTIONS.length}
          </span>
          <h3 className="text-base sm:text-lg font-black text-white mt-1.5 leading-snug">
            {curQ.q}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {curQ.opts.map((optText, optIdx) => {
            const isSelected = answeredInfo?.chosen === optIdx;
            const isRight = curQ.correct === optIdx;

            let style = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-cyan-400/50 hover:bg-slate-900';
            if (isAnswered) {
              if (isRight) {
                style = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-black shadow-lg shadow-emerald-500/20';
              } else if (isSelected) {
                style = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold';
              } else {
                style = 'opacity-40 border-slate-800';
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-3.5 transition-all text-xs sm:text-sm cursor-pointer select-none ${style}`}
              >
                <span className="w-7 h-7 rounded-xl bg-slate-800 font-mono font-black text-xs flex items-center justify-center shrink-0 border border-slate-700">
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="font-semibold leading-relaxed">{optText}</span>
              </button>
            );
          })}
        </div>

        {/* Answer Feedback */}
        {isAnswered && (
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-2xl border-2 text-xs sm:text-sm leading-relaxed ${
                answeredInfo.isCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-200'
              }`}
            >
              <b>{answeredInfo.isCorrect ? `🎯 Bien joué ! +${curQ.pts} points !` : '❌ Oups, mauvaise réponse !'}</b>{' '}
              {curQ.explain}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="game-btn game-btn-primary px-6 py-3 text-xs sm:text-sm cursor-pointer"
              >
                <span>{qIndex + 1 < EXAM_QUESTIONS.length ? 'Question suivante' : '📊 Voir mon Bilan Diagnostique'}</span>
                <span>➡️</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
