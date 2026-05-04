'use client';

import { useState, useEffect, useCallback } from 'react';

/** 
 * Interface para os Ativos Florestais (RWAs)
 * Adicionamos 'rarity' para categorizar os lotes de mogno.
 */
export interface ForestNFT {
    id: string;
    name: string;
    species: string;
    image_url: string;
    rarity: string; // Propriedade adicionada para resolver o erro
}

export function useForest(publicKey: string | null) {
    const [nfts, setNfts] = useState<ForestNFT[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchForest = useCallback(async () => {
        if (!publicKey) return;

        setLoading(true);
        try {
            // Mock de dados representando o manejo de Mogno Africano
            const mockNfts: ForestNFT[] = [
                {
                    id: "1",
                    name: "Lote Mogno 01",
                    species: "Khaya senegalensis",
                    image_url: "/tree-placeholder.jpg",
                    rarity: "Premium"
                }
            ];

            setNfts(mockNfts);
        } catch (e) {
            console.error("Erro ao carregar inventário:", e);
        } finally {
            setLoading(false);
        }
    }, [publicKey]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchForest();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchForest]);

    return { nfts, loading, refresh: fetchForest };
}