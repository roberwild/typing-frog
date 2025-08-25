'use client';

import React, { useState, useEffect } from 'react';
import styles from '@/styles/Parallax.module.css';

export type TimeOfDay = 'morning' | 'afternoon' | 'night';

interface ParallaxProps {
  timeOfDay?: TimeOfDay;
  animated?: boolean;
  gameProgress?: number; // 0-100% progreso del juego
  speed?: number; // Velocidad basada en PPM
  showFinishLine?: boolean; // Mostrar meta al final
}

export const Parallax: React.FC<ParallaxProps> = ({ 
  timeOfDay = 'afternoon', 
  animated = true,
  gameProgress = 0,
  speed = 1,
  showFinishLine = false
}) => {
  // Calcular posición de parallax basado en progreso del juego - AAA Dynamic Movement
  // El fondo se mueve hacia la izquierda cada vez que la rana salta
  const baseOffset = Math.min(gameProgress * 20, 800); // Movimiento limitado para evitar que el lago desaparezca
  const speedMultiplier = Math.max(0.3, Math.min(1.2, speed / 20)); // Multiplicador más conservador

  // Estados para valores aleatorios - Solución a hidratación
  const [randomPositions, setRandomPositions] = useState({
    stars: [] as Array<{left: number, top: number, delay: number}>,
    insects: [] as Array<{left: number, top: number, delay: number}>,
    dewDrops: [] as Array<{left: number, top: number, delay: number}>,
    pollen: [] as Array<{left: number, top: number, delay: number}>,
    fireflies: [] as Array<{left: number, top: number, delay: number}>,
    fishDurations: [] as Array<number>
  });

  const [isClient, setIsClient] = useState(false);

  // Generar posiciones aleatorias solo en el cliente
  useEffect(() => {
    setIsClient(true);
    setRandomPositions({
      stars: Array.from({ length: 15 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 60,
        delay: Math.random() * 3
      })),
      insects: Array.from({ length: 6 }, () => ({
        left: Math.random() * 100,
        top: 30 + Math.random() * 40,
        delay: Math.random() * 5
      })),
      dewDrops: Array.from({ length: 20 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4
      })),
      pollen: Array.from({ length: 15 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 6
      })),
      fireflies: Array.from({ length: 10 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3
      })),
      fishDurations: Array.from({ length: 8 }, () => 6 + Math.random() * 3)
    });
  }, []);

  return (
    <div className={`${styles.parallaxContainer} ${styles[timeOfDay]}`}>
      {/* Capa 1: Cielo y atmósfera */}
      <div className={styles.skyLayer}>
        <div className={styles.sky}></div>
        
        {/* Sol o Luna según hora - CSS puro */}
        {timeOfDay === 'morning' && (
          <div className={`${styles.celestialBody} ${styles.sun} ${styles.morning}`}>
          </div>
        )}
        {timeOfDay === 'afternoon' && (
          <div className={`${styles.celestialBody} ${styles.sun} ${styles.afternoon}`}>
          </div>
        )}
        {timeOfDay === 'night' && (
          <div className={`${styles.celestialBody} ${styles.moon}`}>
          </div>
        )}

        {/* Estrellas para la noche - CSS puro */}
        {timeOfDay === 'night' && isClient && (
          <div className={styles.stars}>
            {randomPositions.stars.map((star, i) => (
              <div
                key={i}
                className={`${styles.star} ${styles[`star${(i % 5) + 1}`]}`}
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                  animationDelay: `${star.delay}s`
                }}
              >
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Capa 2: Nubes distantes - se mueven muy lento */}
      <div 
        className={styles.cloudsDistant}
        style={{ transform: `translateX(${-baseOffset * 0.05 * speedMultiplier}px)` }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={`${styles.cloud} ${styles.distant}`}
            style={{
              left: `${i * 15 + 5}%`,
              top: `${15 + (i % 3) * 8}%`,
              animationDelay: `${i * 0.5}s`
            }}
          >
          </div>
        ))}
      </div>

      {/* Capa 3: Montañas lejanas - fondo coherente */}
      <div 
        className={styles.mountainsDistant}
        style={{ transform: `translateX(${-baseOffset * 0.2 * speedMultiplier}px)` }}
      >
        <div className={styles.mountainLayer1}>
          {Array.from({ length: 15 }, (_, i) => (
            <span key={i} style={{ marginRight: '5px' }}>
              {['🏔️', '🗻', '⛰️'][i % 3]}
            </span>
          ))}
        </div>
      </div>

      {/* Capa 4: Montañas cercanas - más grandes */}
      <div 
        className={styles.mountainsNear}
        style={{ transform: `translateX(${-baseOffset * 0.3 * speedMultiplier}px)` }}
      >
        <div className={styles.mountainLayer2}>
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} style={{ marginRight: '8px' }}>
              {['🗻', '⛰️', '🏔️'][i % 3]}
            </span>
          ))}
        </div>
      </div>

      {/* Capa 5: Vegetación de fondo - bosque coherente */}
      <div 
        className={styles.vegetationBack}
        style={{ transform: `translateX(${-baseOffset * 0.4 * speedMultiplier}px)` }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className={`${styles.tree} ${styles.background}`}
            style={{
              left: `${i * 6}%`
            }}
          >
          </div>
        ))}
      </div>

              {/* Capa 6: Nubes cercanas - más interactivas */}
        <div 
          className={styles.cloudsNear}
          style={{ transform: `translateX(${-baseOffset * 0.3 * speedMultiplier}px)` }}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`${styles.cloud} ${styles.near}`}
              style={{
                left: `${i * 18}%`,
                top: `${8 + (i % 2) * 15}%`,
                animationDelay: `${i * 0.8}s`
              }}
            >
            </div>
          ))}
        </div>

      {/* Capa 7: Vegetación frontal - árboles grandes */}
      <div 
        className={styles.vegetationFront}
        style={{ transform: `translateX(${-baseOffset * 0.6 * speedMultiplier}px)` }}
      >
        {Array.from({ length: 15 }, (_, i) => (
          <div
            key={i}
            className={`${styles.tree} ${styles.foreground}`}
            style={{
              left: `${i * 8}%`
            }}
          >
          </div>
        ))}
      </div>

      {/* Capa 8: Insectos volando */}
      {isClient && (
        <div className={styles.insects}>
          {randomPositions.insects.map((insect, i) => (
            <div
              key={i}
              className={`${styles.insect} ${styles[`insect${(i % 3) + 1}`]}`}
              style={{
                left: `${insect.left}%`,
                top: `${insect.top}%`,
                animationDelay: `${insect.delay}s`
              }}
            >
            </div>
          ))}
        </div>
      )}

      {/* Capa 9: Agua con efectos - capa más rápida */}
      <div className={styles.waterLayer}>
        <div 
          className={styles.water}
          style={{ transform: `translateX(${-baseOffset * 0.8 * speedMultiplier}px)` }}
        >
          {/* Ondas del agua */}
          <div className={styles.waterWaves}></div>
          
          {/* Nenúfares como plataformas distribuidas */}
          <div className={styles.lilyPads}>
            {Array.from({ length: 25 }, (_, i) => (
              <div
                key={i}
                className={`${styles.lilyPad} ${styles[`lily${(i % 4) + 1}`]}`}
                style={{
                  left: `${i * 4}%`, // Mayor distribución horizontal
                  top: `${40 + (i % 6) * 10}%`, // Distribución vertical por todo el lago
                  animationDelay: `${i * 0.2}s`,
                  scale: `${0.8 + (i % 3) * 0.2}` // Variación en tamaño
                }}
              >
              </div>
            ))}
          </div>

          {/* Peces nadando */}
          <div className={styles.fish}>
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={`${styles.fishSwimming} ${styles[`fish${(i % 4) + 1}`]}`}
                style={{
                  left: `${i * 15}%`,
                  animationDelay: `${i * 1.5}s`,
                  animationDuration: isClient ? `${randomPositions.fishDurations[i] || 6}s` : '6s'
                }}
              >
              </div>
            ))}
          </div>

          {/* Reflejos en el agua */}
          <div className={styles.waterReflections}></div>
        </div>
      </div>

      {/* META VISUAL - Solo aparece cerca del final */}
      {showFinishLine && gameProgress > 85 && (
        <div className={styles.finishLineContainer}>
          <div 
            className={styles.finishLine}
            style={{ 
              transform: `translateX(${-baseOffset * 0.9 * speedMultiplier + 800}px)`,
              opacity: Math.min(1, (gameProgress - 85) / 15) // Aparece gradualmente
            }}
          >
            {/* Banderines de meta */}
            <div className={styles.finishFlags}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className={styles.finishFlag}>
                </div>
              ))}
            </div>
            
            {/* Arco de meta */}
            <div className={styles.finishArch}>
              <div className={styles.archText}>¡META!</div>
              <div className={styles.celebrationEffects}>
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className={styles.confetti} style={{ animationDelay: `${i * 0.1}s` }}>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Plataforma final especial */}
            <div className={styles.finalPlatform}>
            </div>
          </div>
        </div>
      )}

      {/* Efectos de partículas ambientales */}
      {isClient && (
        <div className={styles.ambientParticles}>
          {timeOfDay === 'morning' && (
            <>
              {/* Rocío matutino */}
              {randomPositions.dewDrops.map((dewDrop, i) => (
                <div
                  key={i}
                  className={`${styles.dewDrop} ${styles[`dew${(i % 3) + 1}`]}`}
                  style={{
                    left: `${dewDrop.left}%`,
                    top: `${dewDrop.top}%`,
                    animationDelay: `${dewDrop.delay}s`
                  }}
                >
                </div>
              ))}
            </>
          )}

          {timeOfDay === 'afternoon' && (
            <>
              {/* Polen flotando */}
              {randomPositions.pollen.map((pollen, i) => (
                <div
                  key={i}
                  className={`${styles.pollen} ${styles[`pollen${(i % 2) + 1}`]}`}
                  style={{
                    left: `${pollen.left}%`,
                    top: `${pollen.top}%`,
                    animationDelay: `${pollen.delay}s`
                  }}
                >
                </div>
              ))}
            </>
          )}

          {timeOfDay === 'night' && (
            <>
              {/* Luciérnagas */}
              {randomPositions.fireflies.map((firefly, i) => (
                <div
                  key={i}
                  className={`${styles.firefly} ${styles[`firefly${(i % 3) + 1}`]}`}
                  style={{
                    left: `${firefly.left}%`,
                    top: `${firefly.top}%`,
                    animationDelay: `${firefly.delay}s`
                  }}
                >
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
