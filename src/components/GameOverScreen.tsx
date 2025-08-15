import React from 'react';
import { GameStats, DifficultyLevel } from '@/types/game';
import { Medal } from './Medal';
import styles from '@/styles/GameOverScreen.module.css';

interface GameOverScreenProps {
  stats: GameStats;
  currentLevel: DifficultyLevel;
  onRestart: () => void;
  onReturnToMenu: () => void;
  reason: 'time' | 'lives' | 'completed';
  totalCharacters: number;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  stats,
  currentLevel,
  onRestart,
  onReturnToMenu,
  reason,
  totalCharacters,
}) => {
  const getTitle = (): string => {
    if (reason === 'completed') return '¡Texto Completado!';
    if (reason === 'time') return '¡Se Acabó el Tiempo!';
    return '¡Sin Vidas!';
  };

  const getMessage = (): string => {
    if (reason === 'completed') {
      return '🎉 ¡Felicidades! Has completado el texto exitosamente.';
    }
    if (reason === 'time') {
      return '⚡ El tiempo se agotó, pero lo hiciste muy bien.';
    }
    return '💔 Te quedaste sin vidas, ¡pero puedes intentarlo de nuevo!';
  };

  const getLevelLabel = (level: DifficultyLevel): string => {
    const labels = {
      principiante: 'Principiante',
      intermedio: 'Intermedio',
      avanzado: 'Avanzado',
    };
    return labels[level];
  };

  const getLevelIcon = (level: DifficultyLevel): string => {
    const icons = {
      principiante: '🌱',
      intermedio: '⚡',
      avanzado: '🔥',
    };
    return icons[level];
  };

  const accuracy = stats.correctChars > 0 
    ? Math.round((stats.correctChars / (stats.correctChars + stats.errors)) * 100)
    : 0;

  const completionRate = totalCharacters > 0 
    ? Math.round((stats.correctChars / totalCharacters) * 100)
    : 0;

  const wpm = stats.correctChars > 0 
    ? Math.round((stats.correctChars / 5) / ((60 - stats.timeRemaining) / 60))
    : 0;

  const getPerformanceRating = (): { emoji: string; text: string; color: string } => {
    if (reason === 'completed' && stats.medal === 'gold') {
      return { emoji: '👑', text: 'PERFECTO', color: '#ffd700' };
    }
    if (accuracy >= 95) {
      return { emoji: '🔥', text: 'EXCELENTE', color: '#ff6b35' };
    }
    if (accuracy >= 85) {
      return { emoji: '⭐', text: 'MUY BUENO', color: '#4ade80' };
    }
    if (accuracy >= 75) {
      return { emoji: '👍', text: 'BUENO', color: '#60a5fa' };
    }
    return { emoji: '💪', text: 'SIGUE PRACTICANDO', color: '#f59e0b' };
  };

  const performance = getPerformanceRating();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>{getTitle()}</h1>
          <p className={styles.message}>{getMessage()}</p>
          
          {/* Calificación de rendimiento */}
          <div className={styles.performanceRating}>
            <span className={styles.performanceEmoji}>{performance.emoji}</span>
            <span 
              className={styles.performanceText} 
              style={{ color: performance.color }}
            >
              {performance.text}
            </span>
          </div>
        </div>

        {/* Medalla espectacular */}
        {stats.medal && (
          <div className={styles.medalSection}>
            <Medal 
              type={stats.medal} 
              size="large" 
              animated={true}
              showLabel={true}
            />
          </div>
        )}

        {/* Información del nivel */}
        <div className={styles.levelInfo}>
          <span className={styles.levelIcon}>{getLevelIcon(currentLevel)}</span>
          <span className={styles.levelName}>{getLevelLabel(currentLevel)}</span>
        </div>

        {/* Estadísticas mejoradas */}
        <div className={styles.stats}>
          <h2>Estadísticas del Juego</h2>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💯</div>
              <div className={styles.statValue}>{accuracy}%</div>
              <div className={styles.statLabel}>Precisión</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📊</div>
              <div className={styles.statValue}>{completionRate}%</div>
              <div className={styles.statLabel}>Completado</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚡</div>
              <div className={styles.statValue}>{wpm}</div>
              <div className={styles.statLabel}>PPM</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statValue}>{stats.correctChars}</div>
              <div className={styles.statLabel}>Correctos</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>❌</div>
              <div className={styles.statValue}>{stats.errors}</div>
              <div className={styles.statLabel}>Errores</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIcon}>💝</div>
              <div className={styles.statValue}>{stats.lives}</div>
              <div className={styles.statLabel}>Vidas</div>
            </div>
          </div>

          {/* Resumen detallado */}
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Caracteres totales:</span>
              <span className={styles.summaryValue}>{totalCharacters}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Tiempo utilizado:</span>
              <span className={styles.summaryValue}>{60 - stats.timeRemaining}s</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Velocidad promedio:</span>
              <span className={styles.summaryValue}>{wpm} PPM</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.restartButton} onClick={onRestart}>
            🔄 Jugar de Nuevo
          </button>
          <button className={styles.menuButton} onClick={onReturnToMenu}>
            🏠 Menú Principal
          </button>
        </div>
      </div>
    </div>
  );
};
