'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Paleta Deep Forest
// Background: #0B0F0D | Cards: #1A2E24 | Accent: #00F5A0

export default function B2BCheckout() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [activePackage, setActivePackage] = useState<number | null>(null);
    const router = useRouter();

    const handlePayment = async (trees: number) => {
        setLoading(true);
        setActivePackage(trees);

        try {
            const res = await fetch('/api/v1/etherfuse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyId: 'Parceiro_Marata_Oficial',
                    trees_bought: trees,
                }),
            });

            if (res.ok) {
                setSuccess(true);
                // Redireciona para o dashboard após breve feedback visual
                setTimeout(() => {
                    router.push('/empresa/dashboard');
                }, 2500);
            } else {
                const data = await res.json();
                alert(`Erro ao processar o pagamento: ${data.error ?? 'Verifique o terminal.'}`);
            }
        } catch (error) {
            console.error('[Checkout] Erro na transação:', error);
            alert('Falha de conexão com o servidor. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // ─── TELA DE SUCESSO ────────────────────────────────────────────────────────
    if (success) {
        return (
            <div
                style={{ background: '#0B0F0D' }}
                className="min-h-screen flex flex-col items-center justify-center p-10 font-sans text-[#E0E2E1]"
            >
                <div
                    style={{
                        background: '#1A2E24',
                        border: '1px solid #00F5A0',
                        boxShadow: '0 0 40px rgba(0,245,160,0.25)',
                    }}
                    className="p-10 text-center rounded-2xl max-w-lg w-full animate-pulse"
                >
                    <div className="text-7xl mb-6">🌲</div>
                    <h2 style={{ color: '#00F5A0' }} className="text-3xl font-bold mb-4">
                        Impacto Garantido!
                    </h2>
                    <p className="mb-6 text-gray-300 leading-relaxed">
                        O ativo <strong>RWA</strong> foi emitido via{' '}
                        <strong style={{ color: '#00F5A0' }}>Etherfuse</strong>. As Folhas já
                        foram creditadas na rede <strong>Stellar</strong> e vinculadas ao seu
                        perfil empresarial.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle
                                className="opacity-25"
                                cx="12" cy="12" r="10"
                                stroke="currentColor" strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            />
                        </svg>
                        Redirecionando para o Dashboard...
                    </div>
                    <button
                        onClick={() => router.push('/empresa/dashboard')}
                        style={{ background: '#00F5A0', color: '#0B0F0D' }}
                        className="w-full px-6 py-4 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg"
                    >
                        Acessar Dashboard B2B →
                    </button>
                </div>
            </div>
        );
    }

    // ─── VITRINE DE PACOTES ──────────────────────────────────────────────────────
    return (
        <div
            style={{ background: '#0B0F0D' }}
            className="min-h-screen text-[#E0E2E1] p-6 md:p-10 flex flex-col items-center justify-center font-sans"
        >
            <div className="text-center mb-12">
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#00F5A0' }}>
                    Florestas.Social — Protocolo B2B
                </p>
                <h1 style={{ color: '#00F5A0' }} className="text-4xl md:text-5xl font-bold mb-4">
                    Viveiro Corporativo
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl">
                    Transforme sua marca em uma força regenerativa. Escolha um pacote de Mognos
                    Africanos e recompense seus clientes com <strong>Cashback Verde</strong>.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">

                {/* ── PACOTE SEMENTE ──────────────────────────────────────── */}
                <div
                    style={{ background: '#1A2E24', border: '1px solid rgba(255,255,255,0.06)' }}
                    className="p-8 rounded-3xl w-full flex flex-col hover:border-[#00F5A0]/30 transition-all duration-300 group"
                >
                    <h3 className="text-2xl font-bold mb-2">Pacote Semente</h3>
                    <p className="text-gray-400 mb-6 flex-grow">
                        Ideal para pequenos empreendedores. 1 Árvore real que gera{' '}
                        <strong>100 Folhas</strong> para distribuição.
                    </p>
                    <div className="mb-8">
                        <p className="text-5xl font-bold text-white">R$ 50</p>
                        <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">
                            Pagamento único
                        </p>
                    </div>
                    <button
                        onClick={() => handlePayment(1)}
                        disabled={loading}
                        style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                        className="w-full bg-white/5 text-white py-4 rounded-2xl font-bold group-hover:bg-[#00F5A0] group-hover:text-[#0B0F0D] group-hover:border-[#00F5A0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && activePackage === 1 ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Conectando Etherfuse...
                            </span>
                        ) : 'Adquirir Semente'}
                    </button>
                </div>

                {/* ── PACOTE BOSQUE (DESTAQUE) ────────────────────────────── */}
                <div
                    style={{
                        background: '#1A2E24',
                        border: '2px solid #00F5A0',
                        boxShadow: '0 0 30px rgba(0,245,160,0.12)',
                    }}
                    className="p-8 rounded-3xl w-full flex flex-col relative md:scale-105"
                >
                    <div
                        style={{ background: '#00F5A0', color: '#0B0F0D' }}
                        className="absolute top-0 right-0 text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase"
                    >
                        Mais Vendido
                    </div>
                    <h3 style={{ color: '#00F5A0' }} className="text-2xl font-bold mb-2">
                        Pacote Bosque
                    </h3>
                    <p className="text-gray-300 mb-6 flex-grow">
                        Para marcas em crescimento. 5 Árvores reais (<strong>500 Folhas</strong>)
                        e Selo de Parceiro Sustentável.
                    </p>
                    <div className="mb-8">
                        <p className="text-5xl font-bold text-white">R$ 200</p>
                        <p style={{ color: 'rgba(0,245,160,0.6)' }} className="text-sm uppercase tracking-widest mt-1">
                            Economia de 20%
                        </p>
                    </div>
                    <button
                        onClick={() => handlePayment(5)}
                        disabled={loading}
                        style={{ background: '#00F5A0', color: '#0B0F0D' }}
                        className="w-full py-4 rounded-2xl font-bold hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,245,160,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && activePackage === 5 ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Conectando Etherfuse...
                            </span>
                        ) : 'Adquirir Bosque'}
                    </button>
                </div>

            </div>

            <p className="mt-12 text-gray-600 text-sm">
                Infraestrutura de ativos garantida por{' '}
                <strong style={{ color: 'rgba(0,245,160,0.7)' }}>Etherfuse</strong> &amp; Rede{' '}
                <strong style={{ color: 'rgba(0,245,160,0.7)' }}>Stellar</strong>.
            </p>
        </div>
    );
}