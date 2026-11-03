'use client';

import React, { useState, useEffect, useRef } from 'react';
import { generateFaceImage, renderToCanvas, GRID_N } from '@/utils/canvas';
import { sounds } from '@/utils/sound';

interface Mission1Props {
  onSuccess: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export function Mission1Pixels({ onSuccess, onNext, isCompleted }: Mission1Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSmRef = useRef<HTMLCanvasElement>(null);
  const [showNumbers, setShowNumbers] = useState(true);
  const [selectedPixel, setSelectedPixel] = useState<{ x: number; y: number; val: number } | null>(null);
  const [explored, setExplored] = useState<Set<string>>(new Set());
  const [imgData] = useState<number[]>(() => generateFaceImage());

  useEffect(() => {
    if (!canvasRef.current) return;
    renderToCanvas(canvasRef.current, imgData, {
      cellSize: 22,
      nums: showNumbers,
      gridLines: true,
      boxes: selectedPixel ? [[selectedPixel.x, selectedPixel.y, 1, 1, '#06b6d4']] : [],
    });

    if (canvasSmRef.current) {
      renderToCanvas(canvasSmRef.current, imgData, { cellSize: 4 });
    }
  }, [imgData, showNumbers, selectedPixel]);

  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const clp = (v: number) => Math.min(GRID_N - 1, Math.max(0, Math.floor(v * GRID_N)));
    const x = clp((e.clientX - r.left) / r.width);
    const y = clp((e.clientY - r.top) / r.height);
    const val = imgData[y * GRID_N + x];

    // Sound feedback based on brightness!
    sounds.playPixelBlip(val);

    setSelectedPixel({ x, y, val });
    const nextExplored = new Set(explored);
    nextExplored.add(`${x},${y}`);
    setExplored(nextExplored);

    if (nextExplored.size >= 6 && !isCompleted) {
      sounds.playSuccess();
      onSuccess();
    }
  };

  const getDesc = (v: number) => {
    if (v < 55) return 'Noir profond (lumière éteinte = 0)';
    if (v < 115) return 'Gris sombre (ombrage)';
    if (v < 185) return 'Gris moyen / clair (demi-teinte)';
    return 'Blanc éclatant (lumière max = 255)';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Level Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Niveau 1 • Découverte Pixel Art
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">+20 XP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">Le Monde Secret des Pixels</h2>
          <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-2xl">
            Touche les carrés de l’image : écoute le son changer selon la luminosité !
            Chaque case porte un nombre de <b>0</b> (éteint) à <b>255</b> (allumé à fond).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arcade Canvas Terminal */}
        <div className="p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 flex flex-col items-center relative overflow-hidden shadow-2xl">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>🖥️ Écran Pixel 16 × 16</span>
            </h3>
            <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer bg-slate-800 px-3 py-1 rounded-xl border border-slate-700 select-none">
              <input
                type="checkbox"
                checked={showNumbers}
                onChange={(e) => {
                  sounds.playTap();
                  setShowNumbers(e.target.checked);
                }}
                className="accent-cyan-400 rounded cursor-pointer"
              />
              <span>Valeurs numériques</span>
            </label>
          </div>

          <div className="crt-screen rounded-2xl p-2 bg-slate-950 border border-slate-800 shadow-inner">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointer}
              onPointerMove={(e) => {
                if (e.buttons > 0) handlePointer(e);
              }}
              className="rounded-xl border border-slate-700 cursor-crosshair shadow-2xl max-w-full touch-none"
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-3 font-mono">
            👆 Touche ou glisse ton doigt pour scanner les valeurs
          </p>
        </div>

        {/* Gamified Cyber Scanner Box */}
        <div className="p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 flex flex-col justify-between space-y-4 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>🔬 Scanner Détective</span>
              </h3>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">SONDE ACTIVE</span>
            </div>

            {selectedPixel ? (
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Position : X={selectedPixel.x}, Y={selectedPixel.y}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">Intensité :</span>
                    <span className="text-xl font-black text-cyan-400 font-mono">
                      {selectedPixel.val} <span className="text-xs text-slate-500">/ 255</span>
                    </span>
                  </div>
                </div>

                {/* Color Swatch */}
                <div className="relative">
                  <div
                    className="h-12 rounded-xl border-2 border-slate-700 shadow-inner transition-colors duration-100 flex items-center justify-center font-mono text-xs font-black"
                    style={{
                      backgroundColor: `rgb(${selectedPixel.val},${selectedPixel.val},${selectedPixel.val})`,
                      color: selectedPixel.val > 128 ? '#000000' : '#ffffff',
                    }}
                  >
                    RGB({selectedPixel.val}, {selectedPixel.val}, {selectedPixel.val})
                  </div>
                </div>

                {/* Brightness bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-slate-700 via-cyan-400 to-white h-full transition-all duration-150"
                      style={{ width: `${(selectedPixel.val / 255) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0 (Noir)</span>
                    <span>128 (Gris)</span>
                    <span>255 (Blanc)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200">
                  Diagnostic : <b>{getDesc(selectedPixel.val)}</b>.
                </p>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-slate-500 text-xs sm:text-sm">
                👆 Touche n’importe quelle case sur la grille de gauche pour sonder son intensité.
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed">
              💡 <b>L’astuce du Détective :</b> Une photo sur TikTok contient plus de <b>12 millions de pixels</b> identiques à ceux-ci, arrangés en grille !
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
            <canvas ref={canvasSmRef} className="rounded-lg border border-slate-700 max-w-[64px]" />
            <div className="text-xs text-slate-400">
              <span className="font-bold text-white block">Taille réelle (16 × 16 px)</span>
              <span>Sans le zoom loupe, les pixels forment une image continue !</span>
            </div>
          </div>
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
            <span>✅ Mission 1 réussie ! Tu maîtrises les valeurs de pixels (0 à 255).</span>
          ) : (
            <span>🎯 Objectif : Explore 6 pixels différents ({Math.min(explored.size, 6)} / 6)</span>
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
          <span>Niveau 2 : Les Voisins</span>
          <span>➡️</span>
        </button>
      </div>
    </div>
  );
}
