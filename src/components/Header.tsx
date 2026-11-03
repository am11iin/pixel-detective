'use client';

import React from 'react';
import { MissionKey } from '@/types';
import { sounds } from '@/utils/sound';

interface HeaderProps {
  currentView: MissionKey;
  onNavigate: (view: MissionKey) => void;
  examScore: number;
  finishedMissions: Set<MissionKey>;
  isDark: boolean;
  onToggleTheme: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  totalXp: number;
}

const NAV_ITEMS: Array<{ key: MissionKey; label: string; icon: string; short: string }> = [
  { key: 'home', label: 'Base', icon: '🏠', short: 'Base' },
  { key: 'm1', label: '1. Pixels', icon: '🔍', short: '1. Pixels' },
  { key: 'm2', label: '2. Voisins', icon: '👥', short: '2. Voisins' },
  { key: 'm3', label: '3. Coeffs', icon: '🧮', short: '3. Coeffs' },
  { key: 'm4', label: '4. Studio FX', icon: '🎛️', short: '4. Studio' },
  { key: 'm5', label: '5. Mystère', icon: '🕵️', short: '5. Mystère' },
  { key: 'm6', label: 'BOSS : Examen', icon: '🏆', short: 'Examen' },
];

export function Header({
  currentView,
  onNavigate,
  examScore,
  finishedMissions,
  isDark,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  totalXp,
}: HeaderProps) {
  const ORDER: MissionKey[] = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];

  const isUnlocked = (k: MissionKey) => {
    if (k === 'home') return true;
    const idx = ORDER.indexOf(k);
    if (idx === 0) return true;
    return ORDER.slice(0, idx).every((m) => finishedMissions.has(m));
  };

  const getRank = () => {
    if (finishedMissions.size >= 6) return { name: 'Légende Convo', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
    if (finishedMissions.size >= 4) return { name: 'As des Filtres', badge: 'bg-pink-500/20 text-pink-300 border-pink-500/40' };
    if (finishedMissions.size >= 2) return { name: 'Enquêteur Pro', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
    return { name: 'Apprenti Détective', badge: 'bg-slate-800 text-slate-300 border-slate-700' };
  };

  const rank = getRank();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/85 border-b border-slate-800/80 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 flex-wrap">
        {/* Game Brand & Player Rank Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playTap();
              onNavigate('home');
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl">
                🕵️
              </div>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span>CONVO</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">QUEST</span>
              </div>
              <div className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">PIXEL DETECTIVE</div>
            </div>
          </button>

          {/* Gamified Rank Badge */}
          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${rank.badge}`}>
            <span>⭐</span>
            <span>{rank.name}</span>
          </div>
        </div>

        {/* Level Select Pills */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none max-w-full">
          {NAV_ITEMS.map((item) => {
            const active = currentView === item.key;
            const done = finishedMissions.has(item.key);
            const unlocked = isUnlocked(item.key);

            return (
              <button
                key={item.key}
                onClick={() => {
                  if (unlocked) {
                    sounds.playTap();
                    onNavigate(item.key);
                  } else {
                    sounds.playWrong();
                  }
                }}
                disabled={!unlocked}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all whitespace-nowrap select-none ${
                  active
                    ? 'bg-gradient-to-r from-cyan-400 to-pink-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-105 font-black border-b-2 border-pink-700'
                    : unlocked
                    ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                    : 'bg-slate-950/60 text-slate-600 border border-slate-900 cursor-not-allowed opacity-40'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.short}</span>
                {done && !active && <span className="text-emerald-400 text-xs">✓</span>}
              </button>
            );
          })}
        </nav>

        {/* Game HUD Status */}
        <div className="flex items-center gap-2">
          {/* XP Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-extrabold shadow-sm">
            <span>⚡</span>
            <span>{totalXp} XP</span>
          </div>

          {/* Exam Score */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-extrabold shadow-sm">
            <span className="text-[10px] text-amber-400/80 uppercase">Score</span>
            <span className="text-amber-400 font-black">{examScore}/100</span>
          </div>

          {/* Sound Mute/Unmute */}
          <button
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) {
                sounds.enabled = true;
                sounds.playTap();
              } else {
                sounds.enabled = false;
              }
            }}
            title={soundEnabled ? 'Désactiver les sons' : 'Activer les sons'}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm transition-transform active:scale-95"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>
    </header>
  );
}
