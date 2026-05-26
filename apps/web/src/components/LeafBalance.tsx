'use client';
import { useEffect, useState } from 'react';
import { useSorobanContracts } from '../hooks/useSorobanContracts';

export function LeafBalance({ address }: { address: string }) {
    const { leafToken } = useSorobanContracts();
    const [balance, setBalance] = useState('...');

    useEffect(() => {
        async function loadBalance() {
            try {
                // 'balance' é o método padrão SEP-41 do contrato de token
                const result = await leafToken.balance({ id: address });
                setBalance(result.toString());
            } catch (e) {
                setBalance('Erro ao ler');
                console.error("Falha ao ler saldo:", e);
            }
        }
        loadBalance();
    }, [leafToken, address]);

    return (
        <div className="p-3 bg-green-900 text-white rounded">
            Saldo $LEAF: {balance}
        </div>
    );
}