// apps/web/src/app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const router = useRouter();
    const [quantity, setQuantity] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hash, setHash] = useState<string | null>(null);

    const precoUnitario = 500; // Valor de face do Mogno em BRL

    const handleMockPayment = async () => {
        setLoading(true);
        try {
            // 1. Chama o nosso "Banco Falso" que aciona a Blockchain Real
            const res = await fetch('/api/v1/checkout/mock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quantity: quantity,
                    address: null, // 🎯 CORREÇÃO: Enviamos null para evitar o erro de endereço inválido
                })
            });

            const data = await res.json();

            if (data.success) {
                // Guarda o hash para mostrar na tela antes de redirecionar
                setHash(data.receipt.tx_hash);

                // Aguarda 3 segundos para o utilizador ver o sucesso, depois vai para o dashboard
                setTimeout(() => {
                    router.push('/empresa/dashboard?success=true');
                }, 4000);
            } else {
                throw new Error(data.error);
            }
        } catch (e: any) {
            alert(`Erro na simulação: ${e.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0F0D] text-[#E0E2E1] flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full bg-[#1A2E24] border border-[#00F5A0]/20 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,245,160,0.05)]">

                <div className="text-center mb-10">
                    <div className="text-5xl mb-4">🌳</div>
                    <h1 className="text-3xl font-black tracking-tight text-white">Pacote Bosque</h1>
                    <p className="text-[#00F5A0] text-sm font-bold uppercase tracking-widest mt-2">Modo Hackathon</p>
                </div>

                <div className="space-y-8">
                    <div className="bg-[#0B0F0D] p-5 rounded-2xl border border-white/5">
                        <label className="text-[11px] uppercase font-black text-gray-400 block mb-2">Quantidade de Árvores</label>
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={loading || hash !== null}
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 font-bold text-xl flex items-center justify-center disabled:opacity-50"
                            >-</button>

                            <span className="text-3xl font-black text-white">{quantity}</span>

                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                disabled={loading || hash !== null}
                                className="w-10 h-10 rounded-full bg-[#00F5A0]/10 text-[#00F5A0] hover:bg-[#00F5A0]/20 font-bold text-xl flex items-center justify-center disabled:opacity-50"
                            >+</button>
                        </div>
                    </div>

                    <div className="flex justify-between items-end px-2">
                        <div>
                            <p className="text-gray-400 text-sm">Total Estimado</p>
                            <p className="text-[10px] text-[#00F5A0] mt-1">Soroban Direct Payment</p>
                        </div>
                        <span className="text-3xl font-black text-white">R$ {(quantity * precoUnitario).toLocaleString('pt-BR')}</span>
                    </div>

                    {hash ? (
                        <div className="bg-[#00F5A0]/10 border border-[#00F5A0]/30 p-4 rounded-2xl text-center animate-pulse">
                            <p className="text-[#00F5A0] font-bold text-sm mb-1">✅ Ativo RWA Emitido!</p>
                            <p className="text-[10px] text-gray-400 mb-2 italic">Hash da Transação:</p>
                            <p className="text-[9px] text-gray-400 break-all bg-black/30 p-2 rounded-lg">{hash}</p>
                            <p className="text-[10px] text-gray-500 mt-3 uppercase font-bold tracking-tighter">A redirecionar para o dashboard...</p>
                        </div>
                    ) : (
                        <button
                            onClick={handleMockPayment}
                            disabled={loading}
                            className="w-full bg-[#00F5A0] text-[#0B0F0D] py-5 rounded-2xl font-black text-lg hover:shadow-[0_0_30px_rgba(0,245,160,0.3)] transition-all disabled:opacity-50"
                        >
                            {loading ? "A EMITIR NA STELLAR..." : "SIMULAR PAGAMENTO"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}