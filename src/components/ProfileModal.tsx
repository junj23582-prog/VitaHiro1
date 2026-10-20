import React, { useState } from 'react';
import { PlayerProfile, Achievement } from '../types/game';
import { ACHIEVEMENTS_LIST, savePlayerProfile } from '../utils/storage';
import { soundFx } from '../utils/soundEffects';
import { X, Award, Zap, Trophy, ShieldCheck, Heart, User, CheckCircle2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  onProfileUpdate: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);

  if (!isOpen) return null;

  const currentLevel = profile.level;
  const currentXP = profile.xp;
  const xpInCurrentLevel = currentXP % 200;
  const xpPercent = Math.min(100, (xpInCurrentLevel / 200) * 100);

  const handleSaveName = () => {
    soundFx.playClick();
    if (tempName.trim()) {
      const updated = { ...profile, name: tempName.trim() };
      savePlayerProfile(updated);
      onProfileUpdate();
    }
    setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Profil Pahlawan Kesehatan</h3>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            aria-label="Tutup"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Avatar & Level Summary Card */}
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-950 p-5 rounded-xl border border-slate-800">
            {/* Avatar Image */}
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-md shrink-0">
              <img
                src="/src/assets/images/health_hero_avatar_1792478030880.jpg"
                alt="Avatar Pahlawan Sehat"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name, Title, XP Bar */}
            <div className="flex-1 w-full text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-white"
                      maxLength={25}
                    />
                    <button
                      onClick={handleSaveName}
                      className="px-2 py-1 text-xs bg-emerald-500 text-slate-950 font-bold rounded"
                    >
                      Simpan
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{profile.name}</h4>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      (Ubah)
                    </button>
                  </div>
                )}
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs font-bold text-emerald-400">Level {currentLevel}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Kemajuan Level: {xpInCurrentLevel}/200 XP</span>
                <span className="font-mono text-amber-300 font-bold">{profile.vitalityCoins} Vitality Points</span>
              </div>

              {/* XP Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* High Scores Across Game Modes */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Rekor Skor Tertinggi</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Pertahanan Imun</span>
                <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                  {profile.highScores.immuneDefender}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Piring Nutrisi</span>
                <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                  {profile.highScores.nutriPlate}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Kuis Mitos</span>
                <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                  {profile.highScores.mythQuiz}
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Sim Vitalitas</span>
                <span className="text-base font-bold text-emerald-400 font-mono tabular-nums">
                  {profile.highScores.lifeSim}%
                </span>
              </div>
            </div>
          </div>

          {/* Medals & Achievements */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Pencapaian & Medali ({profile.achievements.length}/{ACHIEVEMENTS_LIST.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACHIEVEMENTS_LIST.map((ach) => {
                const isUnlocked = profile.achievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500 opacity-60'
                    }`}
                  >
                    <span className="text-2xl p-1.5 rounded-lg bg-slate-900 shrink-0">
                      {ach.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-bold">{ach.title}</h5>
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                        {ach.description}
                      </p>
                      <span className="text-[10px] font-mono text-amber-400 mt-1 block">
                        +{ach.rewardXP} XP
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
