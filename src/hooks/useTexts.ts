import { useState, useEffect } from 'react';
import { TextsData, DifficultyLevel } from '@/types/game';

// Mapeo de alias para compatibilidad
const LEVEL_MAPPING: Record<string, DifficultyLevel> = {
  beginner: 'principiante',
  intermediate: 'intermedio',
  advanced: 'avanzado',
};

// Texto de fallback si falla la carga
const FALLBACK_TEXTS: TextsData = {
  principiante: [
    'La rana salta feliz entre las hojas verdes del lago. El sol brilla en el agua cristalina mientras los peces nadan.',
  ],
  intermedio: [
    'La tecnología ha cambiado nuestras vidas de manera extraordinaria. Los teléfonos móviles nos conectan instantáneamente con personas de todo el mundo.',
  ],
  avanzado: [
    'La inteligencia artificial representa uno de los avances tecnológicos más significativos del siglo XXI. Su capacidad para procesar información ha revolucionado industrias enteras.',
  ],
};

export const useTexts = () => {
  const [texts, setTexts] = useState<TextsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTexts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Cargando textos desde /data/texts.json...');

        // Intentar cargar el archivo JSON
        const response = await fetch('/data/texts.json');
        console.log('📡 Respuesta del fetch:', response.status, response.statusText);
        
        if (!response.ok) {
          throw new Error(`Error al cargar texts.json: ${response.status}`);
        }

        const data = await response.json();
        console.log('📝 Datos cargados:', data);

        // Validar estructura obligatoria
        const requiredKeys: DifficultyLevel[] = [
          'principiante',
          'intermedio',
          'avanzado',
        ];
        
        for (const key of requiredKeys) {
          if (!data[key] || !Array.isArray(data[key]) || data[key].length === 0) {
            throw new Error(`Clave obligatoria '${key}' faltante o vacía en texts.json`);
          }
        }

        console.log('✅ Textos cargados exitosamente');
        setTexts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        console.error('❌ Error cargando textos:', errorMessage);
        console.log('🔧 Usando textos de fallback');
        setError(errorMessage);
        setTexts(FALLBACK_TEXTS);
      } finally {
        setLoading(false);
        console.log('🏁 Carga de textos completada');
      }
    };

    loadTexts();
  }, []);

  const getRandomText = (level: DifficultyLevel): string => {
    if (!texts) {
      return FALLBACK_TEXTS[level][0];
    }

    // Mapear alias si es necesario
    const mappedLevel = LEVEL_MAPPING[level] || level;
    const levelTexts = texts[mappedLevel] || texts[level];

    if (!levelTexts || levelTexts.length === 0) {
      console.error(`No hay textos disponibles para el nivel: ${level}`);
      return FALLBACK_TEXTS[mappedLevel]?.[0] || FALLBACK_TEXTS.principiante[0];
    }

    const randomIndex = Math.floor(Math.random() * levelTexts.length);
    return levelTexts[randomIndex];
  };

  return {
    texts,
    loading,
    error,
    getRandomText,
  };
};
