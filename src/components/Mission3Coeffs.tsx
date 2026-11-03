'use client';

import React, { useState, useEffect, useRef } from 'react';
import { generateFaceImage, renderToCanvas, getPixel, clamp, GRID_N } from '@/utils/canvas';
import { sounds } from '@/utils/sound';

interface Mission3Props {
  onSuccess: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

const PRESETS = {
  flou: {
    name: 'Flou uniforme (÷9)',
    k: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    d: 9,
    tip: 'Tous les voisins ont le même poids (coef 1). Comme une moyenne classique !',
  },
  centre: {
    name: 'Gaussien : Centre renforcé (÷16)',
    k: [1, 2, 1, 2, 4, 2, 1, 2, 1],
    d: 16,
    tip: 'Le centre compte 4 fois, les voisins directs 2 fois, les coins 1 fois. Somme = 16, donc on divise par 16.',
  },
};

export function Mission3Coeffs({ onSuccess, onNext, isCompleted }: Mission3Props) {
  const canvasBeforeRef = useRef<HTMLCanvasElement>(null);
  const canvasAfterRef = useRef<HTMLCanvasElement>(null);

  const [imgData] = useState<number[]>(() => generateFaceImage());
  const [activeKernelKey, setActiveKernelKey] = useState<'flou' | 'centre'>('flou');
  const [pixelIdx, setPixelIdx] = useState<number>(0);
  const [outData, setOutData] = useState<(number | null)[]>(() => Array(GRID_N * GRID_N).fill(null));
  const [completedPixels, setCompletedPixels] = useState<Set<number>>(new Set());
  const [predictionMode, setPredictionMode] = useState<boolean>(false);
  const [predResult, setPredResult] = useState<string | null>(null);

  const curKernel = PRESETS[activeKernelKey];

  const calcCurrentOutput = (pIdx: number) => {
    const x = pIdx % GRID_N;
    const y = Math.floor(pIdx / GRID_N);
    let sum = 0;
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        sum += getPixel(imgData, x + i - 1, y + j - 1) * curKernel.k[j * 3 + i];
      }
    }
    return clamp(sum / curKernel.d);
  };

  useEffect(() => {
    const x = pixelIdx % GRID_N;
    const y = Math.floor(pixelIdx / GRID_N);

    if (canvasBeforeRef.current) {
      renderToCanvas(canvasBeforeRef.current, imgData, {
        cellSize: 20,
        nums: true,
        boxes: [[x - 1, y - 1, 3, 3, '#ec4899']],
      });
    }

    if (canvasAfterRef.current) {
      renderToCanvas(canvasAfterRef.current, outData, {
        cellSize: 20,
        boxes: [[x, y, 1, 1, '#06b6d4']],
      });
    }
  }, [imgData, outData, pixelIdx]);

  const commitPixel = () => {
    const val = calcCurrentOutput(pixelIdx);
    sounds.playPixelBlip(val);

    const nextOut = [...outData];
    nextOut[pixelIdx] = val;
    setOutData(nextOut);

    const nextDone = new Set(completedPixels);
    nextDone.add(pixelIdx);
    setCompletedPixels(nextDone);

    if (nextDone.size >= 3 && !isCompleted) {
      sounds.playSuccess();
      onSuccess();
    }
  };

  const handleNextPixel = () => {
    sounds.playTap();
    setPredResult(null);
    commitPixel();
    const nextIdx = (pixelIdx + 1) % (GRID_N * GRID_N);
    setPixelIdx(nextIdx);
  };

  const handlePredict = (choice: 'clair' | 'sombre' | 'pareil') => {
    const oldV = getPixel(imgData, pixelIdx % GRID_N, Math.floor(pixelIdx / GRID_N));
    const newV = calcCurrentOutput(pixelIdx);
    const diff = newV - oldV;
    const actual = diff > 8 ? 'clair' : diff < -8 ? 'sombre' : 'pareil';

    const ok = choice === actual;
    if (ok) {
      sounds.playSuccess();
      setPredResult(`🎯 Bien vu ! Le pixel passe de ${oldV} à ${newV} (${choice}).`);
    } else {
      sounds.playWrong();
      setPredResult(`🧐 Pas tout à fait : le pixel passe de ${oldV} à ${newV} (${actual}).`);
    }
    commitPixel();
  };

  const x = pixelIdx % GRID_N;
  const y = Math.floor(pixelIdx / GRID_N);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Niveau 3 • Les Coefficients
          </span>
          <span className="text-xs font-mono text-amber-400 font-bold">+40 XP</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">La moyenne avec coefficients</h2>
        <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-2xl">
          Comme un <b>bulletin de notes au lycée</b> : on multiplie chaque case par son poids, on additionne, puis on <b>divise par le total des coefficients</b> pour ne pas dépasser la note maximale de 255 !
        </p>
      </div>

      {/* Kernel selector */}
      <div className="flex gap-2">
        {(['flou', 'centre'] as const).map((k) => (
          <button
            key={k}
            onClick={() => {
              sounds.playTap();
              setActiveKernelKey(k);
              setOutData(Array(GRID_N * GRID_N).fill(null));
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
              activeKernelKey === k
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20 font-black'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {PRESETS[k].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 flex flex-col items-center shadow-2xl">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-white">Zone 3×3 encadrée</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold">Original</span>
          </div>
          <div className="crt-screen rounded-2xl p-2 bg-slate-950 border border-slate-800 shadow-inner">
            <canvas ref={canvasBeforeRef} className="rounded-xl border border-slate-700 shadow-xl max-w-full" />
          </div>
        </div>

        <div className="p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 flex flex-col items-center shadow-2xl">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-white">Image en construction</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">Pondéré</span>
          </div>
          <div className="crt-screen rounded-2xl p-2 bg-slate-950 border border-slate-800 shadow-inner">
            <canvas ref={canvasAfterRef} className="rounded-xl border border-cyan-500/40 shadow-xl max-w-full" />
          </div>
        </div>
      </div>

      {/* Formula & Prediction Box */}
      <div className="p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={handleNextPixel}
              className="game-btn game-btn-primary px-5 py-2.5 text-xs cursor-pointer"
            >
              <span>▶️ Calculer le pixel suivant</span>
            </button>
            <button
              onClick={() => {
                sounds.playTap();
                setOutData(Array(GRID_N * GRID_N).fill(null));
                setPixelIdx(0);
              }}
              className="game-btn game-btn-panel px-3 py-2 text-xs cursor-pointer"
            >
              <span>🔄 Reset</span>
            </button>
          </div>

          <label className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 cursor-pointer bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 select-none">
            <input
              type="checkbox"
              checked={predictionMode}
              onChange={(e) => {
                sounds.playTap();
                setPredictionMode(e.target.checked);
              }}
              className="accent-pink-500 rounded cursor-pointer"
            />
            <span>🔮 Mini-Jeu : Mode Prédiction</span>
          </label>
        </div>

        {predictionMode ? (
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-3">
            <p className="text-xs sm:text-sm font-bold text-purple-200">
              Devine l’effet sur le pixel ({x}, {y}) [valeur actuelle = {getPixel(imgData, x, y)}] :
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handlePredict('clair')}
                className="game-btn game-btn-panel px-4 py-2 text-xs text-amber-300 cursor-pointer"
              >
                ☀️ Plus clair
              </button>
              <button
                onClick={() => handlePredict('sombre')}
                className="game-btn game-btn-panel px-4 py-2 text-xs text-purple-300 cursor-pointer"
              >
                🌑 Plus sombre
              </button>
              <button
                onClick={() => handlePredict('pareil')}
                className="game-btn game-btn-panel px-4 py-2 text-xs text-cyan-300 cursor-pointer"
              >
                ⚖️ Presque pareil
              </button>
            </div>
            {predResult && (
              <p className="text-xs font-mono font-bold text-cyan-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800 animate-fadeIn">
                {predResult}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 max-w-[280px]">
              {Array.from({ length: 9 }).map((_, m) => {
                const i = m % 3;
                const j = Math.floor(m / 3);
                const v = getPixel(imgData, x + i - 1, y + j - 1);
                const w = curKernel.k[m];
                return (
                  <div
                    key={m}
                    className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center font-mono shadow-inner"
                  >
                    <div className="text-xs text-white font-black">{v}</div>
                    <div className="text-[10px] text-cyan-400 font-bold">×{w} = {v * w}</div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs sm:text-sm font-mono text-cyan-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800 inline-block">
              Somme des produits ÷ {curKernel.d} = <b>{calcCurrentOutput(pixelIdx)}</b>
            </p>
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed">
          <b>💡 {curKernel.name} :</b> {curKernel.tip}
        </div>
      </div>

      {/* Tactile Progress & Next Quest */}
      <div className={`p-5 rounded-2xl border-2 flex items-center justify-between gap-4 transition-all ${
        isCompleted
          ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
          : 'bg-slate-900/80 border-slate-800 text-slate-300'
      }`}>
        <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
          {isCompleted ? (
            <span>✅ Mission 3 réussie ! Tu maîtrises les coefficients pondérés.</span>
          ) : (
            <span>🎯 Objectif : Calcule 3 pixels avec coefficients ({Math.min(completedPixels.size, 3)} / 3)</span>
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
          <span>Niveau 4 : Studio FX</span>
          <span>➡️</span>
        </button>
      </div>
    </div>
  );
}
