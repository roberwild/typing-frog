import { useCallback, useRef } from 'react';

export const useSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  // Inicializar AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Audio no soportado:', error);
        return null;
      }
    }
    return audioContextRef.current;
  }, []);

  // Sonido de salto (tono ascendente)
  const playJumpSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Configuración del sonido de salto
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);

      // Envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);

      console.log('🔊 Sonido de salto reproducido');
    } catch (error) {
      console.warn('Error reproduciendo sonido de salto:', error);
    }
  }, [getAudioContext]);

  // Sonido de error/shock (sonido discordante)
  const playErrorSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      // Crear múltiples osciladores para efecto eléctrico
      const oscillators = [];
      const gainNodes = [];

      for (let i = 0; i < 3; i++) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Frecuencias discordantes
        const frequencies = [150, 180, 220];
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(frequencies[i], ctx.currentTime);

        // Modular la frecuencia para efecto eléctrico
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        lfo.frequency.setValueAtTime(20, ctx.currentTime);
        lfoGain.gain.setValueAtTime(30, ctx.currentTime);

        // Envelope para el shock
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

        oscillators.push(oscillator);
        gainNodes.push(gainNode);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.6);
        
        lfo.start(ctx.currentTime);
        lfo.stop(ctx.currentTime + 0.6);
      }

      console.log('🔊 Sonido de error reproducido');
    } catch (error) {
      console.warn('Error reproduciendo sonido de error:', error);
    }
  }, [getAudioContext]);

  // Sonido de muerte (tono descendente dramático)
  const playDeathSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Configuración del sonido de muerte
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(300, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 1);

      // Envelope dramático
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.4, ctx.currentTime + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 1);

      console.log('🔊 Sonido de muerte reproducido');
    } catch (error) {
      console.warn('Error reproduciendo sonido de muerte:', error);
    }
  }, [getAudioContext]);

  // Sonido de completar nivel (melodía de victoria)
  const playVictorySound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
      const noteDuration = 0.2;

      notes.forEach((frequency, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + index * noteDuration);

        const startTime = ctx.currentTime + index * noteDuration;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

        oscillator.start(startTime);
        oscillator.stop(startTime + noteDuration);
      });

      console.log('🔊 Sonido de victoria reproducido');
    } catch (error) {
      console.warn('Error reproduciendo sonido de victoria:', error);
    }
  }, [getAudioContext]);

  // Cleanup del AudioContext
  const cleanup = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  }, []);

  return {
    playJumpSound,
    playErrorSound,
    playDeathSound,
    playVictorySound,
    cleanup,
  };
};
