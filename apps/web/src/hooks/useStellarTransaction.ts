'use client';
import { useState } from 'react';

/**
 * Este hook simplifica o processo de enviar transações.
 * Ele gerencia o estado de "carregando" e o "erro" para você.
 */
export function useStellarTransaction() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async (txPromise: Promise<any>) => {
        setLoading(true);
        setError(null);
        try {
            // Executa a transação (o SDK do Soroban resolve a assinatura via Freighter automaticamente)
            const result = await txPromise;
            setLoading(false);
            return result;
        } catch (err: any) {
            console.error("Erro na transação:", err);
            setError(err.message || "Falha ao enviar transação");
            setLoading(false);
            throw err;
        }
    };

    return { execute, loading, error };
}