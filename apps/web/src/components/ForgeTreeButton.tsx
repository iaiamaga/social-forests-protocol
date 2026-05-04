'use client';

import { useState } from 'react';
import { forgeTreeTransaction } from '../lib/soroban/transactions';

export default function ForgeTreeButton({ userPublicKey }: { userPublicKey: string }) {
    const [loading, setLoading] = useState(false);
    const [hash, setHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleForge = async () => {
        setLoading(true);
        setError(null);
        setHash(null);

        try {
            const txHash = await forgeTreeTransaction(userPublicKey);
            setHash(txHash);
        } catch (err: unknown) {
            /** 
             * CORREÇÃO: Substituímos 'any' por uma verificação de tipo.
             * Isso garante que o erro seja tratado com segurança.
             */
            const errorMessage = err instanceof Error ? err.message : 'Erro ao forjar árvore.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-8 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-2 uppercase italic">
                Transformar Estoque em Ativo
            </h3>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
                Forje um dNFT que representa um lastro real de Mogno Africano.
                Este processo consome **100 LEAF**.
            </p>

            <button
                onClick={handleForge}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-black py-4 px-6 rounded-2xl transition-all flex justify-center items-center uppercase tracking-widest"
            >
                {loading ? 'Processando na Blockchain...' : 'Forjar dNFT (100 LEAF)'}
            </button>

            {hash && (
                <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-800/30 rounded-2xl text-xs text-emerald-400 break-all font-mono">
                    <p className="font-bold mb-1 uppercase">Sucesso!</p>
                    Hash: {hash}
                </div>
            )}

            {error && (
                <div className="mt-6 p-4 bg-red-900/20 border border-red-800/30 rounded-2xl text-xs text-red-400 font-bold uppercase">
                    {error}
                </div>
            )}
        </div>
    );
}