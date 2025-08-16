import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameStats, DifficultyLevel, CharacterStatus, GameConfig, GameSession } from '@/types/game';
import { useTexts } from './useTexts';
import { useFrogState } from './useFrogState';
import { useSounds } from './useSounds';
import { usePlayerData } from './usePlayerData';

const DEFAULT_CONFIG: GameConfig = {
  maxLives: 3,
  gameTime: 60,
  defaultLevel: 'principiante',
};

export const useGame = (config: Partial<GameConfig> = {}) => {
  const gameConfig = { ...DEFAULT_CONFIG, ...config };
  const { getRandomText, loading: textsLoading } = useTexts();
  
  // Estados de la rana
  const {
    frogState,
    triggerJump,
    triggerShock,
    triggerDeath,
    resetToIdle,
    handleAnimationComplete,
    cleanup: cleanupFrog,
  } = useFrogState();

  // Sonidos del juego
  const {
    playJumpSound,
    playErrorSound,
    playDeathSound,
    playVictorySound,
    cleanup: cleanupSounds,
  } = useSounds();

  // Sistema de persistencia y logros - Fase 5
  const {
    playerStats,
    recordGameSession,
    updatePreferences,
    isLoading: playerDataLoading
  } = usePlayerData();
  
  // Estados principales
  const [gameState, setGameState] = useState<GameState>('idle');
  const [currentLevel, setCurrentLevel] = useState<DifficultyLevel>(gameConfig.defaultLevel);
  const [currentText, setCurrentText] = useState<string>('');
  const [characters, setCharacters] = useState<CharacterStatus[]>([]);
  
  // Estadísticas del juego
  const [stats, setStats] = useState<GameStats>({
    lives: gameConfig.maxLives,
    timeRemaining: gameConfig.gameTime,
    currentPosition: 0,
    correctChars: 0,
    errors: 0,
    medal: null,
  });

  // Referencias para el temporizador
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameStartTimeRef = useRef<number>(0);
  
  // Referencias para tracking de sesión - Fase 5
  const sessionStartTimeRef = useRef<number>(0);
  const sessionIdRef = useRef<string>('');
  const currentTimeOfDayRef = useRef<string>('afternoon');

  // Inicializar texto para el nivel actual
  const initializeText = useCallback((level: DifficultyLevel) => {
    const text = getRandomText(level);
    setCurrentText(text);
    
    const charArray: CharacterStatus[] = text.split('').map((char, index) => ({
      char,
      status: 'pending',
      index,
    }));
    
    setCharacters(charArray);
    setStats(prev => ({
      ...prev,
      currentPosition: 0,
      correctChars: 0,
      errors: 0,
      medal: null,
    }));
  }, [getRandomText]);

  // Iniciar juego
  const startGame = useCallback((level?: DifficultyLevel) => {
    console.log('🚀 startGame llamado con nivel:', level);
    console.log('📊 textsLoading:', textsLoading);
    
    if (textsLoading) {
      console.log('⏳ Juego no iniciado - textos aún cargando');
      return;
    }
    
    const selectedLevel = level || currentLevel;
    console.log('🎯 Nivel seleccionado:', selectedLevel);
    setCurrentLevel(selectedLevel);
    
    // Resetear estado
    console.log('🔄 Cambiando estado a playing');
    setGameState('playing');
    resetToIdle(); // Resetear rana a estado idle
    setStats({
      lives: gameConfig.maxLives,
      timeRemaining: gameConfig.gameTime,
      currentPosition: 0,
      correctChars: 0,
      errors: 0,
      medal: null,
    });
    
    // Inicializar texto
    console.log('📝 Inicializando texto para nivel:', selectedLevel);
    initializeText(selectedLevel);
    
    // Iniciar tracking de sesión - Fase 5
    sessionStartTimeRef.current = Date.now();
    sessionIdRef.current = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Iniciar temporizador
    gameStartTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setStats(prev => {
        const newTime = prev.timeRemaining - 1;
        if (newTime <= 0) {
          // Tiempo agotado - activar muerte de la rana
          triggerDeath();
          playDeathSound();
          setTimeout(() => setGameState('gameOver'), 1000); // Esperar animación
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: newTime };
      });
    }, 1000);
    
    console.log('✅ Juego iniciado exitosamente');
  }, [currentLevel, textsLoading, gameConfig.maxLives, gameConfig.gameTime, initializeText, resetToIdle, triggerDeath, playDeathSound]);

  // Terminar juego
  const endGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Calcular medalla según vidas restantes
    let medal: 'gold' | 'silver' | 'bronze' | null = null;
    if (stats.lives >= 3) medal = 'gold';
    else if (stats.lives >= 2) medal = 'silver';
    else if (stats.lives >= 1) medal = 'bronze';
    
    setStats(prev => ({ ...prev, medal }));
    setGameState('gameOver');
    
    // Registrar sesión de juego - Fase 5
    if (sessionStartTimeRef.current > 0) {
      const duration = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
      const totalChars = characters.length;
      const accuracy = stats.correctChars > 0 ? Math.round((stats.correctChars / (stats.correctChars + stats.errors)) * 100) : 0;
      const wpm = stats.correctChars > 0 ? Math.round((stats.correctChars / 5) / (duration / 60)) : 0;
      const completed = stats.currentPosition >= totalChars;
      
      const session: GameSession = {
        id: sessionIdRef.current,
        date: new Date(),
        level: currentLevel,
        timeOfDay: currentTimeOfDayRef.current,
        duration,
        charactersTyped: stats.correctChars,
        errors: stats.errors,
        accuracy,
        wpm,
        completed,
        medalEarned: medal || undefined,
        achievementsUnlocked: []
      };
      
      recordGameSession(session);
      console.log('📊 Sesión registrada:', session);
    }
  }, [stats, characters.length, currentLevel, recordGameSession]);

  // Procesar tecla presionada
  const handleKeyPress = useCallback((key: string) => {
    if (gameState !== 'playing') return;
    
    setStats(prev => {
      const { currentPosition } = prev;
      
      if (currentPosition >= characters.length) {
        return prev; // Texto completado
      }
      
      const expectedChar = characters[currentPosition].char;
      const isCorrect = key === expectedChar;
      
      if (isCorrect) {
        // Carácter correcto - activar salto de la rana y sonido
        triggerJump();
        playJumpSound();
        
        setCharacters(prevChars => {
          const newChars = [...prevChars];
          // Si había un error previo, marcarlo como corregido
          if (newChars[currentPosition].status === 'error') {
            newChars[currentPosition].status = 'corrected';
          } else {
            newChars[currentPosition].status = 'correct';
          }
          return newChars;
        });
        
        const newPosition = currentPosition + 1;
        const newCorrectChars = prev.correctChars + 1;
        
        // Verificar si se completó el texto
        if (newPosition >= characters.length) {
          playVictorySound();
          setTimeout(() => endGame(), 100);
        }
        
        return {
          ...prev,
          currentPosition: newPosition,
          correctChars: newCorrectChars,
        };
      } else {
        // Error - activar shock de la rana y sonido
        triggerShock();
        playErrorSound();
        
        setCharacters(prevChars => {
          const newChars = [...prevChars];
          newChars[currentPosition].status = 'error';
          return newChars;
        });
        
        const newLives = prev.lives - 1;
        const newErrors = prev.errors + 1;
        
        // Verificar si se agotaron las vidas
        if (newLives <= 0) {
          setTimeout(() => {
            triggerDeath();
            playDeathSound();
            setTimeout(() => endGame(), 1000); // Esperar la animación de muerte
          }, 100);
        }
        
        return {
          ...prev,
          lives: newLives,
          errors: newErrors,
        };
      }
    });
  }, [gameState, characters, endGame, triggerJump, triggerShock, triggerDeath, playJumpSound, playErrorSound, playDeathSound, playVictorySound]);

  // Limpiar temporizador, rana y sonidos al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      cleanupFrog();
      cleanupSounds();
    };
  }, [cleanupFrog, cleanupSounds]);

  // Finalizar juego cuando se agote el tiempo o las vidas
  useEffect(() => {
    if (gameState === 'playing') {
      if (stats.timeRemaining <= 0 || stats.lives <= 0) {
        endGame();
      }
    }
  }, [stats.timeRemaining, stats.lives, gameState, endGame]);

  // Resetear juego a estado inicial
  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState('idle');
    resetToIdle(); // Resetear rana
    setCurrentText('');
    setCharacters([]);
    setStats({
      lives: gameConfig.maxLives,
      timeRemaining: gameConfig.gameTime,
      currentPosition: 0,
      correctChars: 0,
      errors: 0,
      medal: null,
    });
  }, [gameConfig.maxLives, gameConfig.gameTime, resetToIdle]);

  // Actualizar tiempo del día - Fase 5
  const updateTimeOfDay = useCallback((timeOfDay: string) => {
    currentTimeOfDayRef.current = timeOfDay;
  }, []);

  return {
    // Estado
    gameState,
    currentLevel,
    currentText,
    characters,
    stats,
    textsLoading,
    frogState,
    
    // Estado del jugador - Fase 5
    playerStats,
    playerDataLoading,
    
    // Acciones
    startGame,
    endGame,
    resetGame,
    handleKeyPress,
    setCurrentLevel,
    handleAnimationComplete,
    
    // Acciones Fase 5
    updateTimeOfDay,
    updatePreferences,
  };
};
