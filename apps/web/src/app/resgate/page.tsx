'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ResgateContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const code = searchParams.get('code');

    const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!code) {
            setStatus('error');
            setErrorMessage('Código de resgate não encontrado no QR Code.');
            return;
        }
        // Simula validação do código
        const timer = setTimeout(() => setStatus('ready'), 1500);
        return () => clearTimeout(timer);
    }, [code]);

    const handleClaim = async () => {
        setStatus('loading');
        try {
            const res = await fetch('/api/v1/resgate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, userId: 'user_demo_123' }),
            });

            if (res.ok) {
                setStatus('success');
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Falha ao resgatar');
            }
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0F0D] text-[#E0E2E1] flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="w-full max-w-sm bg-[#1A2E24] rounded-[3rem] p-10 border border-[#00F5A0]/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-[#00F5A0]/20 border-t-[#00F5A0] rounded-full animate-spin mb-6"></div>
                        <h2 className="text-xl font-bold">Processando Impacto...</h2>
                    </div>
                )}

                {status === 'ready' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-6xl mb-6">🍃</div>
                        <h1 className="text-2xl font-black mb-2 tracking-tight">Você Ganhou Folhas!</h1>
                        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                            A <span className="text-[#00F5A0] font-bold">Maratá</span> preparou um presente sustentável para você.
                        </p>
                        <button
                            onClick={handleClaim}
                            className="w-full bg-[#00F5A0] text-[#0B0F0D] py-4 rounded-2xl font-black text-lg hover:shadow-[0_0_30px_rgba(0,245,160,0.4)] transition-all active:scale-95"
                        >
                            COLETAR 10 $LEAF
                        </button>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-in zoom-in duration-500">
                        <div className="text-6xl mb-6">🌲</div>
                        <h2 className="text-2xl font-black text-[#00F5A0] mb-2">Resgate Concluído!</h2>
                        <p className="text-sm text-gray-300 mb-8">
                            Suas Folhas foram enviadas para sua carteira. Você agora é um guardião do Mogno Africano.
                        </p>
                        <button
                            onClick={() => router.push('/consumidor/dashboard')}
                            className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all"
                        >
                            Ver meu Impacto
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-in shake duration-300">
                        <div className="text-6xl mb-6">⚠️</div>
                        <h2 className="text-xl font-bold text-red-400 mb-2">Ops! Algo deu errado</h2>
                        <p className="text-sm text-gray-400 mb-8">{errorMessage}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-white/10 py-4 rounded-2xl font-bold"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                )}
            </div>
            <p className="mt-10 text-gray-600 text-[10px] uppercase tracking-[0.2em]">Powered by Stellar & Etherfuse</p>
        </div>
    );
}

// O Next.js exige Suspense para usar useSearchParams
export default function ResgatePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0B0F0D]" />}>
            <ResgateContent />
        </Suspense>
    );
}