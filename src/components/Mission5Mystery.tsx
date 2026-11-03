'use client';

import React, { useState, useEffect, useRef } from 'react';
import { generateFaceImage, applyConvolution, renderToCanvas } from '@/utils/canvas';
import { FILTER_PRESETS } from '@/data/filters';
import { sounds } from '@/utils/sound';

interface Mission5Props {
  onSuccess: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

const POOL = ['flou', 'nettete', 'contours', 'emboss'] as const;

export function Mission5Mystery({ onSuccess, onNext, isCompleted }: Mission5Props) {
  const canvasBeforeRef = useRef<HTMLCanvasElement>(null);
  const canvasAfterRef = useRef<HTMLCanvasElement>(null);

  const [imgData] = useState<number[]>(() => generateFaceImage());
  const [mysteryKey, setMysteryKey] = useState<string>('contours');
  const [answered, setAnswered] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [rounds, setRounds] = useState<number>(0);

  const startNewRound = () => {
    sounds.playTap();
    let nextK: string;
    do {
      nextK = POOL[Math.floor(Math.random() * POOL.length)];
    } while (nextK === mysteryKey && POOL.length > 1);

    setMysteryKey(nextK);
    setAnswered(false);
    setSelectedKey(null);
  };

  useEffect(() => {
    if (canvasBeforeRef.current) {
      renderToCanvas(canvasBeforeRef.current, imgData, { cellSize: 20 });
    }

    if (canvasAfterRef.current) {
      const p = FILTER_PRESETS[mysteryKey];
      const res = applyConvolution(imgData, p.k, p.d);
      renderToCanvas(canvasAfterRef.current, res, { cellSize: 20 });
    }
  }, [imgData, mysteryKey]);

  const handleGuess = (guessKey: string) => {
    if (answered) return;
    setAnswered(true);
    setSelectedKey(guessKey);
    setRounds((prev) => prev + 1);

    const isCorrect = guessKey === mysteryKey;
    if (isCorrect) {
      sounds.playSuccess();
      const nextScore = score + 1;
      setScore(nextScore);
      if (nextScore >= 2 && !isCompleted) {
        onSuccess();
      }
    } else {
      sounds.playWrong();
    }
  };

  const curPreset = FILTER_PRESETS[mysteryKey];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Niveau 5 • Enquête Détective
          </span>
          <span className="text-xs font-mono text-amber-400 font-bold">+60 XP</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">Le Filtre Mystère 🕵️</h2>
        <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-2xl">
          Un hacker a altéré l’image de droite ! En observant les changements par rapport au fichier original, retrouve quel filtre a été appliqué.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 flex flex-col items-center shadow-2xl">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-white">Image Originale (Témoin)</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">Non modifiée</span>
          </div>
          <div className="crt-screen rounded-2xl p-2 bg-slate-950 border border-slate-800 shadow-inner">
            <canvas ref={canvasBeforeRef} className="rounded-xl border border-slate-700 shadow-xl max-w-full" />
          </div>
        </div>

        <div className="p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 flex flex-col items-center shadow-2xl">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-white">Image Mystère (Altérée)</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold">À identifier</span>
          </div>
          <div className="crt-screen rounded-2xl p-2 bg-slate-950 border border-pink-500/40 shadow-inner">
            <canvas ref={canvasAfterRef} className="rounded-xl border border-pink-500/50 shadow-xl max-w-full" />
          </div>
        </div>
      </div>

      {/* Detective Options */}
      <div className="p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 space-y-4 shadow-2xl">
        <h3 className="text-sm font-black text-white">Quel filtre a produit cette altération ?</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {POOL.map((k) => {
            const p = FILTER_PRESETS[k];
            const isChosen = selectedKey === k;
            const isCorrect = k === mysteryKey;

            let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-900';
            if (answered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-black shadow-lg shadow-emerald-500/20';
              } else if (isChosen) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
              } else {
                btnStyle = 'opacity-40 border-slate-800';
              }
            }

            return (
              <button
                key={k}
                onClick={() => handleGuess(k)}
                disabled={answered}
                className={`p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${btnStyle}`}
              >
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <div className="text-sm font-bold text-white">{p.name}</div>
                  <div className="text-xs text-slate-400">{p.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="space-y-3 pt-2">
            <div
              className={`p-4 rounded-2xl border-2 text-xs sm:text-sm leading-relaxed ${
                selectedKey === mysteryKey
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-500/10 border-amber-500/40 text-amber-200'
              }`}
            >
              <b>{selectedKey === mysteryKey ? '🎉 Bien vu Détective !' : '❌ Pas tout à fait.'}</b> C’était bien{' '}
              <b>{curPreset.name}</b> : {curPreset.desc}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono font-bold">
                Énigmes trouvées : <b className="text-cyan-400">{score}</b> sur {rounds}
              </span>
              <button
                onClick={startNewRound}
                className="game-btn game-btn-panel px-4 py-2 text-xs text-cyan-300 cursor-pointer"
              >
                <span>Nouveau mystère ➡️</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tactile Progress & Next Quest */}
      <div className={`p-5 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all ${
        isCompleted
          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
          : 'bg-slate-900/80 border-slate-800 text-slate-300'
      }`}>
        <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
          {isCompleted ? (
            <span>✅ Mission 5 réussie ! Tu as l’œil affûté d’un détective de pixels.</span>
          ) : (
            <span>🎯 Objectif : Trouve 2 filtres mystères ({Math.min(score, 2)} / 2)</span>
          )}
        </div>

        <button
          onClick={() => {
            sounds.playLevelUp();
            onNext();
          }}
          disabled={!isCompleted}
          className={`game-btn px-6 py-3 text-xs sm:text-sm cursor-pointer ${
            isCompleted
              ? 'game-btn-primary'
              : 'bg-slate-800 text-slate-600 border-b-2 border-slate-900 cursor-not-allowed opacity-50'
          }`}
        >
          <span>🏆 BOSS FINAL : L’Examen</span>
          <span>➡️</span>
        </button>
      </div>
    </div>
  );
}
