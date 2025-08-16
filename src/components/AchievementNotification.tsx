'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Achievement } from '@/types/game';
import styles from '@/styles/AchievementNotification.module.css';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
  duration?: number;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
  duration = 4000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      setIsExiting(false);

      // Auto-close después del duration
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [achievement, duration, handleClose]);

  if (!achievement || !isVisible) return null;

  return (
    <div className={`${styles.notification} ${isExiting ? styles.exiting : ''}`}>
      <div className={styles.content}>
        {/* Efectos de fondo */}
        <div className={styles.backgroundEffects}>
          <div className={styles.shimmer}></div>
          <div className={styles.particles}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`${styles.particle} ${styles[`particle${i + 1}`]}`}>
                ✨
              </div>
            ))}
          </div>
        </div>

        {/* Cabecera */}
        <div className={styles.header}>
          <div className={styles.achievementIcon}>
            {achievement.icon}
            <div className={styles.iconGlow}></div>
          </div>
          <div className={styles.headerText}>
            <div className={styles.title}>¡Logro Desbloqueado!</div>
            <div className={styles.achievementName}>{achievement.name}</div>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Descripción */}
        <div className={styles.description}>
          {achievement.description}
        </div>

        {/* Recompensa */}
        {achievement.reward && (
          <div className={styles.reward}>
            <div className={styles.rewardIcon}>🎁</div>
            <div className={styles.rewardText}>
              <span className={styles.rewardLabel}>Recompensa:</span>
              <span className={styles.rewardDescription}>
                {achievement.reward.description}
              </span>
            </div>
          </div>
        )}

        {/* Categoría */}
        <div className={styles.category}>
          <span className={styles.categoryLabel}>Categoría:</span>
          <span className={`${styles.categoryBadge} ${styles[achievement.category]}`}>
            {getCategoryName(achievement.category)}
          </span>
        </div>

        {/* Barra de progreso para auto-cierre */}
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ animationDuration: `${duration}ms` }}
          ></div>
        </div>
      </div>

      {/* Rayos de luz */}
      <div className={styles.lightRays}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`${styles.ray} ${styles[`ray${i + 1}`]}`}></div>
        ))}
      </div>
    </div>
  );
};

// Función auxiliar para obtener nombre de categoría en español
const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    speed: 'Velocidad',
    accuracy: 'Precisión',
    endurance: 'Resistencia',
    consistency: 'Consistencia',
    exploration: 'Exploración',
    master: 'Maestría',
    special: 'Especial'
  };
  return names[category] || category;
};
