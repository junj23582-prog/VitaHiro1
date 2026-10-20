import React from 'react';
import { GameTab } from '../types/game';
import { soundFx } from '../utils/soundEffects';
import { Volume2, VolumeX, Shield, Award } from 'lucide-react';

interface NavbarProps {
  currentTab: GameTab;
  onSelectTab: (tab: GameTab) => void;
  playerLevel: number;
  vitalityCoins: number;
  onOpenProfile: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  playerLevel,
  vitalityCoins,
  onOpenProfile,
  isMuted,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (One single text element) */}
        <button
          onClick={() => {
            soundFx.playClick();
            onSelectTab('home');
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-black text-lg shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
            Vita<span className="text-emerald-400">Hero</span>
          </span>
        </button>

        {/* Zone 2: 4-5 Clean Nav Links (Single line, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectTab('home');
            }}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentTab === 'home'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectTab('immune_defender');
            }}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentTab === 'immune_defender'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Pertahanan Imun
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectTab('nutri_plate');
            }}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentTab === 'nutri_plate'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Piring Gizi
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectTab('myth_quiz');
            }}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentTab === 'myth_quiz'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Kuis Mitos
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectTab('life_sim');
            }}
            className={`whitespace-nowrap transition-colors py-1 ${
              currentTab === 'life_sim'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            Simulator Hidup
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & Status */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {/* Player Badge / Profile CTA */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Pahlawan Lv.{playerLevel}</span>
            <span className="text-slate-400">·</span>
            <span className="font-mono text-amber-300">{vitalityCoins} VP</span>
          </button>
        </div>
      </div>
    </header>
  );
};
