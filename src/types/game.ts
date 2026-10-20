export type GameTab = 
  | 'home' 
  | 'immune_defender' 
  | 'nutri_plate' 
  | 'myth_quiz' 
  | 'life_sim' 
  | 'habits' 
  | 'encyclopedia';

export interface PlayerProfile {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  vitalityCoins: number;
  highScores: {
    immuneDefender: number;
    nutriPlate: number;
    mythQuiz: number;
    lifeSim: number;
  };
  achievements: string[];
  completedHabitsToday: Record<string, boolean>;
  waterGlasses: number;
  lastActiveDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardXP: number;
  unlocked: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  type: 'myth_or_fact' | 'multiple_choice';
  isFact?: boolean;
  options?: string[];
  correctAnswer: number | boolean;
  explanation: string;
  category: 'Nutrisi' | 'Kebugaran' | 'Imunitas' | 'Pola Tidur' | 'Pertolongan Pertama' | 'Kesehatan Mental';
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'karbohidrat' | 'sayuran' | 'protein' | 'buah' | 'junk_warning';
  calories: number;
  benefits: string;
  isSuperfood?: boolean;
  penaltyWarning?: string;
  icon: string;
}

export interface MealOrder {
  id: string;
  patientName: string;
  condition: string;
  description: string;
  requiredCarbs: number; // target items
  requiredVeggies: number;
  requiredProtein: number;
  requiredFruit: number;
  maxJunkAllowed: number;
  targetCalories: number;
  timeLimitSeconds: number;
}

export interface SimChoice {
  text: string;
  impacts: {
    energy: number;
    fitness: number;
    immunity: number;
    mental: number;
  };
  outcomeStory: string;
}

export interface SimScenario {
  id: number;
  timeLabel: string;
  scenarioTitle: string;
  situation: string;
  contextIcon: string;
  choices: [SimChoice, SimChoice];
}
