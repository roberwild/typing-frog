'use client';

import React, { useEffect, useRef } from 'react';
import { CharacterStatus } from '@/types/game';
import styles from '@/styles/TextDisplay.module.css';

interface TextDisplayProps {
  characters: CharacterStatus[];
  currentPosition: number;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({
  characters,
  currentPosition,
}) => {
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para mantener visible el texto actual + 2-3 palabras próximas
  useEffect(() => {
    if (!textContainerRef.current || !textRef.current) {
      return;
    }

    const container = textContainerRef.current;
    const textElement = textRef.current;
    
    // Encontrar el elemento del carácter actual
    const currentCharElement = textElement.children[currentPosition] as HTMLElement;
    if (!currentCharElement) {
      return;
    }

    // Calcular posición para centrar el texto actual con un poco de adelanto
    const containerWidth = container.clientWidth;
    const currentCharLeft = currentCharElement.offsetLeft;
    const currentCharWidth = currentCharElement.offsetWidth;
    
    // Mantener el carácter actual en el primer tercio de la pantalla (para ver palabras siguientes)
    const targetScrollLeft = currentCharLeft - (containerWidth / 3);
    
    // Solo hacer scroll si es necesario (evitar scroll excesivo)
    const currentScrollLeft = container.scrollLeft;
    const scrollDifference = Math.abs(targetScrollLeft - currentScrollLeft);
    
    if (scrollDifference > 20) { // Solo scroll si hay diferencia significativa
      container.scrollTo({
        left: Math.max(0, targetScrollLeft), // No scroll negativo
        behavior: 'smooth'
      });
    }
  }, [currentPosition]);

  // Función para agrupar caracteres en palabras para análisis visual
  const getWordAtPosition = (position: number): { start: number; end: number } => {
    let start = position;
    let end = position;
    
    // Buscar el inicio de la palabra actual
    while (start > 0 && characters[start - 1]?.char !== ' ') {
      start--;
    }
    
    // Buscar el final de la palabra actual
    while (end < characters.length - 1 && characters[end + 1]?.char !== ' ') {
      end++;
    }
    
    return { start, end };
  };

  const currentWord = getWordAtPosition(currentPosition);

  return (
    <div className={styles.textContainer} ref={textContainerRef}>
      <div className={styles.text} ref={textRef}>
        {characters.map((char, index) => {
          const isInCurrentWord = index >= currentWord.start && index <= currentWord.end;
          const isUpcoming = index > currentPosition && index <= currentPosition + 10; // Próximos 10 caracteres
          
          return (
            <span
              key={index}
              className={`${styles.character} ${styles[char.status]} ${
                index === currentPosition ? styles.current : ''
              } ${isInCurrentWord ? styles.currentWord : ''} ${
                isUpcoming ? styles.upcoming : ''
              }`}
            >
              {char.char}
            </span>
          );
        })}
      </div>
      
      {/* Indicador visual de progreso de scroll */}
      <div className={styles.scrollProgress}>
        <div 
          className={styles.scrollProgressBar}
          style={{ 
            width: `${Math.min(100, (currentPosition / characters.length) * 100)}%` 
          }}
        />
      </div>
    </div>
  );
};
