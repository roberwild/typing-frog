import { useState, useCallback, useRef } from 'react';
import { FrogState } from '@/components/Frog';

export const useFrogState = () => {
  const [frogState, setFrogState] = useState<FrogState>('idle');
  const stateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar timeout anterior
  const clearStateTimeout = useCallback(() => {
    if (stateTimeoutRef.current) {
      clearTimeout(stateTimeoutRef.current);
      stateTimeoutRef.current = null;
    }
  }, []);

  // Manejar animación completada
  const handleAnimationComplete = useCallback(() => {
    // Después de animaciones temporales, volver a idle
    if (frogState === 'jumping' || frogState === 'shock' || frogState === 'recovering') {
      setFrogState('idle');
    }
  }, [frogState]);

  // Triggear salto (carácter correcto)
  const triggerJump = useCallback(() => {
    clearStateTimeout();
    
    // Forzar reinicio de animación si ya se está saltando
    setFrogState('idle');

    stateTimeoutRef.current = setTimeout(() => {
      setFrogState('jumping');
      console.log('🐸 Rana saltando');
    }, 10); // Delay mínimo para que React procese el cambio de estado
  }, [clearStateTimeout]);

  // Triggear shock (error)
  const triggerShock = useCallback(() => {
    clearStateTimeout();
    setFrogState('shock');
    console.log('⚡ Rana recibiendo shock');
    
    // Después del shock, mostrar estado de recovery por un momento
    stateTimeoutRef.current = setTimeout(() => {
      setFrogState('recovering');
    }, 600); // Duración del shock
  }, [clearStateTimeout]);

  // Triggear muerte (sin vidas)
  const triggerDeath = useCallback(() => {
    clearStateTimeout();
    setFrogState('dead');
    console.log('💀 Rana muriendo');
  }, [clearStateTimeout]);

  // Resetear a idle
  const resetToIdle = useCallback(() => {
    clearStateTimeout();
    setFrogState('idle');
    console.log('🔄 Rana en estado idle');
  }, [clearStateTimeout]);

  // Cleanup al desmontar
  const cleanup = useCallback(() => {
    clearStateTimeout();
  }, [clearStateTimeout]);

  return {
    frogState,
    triggerJump,
    triggerShock,
    triggerDeath,
    resetToIdle,
    handleAnimationComplete,
    cleanup,
  };
};
