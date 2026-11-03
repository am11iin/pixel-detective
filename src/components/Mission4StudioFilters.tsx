'use client';

import React, { useState, useEffect, useRef } from 'react';
import { generateFaceImage, generateGeoImage, applyConvolution, renderToCanvas, getPixel, clamp, GRID_N } from '@/utils/canvas';
import { FILTER_PRESETS } from '@/data/filters';
import { sounds } from '@/utils/sound';

interface Mission4Props {
  onSuccess: () => void;
  onNext: () => void;
  isCompleted: boolean;
}

export function Mission4StudioFilters({ onSuccess, onNext, isCompleted }: Mission4Props) {
  const canvasBeforeRef = useRef<HTMLCanvasElement>(null);
  const canvasAfterRef = useRef<HTMLCanvasElement>(null);

  const [activeImageKey, setActiveImageKey] = useState<'face' | 'geo'>('face');
  const [faceImg] = useState<number[]>(() => generateFaceImage());
  const [geoImg] = useState<number[]>(() => generateGeoImage());
  const curImg = activeImageKey === 'face' ? faceImg : geoImg;

  const [activePresetKey, setActivePresetKey] = useState<string>('flou');
  const [customKernel, setCustomKernel] = useState<number[]>([...FILTER_PRESETS.flou.k]);
  const [customDivisor, setCustomDivisor] = useState<number>(FILTER_PRESETS.flou.d);
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number; y: number } | null>(null);
  const [testedPresets, setTestedPresets] = useState<Set<string>>(new Set(['flou']));

  const curPreset = FILTER_PRESETS[activePresetKey] || FILTER_PRESETS.custom;

  // Recalculate filtered output
  const filteredData = React.useMemo(() => {
    return applyConvolution(curImg, customKernel, customDivisor);
  }, [curImg, customKernel, customDivisor]);

  useEffect(() => {
    if (canvasBeforeRef.current) {
      renderToCanvas(canvasBeforeRef.current, curImg, {
        cellSize: 20,
        boxes: hoveredPixel ? [[hoveredPixel.x - 1, hoveredPixel.y - 1, 3, 3, '#ec4899']] : [],
      });
    }

    if (canvasAfterRef.current) {
      renderToCanvas(canvasAfterRef.current, filteredData, {
        cellSize: 20,
        boxes: hoveredPixel ? [[hoveredPixel.x, hoveredPixel.y, 1, 1, '#06b6d4']] : [],
      });
    }
  }, [curImg, filteredData, hoveredPixel]);

  const selectPreset = (key: string) => {
    sounds.playTap();
    setActivePresetKey(key);
    const p = FILTER_PRESETS[key];
    setCustomKernel([...p.k]);
    setCustomDivisor(p.d);

    const nextTested = new Set(testedPresets);
    nextTested.add(key);
    setTestedPresets(nextTested);

    if (nextTested.size >= 3 && !isCompleted) {
      sounds.playSuccess();
      onSuccess();
    }
  };

  const handleCellDelta = (idx: number, delta: number) => {
    sounds.playTap();
    const nextK = [...customKernel];
    nextK[idx] += delta;
    setCustomKernel(nextK);
    setActivePresetKey('custom');

    const nextTested = new Set(testedPresets);
    nextTested.add('custom');
    setTestedPresets(nextTested);

    if (nextTested.size >= 3 && !isCompleted) {
      sounds.playSuccess();
      onSuccess();
    }
  };

  const handleAutoNormalize = () => {
    sounds.playSuccess();
    const sum = customKernel.reduce((a, b) => a + b, 0);
    setCustomDivisor(sum > 0 ? sum : 1);
  };

  const handlePointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasBeforeRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const clp = (v: number) => Math.min(GRID_N - 1, Math.max(0, Math.floor(v * GRID_N)));
    const x = clp((e.clientX - r.left) / r.width);
    const y = clp((e.clientY - r.top) / r.height);
    setHoveredPixel({ x, y });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Niveau 4 • Studio Créateur FX (Ex-Labo)
            </span>
            <span className="text-xs font-mono text-amber-400 font-bold">+50 XP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
            Studio Filtres : Deviens Créateur FX 🎨
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-1 max-w-2xl">
            C’est ici que naissent les filtres de tes applications préférées !
            Active les <b>presets cultes</b> (Mode Portrait, Gaming 4K, Cyberpunk Néon, Relief 3D) ou <b>invente ton propre filtre personnalisé</b> dans la matrice 3×3 !
          </p>
        </div>
      </div>

      {/* Preset Selector Pads (DJ / Arcade Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { key: 'flou', label: 'Mode Portrait', emoji: '🤳', sub: 'Flou doux', glow: 'border-cyan-500/50 from-cyan-500/20 to-slate-900 shadow-cyan-500/20' },
          { key: 'nettete', label: 'Gaming 4K', emoji: '🎮', sub: 'Netteté boost', glow: 'border-purple-500/50 from-purple-500/20 to-slate-900 shadow-purple-500/20' },
          { key: 'contours', label: 'Cyberpunk', emoji: '⚡', sub: 'Contours néon', glow: 'border-pink-500/50 from-pink-500/20 to-slate-900 shadow-pink-500/20' },
          { key: 'emboss', label: 'Relief 3D', emoji: '🗿', sub: 'Gravure 3D', glow: 'border-amber-500/50 from-amber-500/20 to-slate-900 shadow-amber-500/20' },
          { key: 'custom', label: 'Custom Lab', emoji: '🎛️', sub: 'Ta matrice', glow: 'border-emerald-500/50 from-emerald-500/20 to-slate-900 shadow-emerald-500/20' },
        ].map((item) => {
          const isActive = activePresetKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => selectPreset(item.key)}
              className={`p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer select-none group relative overflow-hidden ${
                isActive
                  ? `bg-gradient-to-b ${item.glow} border-current text-white shadow-xl scale-105 font-bold`
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80 hover:border-slate-700'
              }`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{item.emoji}</span>
              <span className="text-xs font-black tracking-tight leading-tight">{item.label}</span>
              <span className="text-[10px] text-slate-400 font-mono">{item.sub}</span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-1 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Studio Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Visual Screens (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>📺 Moniteur Double Affichage</span>
            </h3>
            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  sounds.playTap();
                  setActiveImageKey('face');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeImageKey === 'face'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👤 Visage
              </button>
              <button
                onClick={() => {
                  sounds.playTap();
                  setActiveImageKey('geo');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeImageKey === 'geo'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔷 Formes
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="text-center">
              <div className="crt-screen rounded-2xl p-1.5 bg-slate-950 border border-slate-800 shadow-inner">
                <canvas
                  ref={canvasBeforeRef}
                  onPointerMove={handlePointer}
                  onPointerDown={handlePointer}
                  className="rounded-xl border border-slate-700 cursor-crosshair shadow-xl max-w-[145px] sm:max-w-[170px] touch-none"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">Original (Image Brute)</p>
            </div>

            <div className="text-xl text-slate-600 font-bold">⚡</div>

            <div className="text-center">
              <div className="crt-screen rounded-2xl p-1.5 bg-slate-950 border border-cyan-500/40 shadow-inner">
                <canvas
                  ref={canvasAfterRef}
                  className="rounded-xl border border-cyan-500/50 shadow-xl shadow-cyan-500/20 max-w-[145px] sm:max-w-[170px]"
                />
              </div>
              <p className="text-[10px] text-cyan-400 mt-2 font-mono font-bold">{curPreset.name}</p>
            </div>
          </div>

          {/* Live Hover Math Inspector */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
            {hoveredPixel ? (
              (() => {
                const oldV = getPixel(curImg, hoveredPixel.x, hoveredPixel.y);
                let sum = 0;
                for (let j = 0; j < 3; j++) {
                  for (let i = 0; i < 3; i++) {
                    sum += getPixel(curImg, hoveredPixel.x + i - 1, hoveredPixel.y + j - 1) * customKernel[j * 3 + i];
                  }
                }
                const newV = clamp(sum / (customDivisor || 1));
                return (
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>
                      Pixel ({hoveredPixel.x}, {hoveredPixel.y}) : Original = <b>{oldV}</b>
                    </span>
                    <span className="text-cyan-400 font-bold">
                      Produit = <b>{sum}</b> ÷ {customDivisor} ➔ Sortie = <b>{newV}</b>
                    </span>
                  </div>
                );
              })()
            ) : (
              <span className="text-slate-500">
                👆 Touche ou survole l’image de gauche pour voir la loupe 3×3 calculer le pixel en direct !
              </span>
            )}
          </div>
        </div>

        {/* Right: Matrix FX Console (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/80 flex flex-col justify-between space-y-4 shadow-2xl">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-black text-white">{curPreset.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{curPreset.desc}</p>
            </div>

            {/* Matrix 3x3 Tactile Pad */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span>🎛️ Matrice du Filtre (3 × 3)</span>
                </span>
                <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {customDivisor > 1 ? `÷ ${customDivisor}` : '÷ 1'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto">
                {customKernel.map((val, idx) => (
                  <div
                    key={idx}
                    className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center shadow-inner"
                  >
                    <span className="text-sm font-black font-mono text-cyan-300">
                      {val > 0 ? `+${val}` : val}
                    </span>
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={() => handleCellDelta(idx, 1)}
                        className="w-5 h-5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-black text-xs flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                        title="Augmenter de 1"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleCellDelta(idx, -1)}
                        className="w-5 h-5 rounded-lg bg-slate-800 hover:bg-pink-500 hover:text-white text-slate-300 font-black text-xs flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                        title="Diminuer de 1"
                      >
                        −
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={handleAutoNormalize}
                  className="game-btn game-btn-panel px-3 py-1.5 text-xs text-cyan-300 cursor-pointer"
                  title="Ajuste la division par la somme des poids pour éviter que l'image brûle au blanc"
                >
                  <span>⚖️ Normaliser auto</span>
                </button>
                <button
                  onClick={() => selectPreset(activePresetKey === 'custom' ? 'flou' : activePresetKey)}
                  className="game-btn game-btn-panel px-3 py-1.5 text-xs text-slate-400 cursor-pointer"
                >
                  <span>🔄 Reset</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
              💡 <b>L’astuce du créateur FX :</b> {curPreset.tip}
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
            <span>✅ Mission 4 réussie ! Tu as exploré les filtres dans le Studio FX.</span>
          ) : (
            <span>🎯 Objectif : Teste au moins 3 filtres ({Math.min(testedPresets.size, 3)} / 3)</span>
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
          <span>Niveau 5 : Le Filtre Mystère</span>
          <span>➡️</span>
        </button>
      </div>
    </div>
  );
}
