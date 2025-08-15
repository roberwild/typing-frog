import { Achievement } from '@/types/game';

// Base de datos de logros para Typing Frog - Fase 5
export const ACHIEVEMENTS: Achievement[] = [
  // === CATEGORÍA: VELOCIDAD ===
  {
    id: 'speed_novice',
    name: 'Velocista Novato',
    description: 'Alcanza 20 PPM en una partida',
    icon: '🚀',
    category: 'speed',
    condition: {
      type: 'single_game',
      metric: 'wpm',
      value: 20,
      operator: '>='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_green',
      description: 'Rana Verde Básica'
    },
    unlocked: false
  },
  {
    id: 'speed_intermediate',
    name: 'Tecleador Rápido',
    description: 'Alcanza 40 PPM en una partida',
    icon: '⚡',
    category: 'speed',
    condition: {
      type: 'single_game',
      metric: 'wpm',
      value: 40,
      operator: '>='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_blue',
      description: 'Rana Azul Velocista'
    },
    unlocked: false
  },
  {
    id: 'speed_expert',
    name: 'Dedos de Luz',
    description: 'Alcanza 60 PPM en una partida',
    icon: '💫',
    category: 'speed',
    condition: {
      type: 'single_game',
      metric: 'wpm',
      value: 60,
      operator: '>='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_gold',
      description: 'Rana Dorada Legendaria'
    },
    unlocked: false
  },
  {
    id: 'speed_master',
    name: 'Maestro del Teclado',
    description: 'Alcanza 80 PPM en una partida',
    icon: '👑',
    category: 'speed',
    condition: {
      type: 'single_game',
      metric: 'wpm',
      value: 80,
      operator: '>='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_rainbow',
      description: 'Rana Arcoíris Mítica'
    },
    unlocked: false
  },

  // === CATEGORÍA: PRECISIÓN ===
  {
    id: 'accuracy_good',
    name: 'Precisión Decente',
    description: 'Logra 90% de precisión en una partida',
    icon: '🎯',
    category: 'accuracy',
    condition: {
      type: 'single_game',
      metric: 'accuracy',
      value: 90,
      operator: '>='
    },
    reward: {
      type: 'unlock',
      item: 'time_theme_sunset',
      description: 'Tema Atardecer'
    },
    unlocked: false
  },
  {
    id: 'accuracy_excellent',
    name: 'Francotirador',
    description: 'Logra 95% de precisión en una partida',
    icon: '🏹',
    category: 'accuracy',
    condition: {
      type: 'single_game',
      metric: 'accuracy',
      value: 95,
      operator: '>='
    },
    reward: {
      type: 'unlock',
      item: 'particle_effect_stars',
      description: 'Efecto de Estrellas'
    },
    unlocked: false
  },
  {
    id: 'accuracy_perfect',
    name: 'Perfección Absoluta',
    description: 'Logra 100% de precisión en una partida',
    icon: '💎',
    category: 'accuracy',
    condition: {
      type: 'single_game',
      metric: 'accuracy',
      value: 100,
      operator: '='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_diamond',
      description: 'Rana de Diamante'
    },
    unlocked: false,
    secret: true
  },

  // === CATEGORÍA: RESISTENCIA ===
  {
    id: 'endurance_fighter',
    name: 'Luchador Tenaz',
    description: 'Completa 10 partidas',
    icon: '💪',
    category: 'endurance',
    condition: {
      type: 'total_games',
      metric: 'games_completed',
      value: 10,
      operator: '>='
    },
    reward: {
      type: 'unlock',
      item: 'sound_pack_nature',
      description: 'Pack de Sonidos Naturaleza'
    },
    unlocked: false
  },
  {
    id: 'endurance_warrior',
    name: 'Guerrero Incansable',
    description: 'Completa 50 partidas',
    icon: '⚔️',
    category: 'endurance',
    condition: {
      type: 'total_games',
      metric: 'games_completed',
      value: 50,
      operator: '>='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_warrior',
      description: 'Rana Guerrera'
    },
    unlocked: false
  },
  {
    id: 'endurance_legend',
    name: 'Leyenda Viviente',
    description: 'Completa 100 partidas',
    icon: '🏆',
    category: 'endurance',
    condition: {
      type: 'total_games',
      metric: 'games_completed',
      value: 100,
      operator: '>='
    },
    reward: {
      type: 'title',
      item: 'legend_title',
      description: 'Título: Leyenda del Teclado'
    },
    unlocked: false
  },

  // === CATEGORÍA: CONSISTENCIA ===
  {
    id: 'consistency_streak3',
    name: 'En Racha',
    description: 'Gana 3 partidas seguidas',
    icon: '🔥',
    category: 'consistency',
    condition: {
      type: 'streak',
      metric: 'win_streak',
      value: 3,
      operator: '>='
    },
    reward: {
      type: 'unlock',
      item: 'particle_effect_fire',
      description: 'Efecto de Fuego'
    },
    unlocked: false
  },
  {
    id: 'consistency_streak7',
    name: 'Imparable',
    description: 'Gana 7 partidas seguidas',
    icon: '🌟',
    category: 'consistency',
    condition: {
      type: 'streak',
      metric: 'win_streak',
      value: 7,
      operator: '>='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_star',
      description: 'Rana Estelar'
    },
    unlocked: false
  },

  // === CATEGORÍA: EXPLORACIÓN ===
  {
    id: 'exploration_all_levels',
    name: 'Explorador Completo',
    description: 'Completa al menos una partida en cada nivel',
    icon: '🗺️',
    category: 'exploration',
    condition: {
      type: 'special',
      metric: 'all_levels_completed',
      value: 1,
      operator: '>='
    },
    reward: {
      type: 'unlock',
      item: 'time_theme_all',
      description: 'Todos los Temas de Tiempo'
    },
    unlocked: false
  },
  {
    id: 'exploration_all_times',
    name: 'Viajero del Tiempo',
    description: 'Juega en los 3 momentos del día',
    icon: '⏰',
    category: 'exploration',
    condition: {
      type: 'special',
      metric: 'all_times_played',
      value: 1,
      operator: '>='
    },
    reward: {
      type: 'unlock',
      item: 'time_control',
      description: 'Control Manual del Tiempo'
    },
    unlocked: false
  },

  // === CATEGORÍA: MAESTRÍA ===
  {
    id: 'master_gold_collector',
    name: 'Coleccionista de Oro',
    description: 'Obtén 10 medallas de oro',
    icon: '🥇',
    category: 'master',
    condition: {
      type: 'total_games',
      metric: 'gold_medals',
      value: 10,
      operator: '>='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_golden_master',
      description: 'Rana Maestro Dorado'
    },
    unlocked: false
  },
  {
    id: 'master_speed_demon',
    name: 'Demonio de la Velocidad',
    description: 'Promedio de 50+ PPM en 20 partidas',
    icon: '😈',
    category: 'master',
    condition: {
      type: 'special',
      metric: 'average_wpm_games',
      value: 50,
      operator: '>=',
      additional: { min_games: 20 }
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_demon',
      description: 'Rana Demonio'
    },
    unlocked: false,
    secret: true
  },

  // === CATEGORÍA: ESPECIALES ===
  {
    id: 'special_first_play',
    name: 'Primera Vez',
    description: 'Completa tu primera partida',
    icon: '🎉',
    category: 'special',
    condition: {
      type: 'single_game',
      metric: 'first_completion',
      value: 1,
      operator: '='
    },
    reward: {
      type: 'unlock',
      item: 'welcome_gift',
      description: 'Regalo de Bienvenida'
    },
    unlocked: false
  },
  {
    id: 'special_night_owl',
    name: 'Búho Nocturno',
    description: 'Juega 10 partidas en modo noche',
    icon: '🦉',
    category: 'special',
    condition: {
      type: 'special',
      metric: 'night_games',
      value: 10,
      operator: '>='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_owl',
      description: 'Rana Búho'
    },
    unlocked: false
  },
  {
    id: 'special_early_bird',
    name: 'Madrugador',
    description: 'Juega 10 partidas en modo mañana',
    icon: '🐦',
    category: 'special',
    condition: {
      type: 'special',
      metric: 'morning_games',
      value: 10,
      operator: '>='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_bird',
      description: 'Rana Pájaro'
    },
    unlocked: false
  },
  {
    id: 'special_zen_master',
    name: 'Maestro Zen',
    description: 'Completa una partida sin errores en modo principiante',
    icon: '🧘',
    category: 'special',
    condition: {
      type: 'special',
      metric: 'perfect_beginner_game',
      value: 1,
      operator: '>='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_zen',
      description: 'Rana Zen'
    },
    unlocked: false
  },
  {
    id: 'special_secret_master',
    name: '???',
    description: 'Logro secreto - ¡Descúbrelo jugando!',
    icon: '❓',
    category: 'special',
    condition: {
      type: 'special',
      metric: 'secret_condition',
      value: 1,
      operator: '>='
    },
    reward: {
      type: 'cosmetic',
      item: 'frog_skin_mystery',
      description: 'Rana Misteriosa'
    },
    unlocked: false,
    secret: true
  }
];

// Función para obtener logros por categoría
export const getAchievementsByCategory = (category: string): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.category === category);
};

// Función para obtener logros secretos
export const getSecretAchievements = (): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => achievement.secret === true);
};

// Función para obtener logros desbloqueables
export const getUnlockableAchievements = (): Achievement[] => {
  return ACHIEVEMENTS.filter(achievement => !achievement.secret);
};

// Experiencia otorgada por cada logro según categoría
export const ACHIEVEMENT_XP_REWARDS: Record<string, number> = {
  speed: 100,
  accuracy: 150,
  endurance: 200,
  consistency: 175,
  exploration: 125,
  master: 300,
  special: 250
};

// Función para calcular XP de un logro
export const getAchievementXP = (achievement: Achievement): number => {
  return ACHIEVEMENT_XP_REWARDS[achievement.category] || 100;
};
