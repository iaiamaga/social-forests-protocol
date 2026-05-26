'use client';
import { useSorobanContracts } from '@/hooks/useSorobanContracts';
import { useEffect, useState } from 'react';
// IMPORTANTE: Importe o seu hook de carteira aqui. 
// Como você disse que a carteira já está integrada, você deve ter algo como:
// import { useWallet } from '@/context/WalletContext'; 

export default function Dashboard() {
    const { leafToken } = useSorobanContracts();
    // const { address } = useWallet(); // Descomente isto quando souber o seu hook de carteira

    const [balance, setBalance] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBalance() {
            if (!leafToken) return;

            try {
                // Substitua 'GB...' pelo address que vem do seu provider de carteira
                const userAddress = 'GB7AKSRVX2VW52FDVVVCWSDMKK6XUTR5MRB5PNK7672DJTVRSSGMGUE7';

                // Chamada ao contrato
                const result = await leafToken.balance({ id: userAddress });
                setBalance(result.toString());
            } catch (err) {
                console.error("Erro ao ler saldo:", err);
            }
        }
        fetchBalance();
    }, [leafToken]); // O hook garante que isso só re-executa se a conexão mudar

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Dashboard do Guardião</h1>
            <div className="mt-4 p-4 bg-gray-50 rounded border">
                <p>Balanço de $LEAF: <strong>{balance ?? "Carregando..."}</strong></p>
            </div>
        </div>
    );
}