'use client';

import React from 'react';
import styles from '@/styles/Medal.module.css';

export type MedalType = 'gold' | 'silver' | 'bronze' | null;

interface MedalProps {
  type: MedalType;
  animated?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const Medal: React.FC<MedalProps> = ({ 
  type, 
  animated = true, 
  size = 'medium',
  showLabel = true 
}) => {
  if (!type) return null;

  const getMedalIcon = (medalType: MedalType): string => {
    switch (medalType) {
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '';
    }
  };

  const getMedalLabel = (medalType: MedalType): string => {
    switch (medalType) {
      case 'gold': return 'Medalla de Oro';
      case 'silver': return 'Medalla de Plata';
      case 'bronze': return 'Medalla de Bronce';
      default: return '';
    }
  };

  const getMedalDescription = (medalType: MedalType): string => {
    switch (medalType) {
      case 'gold': return 'Perfección absoluta - Sin errores';
      case 'silver': return 'Excelente trabajo - 1 error máximo';
      case 'bronze': return 'Buen trabajo - 2 errores máximo';
      default: return '';
    }
  };

  const containerClass = [
    styles.medalContainer,
    styles[size],
    animated ? styles.animated : '',
    styles[type]
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClass}>
      <div className={styles.medalIcon}>
        {getMedalIcon(type)}
        <div className={styles.shine}></div>
        <div className={styles.glow}></div>
      </div>
      
      {showLabel && (
        <div className={styles.medalInfo}>
          <div className={styles.medalTitle}>
            {getMedalLabel(type)}
          </div>
          <div className={styles.medalDescription}>
            {getMedalDescription(type)}
          </div>
        </div>
      )}

      {/* Efectos de partículas */}
      {animated && (
        <div className={styles.particles}>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={`${styles.particle} ${styles[`particle${i + 1}`]}`}>
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Rayos de luz */}
      {animated && type === 'gold' && (
        <div className={styles.lightRays}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={`${styles.ray} ${styles[`ray${i + 1}`]}`}></div>
          ))}
        </div>
      )}
    </div>
  );
};
