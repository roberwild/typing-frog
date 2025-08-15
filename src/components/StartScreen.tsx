import React from 'react';
import { DifficultyLevel } from '@/types/game';
import styles from '@/styles/StartScreen.module.css';

interface StartScreenProps {
  onStartGame: (level: DifficultyLevel) => void;
  isLoading?: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  isLoading = false,
}) => {
  const levels: { key: DifficultyLevel; label: string; description: string }[] = [
    {
      key: 'principiante',
      label: 'Principiante',
      description: '~25 palabras, sin acentos complejos',
    },
    {
      key: 'intermedio',
      label: 'Intermedio',
      description: '~40 palabras, con tildes y puntuación',
    },
    {
      key: 'avanzado',
      label: 'Avanzado',
      description: '~55 palabras, vocabulario completo',
    },
  ];

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando textos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>🐸 Typing Frog</h1>
          <p className={styles.subtitle}>
            ¡Ayuda a la rana a saltar entre nenúfares tecleando correctamente!
          </p>
        </div>

        <div className={styles.instructions}>
          <h2>¿Cómo jugar?</h2>
          <ul>
            <li>Teclea el texto que aparece en la parte inferior</li>
            <li>La rana saltará con cada letra correcta</li>
            <li>Tienes 3 vidas y 60 segundos</li>
            <li>¡Evita los errores o perderás una vida!</li>
          </ul>
        </div>

        <div className={styles.levelSelection}>
          <h2>Selecciona tu nivel:</h2>
          <div className={styles.levels}>
            {levels.map((level) => (
              <button
                key={level.key}
                className={styles.levelButton}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🎮 Botón clickeado:', level.key);
                  console.log('🎮 Event:', e);
                  onStartGame(level.key);
                }}
              >
                <div className={styles.levelLabel}>{level.label}</div>
                <div className={styles.levelDescription}>{level.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
