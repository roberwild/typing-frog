// Tipos para el juego Typing Frog

export type DifficultyLevel = 'principiante' | 'intermedio' | 'avanzado';

export type GameState = 'idle' | 'playing' | 'gameOver';

export interface GameStats {
  lives: number;
  currentPosition: number;
  correctChars: number;
  errors: number;
  medal: 'gold' | 'silver' | 'bronze' | null;
}

export interface TextsData {
  principiante: string[];
  intermedio: string[];
  avanzado: string[];
  beginner?: string[];
  intermediate?: string[];
  advanced?: string[];
}

export interface CharacterStatus {
  char: string;
  status: 'pending' | 'correct' | 'error' | 'corrected';
  index: number;
}

export interface GameConfig {
  maxLives: number;
  defaultLevel: DifficultyLevel;
}

export type FrogState = 'idle' | 'jumping' | 'shock' | 'recovering' | 'dead';

// Tipos para logros y persistencia - Fase 5
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  condition: AchievementCondition;
  reward?: AchievementReward;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  secret?: boolean;
}

export type AchievementCategory = 
  | 'speed' 
  | 'accuracy' 
  | 'endurance' 
  | 'consistency' 
  | 'exploration' 
  | 'master' 
  | 'special';

export interface AchievementCondition {
  type: 'single_game' | 'total_games' | 'streak' | 'special';
  metric: string; // 'wpm', 'accuracy', 'games_played', 'perfect_games', etc.
  value: number;
  operator: '=' | '>' | '>=' | '<' | '<=' | 'range';
  additional?: Record<string, any>;
}

export interface AchievementReward {
  type: 'cosmetic' | 'unlock' | 'title';
  item: string;
  description: string;
}

export interface PlayerStats {
  // Estadísticas totales
  totalGamesPlayed: number;
  totalGamesCompleted: number;
  totalCharactersTyped: number;
  totalErrors: number;
  totalTimeSpent: number; // en segundos
  
  // Récords personales
  bestWPM: number;
  bestAccuracy: number;
  longestStreak: number;
  fastestCompletion: number; // tiempo en segundos
  
  // Estadísticas por nivel
  principianteStats: LevelStats;
  intermedioStats: LevelStats;
  avanzadoStats: LevelStats;
  
  // Progresión
  level: number;
  experience: number;
  experienceToNext: number;
  
  // Logros
  achievements: string[]; // IDs de logros desbloqueados
  
  // Personalización desbloqueada
  unlockedCustomizations: string[];
  
  // Configuración personal
  preferences: PlayerPreferences;
  
  // Fechas importantes
  firstPlayDate: Date;
  lastPlayDate: Date;
}

export interface LevelStats {
  gamesPlayed: number;
  gamesCompleted: number;
  bestWPM: number;
  bestAccuracy: number;
  averageWPM: number;
  averageAccuracy: number;
  totalTimeSpent: number;
}

export interface PlayerPreferences {
  selectedFrogSkin: string;
  selectedTimeOfDay: 'auto' | 'morning' | 'afternoon' | 'night';
  soundEnabled: boolean;
  particlesEnabled: boolean;
  reducedMotion: boolean;
  colorBlindMode: boolean;
}

export interface GameSession {
  id: string;
  date: Date;
  level: DifficultyLevel;
  timeOfDay: string;
  duration: number;
  charactersTyped: number;
  errors: number;
  accuracy: number;
  wpm: number;
  completed: boolean;
  medalEarned?: 'gold' | 'silver' | 'bronze';
  achievementsUnlocked: string[];
}

export interface Customization {
  id: string;
  name: string;
  description: string;
  category: 'frog_skin' | 'time_theme' | 'particle_effect' | 'sound_pack';
  icon: string;
  unlockCondition?: string; // ID del achievement que lo desbloquea
  premium?: boolean;
}
