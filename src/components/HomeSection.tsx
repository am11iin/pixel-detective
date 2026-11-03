'use client';

import React, { useEffect, useRef } from 'react';
import { MissionKey } from '@/types';
import { generateFaceImage, applyConvolution, renderToCanvas, GRID_N } from '@/utils/canvas';
import { FILTER_PRESETS } from '@/data/filters';
import { sounds } from '@/utils/sound';

interface HomeSectionProps {
  onStart: (view: MissionKey) => void;
  finishedMissions: Set<MissionKey>;
  totalXp: number;
}

export function HomeSection({ onStart, finishedMissions, totalXp }: HomeSectionProps) {
  const canvasBeforeRef = useRef<HTMLCanvasElement>(null);
  const canvasAfterRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const img = generateFaceImage();
    const presets = ['flou', 'nettete', 'contours', 'emboss'];
    const texts = [
      '🤳 Mode Portrait : la loupe 3×3 moyenne les 9 cases pour adoucir le visage !',
      '🎮 Gaming 4K : centre boosté (+5) − voisins (−1) = arêtes ultra nettes !',
      '⚡ Vision Cyberpunk : zones plates à 0 (noir) et bords allumés en néon !',
      '🗿 Relief 3D : fausse ombre portée en opposant ombres (−) et lumières (+) !',
    ];

    let fxIdx = 0;
    let pixelPos = 0;
    let timer: NodeJS.Timeout;

    const runLoop = () => {
      const curPresetKey = presets[fxIdx];
      const p = FILTER_PRESETS[curPresetKey];
      const fullRes = applyConvolution(img, p.k, p.d);

      if (labelRef.current) {
        labelRef.current.textContent = texts[fxIdx];
      }

      timer = setInterval(() => {
        pixelPos += 4;
        const finished = pixelPos >= GRID_N * GRID_N;
        const x = Math.min(pixelPos, GRID_N * GRID_N - 1) % GRID_N;
        const y = Math.floor(Math.min(pixelPos, GRID_N * GRID_N - 1) / GRID_N);

        if (canvasBeforeRef.current) {
          renderToCanvas(canvasBeforeRef.current, img, {
            cellSize: 10,
            boxes: finished ? [] : [[x - 1, y - 1, 3, 3, '#ec4899']],
          });
        }

        if (canvasAfterRef.current) {
          const partial = fullRes.map((v, i) => (i < pixelPos ? v : null));
          renderToCanvas(canvasAfterRef.current, partial, {
            cellSize: 10,
            boxes: finished ? [] : [[x, y, 1, 1, '#06b6d4']],
          });
        }

        if (pixelPos > GRID_N * GRID_N + 25) {
          clearInterval(timer);
          pixelPos = 0;
          fxIdx = (fxIdx + 1) % presets.length;
          setTimeout(runLoop, 400);
        }
      }, 45);
    };

    runLoop();
    return () => clearInterval(timer);
  }, []);

  const QUEST_LEVELS: Array<{
    key: MissionKey;
    num: string;
    title: string;
    icon: string;
    badge: string;
    desc: string;
    xp: number;
  }> = [
    { key: 'm1', num: '01', title: 'Le Monde des Pixels', icon: '🔍', badge: 'Bases', desc: 'Sonde chaque case de 0 à 255 comme un hacker.', xp: 20 },
    { key: 'm2', num: '02', title: 'Les Voisins & le Flou', icon: '👥', badge: 'Moyenne 3×3', desc: 'Comprends comment le lissage des 8 voisins crée le flou.', xp: 30 },
    { key: 'm3', num: '03', title: 'Coeffs & Normalisation', icon: '🧮', badge: 'Pondération', desc: 'Comme les notes au lycée : attribue des poids sans brûler l’image.', xp: 40 },
    { key: 'm4', num: '04', title: 'Studio Filtres FX', icon: '🎛️', badge: 'Créateur FX', desc: 'Presets cultes (Portrait, 4K, Cyberpunk) et matrice custom libre.', xp: 50 },
    { key: 'm5', num: '05', title: 'Le Filtre Mystère', icon: '🕵️', badge: 'Enquête', desc: 'Mène l’enquête : démasque le filtre qui a modifié l’image.', xp: 60 },
    { key: 'm6', num: 'BOSS', title: 'Examen Final sur 100', icon: '🏆', badge: 'Boss Final', desc: 'Relève le grand défi et reçois ton Bilan Diagnostique par tâche.', xp: 100 },
  ];

  const ORDER: MissionKey[] = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];
  const isUnlocked = (k: MissionKey) => {
    const idx = ORDER.indexOf(k);
    if (idx <= 0) return true;
    return ORDER.slice(0, idx).every((m) => finishedMissions.has(m));
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Game Cyber Hero Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-950 to-purple-950/40 p-6 sm:p-10 shadow-2xl">
        {/* Neon Glow orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 justify-between">
          <div className="max-w-2xl space-y-4 text-center lg:text-left">
            {/* Game Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-extrabold shadow-sm">
              <span className="animate-pulse">🎮</span>
              <span>Jeu Éducatif Interactif</span>
              <span className="text-slate-500">•</span>
              <span className="text-pink-400">15–19 ans</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Plonge dans le{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-amber-300">
                laboratoire secret
              </span>{' '}
              des pixels et des filtres !
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tu utilises le <b>mode portrait flou</b> sur ton téléphone ? Les filtres néon sur TikTok ?
              Derrière cette magie se cache un super-pouvoir mathématique ultra simple : <b>la convolution</b>.
              Explore la grille, crée tes propres filtres et débloque le grade de <b>Détective Légendaire</b> !
            </p>

            {/* Tactile 3D Game Buttons */}
            <div className="pt-2 flex flex-wrap gap-3 justify-center lg:justify-start">
              <button
                onClick={() => {
                  sounds.playLevelUp();
                  onStart('m1');
                }}
                className="game-btn game-btn-primary px-7 py-4 text-sm sm:text-base cursor-pointer"
              >
                <span>🚀 Lancer la Mission 1</span>
              </button>

              <button
                onClick={() => {
                  sounds.playTap();
                  onStart('m4');
                }}
                className="game-btn game-btn-panel px-6 py-4 text-sm sm:text-base cursor-pointer"
              >
                <span>🎛️ Tester le Studio FX</span>
              </button>
            </div>
          </div>

          {/* Arcade CRT Screen with Cyber Look */}
          <div className="w-full lg:w-auto flex flex-col items-center">
            <div className="crt-screen p-4 rounded-3xl border-2 border-slate-700 bg-slate-950 shadow-2xl relative">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  CANVAS LIVE 60 FPS
                </span>
              </div>

              <div className="flex items-center justify-center gap-4 py-1">
                <div className="text-center">
                  <canvas ref={canvasBeforeRef} className="rounded-xl border border-slate-700 max-w-[130px] sm:max-w-[145px]" />
                  <p className="text-[10px] text-slate-400 mt-1.5 font-mono">Image Brute</p>
                </div>
                <div className="text-lg text-slate-600 font-bold">⚡</div>
                <div className="text-center">
                  <canvas ref={canvasAfterRef} className="rounded-xl border border-cyan-500/60 shadow-lg shadow-cyan-500/20 max-w-[130px] sm:max-w-[145px]" />
                  <p className="text-[10px] text-cyan-400 mt-1.5 font-mono font-bold">Filtre Appliqué</p>
                </div>
              </div>

              <p
                ref={labelRef}
                className="text-[11px] sm:text-xs font-mono text-amber-300 bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 text-center mt-3 max-w-[320px] min-h-[2.8rem] flex items-center justify-center"
              >
                Initialisation du moteur de convolution...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quest Map / Level Path (Arcade Style) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>🗺️ Carte des Quêtes & Progression</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Complète chaque mission pour débloquer la suivante et accéder au Boss Final :
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
            <span>Progression :</span>
            <span className="text-cyan-400 font-black">{finishedMissions.size} / 6</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUEST_LEVELS.map((lvl) => {
            const isDone = finishedMissions.has(lvl.key);
            const unlocked = isUnlocked(lvl.key);

            return (
              <div
                key={lvl.key}
                onClick={() => {
                  if (unlocked) {
                    sounds.playTap();
                    onStart(lvl.key);
                  } else {
                    sounds.playWrong();
                  }
                }}
                className={`relative p-5 rounded-2xl border-2 transition-all select-none cursor-pointer group ${
                  isDone
                    ? 'bg-slate-900/70 border-emerald-500/50 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10'
                    : unlocked
                    ? 'bg-slate-900/80 border-cyan-500/40 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Level Tag & XP */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                      LVL {lvl.num}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                      {lvl.badge}
                    </span>
                  </div>

                  {isDone ? (
                    <span className="text-emerald-400 text-sm font-extrabold flex items-center gap-1">
                      <span>✓</span> Validé
                    </span>
                  ) : unlocked ? (
                    <span className="text-amber-400 text-xs font-mono font-bold">+{lvl.xp} XP</span>
                  ) : (
                    <span className="text-slate-600 text-xs">🔒 Verrouillé</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex items-start gap-3.5">
                  <div className="text-3xl p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 group-hover:scale-110 transition-transform">
                    {lvl.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                      {lvl.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{lvl.desc}</p>
                  </div>
                </div>

                {/* Bottom Game Action Strip */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-400">
                    {isDone ? 'Rejouer la quête' : unlocked ? 'Commencer la quête' : 'Termine la quête précédente'}
                  </span>
                  <span className="text-cyan-400 font-extrabold group-hover:translate-x-1 transition-transform">
                    {unlocked ? '▶️' : '🔒'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
