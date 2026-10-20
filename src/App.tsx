/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameTab, PlayerProfile } from './types/game';
import { getPlayerProfile } from './utils/storage';
import { soundFx } from './utils/soundEffects';
import { Navbar } from './components/Navbar';
import { ImmuneDefender } from './components/ImmuneDefender';
import { NutriPlateGame } from './components/NutriPlateGame';
import { HealthQuiz } from './components/HealthQuiz';
import { LifeChoiceSimulator } from './components/LifeChoiceSimulator';
import { HabitQuestTracker } from './components/HabitQuestTracker';
import { HealthEncyclopedia } from './components/HealthEncyclopedia';
import { ProfileModal } from './components/ProfileModal';
import { 
  ShieldCheck, 
  UtensilsCrossed, 
  HelpCircle, 
  Activity, 
  BookOpen, 
  Flame, 
  Sparkles, 
  ChevronRight,
  Heart,
  Droplet
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<GameTab>('home');
  const [profile, setProfile] = useState<PlayerProfile>(getPlayerProfile());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());

  const handleProfileUpdate = () => {
    setProfile(getPlayerProfile());
  };

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundFx.playClick();
    }
  };

  return (
    <div className="min-h-screen bg-[#070e1d] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          soundFx.playClick();
          setCurrentTab(tab);
        }}
        playerLevel={profile.level}
        vitalityCoins={profile.vitalityCoins}
        onOpenProfile={() => setIsProfileOpen(true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'home' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Hero Section */}
            <section className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Hero Text (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider">
                    <span>GAME EDUKASI KESEHATAN VITAL</span>
                    <span aria-hidden="true">·</span>
                    <span>STANDAR GIZI KLINIS</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight text-balance leading-tight">
                    Jadilah Pahlawan Bagi Tubuhmu Sendiri
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                    Pelajari biologi kekebalan tubuh, rahasia piring gizi seimbang, mitos medis populer, dan simulasi keputusan 24 jam dengan cara yang seru, interaktif, dan aplikatif.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setCurrentTab('immune_defender');
                      }}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-950" />
                      <span>Mainkan Pertahanan Sel Imun</span>
                    </button>
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setCurrentTab('nutri_plate');
                      }}
                      className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-sm transition-all border border-slate-700 flex items-center gap-2"
                    >
                      <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
                      <span>Tantangan Piring Gizi</span>
                    </button>
                  </div>
                </div>

                {/* Right Hero Visual Banner (5 cols) */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl">
                    <img
                      src="/src/assets/images/health_hero_avatar_1792478030880.jpg"
                      alt="Pahlawan Kesehatan VitaHero"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                      <div className="text-xs">
                        <span className="text-emerald-300 font-bold block">{profile.name}</span>
                        <span className="text-slate-300">Level {profile.level} · {profile.vitalityCoins} Vitality Points</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 Interactive Game Modes Grid */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Arena Game & Tantangan Interaktif
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pilih petualangan kesehatan untuk mengasah refleks, wawasan nutrisi, dan pemahaman klinis.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Pertahanan Sel Imun */}
                <div
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentTab('immune_defender');
                  }}
                  className="group cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all shadow-md flex flex-col justify-between"
                >
                  <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                    <img
                      src="/src/assets/images/immune_defender_backdrop_1792478030398.jpg"
                      alt="Arena Pertahanan Sel Imun"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        Aksi Pertahanan 2D
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        Pertahanan Sel Imun (Immune Defender)
                      </h3>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                        Kendalikan sel darah putih (Leukosit Prima) untuk membasmi virus flu, bakteri patogen, dan radikal bebas sebelum merusak jantung dan organ vital.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Skor Terbaik: <strong className="text-emerald-400 font-mono tabular-nums">{profile.highScores.immuneDefender}</strong>
                      </span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Mulai Main</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. NutriPlate Piring Sehat */}
                <div
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentTab('nutri_plate');
                  }}
                  className="group cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all shadow-md flex flex-col justify-between"
                >
                  <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                    <img
                      src="/src/assets/images/nutri_plate_showcase_1792478030548.jpg"
                      alt="NutriPlate Piring Sehat"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      <span className="text-xs font-semibold text-sky-300 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-sky-500/30">
                        Simulasi Nutrisi Klinis
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        NutriPlate: Isi Piringku Sehat
                      </h3>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                        Praktekkan standar porsi gizi Kemenkes RI untuk memenuhi kebutuhan diet pasien nyata dan singkirkan makanan ultra-processed berbahaya.
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Skor Terbaik: <strong className="text-emerald-400 font-mono tabular-nums">{profile.highScores.nutriPlate}</strong>
                      </span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Mulai Main</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Kuis Mitos vs Fakta Medis */}
                <div
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentTab('myth_quiz');
                  }}
                  className="group cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-amber-400 tracking-wider block mb-1">
                      TRIVIA MEDIS & DETEKTIF MITOS
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                      Kuis Mitos vs Fakta Kesehatan
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      Benarkah air es bikin buncit? Apakah ikan kembung kalah dari salmon? Uji kebenaran mitos-mitos yang sering beredar dengan penjelasan dokter.
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Skor Terbaik: <strong className="text-amber-300 font-mono tabular-nums">{profile.highScores.mythQuiz}</strong>
                    </span>
                    <span className="text-amber-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Mulai Kuis</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* 4. Simulator Hidup 24 Jam */}
                <div
                  onClick={() => {
                    soundFx.playClick();
                    setCurrentTab('life_sim');
                  }}
                  className="group cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                      <Activity className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-purple-400 tracking-wider block mb-1">
                      SIMULATOR KEPUTUSAN HARIAN
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      Simulator Hidup: 24 Jam Pilihan Vital
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      Hadapi pilihan nyata dari bangun tidur, sarapan, deadline kantor, hingga malam hari. Jaga keseimbangan 4 pilar vitalitas tubuhmu!
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Vitalitas Terbaik: <strong className="text-purple-300 font-mono tabular-nums">{profile.highScores.lifeSim}%</strong>
                    </span>
                    <span className="text-purple-400 font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Mulai Simulasi</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Daily Real-World Habit Tracker */}
            <section>
              <HabitQuestTracker onProfileUpdate={handleProfileUpdate} />
            </section>

            {/* Bottom Strip: Encyclopedia Teaser */}
            <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Ensiklopedia Anatomi & Superfood
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ketahui cara menjaga Jantung, Paru-paru, Mikrobioma Usus, dan Otak tetap awet muda.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setCurrentTab('encyclopedia');
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 whitespace-nowrap transition-colors"
              >
                Buka Ensiklopedia
              </button>
            </section>
          </div>
        )}

        {/* Tab Components */}
        {currentTab === 'immune_defender' && (
          <ImmuneDefender
            onBackToHome={() => setCurrentTab('home')}
            onProfileUpdate={handleProfileUpdate}
          />
        )}

        {currentTab === 'nutri_plate' && (
          <NutriPlateGame
            onBackToHome={() => setCurrentTab('home')}
            onProfileUpdate={handleProfileUpdate}
          />
        )}

        {currentTab === 'myth_quiz' && (
          <HealthQuiz
            onBackToHome={() => setCurrentTab('home')}
            onProfileUpdate={handleProfileUpdate}
          />
        )}

        {currentTab === 'life_sim' && (
          <LifeChoiceSimulator
            onBackToHome={() => setCurrentTab('home')}
            onProfileUpdate={handleProfileUpdate}
          />
        )}

        {currentTab === 'habits' && (
          <div className="max-w-4xl mx-auto py-6">
            <HabitQuestTracker onProfileUpdate={handleProfileUpdate} />
          </div>
        )}

        {currentTab === 'encyclopedia' && <HealthEncyclopedia />}
      </main>

      {/* Profile & Achievements Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onProfileUpdate={handleProfileUpdate}
      />

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>VitaHero: Petualangan Edukasi Kesehatan & Gaya Hidup Sehat</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Pedoman Klinis Gizi & Imunitas</span>
            <span>·</span>
            <span>Kemenkes RI Standar Isi Piringku</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
