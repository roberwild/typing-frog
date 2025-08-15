import React from 'react';
import { GameStats, DifficultyLevel } from '@/types/game';
import styles from '@/styles/HUD.module.css';

interface HUDProps {
  stats: GameStats;
  totalCharacters: number;
  currentLevel: DifficultyLevel;
  maxTime: number;
}

export const HUD: React.FC<HUDProps> = ({ 
  stats, 
  totalCharacters, 
  currentLevel,
  maxTime 
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeBarWidth = (): number => {
    return Math.max(0, (stats.timeRemaining / maxTime) * 100);
  };

  const getTimeBarColor = (): string => {
    const percentage = stats.timeRemaining / maxTime;
    if (percentage <= 0.16) return '#ef4444'; // Crítico - rojo
    if (percentage <= 0.5) return '#f59e0b';  // Advertencia - amarillo
    return '#22c55e'; // Normal - verde
  };

  const getProgressPercentage = (): number => {
    if (totalCharacters === 0) return 0;
    return Math.min(100, (stats.correctChars / totalCharacters) * 100);
  };

  const getMedalIcon = (): string => {
    if (!stats.medal) return '';
    switch (stats.medal) {
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '';
    }
  };

  const getLevelIcon = (): string => {
    switch (currentLevel) {
      case 'principiante': return '🌱';
      case 'intermedio': return '⚡';
      case 'avanzado': return '🔥';
      default: return '🎯';
    }
  };

  const getLevelLabel = (): string => {
    switch (currentLevel) {
      case 'principiante': return 'Principiante';
      case 'intermedio': return 'Intermedio';
      case 'avanzado': return 'Avanzado';
      default: return 'Nivel';
    }
  };

  return (
    <div className={styles.hud}>
      {/* Nivel y Medalla */}
      <div className={styles.levelContainer}>
        <div className={styles.levelInfo}>
          <span className={styles.levelIcon}>{getLevelIcon()}</span>
          <span className={styles.levelLabel}>{getLevelLabel()}</span>
        </div>
        {stats.medal && (
          <div className={styles.medalContainer}>
            <span className={styles.medalIcon}>{getMedalIcon()}</span>
          </div>
        )}
      </div>

      {/* Vidas mejoradas */}
      <div className={styles.livesContainer}>
        <span className={styles.label}>Vidas</span>
        <div className={styles.lives}>
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className={`${styles.heartContainer} ${
                index < stats.lives ? styles.active : styles.inactive
              }`}
            >
              <div className={styles.heart}></div>
              {index < stats.lives && (
                <div className={styles.heartGlow}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Barra de tiempo */}
      <div className={styles.timeContainer}>
        <span className={styles.label}>Tiempo</span>
        <div className={styles.timeBarContainer}>
          <div 
            className={styles.timeBar}
            style={{
              width: `${getTimeBarWidth()}%`,
              backgroundColor: getTimeBarColor()
            }}
          >
            <div className={styles.timeBarGlow}></div>
          </div>
          <span className={styles.timeText}>
            {formatTime(stats.timeRemaining)}
          </span>
        </div>
      </div>

      {/* Progreso visual */}
      <div className={styles.progressContainer}>
        <span className={styles.label}>Progreso</span>
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBar}
            style={{ width: `${getProgressPercentage()}%` }}
          >
            <div className={styles.progressBarGlow}></div>
          </div>
          <span className={styles.progressText}>
            {stats.correctChars}/{totalCharacters}
          </span>
        </div>
      </div>

      {/* Estadísticas adicionales */}
      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>!</span>
          <span className={styles.statValue}>{stats.errors}</span>
          <span className={styles.statLabel}>Errores</span>
        </div>
      </div>
    </div>
  );
};
