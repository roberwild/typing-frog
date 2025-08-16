'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '@/hooks/useGame';
import { StartScreen } from './StartScreen';
import { TextDisplay } from './TextDisplay';
import { HUD } from './HUD';
import { GameOverScreen } from './GameOverScreen';
import { Frog } from './Frog';
import { Parallax, TimeOfDay } from './Parallax';
import { ParticleSystem } from './ParticleSystem';
import { AchievementsPanel } from './AchievementsPanel';
import { AchievementNotification } from './AchievementNotification';
import { useAmbientSounds } from '@/hooks/useAmbientSounds';
import { usePlayerData } from '@/hooks/usePlayerData';
import { Achievement } from '@/types/game';
import styles from '@/styles/Game.module.css';

export const Game: React.FC = () => {
  const {
    gameState,
    currentLevel,
    characters,
    stats,
    textsLoading,
    frogState,
    playerStats,
    playerDataLoading,
    startGame,
    endGame,
    resetGame,
    handleKeyPress,
    setCurrentLevel,
    handleAnimationComplete,
    updateTimeOfDay,
    updatePreferences,
  } = useGame();

  // Ref para input móvil invisible
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [showMobileHint, setShowMobileHint] = useState(true);

  // Hook directo para logros (para evitar duplicación)
  const { achievements } = usePlayerData();

  // Estados para la Fase 4
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  
  // Estados para la Fase 5 - Sistema de logros
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);
  
  // Hook de sonidos ambientales
  const {
    startAmbientSounds,
    stopAmbientSounds,
    playThunderSound,
    cleanup: cleanupAmbient
  } = useAmbientSounds();

  // Debug: Log del estado actual
  console.log('🎮 Game State:', gameState, 'Loading:', textsLoading);

  // Cambio automático de hora del día
  useEffect(() => {
    if (gameState !== 'playing') {
      return;
    }

    const interval = setInterval(() => {
      setTimeOfDay(prev => {
        const times: TimeOfDay[] = ['morning', 'afternoon', 'night'];
        const currentIndex = times.indexOf(prev);
        const nextIndex = (currentIndex + 1) % times.length;
        const newTime = times[nextIndex];
        
        // Sincronizar con useGame - Fase 5
        updateTimeOfDay(newTime);
        
        return newTime;
      });
    }, 15000); // Cambiar cada 15 segundos

    return () => clearInterval(interval);
  }, [gameState, updateTimeOfDay]);

  // Gestión de sonidos ambientales
  useEffect(() => {
    if (gameState === 'playing') {
      startAmbientSounds(timeOfDay);
    } else {
      stopAmbientSounds();
    }

    return () => {
      stopAmbientSounds();
    };
  }, [gameState, timeOfDay, startAmbientSounds, stopAmbientSounds]);

  // Efectos de partículas sincronizados con la rana
  useEffect(() => {
    // Simplificado - los efectos visuales ahora están en el CSS de la rana
    // console.log('Frog state changed to:', frogState);
  }, [frogState]);

  // Efectos especiales al finalizar el juego
  useEffect(() => {
    if (gameState === 'gameOver') {
      const reason = getGameOverReason();
      
      if (reason === 'time') {
        // Efecto de trueno si se acabó el tiempo
        playThunderSound();
        setTimeOfDay('night'); // Cambiar a noche dramáticamente
      } else if (reason === 'completed') {
        // Efectos de celebración manejados por CSS
        console.log('🎉 Game completed!');
      }
    }
  }, [gameState, playThunderSound, getGameOverReason]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      cleanupAmbient();
    };
  }, [cleanupAmbient]);

  // Manejar eventos de teclado (escritorio y móvil)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Evitar comportamientos por defecto para teclas especiales
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        return;
      }
      
      // Solo procesar caracteres imprimibles
      if (event.key.length === 1) {
        event.preventDefault();
        handleKeyPress(event.key);
      }
    };

    if (gameState === 'playing') {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, handleKeyPress]);

  // Input móvil - Foco automático y manejo del teclado virtual
  useEffect(() => {
    if (gameState === 'playing' && mobileInputRef.current) {
      // Enfocar el input invisible para activar el teclado virtual
      mobileInputRef.current.focus();
      
      // Mantener el foco en caso de que se pierda
      const maintainFocus = () => {
        if (mobileInputRef.current && gameState === 'playing') {
          mobileInputRef.current.focus();
        }
      };
      
      // Mantener foco cada segundo mientras se juega
      const focusInterval = setInterval(maintainFocus, 1000);
      
      return () => {
        clearInterval(focusInterval);
      };
    }
  }, [gameState]);

  // Manejar input del teclado virtual móvil
  const handleMobileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    
    // Procesar solo el último carácter añadido
    if (inputValue.length > 0) {
      const lastChar = inputValue[inputValue.length - 1];
      handleKeyPress(lastChar);
      
      // Ocultar pista después del primer input
      if (showMobileHint) {
        setShowMobileHint(false);
      }
      
      // Limpiar el input para permitir caracteres repetidos
      if (mobileInputRef.current) {
        mobileInputRef.current.value = '';
      }
    }
  };

  // Prevenir que el input móvil pierda el foco
  const handleMobileBlur = () => {
    if (gameState === 'playing') {
      setTimeout(() => {
        if (mobileInputRef.current && gameState === 'playing') {
          mobileInputRef.current.focus();
        }
      }, 100);
    }
  };

  // Activar input móvil al tocar la pantalla durante el juego
  const handleGameContainerTouch = () => {
    if (gameState === 'playing' && mobileInputRef.current) {
      mobileInputRef.current.focus();
      // Ocultar pista al tocar
      if (showMobileHint) {
        setShowMobileHint(false);
      }
    }
  };

  // Resetear pista móvil cuando inicia el juego
  useEffect(() => {
    if (gameState === 'playing') {
      setShowMobileHint(true);
    }
  }, [gameState]);

  const handleRestart = () => {
    startGame(currentLevel);
  };

  const handleReturnToMenu = () => {
    setCurrentLevel('principiante');
    resetGame();
  };

  const getGameOverReason = (): 'time' | 'lives' | 'completed' => {
    if (stats.timeRemaining <= 0) {
      return 'time';
    }
    if (stats.lives <= 0) {
      return 'lives';
    }
    return 'completed';
  };

  // Calcular progreso del juego y velocidad para parallax
  const gameProgress = characters.length > 0 ? (stats.currentPosition / characters.length) * 100 : 0;
  const currentWPM = stats.correctChars > 0 && stats.timeRemaining < 60 
    ? Math.round((stats.correctChars / 5) / ((60 - stats.timeRemaining) / 60))
    : 0;
  const isNearEnd = gameProgress > 85; // Para mostrar la meta

  return (
    <div 
      className={styles.gameContainer}
      onTouchStart={handleGameContainerTouch}
      onClick={handleGameContainerTouch}
    >
      {/* Sistema de Parallax completo con variaciones de hora */}
      <Parallax 
        timeOfDay={timeOfDay}
        animated={gameState === 'playing'}
        gameProgress={gameProgress}
        speed={currentWPM}
        showFinishLine={isNearEnd || getGameOverReason() === 'completed'}
      />

      {/* Sistema de partículas global */}
      <ParticleSystem 
        active={gameState === 'playing'}
        maxParticles={60}
      />

      {/* Input invisible para teclado virtual móvil */}
      <input
        ref={mobileInputRef}
        type="text"
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={handleMobileInput}
        onBlur={handleMobileBlur}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Botón de logros - siempre visible */}
      {!showAchievementsPanel && (
        <button 
          className={styles.achievementsButton}
          onClick={() => setShowAchievementsPanel(true)}
          title="Ver logros y estadísticas"
        >
          🏆
        </button>
      )}

      {/* Pantalla de inicio */}
      {gameState === 'idle' && (
        <StartScreen
          onStartGame={(level) => {
            // Inicializar hora del día según el nivel
            const levelTimeMap: Record<string, TimeOfDay> = {
              principiante: 'morning',
              intermedio: 'afternoon',
              avanzado: 'night'
            };
            const newTime = levelTimeMap[level] || 'afternoon';
            setTimeOfDay(newTime);
            updateTimeOfDay(newTime); // Sincronizar con useGame
            startGame(level);
          }}
          isLoading={textsLoading}
        />
      )}

      {/* Juego en progreso */}
      {gameState === 'playing' && (
        <>
          <HUD 
            stats={stats} 
            totalCharacters={characters.length}
            currentLevel={currentLevel}
            maxTime={60}
          />
          <TextDisplay characters={characters} currentPosition={stats.currentPosition} />
          
          {/* Indicador de hora del día */}
          <div className={styles.timeIndicator}>
            <span className={styles.timeIcon}>
              {timeOfDay === 'morning' && '🌅'}
              {timeOfDay === 'afternoon' && '☀️'}
              {timeOfDay === 'night' && '🌙'}
            </span>
            <span className={styles.timeLabel}>
              {timeOfDay === 'morning' && 'Mañana'}
              {timeOfDay === 'afternoon' && 'Tarde'}
              {timeOfDay === 'night' && 'Noche'}
            </span>
          </div>

          {/* Pista móvil para teclado virtual */}
          {showMobileHint && (
            <div className={styles.mobileHint}>
              📱 Toca la pantalla para activar el teclado
            </div>
          )}
        </>
      )}

      {/* Rana solo durante el juego */}
      {gameState === 'playing' && (
        <div className={styles.gameArea}>
          <div className={styles.frogArea}>
            <Frog 
              state={frogState} 
              onAnimationComplete={handleAnimationComplete}
            />
          </div>
        </div>
      )}

      {/* Pantalla de Game Over */}
      {gameState === 'gameOver' && (
        <GameOverScreen
          stats={stats}
          currentLevel={currentLevel}
          onRestart={handleRestart}
          onReturnToMenu={handleReturnToMenu}
          reason={getGameOverReason()}
          totalCharacters={characters.length}
        />
      )}

      {/* Panel de logros - Fase 5 */}
      {showAchievementsPanel && (
        <AchievementsPanel
          achievements={achievements}
          playerStats={playerStats}
          onClose={() => setShowAchievementsPanel(false)}
        />
      )}

      {/* Notificación de logro - Fase 5 */}
      <AchievementNotification
        achievement={currentNotification}
        onClose={() => setCurrentNotification(null)}
        duration={4000}
      />
    </div>
  );
};
