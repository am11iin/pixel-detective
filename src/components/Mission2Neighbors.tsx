'use client';

import React, { useState, useEffect, useRef } from 'react';
import { renderToCanvas } from '@/utils/canvas';
import { sounds } from '@/utils/sound';

interface Mission2Props {
  onSuccess: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export function Mission2Neighbors({ onSuccess, onNext, isCompleted }: Mission2Props) {
  const canvasBeforeRef = useRef<HTMLCanvasElement>(null);
  const canvasAfterRef = useRef<HTMLCanvasElement>(null);

  const [inputGrid] = useState<number[]>(() => {
    const arr = Array.from({ length: 36 }, (_, i) => (i % 6 < 3 ? 35 : 205));
    arr[7] = 205; // anomalie claire
    arr[28] = 35;  // anomalie sombre
    return arr;
  });

  const [outputGrid, setOutputGrid] = useState<(number | null)[]>(() => Array(36).fill(null));
  const [activeCell, setActiveCell] = useState<{ x: number; y: number } | null>(null);

  const getCellVal = (x: number, y: number) => {
    const cx = Math.min(5, Math.max(0, x));
    const cy = Math.min(5, Math.max(0, y));
    return inputGrid[cy * 6 + cx];
  };

  const getAvg = (x: number, y: number) => {
    const vals: number[] = [];
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        vals.push(getCellVal(x + i, y + j));
      }
    }
    const sum = vals.reduce((a, b) => a + b, 0);
    return { vals, sum, avg: Math.round(sum / 9) };
  };

  useEffect(() => {
    if (canvasBeforeRef.current) {
      renderToCanvas(canvasBeforeRef.current, inputGrid, {
        cellSize: 46,
        nums: true,
        gridLines: true,
        boxes: activeCell
          ? [
              [activeCell.x - 1, activeCell.y - 1, 3, 3, '#ec4899'],
              [activeCell.x, activeCell.y, 1, 1, '#06b6d4'],
            ]
          : [],
      });
    }

    if (canvasAfterRef.current) {
      renderToCanvas(canvasAfterRef.current, outputGrid, {
        cellSize: 46,
        nums: true,
        gridLines: true,
        boxes: activeCell ? [[activeCell.x, activeCell.y, 1, 1, '#06b6d4']] : [],
      });
    }
  }, [inputGrid, outputGrid, activeCell]);

  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasBeforeRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const clp = (v: number) => Math.min(5, Math.max(0, Math.floor(v * 6)));
    const x = clp((e.clientX - r.left) / r.width);
    const y = clp((e.clientY - r.top) / r.height);

    const { avg } = getAvg(x, y);
    sounds.playPixelBlip(avg);

    setActiveCell({ x, y });

    const nextOut = [...outputGrid];
    nextOut[y * 6 + x] = avg;
    setOutputGrid(nextOut);

    const doneCount = nextOut.filter((v) => v !== null).length;
    if (doneCount >= 4 && !isCompleted) {
      sounds.playSuccess();
      onSuccess();
    }
  };

  const computeAll = () => {
    sounds.playLevelUp();
    const nextOut: number[] = [];
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        nextOut.push(getAvg(x, y).avg);
      }
    }
    setOutputGrid(nextOut);
    if (!isCompleted) onSuccess();
  };

  const resetGrid = () => {
    sounds.playTap();
    setOutputGrid(Array(36).fill(null));
    setActiveCell(null);
  };

  const doneCount = outputGrid.filter((v) => v !== null).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Niveau 2 • Le Voisinage 3×3
          </span>
          <span className="text-xs font-mono text-amber-400 font-bold">+30 XP</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">Le pixel et ses 8 voisins (Le Flou)</h2>
        <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-2xl">
          Un filtre ne calcule jamais un pixel dans son coin : il regarde ses <b>8 voisins directs</b>.
          Clique sur un pixel à gauche pour le remplacer par la <b>moyenne</b> des 9 cases !
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Grid */}
        <div className="p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 flex flex-col items-center shadow-2xl">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>🖼️ Grille Avant (Clique une case)</span>
            </h3>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
              6 × 6 Pixels
            </span>
          </div>
          <div className="crt-screen rounded-2xl p-2 bg-slate-950 border border-slate-800 shadow-inner">
            <canvas
              ref={canvasBeforeRef}
              onPointerDown={handlePointer}
              className="rounded-xl border border-slate-700 cursor-pointer shadow-xl max-w-full touch-none"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-mono">
            👆 Clique sur n’importe quelle case pour la flouter
          </p>
        </div>

        {/* Output Grid */}
        <div className="p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 flex flex-col items-center shadow-2xl">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>✨ Grille Après (Moyenne Calculée)</span>
            </h3>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Sortie Floutée
            </span>
          </div>
          <div className="crt-screen rounded-2xl p-2 bg-slate-950 border border-slate-800 shadow-inner">
            <canvas
              ref={canvasAfterRef}
              className="rounded-xl border border-cyan-500/40 shadow-xl max-w-full"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-3 font-mono">
            {activeCell ? `Case (${activeCell.x}, ${activeCell.y}) calculée avec succès !` : 'En attente de ton premier clic...'}
          </p>
        </div>
      </div>

      {/* Control Box */}
      <div className="p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs sm:text-sm font-mono text-cyan-300 bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex-1">
            {activeCell ? (
              (() => {
                const { sum, avg } = getAvg(activeCell.x, activeCell.y);
                const oldV = getCellVal(activeCell.x, activeCell.y);
                return `Pixel (${activeCell.x}, ${activeCell.y}) : Somme des 9 cases = ${sum} ➔ Moyenne = ${sum} ÷ 9 = ${avg} (valeur initiale : ${oldV})`;
              })()
            ) : (
              'Clique sur une case de gauche pour voir la moyenne arithmétique des 9 pixels.'
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={computeAll}
              className="game-btn game-btn-panel px-4 py-2 text-xs cursor-pointer"
            >
              <span>⚡ Tout calculer</span>
            </button>
            <button
              onClick={resetGrid}
              className="game-btn game-btn-danger px-3 py-2 text-xs cursor-pointer"
            >
              <span>🔄 Effacer</span>
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
          <b>📸 Pourquoi ça floute ?</b> Si un pixel était très lumineux (ex: 205) au milieu de pixels sombres (35), faire la moyenne lisse la cassure. Les contrastes brutaux s’effacent !
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
            <span>✅ Mission 2 réussie ! Tu maîtrises le principe du flou par moyenne locale.</span>
          ) : (
            <span>🎯 Objectif : Calcule au moins 4 pixels différents ({Math.min(doneCount, 4)} / 4)</span>
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
          <span>Niveau 3 : Les Coeffs</span>
          <span>➡️</span>
        </button>
      </div>
    </div>
  );
}
