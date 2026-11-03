'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { MissionKey } from '@/types';
import { generateFaceImage, applyConvolution, renderToCanvas, GRID_N } from '@/utils/canvas';
import { FILTER_PRESETS } from '@/data/filters';
import { sounds } from '@/utils/sound';
import { TeamSection } from './TeamSection';
import {
  Rocket,
  Play,
  Trophy,
  GraduationCap,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  Eye,
  Sliders,
  Search,
  Lock,
  Layers,
  Zap,
} from 'lucide-react';

interface HomeSectionProps {
  onStart: (view: MissionKey) => void;
  finishedMissions: Set<MissionKey>;
  totalXp: number;
}

export function HomeSection({ onStart, finishedMissions, totalXp }: HomeSectionProps) {
  const canvasBeforeRef = useRef<HTMLCanvasElement>(null);
  const canvasAfterRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const [selectedDemoPreset, setSelectedDemoPreset] = useState<string>('flou');

  // Live Canvas 60 FPS Animation Engine
  useEffect(() => {
    const img = generateFaceImage();
    const presets = ['flou', 'nettete', 'contours', 'emboss'];
    const texts = [
      '🤳 Mode Portrait : la matrice 3×3 moyenne les 9 cases pour adoucir le visage !',
      '🎮 Gaming 4K : centre boosté (+5) − voisins (−1) = arêtes ultra nettes !',
      '⚡ Vision Cyberpunk : zones plates à 0 (noir) et bords allumés en néon !',
      '🗿 Relief 3D : fausse ombre portée en opposant ombres (−) et lumières (+) !',
    ];

    let fxIdx = presets.indexOf(selectedDemoPreset);
    if (fxIdx === -1) fxIdx = 0;
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
            boxes: finished ? [] : [[x - 1, y - 1, 3, 3, '#a855f7']],
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
          setSelectedDemoPreset(presets[fxIdx]);
          setTimeout(runLoop, 400);
        }
      }, 45);
    };

    runLoop();
    return () => clearInterval(timer);
  }, [selectedDemoPreset]);

  const ORDER: MissionKey[] = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];
  const isUnlocked = (k: MissionKey) => {
    const idx = ORDER.indexOf(k);
    if (idx <= 0) return true;
    return ORDER.slice(0, idx).every((m) => finishedMissions.has(m));
  };

  const MODULE_CARDS = [
    {
      key: 'm1' as MissionKey,
      num: '01',
      title: 'Introduction à la Stéganographie',
      subtitle: 'Découvre les bases et les concepts fondamentaux.',
      progress: finishedMissions.has('m1') ? 100 : 100,
      color: 'from-purple-500 to-indigo-600',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      progressBg: 'bg-purple-500',
      icon: Eye,
      xp: 20,
    },
    {
      key: 'm2' as MissionKey,
      num: '02',
      title: 'Formats d’Images & Voisins',
      subtitle: 'Comprends les structures internes des images.',
      progress: finishedMissions.has('m2') ? 100 : 75,
      color: 'from-blue-500 to-cyan-500',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      progressBg: 'bg-blue-500',
      icon: Layers,
      xp: 30,
    },
    {
      key: 'm3' as MissionKey,
      num: '03',
      title: 'Techniques de Dissimulation',
      subtitle: 'Apprends les méthodes de dissimulation de données.',
      progress: finishedMissions.has('m3') ? 100 : 50,
      color: 'from-emerald-500 to-teal-500',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      progressBg: 'bg-emerald-500',
      icon: Sliders,
      xp: 40,
    },
    {
      key: 'm4' as MissionKey,
      num: '04',
      title: 'Détection et Analyse FX',
      subtitle: 'Maîtrise les techniques de détection et d’extraction.',
      progress: finishedMissions.has('m4') ? 100 : 25,
      color: 'from-amber-500 to-orange-500',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      progressBg: 'bg-amber-500',
      icon: Search,
      xp: 50,
    },
    {
      key: 'm5' as MissionKey,
      num: '05',
      title: 'Cas Pratiques Avancés & BOSS',
      subtitle: 'Analyse de cas réels et scénarios complexes.',
      progress: finishedMissions.has('m5') ? 100 : 0,
      color: 'from-pink-500 to-rose-600',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
      progressBg: 'bg-pink-500',
      icon: Lock,
      xp: 60,
    },
  ];

  return (
    <div className="space-y-14 animate-fadeIn">
      {/* =========================================================================
          HERO SECTION (Matching Reference Image 1)
      ========================================================================= */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-indigo-900/50 bg-gradient-to-br from-[#0b0e26]/90 via-[#070919] to-[#0d0d2b]/80 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl">
        {/* Cyber Neon Glow orbs */}
        <div className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 justify-between">
          {/* Hero Left Content */}
          <div className="max-w-xl space-y-6 text-center lg:text-left">
            {/* Tag Badge: PLATEFORME D'APPRENTISSAGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-black tracking-wider uppercase backdrop-blur-md shadow-sm">
              <Rocket className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span>Plateforme d’apprentissage</span>
              <span className="text-slate-600">•</span>
              <span className="text-purple-300 font-mono flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" />
                {totalXp} XP
              </span>
            </div>

            {/* Giant Title: DEVIENS UN DÉTECTIVE DU DIGITAL */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08]">
              DEVIENS UN<br />
              DÉTECTIVE DU<br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(139,92,246,0.6)]">
                DIGITAL
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
              Apprends la stéganographie et l’analyse d’images à travers des modules interactifs et des challenges captivants.
            </p>

            {/* Action Call to Actions */}
            <div className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start">
              {/* Primary: COMMENCER L'AVENTURE */}
              <button
                onClick={() => {
                  sounds.playLevelUp();
                  onStart('m1');
                }}
                className="group inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:shadow-[0_0_35px_rgba(139,92,246,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Rocket className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
                <span>Commencer l’aventure</span>
              </button>

              {/* Secondary: VOIR LA DÉMO */}
              <button
                onClick={() => {
                  sounds.playTap();
                  const el = document.getElementById('demo');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 border border-indigo-500/40 hover:border-indigo-400 hover:text-white transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-purple-400" />
                <span>Voir la démo</span>
              </button>
            </div>
          </div>

          {/* Hero Right: Cyber Artwork & Steganography Terminal */}
          <div className="w-full lg:w-auto flex flex-col items-center">
            <div className="relative group rounded-3xl border-2 border-indigo-900/60 bg-[#070919] shadow-2xl p-2 sm:p-3 overflow-hidden backdrop-blur-xl">
              <div className="relative w-full max-w-[460px] aspect-[480/285] rounded-2xl overflow-hidden border border-indigo-500/20">
                <Image
                  src="/hero_art.png"
                  alt="Detective du digital avec stéganographie et cadenas secret"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070919]/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating badge inside artwork */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/30">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>VOIR L’INVISIBLE, RÉVÉLER LA VÉRITÉ</span>
                  </span>
                  <span className="text-purple-300 font-bold">TOP SECRET</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STATS ROW (4 Glassy Cards as in Reference Image 1)
      ========================================================================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: CHALLENGES */}
        <div className="group rounded-2xl border border-purple-500/20 bg-gradient-to-b from-slate-900/80 to-[#080a1c] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)] flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block">
              Challenges
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">12+</div>
            <span className="text-xs text-slate-400">Défis captivants</span>
          </div>
        </div>

        {/* Card 2: MODULES */}
        <div className="group rounded-2xl border border-blue-500/20 bg-gradient-to-b from-slate-900/80 to-[#080a1c] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block">
              Modules
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">5</div>
            <span className="text-xs text-slate-400">Modules interactifs</span>
          </div>
        </div>

        {/* Card 3: APPRENANTS */}
        <div className="group rounded-2xl border border-pink-500/20 bg-gradient-to-b from-slate-900/80 to-[#080a1c] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-pink-500/50 hover:shadow-[0_0_25px_rgba(236,72,153,0.25)] flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block">
              Apprenants
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">850+</div>
            <span className="text-xs text-slate-400">Détectives en herbe</span>
          </div>
        </div>

        {/* Card 4: TAUX DE RÉUSSITE */}
        <div className="group rounded-2xl border border-amber-500/20 bg-gradient-to-b from-slate-900/80 to-[#080a1c] p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block">
              Taux de Réussite
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">92%</div>
            <span className="text-xs text-slate-400">Bravo détective !</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MODULES DISPONIBLES (Matching Reference Image 1)
      ========================================================================= */}
      <section id="modules" className="space-y-6 scroll-mt-20">
        <div className="flex items-center justify-between border-b border-indigo-950/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-purple-400 font-bold">✦</span>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-wider uppercase">
              Modules Disponibles
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onStart('m1');
            }}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Voir tous les modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {MODULE_CARDS.map((mod) => {
            const Icon = mod.icon;
            const unlocked = isUnlocked(mod.key);
            const isDone = finishedMissions.has(mod.key);

            return (
              <div
                key={mod.num}
                onClick={() => {
                  if (unlocked) {
                    sounds.playTap();
                    onStart(mod.key);
                  } else {
                    sounds.playWrong();
                  }
                }}
                className={`group relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer backdrop-blur-xl select-none ${
                  isDone
                    ? 'border-emerald-500/40 bg-slate-900/80 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]'
                    : unlocked
                    ? 'border-indigo-500/30 bg-[#0a0c20]/90 hover:border-indigo-400 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-1'
                    : 'border-slate-800/60 bg-slate-950/40 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="space-y-3">
                  {/* Top: Number Badge and Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-slate-300 px-2 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-800/40">
                      {mod.num}
                    </span>
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4 text-indigo-300" />
                    </div>
                  </div>

                  {/* Title and Subtitle */}
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                      {mod.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {mod.subtitle}
                    </p>
                  </div>
                </div>

                {/* Progress bar at bottom */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">{isDone ? 'Complété' : 'Progression'}</span>
                    <span className="font-bold text-white">{isDone ? '100%' : `${mod.progress}%`}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDone ? 'bg-emerald-400' : mod.progressBg
                      }`}
                      style={{ width: `${isDone ? 100 : mod.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          LIVE 60 FPS INTERACTIVE CONVOLUTION DEMO (#demo)
      ========================================================================= */}
      <section id="demo" className="scroll-mt-20">
        <div className="rounded-3xl border border-indigo-900/60 bg-gradient-to-br from-[#0a0d24] via-slate-950 to-[#0a0c1e] p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-950/80 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>MOTEUR CANVAS 60 FPS • TEMPS RÉEL</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Laboratoire Interactif de Convolution
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Observe la matrice 3×3 balayer l’image pour transformer chaque pixel en direct.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'flou', label: 'Mode Portrait (Flou)' },
                { key: 'nettete', label: 'Gaming 4K (Netteté)' },
                { key: 'contours', label: 'Vision Cyber (Contours)' },
                { key: 'emboss', label: 'Relief 3D' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    sounds.playTap();
                    setSelectedDemoPreset(f.key);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedDemoPreset === f.key
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* CRT Screen Display */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="crt-screen p-5 rounded-3xl border-2 border-indigo-900/80 bg-slate-950 shadow-2xl max-w-lg w-full">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  SCAN MATRICIEL // EN COURS
                </span>
              </div>

              <div className="flex items-center justify-center gap-6 py-2">
                <div className="text-center">
                  <canvas
                    ref={canvasBeforeRef}
                    className="rounded-xl border border-slate-700 max-w-[130px] sm:max-w-[155px] shadow-lg"
                  />
                  <p className="text-[10px] text-slate-400 mt-2 font-mono uppercase">Image Brute</p>
                </div>
                <div className="text-xl text-purple-400 font-black animate-pulse">⚡</div>
                <div className="text-center">
                  <canvas
                    ref={canvasAfterRef}
                    className="rounded-xl border border-cyan-400/80 shadow-lg shadow-cyan-500/25 max-w-[130px] sm:max-w-[155px]"
                  />
                  <p className="text-[10px] text-cyan-400 mt-2 font-mono font-bold uppercase">
                    Filtre Appliqué
                  </p>
                </div>
              </div>

              <p
                ref={labelRef}
                className="text-[11px] sm:text-xs font-mono text-amber-300 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center mt-4 min-h-[3rem] flex items-center justify-center"
              >
                Initialisation du moteur de convolution...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION « NOTRE ÉQUIPE » (The Requested Team Section)
      ========================================================================= */}
      <TeamSection />
    </div>
  );
}
