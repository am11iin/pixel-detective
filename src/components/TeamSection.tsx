'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  colorClass: string;
  activeBg: string;
  activeRing: string;
  activeShadow: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'abderrahmane',
    name: 'Abderrahmane Ferhat',
    colorClass: 'text-cyan-300',
    activeBg: 'bg-cyan-950/80',
    activeRing: 'ring-2 ring-cyan-400',
    activeShadow: 'shadow-[0_0_25px_rgba(6,182,212,0.6)]',
  },
  {
    id: 'amine',
    name: 'Mohamed Amine Sellami',
    colorClass: 'text-indigo-300',
    activeBg: 'bg-indigo-950/80',
    activeRing: 'ring-2 ring-indigo-400',
    activeShadow: 'shadow-[0_0_25px_rgba(99,102,241,0.6)]',
  },
  {
    id: 'chakib',
    name: 'Chakib Kedjour',
    colorClass: 'text-purple-300',
    activeBg: 'bg-purple-950/80',
    activeRing: 'ring-2 ring-purple-400',
    activeShadow: 'shadow-[0_0_25px_rgba(168,85,247,0.6)]',
  },
];

export function TeamSection() {
  const [activeMember, setActiveMember] = useState<string | null>(null);

  return (
    <section id="team" className="relative py-10 sm:py-14 scroll-mt-20">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-48 bg-indigo-600/10 rounded-full blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30 text-xs font-bold text-purple-300 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>L’ÉQUIPE DU PROJET</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-mono">PIXEL DETECTIVE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Notre{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Équipe
            </span>
          </h2>
        </div>

        {/* Master Panoramic Artwork Showcase (With Interactive Overlays in the 3 boxes) */}
        <div className="relative group rounded-3xl border-2 border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-[#0a0c1a] to-[#060814] p-3 sm:p-5 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(112,66,248,0.25)]">
          {/* Panoramic Image Container */}
          <div className="relative w-full aspect-[895/598] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950">
            {/* Base Team Image */}
            <Image
              src="/team.png"
              alt="L’équipe Pixel Detective : Abderrahmane Ferhat, Mohamed Amine Sellami, Chakib Kedjour"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              priority
            />

            {/* Subtle cyber grid and vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060814]/70 via-transparent to-transparent pointer-events-none" />

            {/* Interactive Nameplate Overlays positioned exactly on the 3 glowing boxes */}
            {/* Box 1 (Left): Abderrahmane Ferhat */}
            <div
              onMouseEnter={() => setActiveMember('abderrahmane')}
              onMouseLeave={() => setActiveMember(null)}
              className="absolute transition-all duration-300 cursor-pointer flex flex-col justify-center items-center text-center px-2 py-1 select-none"
              style={{
                left: '2%',
                width: '30.1%',
                top: '72.7%',
                height: '19.2%',
              }}
            >
              <div
                className={`w-full h-full flex items-center justify-center rounded-xl px-2 py-1 transition-all duration-300 backdrop-blur-sm ${
                  activeMember === 'abderrahmane'
                    ? 'bg-cyan-950/80 ring-2 ring-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)]'
                    : 'bg-slate-950/40 hover:bg-cyan-950/60'
                }`}
              >
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black tracking-wider text-cyan-300 uppercase transition-all">
                  Abderrahmane Ferhat
                </span>
              </div>
            </div>

            {/* Box 2 (Center): Mohamed Amine Sellami */}
            <div
              onMouseEnter={() => setActiveMember('amine')}
              onMouseLeave={() => setActiveMember(null)}
              className="absolute transition-all duration-300 cursor-pointer flex flex-col justify-center items-center text-center px-2 py-1 select-none"
              style={{
                left: '34.8%',
                width: '30.1%',
                top: '72.7%',
                height: '19.2%',
              }}
            >
              <div
                className={`w-full h-full flex items-center justify-center rounded-xl px-2 py-1 transition-all duration-300 backdrop-blur-sm ${
                  activeMember === 'amine'
                    ? 'bg-indigo-950/80 ring-2 ring-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.6)]'
                    : 'bg-slate-950/40 hover:bg-indigo-950/60'
                }`}
              >
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black tracking-wider text-indigo-300 uppercase transition-all">
                  Mohamed Amine Sellami
                </span>
              </div>
            </div>

            {/* Box 3 (Right): Chakib Kedjour */}
            <div
              onMouseEnter={() => setActiveMember('chakib')}
              onMouseLeave={() => setActiveMember(null)}
              className="absolute transition-all duration-300 cursor-pointer flex flex-col justify-center items-center text-center px-2 py-1 select-none"
              style={{
                left: '67.7%',
                width: '30.1%',
                top: '72.7%',
                height: '19.2%',
              }}
            >
              <div
                className={`w-full h-full flex items-center justify-center rounded-xl px-2 py-1 transition-all duration-300 backdrop-blur-sm ${
                  activeMember === 'chakib'
                    ? 'bg-purple-950/80 ring-2 ring-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.6)]'
                    : 'bg-slate-950/40 hover:bg-purple-950/60'
                }`}
              >
                <span className="text-xs sm:text-sm md:text-base lg:text-lg font-black tracking-wider text-purple-300 uppercase transition-all">
                  Chakib Kedjour
                </span>
              </div>
            </div>
          </div>

          {/* Responsive Name Strip for Mobile & Desktop (Only the 3 Names under their portraits) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
            {TEAM_MEMBERS.map((member) => {
              const isHovered = activeMember === member.id;

              return (
                <div
                  key={member.id}
                  onMouseEnter={() => setActiveMember(member.id)}
                  onMouseLeave={() => setActiveMember(null)}
                  className={`p-2.5 sm:p-3.5 rounded-xl border transition-all duration-300 text-center select-none cursor-pointer backdrop-blur-md ${
                    isHovered
                      ? `${member.activeBg} ${member.activeRing} ${member.activeShadow} -translate-y-0.5`
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <p className={`text-xs sm:text-sm md:text-base font-black tracking-wider ${member.colorClass}`}>
                    {member.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
