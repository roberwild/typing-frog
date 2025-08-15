import { useCallback, useRef, useEffect } from 'react';
import { TimeOfDay } from '@/components/Parallax';

export const useAmbientSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);
  const currentTimeOfDay = useRef<TimeOfDay>('afternoon');
  const isPlayingRef = useRef(false);

  // Inicializar AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Audio ambiente no soportado:', error);
        return null;
      }
    }
    return audioContextRef.current;
  }, []);

  // Limpiar osciladores anteriores
  const cleanupOscillators = useCallback(() => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Ignorar errores al detener osciladores
      }
    });
    gainNodesRef.current.forEach(gain => {
      try {
        gain.disconnect();
      } catch (e) {
        // Ignorar errores al desconectar gains
      }
    });
    oscillatorsRef.current = [];
    gainNodesRef.current = [];
  }, []);

  // Crear oscilador con configuración específica
  const createOscillator = useCallback((
    frequency: number,
    type: OscillatorType,
    volume: number,
    ctx: AudioContext
  ) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = type;
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    oscillatorsRef.current.push(oscillator);
    gainNodesRef.current.push(gainNode);

    return { oscillator, gainNode };
  }, []);

  // Sonidos de mañana: Pájaros cantando, brisa suave
  const playMorningAmbient = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    cleanupOscillators();

    // Canto de pájaros (frecuencias altas moduladas)
    for (let i = 0; i < 3; i++) {
      const { oscillator, gainNode } = createOscillator(
        800 + Math.random() * 400,
        'sine',
        0.02 + Math.random() * 0.01,
        ctx
      );

      // Modular la frecuencia para simular canto
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      lfo.frequency.setValueAtTime(2 + Math.random() * 3, ctx.currentTime);
      lfoGain.gain.setValueAtTime(100 + Math.random() * 50, ctx.currentTime);

      oscillator.start(ctx.currentTime);
      lfo.start(ctx.currentTime);

      // Fade in/out aleatorio
      const duration = 3 + Math.random() * 4;
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      
      setTimeout(() => {
        try {
          oscillator.stop();
          lfo.stop();
        } catch (e) {
          // Ignorar errores
        }
      }, duration * 1000);
    }

    // Brisa suave (ruido rosa filtrado)
    const { oscillator: wind } = createOscillator(60, 'sawtooth', 0.005, ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    
    wind.disconnect();
    wind.connect(filter);
    filter.connect(gainNodesRef.current[gainNodesRef.current.length - 1]);
    
    wind.start(ctx.currentTime);

    console.log('🌅 Sonidos de mañana iniciados');
  }, [getAudioContext, cleanupOscillators, createOscillator]);

  // Sonidos de tarde: Agua fluyendo, insectos suaves
  const playAfternoonAmbient = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    cleanupOscillators();

    // Agua fluyendo (ruido blanco filtrado)
    const { oscillator: water, gainNode: waterGain } = createOscillator(100, 'sawtooth', 0.008, ctx);
    const waterFilter = ctx.createBiquadFilter();
    waterFilter.type = 'bandpass';
    waterFilter.frequency.setValueAtTime(150, ctx.currentTime);
    waterFilter.Q.setValueAtTime(1, ctx.currentTime);
    
    water.disconnect();
    water.connect(waterFilter);
    waterFilter.connect(waterGain);
    
    // Modular para simular flujo
    const waterLfo = ctx.createOscillator();
    const waterLfoGain = ctx.createGain();
    waterLfo.connect(waterLfoGain);
    waterLfoGain.connect(waterFilter.frequency);
    
    waterLfo.frequency.setValueAtTime(0.5, ctx.currentTime);
    waterLfoGain.gain.setValueAtTime(30, ctx.currentTime);
    
    water.start(ctx.currentTime);
    waterLfo.start(ctx.currentTime);

    // Insectos ocasionales (frecuencias medias)
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        const { oscillator: insect } = createOscillator(
          300 + Math.random() * 200,
          'triangle',
          0.01,
          ctx
        );
        
        insect.start(ctx.currentTime);
        setTimeout(() => {
          try {
            insect.stop();
          } catch (e) {
            // Ignorar errores
          }
        }, 500 + Math.random() * 1000);
      }, i * 3000 + Math.random() * 2000);
    }

    console.log('☀️ Sonidos de tarde iniciados');
  }, [getAudioContext, cleanupOscillators, createOscillator]);

  // Sonidos de noche: Grillos, viento nocturno, búho ocasional
  const playNightAmbient = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    cleanupOscillators();

    // Grillos (frecuencias altas rítmicas)
    for (let i = 0; i < 4; i++) {
      const { oscillator: cricket, gainNode: cricketGain } = createOscillator(
        1500 + Math.random() * 500,
        'square',
        0.008 + Math.random() * 0.004,
        ctx
      );

      // Ritmo de grillos
      const rhythm = ctx.createOscillator();
      const rhythmGain = ctx.createGain();
      rhythm.connect(rhythmGain);
      rhythmGain.connect(cricketGain.gain);
      
      rhythm.frequency.setValueAtTime(8 + Math.random() * 4, ctx.currentTime);
      rhythmGain.gain.setValueAtTime(0.008, ctx.currentTime);
      
      cricket.start(ctx.currentTime);
      rhythm.start(ctx.currentTime);
    }

    // Viento nocturno (frecuencias muy bajas)
    const { oscillator: nightWind } = createOscillator(40, 'sawtooth', 0.003, ctx);
    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(80, ctx.currentTime);
    
    nightWind.disconnect();
    nightWind.connect(windFilter);
    windFilter.connect(gainNodesRef.current[gainNodesRef.current.length - 1]);
    
    nightWind.start(ctx.currentTime);

    // Búho ocasional
    setTimeout(() => {
      const { oscillator: owl } = createOscillator(200, 'sine', 0.015, ctx);
      
      // Patrón del búho "hu-hu"
      const owlPattern = [0.2, 0.05, 0.2];
      let time = ctx.currentTime;
      
      owlPattern.forEach((duration, index) => {
        if (index % 2 === 0) {
          owl.frequency.setValueAtTime(180, time);
        } else {
          owl.frequency.setValueAtTime(0, time);
        }
        time += duration;
      });
      
      owl.start(ctx.currentTime);
      setTimeout(() => {
        try {
          owl.stop();
        } catch (e) {
          // Ignorar errores
        }
      }, 1000);
    }, 2000 + Math.random() * 5000);

    console.log('🌙 Sonidos de noche iniciados');
  }, [getAudioContext, cleanupOscillators, createOscillator]);

  // Iniciar sonidos ambientales según la hora
  const startAmbientSounds = useCallback((timeOfDay: TimeOfDay) => {
    if (isPlayingRef.current && currentTimeOfDay.current === timeOfDay) {
      return; // Ya reproduciendo la misma hora
    }

    currentTimeOfDay.current = timeOfDay;
    isPlayingRef.current = true;

    // Limpiar sonidos anteriores
    cleanupOscillators();

    // Iniciar nuevos sonidos según la hora
    switch (timeOfDay) {
      case 'morning':
        playMorningAmbient();
        break;
      case 'afternoon':
        playAfternoonAmbient();
        break;
      case 'night':
        playNightAmbient();
        break;
    }

    // Repetir sonidos ambientales cada cierto tiempo
    setTimeout(() => {
      if (isPlayingRef.current && currentTimeOfDay.current === timeOfDay) {
        startAmbientSounds(timeOfDay);
      }
    }, 8000 + Math.random() * 4000);
  }, [playMorningAmbient, playAfternoonAmbient, playNightAmbient, cleanupOscillators]);

  // Detener sonidos ambientales
  const stopAmbientSounds = useCallback(() => {
    isPlayingRef.current = false;
    cleanupOscillators();
    console.log('🔇 Sonidos ambientales detenidos');
  }, [cleanupOscillators]);

  // Sonido de lluvia (para efectos especiales)
  const playRainSound = useCallback((intensity: number = 0.5) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    const { oscillator: rain, gainNode: rainGain } = createOscillator(
      80, 
      'sawtooth', 
      0.01 * intensity, 
      ctx
    );
    
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'highpass';
    rainFilter.frequency.setValueAtTime(200, ctx.currentTime);
    
    rain.disconnect();
    rain.connect(rainFilter);
    rainFilter.connect(rainGain);
    
    // Modular para simular gotas
    const rainLfo = ctx.createOscillator();
    const rainLfoGain = ctx.createGain();
    rainLfo.connect(rainLfoGain);
    rainLfoGain.connect(rainGain.gain);
    
    rainLfo.frequency.setValueAtTime(15, ctx.currentTime);
    rainLfoGain.gain.setValueAtTime(0.005 * intensity, ctx.currentTime);
    
    rain.start(ctx.currentTime);
    rainLfo.start(ctx.currentTime);

    console.log('🌧️ Sonido de lluvia iniciado');
  }, [getAudioContext, createOscillator]);

  // Sonido de trueno (para tiempo agotado)
  const playThunderSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Trueno grave y dramático
    const { oscillator: thunder, gainNode: thunderGain } = createOscillator(
      30,
      'sawtooth',
      0.3,
      ctx
    );

    // Envelope dramático
    thunderGain.gain.setValueAtTime(0, ctx.currentTime);
    thunderGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
    thunderGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);

    thunder.start(ctx.currentTime);
    
    setTimeout(() => {
      try {
        thunder.stop();
      } catch (e) {
        // Ignorar errores
      }
    }, 2000);

    console.log('⚡ Sonido de trueno reproducido');
  }, [getAudioContext, createOscillator]);

  // Cleanup al desmontar
  const cleanup = useCallback(() => {
    stopAmbientSounds();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  }, [stopAmbientSounds]);

  // Cleanup automático al desmontar el componente
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    startAmbientSounds,
    stopAmbientSounds,
    playRainSound,
    playThunderSound,
    cleanup,
  };
};
