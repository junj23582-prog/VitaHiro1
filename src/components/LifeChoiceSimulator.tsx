import React, { useState } from 'react';
import { SIM_SCENARIOS } from '../data/simScenarios';
import { SimChoice } from '../types/game';
import { soundFx } from '../utils/soundEffects';
import { addXPAndCoins, updateHighScore, unlockAchievement } from '../utils/storage';
import { Activity, BatteryCharging, Shield, HeartPulse, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';

interface LifeChoiceSimulatorProps {
  onBackToHome: () => void;
  onProfileUpdate: () => void;
}

export const LifeChoiceSimulator: React.FC<LifeChoiceSimulatorProps> = ({
  onBackToHome,
  onProfileUpdate,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stats, setStats] = useState({
    energy: 65,
    fitness: 60,
    immunity: 60,
    mental: 65,
  });
  const [selectedChoice, setSelectedChoice] = useState<SimChoice | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const scenario = SIM_SCENARIOS[currentStepIndex];

  const handleSelectChoice = (choice: SimChoice) => {
    if (selectedChoice) return;

    soundFx.playClick();
    setSelectedChoice(choice);

    // Apply impacts and clamp between 0 and 100
    setStats((prev) => ({
      energy: Math.max(5, Math.min(100, prev.energy + choice.impacts.energy)),
      fitness: Math.max(5, Math.min(100, prev.fitness + choice.impacts.fitness)),
      immunity: Math.max(5, Math.min(100, prev.immunity + choice.impacts.immunity)),
      mental: Math.max(5, Math.min(100, prev.mental + choice.impacts.mental)),
    }));
  };

  const handleNextStep = () => {
    soundFx.playClick();
    if (currentStepIndex >= SIM_SCENARIOS.length - 1) {
      // Calculate final average vitality score
      const finalVitality = Math.round(
        (stats.energy + stats.fitness + stats.immunity + stats.mental) / 4
      );
      setIsFinished(true);
      soundFx.playSuccess();
      updateHighScore('lifeSim', finalVitality);
      addXPAndCoins(150, 30);
      if (finalVitality >= 70) {
        unlockAchievement('vital_day');
      }
      onProfileUpdate();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedChoice(null);
    }
  };

  const handleRestart = () => {
    soundFx.playClick();
    setCurrentStepIndex(0);
    setStats({ energy: 65, fitness: 60, immunity: 60, mental: 65 });
    setSelectedChoice(null);
    setIsFinished(false);
  };

  const finalVitality = Math.round(
    (stats.energy + stats.fitness + stats.immunity + stats.mental) / 4
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Simulator Hidup: 24 Jam Pilihan Vital
            </h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-emerald-400 font-semibold tracking-wider">
              {scenario ? `FASE ${currentStepIndex + 1}/${SIM_SCENARIOS.length}` : 'SELESAI'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Setiap pilihan harian memengaruhi 4 pilar vitalitas: Energi, Kebugaran Fisik, Sistem Imunitas, dan Kesehatan Mental.
          </p>
        </div>
      </div>

      {/* 4 Vitality Gauges HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* Energi */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <BatteryCharging className="w-4 h-4" />
              <span>Energi Fisik</span>
            </div>
            <span className="font-bold font-mono text-white tabular-nums">{stats.energy}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-300"
              style={{ width: `${stats.energy}%` }}
            />
          </div>
        </div>

        {/* Kebugaran */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-sky-400 font-medium">
              <Activity className="w-4 h-4" />
              <span>Kebugaran Otot</span>
            </div>
            <span className="font-bold font-mono text-white tabular-nums">{stats.fitness}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-400 transition-all duration-300"
              style={{ width: `${stats.fitness}%` }}
            />
          </div>
        </div>

        {/* Imunitas */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Shield className="w-4 h-4" />
              <span>Ketahanan Imun</span>
            </div>
            <span className="font-bold font-mono text-white tabular-nums">{stats.immunity}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${stats.immunity}%` }}
            />
          </div>
        </div>

        {/* Ketenangan Mental */}
        <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-purple-400 font-medium">
              <HeartPulse className="w-4 h-4" />
              <span>Ketenangan Jiwa</span>
            </div>
            <span className="font-bold font-mono text-white tabular-nums">{stats.mental}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-400 transition-all duration-300"
              style={{ width: `${stats.mental}%` }}
            />
          </div>
        </div>
      </div>

      {!isFinished ? (
        /* Active Scenario Card */
        <div className="bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          {/* Time & Situation */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className="text-xl">{scenario.contextIcon}</span>
            <span className="font-bold text-emerald-400 font-mono">{scenario.timeLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{scenario.scenarioTitle}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
            {scenario.situation}
          </h3>

          {/* Choices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {scenario.choices.map((choice, idx) => {
              const isSelected = selectedChoice === choice;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectChoice(choice)}
                  disabled={selectedChoice !== null}
                  className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg'
                      : selectedChoice !== null
                      ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 hover:border-emerald-500/50 text-slate-200'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-semibold mb-4 leading-relaxed">
                    {choice.text}
                  </span>

                  {/* Impact preview */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 pt-3 border-t border-slate-800/60">
                    <span className={choice.impacts.energy >= 0 ? 'text-amber-400' : 'text-rose-400'}>
                      Energi {choice.impacts.energy >= 0 ? `+${choice.impacts.energy}` : choice.impacts.energy}
                    </span>
                    <span>·</span>
                    <span className={choice.impacts.fitness >= 0 ? 'text-sky-400' : 'text-rose-400'}>
                      Kebugaran {choice.impacts.fitness >= 0 ? `+${choice.impacts.fitness}` : choice.impacts.fitness}
                    </span>
                    <span>·</span>
                    <span className={choice.impacts.immunity >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      Imunitas {choice.impacts.immunity >= 0 ? `+${choice.impacts.immunity}` : choice.impacts.immunity}
                    </span>
                    <span>·</span>
                    <span className={choice.impacts.mental >= 0 ? 'text-purple-400' : 'text-rose-400'}>
                      Pikiran {choice.impacts.mental >= 0 ? `+${choice.impacts.mental}` : choice.impacts.mental}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Outcome Story Debrief */}
          {selectedChoice && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6">
              <span className="text-xs font-bold text-emerald-400 block mb-1">
                DAMPAK FISIOLOGIS TUBUH:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedChoice.outcomeStory}
              </p>
            </div>
          )}

          {/* Next Button */}
          {selectedChoice && (
            <button
              onClick={handleNextStep}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>{currentStepIndex < SIM_SCENARIOS.length - 1 ? 'Lanjut ke Waktu Berikutnya' : 'Evaluasi Siklus 24 Jam'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Summary & Evaluation View */
        <div className="bg-slate-900/80 rounded-2xl p-8 border border-slate-800 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Siklus 24 Jam Berhasil Diselesaikan!
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            Hasil diagnosis gaya hidup berdasarkan keputusan yang kamu ambil sepanjang hari:
          </p>

          <div className="max-w-md mx-auto bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-6 text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <span className="text-sm font-semibold text-slate-300">Indeks Vitalitas Keseluruhan</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">{finalVitality}%</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <strong>Kondisi Tubuh:</strong>{' '}
                {finalVitality >= 80
                  ? 'Tubuh dalam kondisi PRIMA optimal! Regenerasi seluler berlangsung lancar dan ritme sirkadian seimbang.'
                  : finalVitality >= 60
                  ? 'Kondisi tubuh BAIK namun ada celah kelelahan pada jam sibuk yang perlu diseimbangkan dengan hidrasi dan jeda gerak.'
                  : 'Peringatan: Pola pilihan menunjukkan risiko kelelahan kronis dan stres oksidatif tinggi. Prioritaskan tidur dan kurangi makanan olahan.'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mulai Ulang Siklus Hari</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                onBackToHome();
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs sm:text-sm transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
