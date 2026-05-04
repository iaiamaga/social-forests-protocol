'use client';

import { useState, useEffect, useCallback } from 'react';

interface HeroData {
  xp: number;
  level: number;
  title: string;
}

export function useHeroState(publicKey: string | null) {
  const [heroState, setHeroState] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchHeroState = useCallback(async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      // Simulação de dados de progresso no Florestas.Social
      setHeroState({ xp: 1200, level: 5, title: "Protetor da Mata" });
    } catch (e) {
      console.error("Erro ao buscar estado do herói:", e);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHeroState();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchHeroState]);

  return {
    heroState,
    loading,
    isForging: loading,
    forgeTree: fetchHeroState,
    refresh: fetchHeroState
  };
}