import { PlayerProfile, Achievement } from '../types/game';

const STORAGE_KEY = 'vitahero_player_profile';

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Pejuang Sehat',
  avatar: 'hero_avatar',
  level: 1,
  xp: 0,
  vitalityCoins: 50,
  highScores: {
    immuneDefender: 0,
    nutriPlate: 0,
    mythQuiz: 0,
    lifeSim: 0,
  },
  achievements: [],
  completedHabitsToday: {},
  waterGlasses: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_defense',
    title: 'Garda Terdepan Sel',
    description: 'Selesaikan gelombang pertama di Pertahanan Sel Imun.',
    icon: '🛡️',
    rewardXP: 100,
    unlocked: false,
  },
  {
    id: 'virus_buster',
    title: 'Penakluk Virus',
    description: 'Kalahkan total 50 patogen jahat dalam game pertahanan tubuh.',
    icon: '🦠',
    rewardXP: 250,
    unlocked: false,
  },
  {
    id: 'master_chef_gizi',
    title: 'Pakar Piring Sehat',
    description: 'Selesaikan pesanan gizi seimbang dengan skor sempurna di NutriPlate.',
    icon: '🥗',
    rewardXP: 150,
    unlocked: false,
  },
  {
    id: 'myth_slayer',
    title: 'Detektif Mitos Medis',
    description: 'Jawab benar 5 pertanyaan berturut-turut di Kuis Kesehatan.',
    icon: '💡',
    rewardXP: 200,
    unlocked: false,
  },
  {
    id: 'vital_day',
    title: 'Siklus Harmonis',
    description: 'Selesaikan 24 Jam Simulator Hidup dengan skor vitalitas di atas 70%.',
    icon: '⚡',
    rewardXP: 200,
    unlocked: false,
  },
  {
    id: 'hydration_champ',
    title: 'Juara Hidrasi',
    description: 'Penuhi target minum 8 gelas air dalam satu hari.',
    icon: '💧',
    rewardXP: 150,
    unlocked: false,
  },
];

export function getPlayerProfile(): PlayerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];
    
    // Reset daily habits if it's a new day
    if (parsed.lastActiveDate !== today) {
      parsed.completedHabitsToday = {};
      parsed.waterGlasses = 0;
      parsed.lastActiveDate = today;
      savePlayerProfile(parsed);
    }
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function savePlayerProfile(profile: PlayerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile', err);
  }
}

export function addXPAndCoins(xpGained: number, coinsGained: number): { profile: PlayerProfile; leveledUp: boolean } {
  const profile = getPlayerProfile();
  const oldLevel = profile.level;
  
  profile.xp += xpGained;
  profile.vitalityCoins += coinsGained;
  
  // Calculate new level (every 200 XP = 1 level)
  const newLevel = Math.floor(profile.xp / 200) + 1;
  const leveledUp = newLevel > oldLevel;
  profile.level = newLevel;

  savePlayerProfile(profile);
  return { profile, leveledUp };
}

export function updateHighScore(game: keyof PlayerProfile['highScores'], score: number): boolean {
  const profile = getPlayerProfile();
  if (score > profile.highScores[game]) {
    profile.highScores[game] = score;
    savePlayerProfile(profile);
    return true; // new high score
  }
  return false;
}

export function unlockAchievement(achievementId: string): boolean {
  const profile = getPlayerProfile();
  if (!profile.achievements.includes(achievementId)) {
    profile.achievements.push(achievementId);
    const target = ACHIEVEMENTS_LIST.find((a) => a.id === achievementId);
    if (target) {
      profile.xp += target.rewardXP;
      profile.level = Math.floor(profile.xp / 200) + 1;
    }
    savePlayerProfile(profile);
    return true;
  }
  return false;
}
