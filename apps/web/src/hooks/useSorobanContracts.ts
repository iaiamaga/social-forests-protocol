'use client';

import { useState } from 'react';

/**
 * Dados de telemetria de uma árvore (dNFT) no forest_mythos_vault.
 * Alinhado com DnftRecord do contrato Rust.
 */
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

/**
 * Hook para leitura de dados on-chain dos contratos Soroban.
 * Usa o endpoint x402 /api/v1/x402/rwa-data/[id] para dados pagos,
 * ou simulação direta para dados públicos.
 */
export function useSorobanContracts() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTreeRecord = async (id: string): Promise<TreeRecord | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Tenta buscar via API (sem paywall para leitura básica)
      const res = await fetch(`/api/v1/x402/rwa-data/${id}`);

      if (res.status === 402) {
        // Dados pagos — retorna placeholder indicando que precisa de pagamento
        return {
          id,
          species: "Khaya senegalensis",
          planting_date: 0,
          status: "Requer pagamento x402 para acessar telemetria",
          carbon_kg: 0,
          height_cm: 0,
          health_score: 0,
          geo_hash: "",
        };
      }

      if (res.ok) {
        const data = await res.json();
        return {
          id,
          species: "Khaya senegalensis",
          planting_date: Number(data.data?.birthDate ?? 0),
          status: `Fase ${data.data?.phase ?? 1}`,
          carbon_kg: Number(data.data?.carbonG ?? 0) / 1000,
          height_cm: Number(data.data?.biomassKg ?? 0) * 10, // estimativa
          health_score: data.data?.phase >= 2 ? 95 : 80,
          geo_hash: "7h2u1s",
        };
      }

      return null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const forgeTree = async () => {
    // Delegado ao useX402Payment hook — este é apenas para leitura
    return {
      success: false,
      message: "Use useX402Payment para operações de escrita.",
      hash: "",
    };
  };

  return { getTreeRecord, forgeTree, isLoading, error };
}
