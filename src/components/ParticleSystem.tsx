'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from '@/styles/ParticleSystem.module.css';

export type ParticleType = 'splash' | 'sparkle' | 'ripple' | 'bubble' | 'lightning';

interface Particle {
  id: string;
  type: ParticleType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  emoji: string;
}

interface ParticleSystemProps {
  active?: boolean;
  maxParticles?: number;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  active = true,
  maxParticles = 50
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Crear nueva partícula
  const createParticle = useCallback((
    type: ParticleType,
    x: number,
    y: number,
    customVelocity?: { vx: number; vy: number }
  ): Particle => {
    const id = `${type}-${Date.now()}-${Math.random()}`;
    
    const configs = {
      splash: {
        emoji: ['💧', '💦', '🌊'][Math.floor(Math.random() * 3)],
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 3 - 1,
        life: 30,
        size: 0.8 + Math.random() * 0.4
      },
      sparkle: {
        emoji: ['✨', '⭐', '🌟'][Math.floor(Math.random() * 3)],
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.random() * 2,
        life: 40,
        size: 0.5 + Math.random() * 0.5
      },
      ripple: {
        emoji: '〰️',
        vx: 0,
        vy: 0,
        life: 25,
        size: 0.3 + Math.random() * 0.7
      },
      bubble: {
        emoji: ['🫧', '💭'][Math.floor(Math.random() * 2)],
        vx: (Math.random() - 0.5) * 1,
        vy: -Math.random() * 2 - 0.5,
        life: 50,
        size: 0.4 + Math.random() * 0.6
      },
      lightning: {
        emoji: ['⚡', '🔆', '✦'][Math.floor(Math.random() * 3)],
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 20,
        size: 0.8 + Math.random() * 0.4
      }
    };

    const config = configs[type];
    
    return {
      id,
      type,
      x,
      y,
      vx: customVelocity?.vx ?? config.vx,
      vy: customVelocity?.vy ?? config.vy,
      life: config.life,
      maxLife: config.life,
      size: config.size,
      emoji: config.emoji
    };
  }, []);

  // Actualizar partículas
  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setParticles(prevParticles => {
        return prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1, // Gravedad
            life: particle.life - 1
          }))
          .filter(particle => particle.life > 0);
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [active]);

  // Exponer función para crear partículas desde el exterior
  const addParticle = useCallback((
    type: ParticleType,
    x: number,
    y: number,
    customVelocity?: { vx: number; vy: number }
  ) => {
    setParticles(prev => {
      if (prev.length >= maxParticles) {
        return prev.slice(1).concat(createParticle(type, x, y, customVelocity));
      }
      return [...prev, createParticle(type, x, y, customVelocity)];
    });
  }, [createParticle, maxParticles]);

  // Crear partículas de splash (para saltos)
  const createSplash = useCallback((x: number, y: number, intensity: number = 1) => {
    const count = Math.floor(3 + intensity * 2);
    for (let i = 0; i < count; i++) {
      addParticle('splash', 
        x + (Math.random() - 0.5) * 30, 
        y + (Math.random() - 0.5) * 10
      );
    }
    
    // Agregar algunas burbujas
    for (let i = 0; i < 2; i++) {
      addParticle('bubble', 
        x + (Math.random() - 0.5) * 20, 
        y + Math.random() * 10
      );
    }
  }, [addParticle]);

  // Crear partículas de shock eléctrico
  const createLightning = useCallback((x: number, y: number, intensity: number = 1) => {
    const count = Math.floor(2 + intensity * 3);
    for (let i = 0; i < count; i++) {
      addParticle('lightning', 
        x + (Math.random() - 0.5) * 40, 
        y + (Math.random() - 0.5) * 40
      );
    }
    
    // Agregar chispas
    for (let i = 0; i < 3; i++) {
      addParticle('sparkle', 
        x + (Math.random() - 0.5) * 50, 
        y + (Math.random() - 0.5) * 50
      );
    }
  }, [addParticle]);

  // Crear ondas en el agua
  const createRipples = useCallback((x: number, y: number) => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        addParticle('ripple', x, y);
      }, i * 200);
    }
  }, [addParticle]);

  // Exponer funciones públicas
  React.useImperativeHandle(React.createRef(), () => ({
    createSplash,
    createLightning,
    createRipples,
    addParticle
  }));

  return (
    <div className={styles.particleContainer}>
      {particles.map(particle => {
        const lifePercentage = particle.life / particle.maxLife;
        const opacity = Math.sin(lifePercentage * Math.PI);
        const scale = particle.size * (0.5 + lifePercentage * 0.5);
        
        return (
          <div
            key={particle.id}
            className={`${styles.particle} ${styles[particle.type]}`}
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity,
              transform: `scale(${scale})`,
              fontSize: `${scale}rem`
            }}
          >
            {particle.emoji}
          </div>
        );
      })}
    </div>
  );
};

// Hook personalizado para usar el sistema de partículas
export const useParticles = () => {
  const [particleSystem, setParticleSystem] = useState<any>(null);

  const createSplash = useCallback((x: number, y: number, intensity?: number) => {
    particleSystem?.createSplash(x, y, intensity);
  }, [particleSystem]);

  const createLightning = useCallback((x: number, y: number, intensity?: number) => {
    particleSystem?.createLightning(x, y, intensity);
  }, [particleSystem]);

  const createRipples = useCallback((x: number, y: number) => {
    particleSystem?.createRipples(x, y);
  }, [particleSystem]);

  const addParticle = useCallback((
    type: ParticleType,
    x: number,
    y: number,
    customVelocity?: { vx: number; vy: number }
  ) => {
    particleSystem?.addParticle(type, x, y, customVelocity);
  }, [particleSystem]);

  return {
    ParticleSystemComponent: ParticleSystem,
    createSplash,
    createLightning,
    createRipples,
    addParticle,
    setParticleSystem
  };
};
