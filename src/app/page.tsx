'use client';

import React, { useState, useEffect } from 'react';
import { MissionKey } from '@/types';
import { Header } from '@/components/Header';
import { HomeSection } from '@/components/HomeSection';
import { Mission1Pixels } from '@/components/Mission1Pixels';
import { Mission2Neighbors } from '@/components/Mission2Neighbors';
import { Mission3Coeffs } from '@/components/Mission3Coeffs';
import { Mission4StudioFilters } from '@/components/Mission4StudioFilters';
import { Mission5Mystery } from '@/components/Mission5Mystery';
import { Mission6Exam } from '@/components/Mission6Exam';
import { sounds } from '@/utils/sound';

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<MissionKey>('home');
  const [examScore, setExamScore] = useState<number>(0);
  const [finishedMissions, setFinishedMissions] = useState<Set<MissionKey>>(new Set());
  const [isDark, setIsDark] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [totalXp, setTotalXp] = useState<number>(50);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync dark class on html root
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  const markMissionFinished = (key: MissionKey) => {
    if (!finishedMissions.has(key)) {
      setFinishedMissions((prev) => {
        const next = new Set(prev);
        next.add(key);
        return next;
      });

      const xpAwards: Record<string, number> = {
        m1: 20,
        m2: 30,
        m3: 40,
        m4: 50,
        m5: 60,
        m6: 100,
      };
      setTotalXp((prev) => prev + (xpAwards[key] || 25));
    }
  };

  const handleNavigate = (view: MissionKey) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      sounds.enabled = next;
      return next;
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#080b14] text-cyan-400 flex flex-col items-center justify-center font-mono gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-pink-500 animate-spin flex items-center justify-center text-xl">
          🕵️
        </div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Chargement de Pixel Detective...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b14] text-slate-100 flex flex-col selection:bg-pink-500 selection:text-white">
      {/* Game HUD Navbar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        examScore={examScore}
        finishedMissions={finishedMissions}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        totalXp={totalXp}
      />

      {/* Main Game Arena */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'home' && (
          <HomeSection
            onStart={(view) => handleNavigate(view)}
            finishedMissions={finishedMissions}
            totalXp={totalXp}
          />
        )}

        {currentView === 'm1' && (
          <Mission1Pixels
            onSuccess={() => markMissionFinished('m1')}
            onNext={() => handleNavigate('m2')}
            isCompleted={finishedMissions.has('m1')}
          />
        )}

        {currentView === 'm2' && (
          <Mission2Neighbors
            onSuccess={() => markMissionFinished('m2')}
            onNext={() => handleNavigate('m3')}
            isCompleted={finishedMissions.has('m2')}
          />
        )}

        {currentView === 'm3' && (
          <Mission3Coeffs
            onSuccess={() => markMissionFinished('m3')}
            onNext={() => handleNavigate('m4')}
            isCompleted={finishedMissions.has('m3')}
          />
        )}

        {currentView === 'm4' && (
          <Mission4StudioFilters
            onSuccess={() => markMissionFinished('m4')}
            onNext={() => handleNavigate('m5')}
            isCompleted={finishedMissions.has('m4')}
          />
        )}

        {currentView === 'm5' && (
          <Mission5Mystery
            onSuccess={() => markMissionFinished('m5')}
            onNext={() => handleNavigate('m6')}
            isCompleted={finishedMissions.has('m5')}
          />
        )}

        {currentView === 'm6' && (
          <Mission6Exam
            onScoreUpdate={(score) => setExamScore(score)}
            onNavigateToTask={(task) => handleNavigate(task)}
            onFinishExam={() => markMissionFinished('m6')}
          />
        )}
      </main>

      {/* Game Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-6 px-4 text-center text-xs sm:text-sm text-slate-500">
        <p className="flex items-center justify-center gap-2">
          <span>🕵️</span>
          <span><b>Pixel Detective • ConvoQuest</b> — Studio Éducatif de Convolution.</span>
          <span>🎮</span>
        </p>
      </footer>
    </div>
  );
}
