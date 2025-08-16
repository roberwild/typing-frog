import { useState, useEffect, useCallback } from 'react';
import { 
  PlayerStats, 
  GameSession, 
  Achievement, 
  DifficultyLevel,
  LevelStats,
  PlayerPreferences
} from '@/types/game';
import { ACHIEVEMENTS, getAchievementXP } from '@/data/achievements';

// Hook principal para gestionar datos del jugador - Fase 5
export const usePlayerData = () => {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Estadísticas iniciales por defecto
  const createDefaultStats = (): PlayerStats => {
    const defaultLevelStats: LevelStats = {
      gamesPlayed: 0,
      gamesCompleted: 0,
      bestWPM: 0,
      bestAccuracy: 0,
      averageWPM: 0,
      averageAccuracy: 0,
      totalTimeSpent: 0
    };

    const defaultPreferences: PlayerPreferences = {
      selectedFrogSkin: 'default',
      selectedTimeOfDay: 'auto',
      soundEnabled: true,
      particlesEnabled: true,
      reducedMotion: false,
      colorBlindMode: false
    };

    return {
      totalGamesPlayed: 0,
      totalGamesCompleted: 0,
      totalCharactersTyped: 0,
      totalErrors: 0,
      totalTimeSpent: 0,
      bestWPM: 0,
      bestAccuracy: 0,
      longestStreak: 0,
      fastestCompletion: 0,
      principianteStats: { ...defaultLevelStats },
      intermedioStats: { ...defaultLevelStats },
      avanzadoStats: { ...defaultLevelStats },
      level: 1,
      experience: 0,
      experienceToNext: 1000,
      achievements: [],
      unlockedCustomizations: ['default'],
      preferences: defaultPreferences,
      firstPlayDate: new Date(),
      lastPlayDate: new Date()
    };
  };

  // Cargar datos desde localStorage
  const loadPlayerData = useCallback(() => {
    try {
      const savedStats = localStorage.getItem('typing_frog_player_stats');
      const savedAchievements = localStorage.getItem('typing_frog_achievements');

      if (savedStats) {
        const stats = JSON.parse(savedStats);
        // Convertir fechas de string a Date
        stats.firstPlayDate = new Date(stats.firstPlayDate);
        stats.lastPlayDate = new Date(stats.lastPlayDate);
        setPlayerStats(stats);
      } else {
        setPlayerStats(createDefaultStats());
      }

      if (savedAchievements) {
        const achvs = JSON.parse(savedAchievements);
        // Convertir fechas de desbloqueo
        achvs.forEach((ach: Achievement) => {
          if (ach.unlockedAt) {
            ach.unlockedAt = new Date(ach.unlockedAt);
          }
        });
        setAchievements(achvs);
      } else {
        // Inicializar achievements desde la base de datos
        setAchievements([...ACHIEVEMENTS]);
      }
    } catch (error) {
      console.error('Error loading player data:', error);
      setPlayerStats(createDefaultStats());
      setAchievements([...ACHIEVEMENTS]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar datos en localStorage
  const savePlayerData = useCallback(() => {
    if (!playerStats) return;

    try {
      localStorage.setItem('typing_frog_player_stats', JSON.stringify(playerStats));
      localStorage.setItem('typing_frog_achievements', JSON.stringify(achievements));
      console.log('💾 Datos del jugador guardados');
    } catch (error) {
      console.error('Error saving player data:', error);
    }
  }, [playerStats, achievements]);

  // Calcular experiencia necesaria para el siguiente nivel
  const calculateXPForNextLevel = (level: number): number => {
    return Math.floor(1000 * Math.pow(1.5, level - 1));
  };

  // Actualizar estadísticas después de una partida
  const updateStatsAfterGame = useCallback((session: GameSession) => {
    if (!playerStats) return;

    setPlayerStats(prev => {
      if (!prev) return prev;

      const newStats = { ...prev };
      
      // Actualizar estadísticas generales
      newStats.totalGamesPlayed++;
      if (session.completed) {
        newStats.totalGamesCompleted++;
      }
      newStats.totalCharactersTyped += session.charactersTyped;
      newStats.totalErrors += session.errors;
      newStats.totalTimeSpent += session.duration;
      
      // Actualizar récords personales
      if (session.wpm > newStats.bestWPM) {
        newStats.bestWPM = session.wpm;
      }
      if (session.accuracy > newStats.bestAccuracy) {
        newStats.bestAccuracy = session.accuracy;
      }
      if (session.completed && session.duration < newStats.fastestCompletion || newStats.fastestCompletion === 0) {
        newStats.fastestCompletion = session.duration;
      }

      // Actualizar estadísticas por nivel
      const levelKey = `${session.level}Stats` as keyof PlayerStats;
      const levelStats = newStats[levelKey] as LevelStats;
      
      levelStats.gamesPlayed++;
      if (session.completed) {
        levelStats.gamesCompleted++;
      }
      if (session.wpm > levelStats.bestWPM) {
        levelStats.bestWPM = session.wpm;
      }
      if (session.accuracy > levelStats.bestAccuracy) {
        levelStats.bestAccuracy = session.accuracy;
      }
      levelStats.totalTimeSpent += session.duration;
      
      // Recalcular promedios
      if (levelStats.gamesPlayed > 0) {
        levelStats.averageWPM = Math.round(
          (levelStats.averageWPM * (levelStats.gamesPlayed - 1) + session.wpm) / levelStats.gamesPlayed
        );
        levelStats.averageAccuracy = Math.round(
          (levelStats.averageAccuracy * (levelStats.gamesPlayed - 1) + session.accuracy) / levelStats.gamesPlayed
        );
      }

      // Actualizar fecha de última partida
      newStats.lastPlayDate = new Date();

      return newStats;
    });
  }, [playerStats]);

  // Verificar y desbloquear logros
  const checkAchievements = useCallback((session: GameSession, updatedStats: PlayerStats) => {
    const newlyUnlocked: Achievement[] = [];

    setAchievements(prev => {
      return prev.map(achievement => {
        if (achievement.unlocked) return achievement;

        let shouldUnlock = false;

        // Verificar condiciones según tipo
        switch (achievement.condition.type) {
          case 'single_game':
            shouldUnlock = checkSingleGameCondition(achievement, session);
            break;
          case 'total_games':
            shouldUnlock = checkTotalGamesCondition(achievement, updatedStats);
            break;
          case 'streak':
            // TODO: Implementar lógica de rachas
            break;
          case 'special':
            shouldUnlock = checkSpecialCondition(achievement, session, updatedStats);
            break;
        }

        if (shouldUnlock) {
          const unlockedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
          newlyUnlocked.push(unlockedAchievement);
          
          // Otorgar XP
          const xpGained = getAchievementXP(achievement);
          setPlayerStats(prevStats => {
            if (!prevStats) return prevStats;
            
            const newXP = prevStats.experience + xpGained;
            const newLevel = calculatePlayerLevel(newXP);
            
            return {
              ...prevStats,
              experience: newXP,
              level: newLevel,
              experienceToNext: calculateXPForNextLevel(newLevel + 1) - newXP
            };
          });

          console.log(`🏆 ¡Logro desbloqueado! ${achievement.name} (+${xpGained} XP)`);
          return unlockedAchievement;
        }

        return achievement;
      });
    });

    return newlyUnlocked;
  }, [calculatePlayerLevel, checkSingleGameCondition, checkTotalGamesCondition]);

  // Verificar condición de una sola partida
  const checkSingleGameCondition = (achievement: Achievement, session: GameSession): boolean => {
    const { metric, value, operator } = achievement.condition;
    let sessionValue: number = 0;

    switch (metric) {
      case 'wpm':
        sessionValue = session.wpm;
        break;
      case 'accuracy':
        sessionValue = session.accuracy;
        break;
      case 'first_completion':
        return session.completed;
    }

    return evaluateCondition(sessionValue, value, operator);
  };

  // Verificar condición de totales
  const checkTotalGamesCondition = (achievement: Achievement, stats: PlayerStats): boolean => {
    const { metric, value, operator } = achievement.condition;
    let totalValue: number = 0;

    switch (metric) {
      case 'games_completed':
        totalValue = stats.totalGamesCompleted;
        break;
      case 'gold_medals':
        // TODO: Implementar contador de medallas
        totalValue = 0;
        break;
    }

    return evaluateCondition(totalValue, value, operator);
  };

  // Verificar condiciones especiales
  const checkSpecialCondition = (achievement: Achievement, session: GameSession, stats: PlayerStats): boolean => {
    const { metric } = achievement.condition;

    switch (metric) {
      case 'all_levels_completed':
        return stats.principianteStats.gamesCompleted > 0 && 
               stats.intermedioStats.gamesCompleted > 0 && 
               stats.avanzadoStats.gamesCompleted > 0;
      
      case 'night_games':
        // TODO: Implementar contador por tiempo del día
        return false;
      
      case 'morning_games':
        // TODO: Implementar contador por tiempo del día
        return false;
      
      case 'perfect_beginner_game':
        return session.level === 'principiante' && session.errors === 0 && session.completed;
      
      default:
        return false;
    }
  };

  // Evaluar operadores de condiciones
  const evaluateCondition = (actual: number, target: number, operator: string): boolean => {
    switch (operator) {
      case '=': return actual === target;
      case '>': return actual > target;
      case '>=': return actual >= target;
      case '<': return actual < target;
      case '<=': return actual <= target;
      default: return false;
    }
  };

  // Calcular nivel del jugador basado en XP
  const calculatePlayerLevel = (experience: number): number => {
    let level = 1;
    let xpRequired = 1000;
    let totalXP = 0;

    while (totalXP + xpRequired <= experience) {
      totalXP += xpRequired;
      level++;
      xpRequired = calculateXPForNextLevel(level);
    }

    return level;
  };

  // Registrar una nueva sesión de juego
  const recordGameSession = useCallback((session: GameSession) => {
    if (!playerStats) return [];

    // Actualizar estadísticas
    updateStatsAfterGame(session);

    // Verificar logros después de actualizar stats
    setTimeout(() => {
      if (playerStats) {
        const newAchievements = checkAchievements(session, playerStats);
        session.achievementsUnlocked = newAchievements.map(a => a.id);
      }
    }, 100);

    return [];
  }, [playerStats, updateStatsAfterGame, checkAchievements]);

  // Actualizar preferencias
  const updatePreferences = useCallback((newPreferences: Partial<PlayerPreferences>) => {
    setPlayerStats(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          ...newPreferences
        }
      };
    });
  }, []);

  // Reset completo de datos
  const resetPlayerData = useCallback(() => {
    const defaultStats = createDefaultStats();
    setPlayerStats(defaultStats);
    setAchievements([...ACHIEVEMENTS]);
    localStorage.removeItem('typing_frog_player_stats');
    localStorage.removeItem('typing_frog_achievements');
    console.log('🔄 Datos del jugador reiniciados');
  }, []);

  // Exportar datos para backup
  const exportPlayerData = useCallback(() => {
    const data = {
      stats: playerStats,
      achievements: achievements,
      exportDate: new Date(),
      version: '1.0'
    };
    return JSON.stringify(data, null, 2);
  }, [playerStats, achievements]);

  // Importar datos desde backup
  const importPlayerData = useCallback((dataString: string) => {
    try {
      const data = JSON.parse(dataString);
      if (data.stats && data.achievements) {
        setPlayerStats(data.stats);
        setAchievements(data.achievements);
        savePlayerData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, [savePlayerData]);

  // Inicializar datos al montar
  useEffect(() => {
    loadPlayerData();
  }, [loadPlayerData]);

  // Auto-save periódico
  useEffect(() => {
    if (!isLoading && playerStats) {
      savePlayerData();
    }
  }, [playerStats, achievements, isLoading, savePlayerData]);

  return {
    // Estado
    playerStats,
    achievements,
    isLoading,
    
    // Funciones principales
    recordGameSession,
    updatePreferences,
    
    // Gestión de datos
    resetPlayerData,
    exportPlayerData,
    importPlayerData,
    savePlayerData,
    
    // Utilidades
    getUnlockedAchievements: () => achievements.filter(a => a.unlocked),
    getLockedAchievements: () => achievements.filter(a => !a.unlocked),
    getAchievementProgress: (achievementId: string) => {
      const achievement = achievements.find(a => a.id === achievementId);
      return achievement?.progress || 0;
    }
  };
};
