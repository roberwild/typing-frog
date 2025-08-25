import React from 'react';
import { GameStats, DifficultyLevel } from '@/types/game';
import styles from '@/styles/HUD.module.css';

interface HUDProps {
  stats: GameStats;
  totalCharacters: number;
  currentLevel: DifficultyLevel;
}

export const HUD: React.FC<HUDProps> = ({ 
  stats, 
  totalCharacters, 
  currentLevel
}) => {


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
