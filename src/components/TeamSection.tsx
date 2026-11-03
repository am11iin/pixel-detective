'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Shield, Sparkles, Terminal } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  codename: string;
  badgeColor: string;
  glowColor: string;
  borderColor: string;
  accentBg: string;
  textColor: string;
  portrait: string;
  quote: string;
  skills: string[];
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'abderrahmane',
    name: 'Abderrahmane Ferhat',
    role: 'Moteur Convolution & R&D',
    specialty: 'Algorithmes matriciels, Web Audio API & Synthèse interactive',
    codename: 'DETECTIVE MATRIX',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    glowColor: 'hover:shadow-[0_0_35px_rgba(6,182,212,0.4)]',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    accentBg: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    textColor: 'text-cyan-400',
    portrait: '/portrait_left.png',
    quote: '« Chaque coefficient transforme le signal pour révéler l’invisible. »',
    skills: ['Noyaux 3×3', 'Web Audio API', 'Canvas 60 FPS', 'Algorithmes'],
  },
  {
    id: 'amine',
    name: 'Mohamed Amine Sellami',
    role: 'Lead Développeur & Architecture',
    specialty: 'Vision par ordinateur, Gamification & Conduite de Projet',
    codename: 'CHIEF DETECTIVE',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    glowColor: 'hover:shadow-[0_0_40px_rgba(99,102,241,0.45)]',
    borderColor: 'border-indigo-500/50 hover:border-indigo-400',
    accentBg: 'from-indigo-500/20 via-purple-500/10 to-transparent',
    textColor: 'text-indigo-400',
    portrait: '/portrait_center.png',
    quote: '« Transformer une science complexe en une aventure d’investigation captivante. »',
    skills: ['Architecture Next.js', 'Stéganographie', 'Traitement d’Image', 'Lead Tech'],
  },
  {
    id: 'chakib',
    name: 'Chakib Kedjour',
    role: 'Design Interactif & UX',
    specialty: 'Scénarisation des enquêtes, ergonomie visuelle & analyse d’image',
    codename: 'DETECTIVE CYPHER',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    glowColor: 'hover:shadow-[0_0_35px_rgba(168,85,247,0.4)]',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    accentBg: 'from-purple-500/20 via-pink-500/10 to-transparent',
    textColor: 'text-purple-400',
    portrait: '/portrait_right.png',
    quote: '« Une interface intuitive permet aux apprenants de toucher la vérité du bout des doigts. »',
    skills: ['UI/UX Cyberpunk', 'Gamification', 'Analyse Stéganographique', 'Prototypage'],
  },
];

export function TeamSection() {
  const [activeMember, setActiveMember] = useState<string | null>(null);

  return (
    <section id="team" className="relative py-12 sm:py-16 scroll-mt-20">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-72 bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30 text-xs sm:text-sm font-bold text-purple-300 backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>L’ÉQUIPE PIXEL DETECTIVE</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-mono">CONVOQUEST CREW</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Notre{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Équipe d’Experts
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Rencontrez les trois enquêteurs et concepteurs à l’origine du laboratoire interactif Pixel Detective.
            Alliant passion pour le traitement d’image, gamification et stéganographie.
          </p>
        </div>

        {/* Master Panoramic Artwork Showcase (With Interactive Overlays) */}
        <div className="relative group rounded-3xl border-2 border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-[#0a0c1a] to-[#060814] p-3 sm:p-5 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(112,66,248,0.2)]">
          {/* Top terminal bar */}
          <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-800/80 mb-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-[11px] text-slate-500 hidden sm:inline">TEAM_DOSSIER // CONFIDENTIAL</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-300 text-[11px] font-bold">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>3 ENQUÊTEURS ACTIFS</span>
            </div>
          </div>

          {/* Panoramic Image Container */}
          <div className="relative w-full aspect-[895/598] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950">
            {/* Base Image */}
            <Image
              src="/team.png"
              alt="L’équipe Pixel Detective : Abderrahmane Ferhat, Mohamed Amine Sellami, Chakib Kedjour"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              priority
            />

            {/* Subtle cyber grid and vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060814]/90 via-transparent to-transparent pointer-events-none" />

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
                className={`w-full h-full flex flex-col justify-center items-center rounded-xl px-2 py-1 transition-all duration-300 backdrop-blur-sm ${
                  activeMember === 'abderrahmane'
                    ? 'bg-cyan-950/70 ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                    : 'bg-slate-950/40 hover:bg-cyan-950/50'
                }`}
              >
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-cyan-300 uppercase">
                  Abderrahmane Ferhat
                </span>
                <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium hidden sm:block truncate max-w-full">
                  Moteur Convolution & R&D
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
                className={`w-full h-full flex flex-col justify-center items-center rounded-xl px-2 py-1 transition-all duration-300 backdrop-blur-sm ${
                  activeMember === 'amine'
                    ? 'bg-indigo-950/70 ring-2 ring-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)]'
                    : 'bg-slate-950/40 hover:bg-indigo-950/50'
                }`}
              >
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-indigo-300 uppercase">
                  Mohamed Amine Sellami
                </span>
                <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium hidden sm:block truncate max-w-full">
                  Lead Développeur & Archi
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
                className={`w-full h-full flex flex-col justify-center items-center rounded-xl px-2 py-1 transition-all duration-300 backdrop-blur-sm ${
                  activeMember === 'chakib'
                    ? 'bg-purple-950/70 ring-2 ring-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.6)]'
                    : 'bg-slate-950/40 hover:bg-purple-950/50'
                }`}
              >
                <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-purple-300 uppercase">
                  Chakib Kedjour
                </span>
                <span className="text-[9px] sm:text-[11px] text-slate-300 font-medium hidden sm:block truncate max-w-full">
                  Design Interactif & UX
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Member Cards (Optimized for Mobile, Tablet & Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TEAM_MEMBERS.map((member) => {
            const isHovered = activeMember === member.id;

            return (
              <div
                key={member.id}
                onMouseEnter={() => setActiveMember(member.id)}
                onMouseLeave={() => setActiveMember(null)}
                className={`group relative rounded-2xl border-2 transition-all duration-300 p-5 flex flex-col justify-between backdrop-blur-xl bg-slate-900/60 ${member.borderColor} ${member.glowColor} ${
                  isHovered ? '-translate-y-1.5 bg-slate-900/90' : ''
                }`}
              >
                {/* Neon highlight top bar */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r ${member.accentBg} transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-40'
                  }`}
                />

                <div className="space-y-4">
                  {/* Portrait and Header strip */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-md group-hover:scale-105 transition-transform flex-shrink-0 bg-slate-950">
                      <Image
                        src={member.portrait}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-slate-700 bg-slate-800/80 text-slate-400">
                          {member.codename}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white mt-1 group-hover:text-cyan-300 transition-colors truncate">
                        {member.name}
                      </h3>
                      <p className={`text-xs font-semibold ${member.textColor} truncate`}>
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Speciality Description */}
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {member.specialty}
                  </p>

                  {/* Quote */}
                  <blockquote className="text-[11px] italic text-slate-400 border-l-2 border-slate-700 pl-2.5 py-0.5">
                    {member.quote}
                  </blockquote>
                </div>

                {/* Skill Pills */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pedagogical Mission Stamp */}
        <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <span className="font-bold text-white block">Projet Pédagogique Interactif</span>
              <span className="text-[11px]">Conçu pour rendre l’apprentissage de la convolution accessible et stimulant.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Terminal className="w-4 h-4" />
            <span>Pixel Detective v2.0 • 100% Client-Side</span>
          </div>
        </div>
      </div>
    </section>
  );
}
