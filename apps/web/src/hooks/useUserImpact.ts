'use client';

import { useState, useEffect, useCallback } from 'react';

interface ImpactData {
  carbonOffset: number;
  treesPlanted: number;
}

export function useUserImpact(publicKey: string | null) {
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchImpact = useCallback(async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      setImpactData({ carbonOffset: 450, treesPlanted: 12 });
    } catch (e) {
      console.error("Erro ao carregar dados de impacto:", e);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchImpact();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchImpact]);

  return { impactData, loading, refresh: fetchImpact };
}