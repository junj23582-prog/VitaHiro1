import React, { useState } from 'react';
import { ORGAN_GUIDES, OrganGuide } from '../data/encyclopediaData';
import { soundFx } from '../utils/soundEffects';
import { BookOpen, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const HealthEncyclopedia: React.FC = () => {
  const [selectedOrgan, setSelectedOrgan] = useState<OrganGuide>(ORGAN_GUIDES[0]);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Ensiklopedia Anatomi & Panduan Vital
            </h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-400 font-semibold tracking-wider">
              SAINS TUBUH MANUSIA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pelajari peran biologis organ vital, makanan super pendukung, dan musuh metabolik yang harus dihindari.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Organ Selector (4 cols) */}
        <div className="md:col-span-4 space-y-2">
          {ORGAN_GUIDES.map((organ) => {
            const isSelected = selectedOrgan.id === organ.id;
            return (
              <button
                key={organ.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedOrgan(organ);
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-lg bg-slate-950">{organ.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{organ.name}</h4>
                    <span className="text-[11px] text-slate-400 italic block">{organ.latinName}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Organ Deep Dive Details (8 cols) */}
        <div className="md:col-span-8 bg-slate-900/80 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <div className="flex items-start gap-4 mb-4 pb-4 border-b border-slate-800">
            <span className="text-4xl p-3 rounded-2xl bg-slate-950 shrink-0">
              {selectedOrgan.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{selectedOrgan.name}</h3>
                <span className="text-xs text-slate-500 font-mono">({selectedOrgan.latinName})</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {selectedOrgan.role}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Health Rules */}
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Prinsip Perlindungan & Perawatan Harian</span>
              </h4>
              <ul className="space-y-2">
                {selectedOrgan.healthRules.map((rule, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Superfoods */}
            <div>
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Superfood & Nutrisi Kunci</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedOrgan.superFoods.map((food, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                    {food}
                  </div>
                ))}
              </div>
            </div>

            {/* Enemies / Dangers */}
            <div>
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Faktor Risiko & Musuh Utama</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedOrgan.enemies.map((enemy, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                    {enemy}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
