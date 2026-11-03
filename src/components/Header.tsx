'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MissionKey } from '@/types';
import { sounds } from '@/utils/sound';
import { Zap, Gamepad2, Volume2, VolumeX, ChevronDown } from 'lucide-react';

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

const MISSIONS: Array<{ key: MissionKey; label: string; icon: string; short: string }> = [
  { key: 'home', label: 'Accueil', icon: '🏠', short: 'Base' },
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
  soundEnabled,
  onToggleSound,
  totalXp,
}: HeaderProps) {
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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

  const scrollToAnchor = (anchorId: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#070918]/90 border-b border-indigo-950/60 px-3 sm:px-6 py-2.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        {/* Brand Logo - Pixel Detective */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playTap();
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            {/* Cyber Loupe Icon */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:shadow-cyan-400/40 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#080b18] rounded-[14px] flex items-center justify-center text-lg">
                <span className="animate-pulse">🕵️</span>
              </div>
            </div>

            <div className="text-left flex flex-col">
              <div className="text-base font-black tracking-wider text-white flex items-center gap-1.5 leading-none">
                <span>PIXEL</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  DETECTIVE
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                CONVOQUEST STUDIO
              </span>
            </div>
          </button>
        </div>

        {/* Main Navigation Links (As seen in Reference Image 1) */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-300">
          {/* Accueil */}
          <button
            onClick={() => {
              sounds.playTap();
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`relative px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer hover:text-white ${
              currentView === 'home' ? 'text-white font-bold' : ''
            }`}
          >
            <span>Accueil</span>
            {currentView === 'home' && (
              <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            )}
          </button>

          {/* Modules with dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sounds.playTap();
                setModulesDropdownOpen(!modulesDropdownOpen);
              }}
              className="px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer hover:text-white flex items-center gap-1"
            >
              <span>Modules</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {modulesDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-[#0b0e24] border border-indigo-500/30 p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                {MISSIONS.filter((m) => m.key !== 'home').map((m) => {
                  const done = finishedMissions.has(m.key);
                  const unlocked = isUnlocked(m.key);

                  return (
                    <button
                      key={m.key}
                      onClick={() => {
                        if (unlocked) {
                          sounds.playTap();
                          onNavigate(m.key);
                          setModulesDropdownOpen(false);
                        } else {
                          sounds.playWrong();
                        }
                      }}
                      disabled={!unlocked}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                        currentView === m.key
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : unlocked
                          ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          : 'text-slate-600 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{m.icon}</span>
                        <span>{m.label}</span>
                      </span>
                      {done && <span className="text-emerald-400 text-xs font-bold">✓</span>}
                      {!unlocked && <span className="text-[10px]">🔒</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Challenge (Boss / Mystère) */}
          <button
            onClick={() => {
              sounds.playTap();
              if (isUnlocked('m5')) {
                onNavigate('m5');
              } else {
                onNavigate('m1');
              }
            }}
            className="px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer hover:text-white"
          >
            Challenge
          </button>

          {/* Classement */}
          <button
            onClick={() => {
              sounds.playTap();
              scrollToAnchor('modules');
            }}
            className="px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer hover:text-white"
          >
            Classement
          </button>

          {/* Ressources */}
          <button
            onClick={() => {
              sounds.playTap();
              scrollToAnchor('demo');
            }}
            className="px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer hover:text-white"
          >
            Ressources
          </button>

          {/* À propos / Notre Équipe */}
          <button
            onClick={() => {
              sounds.playTap();
              scrollToAnchor('team');
            }}
            className="px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer hover:text-white flex items-center gap-1.5"
          >
            <span>Notre Équipe</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              3
            </span>
          </button>
        </nav>

        {/* Level Select Quick-Bar for Mobile / Tablet */}
        <div className="flex lg:hidden items-center gap-1 overflow-x-auto py-1 scrollbar-none max-w-full">
          {MISSIONS.map((item) => {
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
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30 font-black'
                    : unlocked
                    ? 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
                    : 'bg-slate-950/40 text-slate-600 opacity-40 cursor-not-allowed'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.short}</span>
                {done && !active && <span className="text-emerald-400 text-xs">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Right Section: XP Pill, User Profile, Sound & Action Button */}
        <div className="flex items-center gap-2.5">
          {/* XP Badge Pill (Reference Image 1: ⚡ 1250 XP) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-black shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>{totalXp} XP</span>
          </div>

          {/* User Profile Avatar Pill with dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sounds.playTap();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-purple-400 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-[1.5px] overflow-hidden">
                <Image
                  src="/avatar_crop.png"
                  alt="Detective Avatar"
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 mr-1" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#0b0e24] border border-indigo-500/30 p-3 shadow-2xl backdrop-blur-2xl z-50 space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                  <div className="text-xs">
                    <div className="font-bold text-white">Agent Détective</div>
                    <div className="text-[10px] text-slate-400 font-mono">Score Exam : {examScore}/100</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-bold border ${rank.badge} text-center`}>
                  {rank.name}
                </div>
                <button
                  onClick={() => {
                    scrollToAnchor('team');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left text-xs text-slate-300 hover:text-white px-2 py-1.5 rounded-lg hover:bg-slate-800/60"
                >
                  👥 Voir Notre Équipe
                </button>
              </div>
            )}
          </div>

          {/* Sound Toggle Button */}
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
            title={soundEnabled ? 'Désactiver les effets audio' : 'Activer les effets audio'}
            className="w-8 h-8 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-sm transition-all hover:border-indigo-500/50 cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Primary Action Button - Commencer (Reference Image 1) */}
          <button
            onClick={() => {
              sounds.playLevelUp();
              if (currentView === 'home') {
                onNavigate('m1');
              } else {
                onNavigate('home');
              }
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_28px_rgba(139,92,246,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>{currentView === 'home' ? 'Commencer' : 'Quitter'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
