'use client';

import React, { useState } from 'react';
import { Achievement, AchievementCategory, PlayerStats } from '@/types/game';
import styles from '@/styles/AchievementsPanel.module.css';

interface AchievementsPanelProps {
  achievements: Achievement[];
  playerStats: PlayerStats | null;
  onClose: () => void;
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  achievements,
  playerStats,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  const categories: { key: AchievementCategory | 'all'; name: string; icon: string }[] = [
    { key: 'all', name: 'Todos', icon: '🏆' },
    { key: 'speed', name: 'Velocidad', icon: '🚀' },
    { key: 'accuracy', name: 'Precisión', icon: '🎯' },
    { key: 'endurance', name: 'Resistencia', icon: '💪' },
    { key: 'consistency', name: 'Consistencia', icon: '🔥' },
    { key: 'exploration', name: 'Exploración', icon: '🗺️' },
    { key: 'master', name: 'Maestría', icon: '👑' },
    { key: 'special', name: 'Especiales', icon: '⭐' }
  ];

  // Filtrar logros por categoría
  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory === 'all') return true;
    return achievement.category === selectedCategory;
  });

  // Separar logros desbloqueados y bloqueados
  const unlockedAchievements = filteredAchievements.filter(a => a.unlocked);
  const lockedAchievements = filteredAchievements.filter(a => !a.unlocked && !a.secret);
  const secretAchievements = filteredAchievements.filter(a => !a.unlocked && a.secret);

  // Estadísticas de progreso
  const totalAchievements = achievements.length;
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercentage = Math.round((unlockedCount / totalAchievements) * 100);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const renderAchievement = (achievement: Achievement, isLocked: boolean = false) => (
    <div 
      key={achievement.id} 
      className={`${styles.achievementCard} ${isLocked ? styles.locked : styles.unlocked}`}
    >
      <div className={styles.achievementIcon}>
        {isLocked && !achievement.secret ? '🔒' : achievement.icon}
      </div>
      
      <div className={styles.achievementContent}>
        <div className={styles.achievementHeader}>
          <h4 className={styles.achievementName}>
            {isLocked && achievement.secret ? '???' : achievement.name}
          </h4>
          {achievement.unlocked && achievement.unlockedAt && (
            <span className={styles.unlockedDate}>
              {formatDate(achievement.unlockedAt)}
            </span>
          )}
        </div>
        
        <p className={styles.achievementDescription}>
          {isLocked && achievement.secret ? 'Logro secreto - ¡Descúbrelo!' : achievement.description}
        </p>
        
        {achievement.reward && !isLocked && (
          <div className={styles.achievementReward}>
            <span className={styles.rewardIcon}>🎁</span>
            <span className={styles.rewardText}>{achievement.reward.description}</span>
          </div>
        )}
        
        {achievement.progress !== undefined && achievement.maxProgress && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ 
                  width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` 
                }}
              ></div>
            </div>
            <span className={styles.progressText}>
              {achievement.progress} / {achievement.maxProgress}
            </span>
          </div>
        )}
      </div>
      
      <div className={styles.categoryBadge}>
        {categories.find(c => c.key === achievement.category)?.icon}
      </div>
    </div>
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>🏆 Logros y Estadísticas</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Estadísticas de progreso general */}
        <div className={styles.statsOverview}>
          <div className={styles.progressSection}>
            <h3>Progreso General</h3>
            <div className={styles.overallProgress}>
              <div className={styles.progressCircle}>
                <div className={styles.progressRing}>
                  <svg viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#374151"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="#4ade80"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${progressPercentage * 2.83} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className={styles.progressText}>
                    <span className={styles.percentage}>{progressPercentage}%</span>
                    <span className={styles.count}>{unlockedCount}/{totalAchievements}</span>
                  </div>
                </div>
              </div>
              
              {playerStats && (
                <div className={styles.quickStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>🎮</span>
                    <span className={styles.statValue}>{playerStats.totalGamesCompleted}</span>
                    <span className={styles.statLabel}>Partidas</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>⚡</span>
                    <span className={styles.statValue}>{playerStats.bestWPM}</span>
                    <span className={styles.statLabel}>Mejor PPM</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>🎯</span>
                    <span className={styles.statValue}>{playerStats.bestAccuracy}%</span>
                    <span className={styles.statLabel}>Mejor Precisión</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statIcon}>📊</span>
                    <span className={styles.statValue}>{playerStats.level}</span>
                    <span className={styles.statLabel}>Nivel</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filtros por categoría */}
        <div className={styles.categoryFilters}>
          {categories.map(category => {
            const categoryCount = achievements.filter(a => 
              category.key === 'all' ? true : a.category === category.key
            ).length;
            const categoryUnlocked = achievements.filter(a => 
              (category.key === 'all' ? true : a.category === category.key) && a.unlocked
            ).length;

            return (
              <button
                key={category.key}
                className={`${styles.categoryButton} ${
                  selectedCategory === category.key ? styles.active : ''
                }`}
                onClick={() => setSelectedCategory(category.key)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryName}>{category.name}</span>
                <span className={styles.categoryCount}>
                  {categoryUnlocked}/{categoryCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Lista de logros */}
        <div className={styles.achievementsList}>
          {/* Logros desbloqueados */}
          {unlockedAchievements.length > 0 && (
            <div className={styles.achievementsSection}>
              <h3 className={styles.sectionTitle}>
                ✅ Desbloqueados ({unlockedAchievements.length})
              </h3>
              <div className={styles.achievementsGrid}>
                {unlockedAchievements.map(achievement => renderAchievement(achievement, false))}
              </div>
            </div>
          )}

          {/* Logros bloqueados */}
          {lockedAchievements.length > 0 && (
            <div className={styles.achievementsSection}>
              <h3 className={styles.sectionTitle}>
                🔒 Por Desbloquear ({lockedAchievements.length})
              </h3>
              <div className={styles.achievementsGrid}>
                {lockedAchievements.map(achievement => renderAchievement(achievement, true))}
              </div>
            </div>
          )}

          {/* Logros secretos */}
          {secretAchievements.length > 0 && (
            <div className={styles.achievementsSection}>
              <h3 className={styles.sectionTitle}>
                ❓ Secretos ({secretAchievements.length})
              </h3>
              <div className={styles.achievementsGrid}>
                {secretAchievements.map(achievement => renderAchievement(achievement, true))}
              </div>
            </div>
          )}

          {/* Si no hay logros en la categoría */}
          {filteredAchievements.length === 0 && (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🏆</span>
              <p>No hay logros en esta categoría</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
