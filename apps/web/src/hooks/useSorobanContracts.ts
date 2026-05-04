'use client';

import { useState } from 'react';

// Interface ajustada para a biometria do Mogno Africano (Khaya senegalensis)
export interface TreeRecord {
  id: string;
  species: string;
  planting_date: number;
  status: string;
  carbon_kg: number;
  height_cm: number;
  health_score: number;
  geo_hash: string;
}

export function useSorobanContracts() {
  const [isLoading] = useState(false); // Removido setIsLoading
  const [error] = useState<string | null>(null); // Removido setError

  // Removido o argumento 'year' que não estava sendo usado
  const getTreeRecord = async (id: string): Promise<TreeRecord | null> => {
    return {
      id,
      species: "Khaya senegalensis",
      planting_date: Date.now(),
      status: "Saudável",
      carbon_kg: 45.2,
      height_cm: 420,
      health_score: 98,
      geo_hash: "7h2u1s"
    };
  };

  // Removido o argumento 'userAddress' que não estava sendo usado
  const forgeTree = async () => {
    return {
      success: true,
      message: "Ativo de Mogno Africano registrado com sucesso!",
      hash: "stellar-tx-hash-123"
    };
  };

  return { getTreeRecord, forgeTree, isLoading, error };
}