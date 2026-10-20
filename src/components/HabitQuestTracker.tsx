import React, { useState } from 'react';
import { getPlayerProfile, savePlayerProfile, addXPAndCoins, unlockAchievement } from '../utils/storage';
import { soundFx } from '../utils/soundEffects';
import { Droplet, Check, Plus, Minus, Flame, Sparkles } from 'lucide-react';

interface HabitQuestTrackerProps {
  onProfileUpdate: () => void;
}

interface DailyQuest {
  id: string;
  title: string;
  desc: string;
  rewardXP: number;
  rewardCoins: number;
  icon: string;
}

const DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'habit_stretch',
    title: 'Peregangan Otot & Postur 5 Menit',
    desc: 'Lakukan peregangan leher, punggung, dan pergelangan tangan untuk mengurangi ketegangan kaku seharian.',
    rewardXP: 30,
    rewardCoins: 10,
    icon: '🧘',
  },
  {
    id: 'habit_steps',
    title: 'Target Langkah Aktif (Minimal 6.000 Langkah)',
    desc: 'Bakar kalori non-latihan dan tingkatkan sirkulasi darah pembuluh vena tungkai.',
    rewardXP: 50,
    rewardCoins: 15,
    icon: '👟',
  },
  {
    id: 'habit_greens',
    title: 'Konsumsi 2 Porsi Sayur / Buah Segar',
    desc: 'Penuhi kebutuhan serat pangan, vitamin C alami, dan mikronutrien harian tubuh.',
    rewardXP: 40,
    rewardCoins: 10,
    icon: '🥗',
  },
  {
    id: 'habit_screen_break',
    title: 'Praktikkan Aturan 20-20-20 untuk Mata',
    desc: 'Setiap 20 menit menatap layar gawai, istirahatkan mata menatap objek jauh selama 20 detik.',
    rewardXP: 30,
    rewardCoins: 10,
    icon: '👀',
  },
  {
    id: 'habit_sleep',
    title: 'Tidur Berkualitas Minimal 7 Jam',
    desc: 'Beri waktu sistem imun memproduksi sitokin pelindung dan otak membersihkan sisa metabolit.',
    rewardXP: 60,
    rewardCoins: 20,
    icon: '🌙',
  },
];

export const HabitQuestTracker: React.FC<HabitQuestTrackerProps> = ({ onProfileUpdate }) => {
  const [profile, setProfile] = useState(getPlayerProfile());

  const handleAddWater = () => {
    soundFx.playCollect();
    const nextGlasses = Math.min(8, (profile.waterGlasses || 0) + 1);
    const updated = { ...profile, waterGlasses: nextGlasses };
    savePlayerProfile(updated);
    setProfile(updated);

    if (nextGlasses === 8) {
      soundFx.playSuccess();
      addXPAndCoins(100, 25);
      unlockAchievement('hydration_champ');
    }
    onProfileUpdate();
  };

  const handleRemoveWater = () => {
    if ((profile.waterGlasses || 0) <= 0) return;
    soundFx.playClick();
    const nextGlasses = Math.max(0, (profile.waterGlasses || 0) - 1);
    const updated = { ...profile, waterGlasses: nextGlasses };
    savePlayerProfile(updated);
    setProfile(updated);
    onProfileUpdate();
  };

  const handleToggleQuest = (quest: DailyQuest) => {
    const isCompleted = !!profile.completedHabitsToday?.[quest.id];
    soundFx.playClick();

    const updatedCompleted = { ...profile.completedHabitsToday };
    if (!isCompleted) {
      updatedCompleted[quest.id] = true;
      soundFx.playSuccess();
      addXPAndCoins(quest.rewardXP, quest.rewardCoins);
    } else {
      delete updatedCompleted[quest.id];
    }

    const updated = { ...profile, completedHabitsToday: updatedCompleted };
    savePlayerProfile(updated);
    setProfile(updated);
    onProfileUpdate();
  };

  const waterCount = profile.waterGlasses || 0;
  const completedCount = Object.keys(profile.completedHabitsToday || {}).length;

  return (
    <div className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-400" />
            <span>Misi Kebiasaan Sehat Harian</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Jalankan kebiasaan nyata di dunia sehari-hari untuk klaim XP dan Vitality Points pahlawanmu.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">Tuntas Hari Ini:</span>
          <span className="font-bold text-emerald-400 font-mono tabular-nums">
            {completedCount}/{DAILY_QUESTS.length} Misi
          </span>
        </div>
      </div>

      {/* Water Intake Section */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-sky-400 fill-sky-400" />
            <div>
              <h4 className="text-xs font-bold text-white">Target Hidrasi: 8 Gelas Air (2 Liter)</h4>
              <span className="text-[11px] text-slate-400">
                Penuhi hidrasi seluler untuk konsentrasi dan filtrasi ginjal optimal.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRemoveWater}
              disabled={waterCount === 0}
              aria-label="Kurangi 1 gelas"
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white flex items-center justify-center text-xs transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-bold font-mono text-sky-400 px-2 tabular-nums">
              {waterCount}/8
            </span>
            <button
              onClick={handleAddWater}
              disabled={waterCount === 8}
              aria-label="Tambah 1 gelas"
              className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-30 text-slate-950 flex items-center justify-center text-xs font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 8 Glass Visual Indicator */}
        <div className="grid grid-cols-8 gap-2 mt-2">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isFilled = idx < waterCount;
            return (
              <div
                key={idx}
                className={`h-10 rounded-lg border flex items-center justify-center transition-all ${
                  isFilled
                    ? 'bg-sky-500/20 border-sky-400 text-sky-400 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-700'
                }`}
              >
                <Droplet className={`w-4 h-4 ${isFilled ? 'fill-sky-400' : ''}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Habit Quests List */}
      <div className="space-y-3">
        {DAILY_QUESTS.map((quest) => {
          const isDone = !!profile.completedHabitsToday?.[quest.id];
          return (
            <div
              key={quest.id}
              onClick={() => handleToggleQuest(quest)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-lg bg-slate-900">{quest.icon}</span>
                <div>
                  <h4 className={`text-xs font-bold ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                    {quest.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {quest.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-amber-300 font-mono">
                  +{quest.rewardXP} XP
                </span>
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                      : 'border-slate-700 bg-slate-900 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
