'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  TreePine,
  Leaf,
  Wind,
  QrCode,
  ChevronRight,
  Loader2,
  X,
  BarChart3,
  Package,
} from 'lucide-react';
import Link from 'next/link';

// ─── Tipagem ─────────────────────────────────────────────────────────────────
interface DistributePayload {
  type: 'NEW' | 'LINK';
  leafAmount: number;
  totalScans?: number;
  productId?: string;
  companyId: string;
}

interface DistributeResponse {
  success: boolean;
  campaignId?: string;
  qrCodeUrl?: string;
  error?: string;
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function EmpresaDashboard() {
  const { session } = useAuth();
  const companyId = session?.address ?? 'EMPRESA_MOCK';

  // Estados do Modal
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<'choice' | 'form'>('choice');
  const [type, setType] = useState<'NEW' | 'LINK'>('NEW');
  const [loading, setLoading] = useState(false);
  const [campaignResult, setCampaignResult] = useState<DistributeResponse | null>(null);

  // Campos do Formulário
  const [leafAmount, setLeafAmount] = useState(10);
  const [totalScans, setTotalScans] = useState(100);
  const [productId, setProductId] = useState('');

  const openModal = () => {
    setShowModal(true);
    setStep('choice');
    setCampaignResult(null);
    setProductId('');
    setLeafAmount(10);
    setTotalScans(100);
  };

  const closeModal = () => {
    setShowModal(false);
    setStep('choice');
    setCampaignResult(null);
  };

  /**
   * Chama /api/v1/distribute para vincular saldo $LEAF a uma campanha ou produto.
   * Preparado para a integração com Stellar Anchors (SEP-0006/0031) quando disponível.
   */
  const handleDistribute = async () => {
    setLoading(true);
    try {
      const payload: DistributePayload = {
        type,
        leafAmount,
        companyId,
        ...(type === 'NEW' && { totalScans }),
        ...(type === 'LINK' && { productId }),
      };

      const res = await fetch('/api/v1/distribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: DistributeResponse = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Falha ao processar distribuição.');

      setCampaignResult(data);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Erro desconhecido.';
      setCampaignResult({ success: false, error: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B0F0D] min-h-screen text-[#E0E2E1] p-6 md:p-10 font-sans relative">

      {/* ── BACKGROUND GLOW ────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-[-20%] right-[-15%] w-[600px] h-[600px] bg-[#00F5A0]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-emerald-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#00F5A0]/60 mb-1 font-bold">
              Florestas.Social · Painel Executivo
            </p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Painel de Impacto
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Bem-vindo, <span className="text-[#00F5A0] font-semibold">Parceiro Maratá</span>
            </p>
          </div>

          {/* Saldo de Folhas */}
          <div className="bg-[#00F5A0]/5 border border-[#00F5A0]/20 backdrop-blur-sm px-6 py-4 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-[#00F5A0]/10 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#00F5A0]" />
            </div>
            <div>
              <p className="text-[10px] text-[#00F5A0]/70 uppercase font-black tracking-widest mb-0.5">
                Saldo de Folhas ($LEAF)
              </p>
              <p className="text-2xl font-bold text-white font-mono">500.00</p>
            </div>
          </div>
        </header>

        {/* ── MÉTRICAS RWA ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">

          {/* Ativos RWA */}
          <div className="bg-white/3 border border-white/8 rounded-3xl p-7 hover:border-[#00F5A0]/30 transition-all duration-300 group">
            <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <TreePine className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">
              Ativos RWA (Mogno)
            </p>
            <p className="text-4xl font-extrabold text-white">5</p>
            <p className="text-xs text-[#00F5A0] mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#00F5A0] rounded-full animate-pulse" />
              Garantido via Etherfuse · Rede Stellar
            </p>
          </div>

          {/* Carbono Retido */}
          <div className="bg-white/3 border border-white/8 rounded-3xl p-7 hover:border-blue-400/30 transition-all duration-300 group">
            <div className="w-11 h-11 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Wind className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mb-2">
              Carbono Retido
            </p>
            <p className="text-4xl font-extrabold text-white">1.25</p>
            <p className="text-xs text-blue-400 mt-2">toneladas — métrica on-chain</p>
          </div>

          {/* Ação: Distribuir Cashback */}
          <div className="bg-[#00F5A0]/5 border-2 border-[#00F5A0]/30 rounded-3xl p-7 flex flex-col justify-between hover:border-[#00F5A0]/60 hover:shadow-[0_0_30px_rgba(0,245,160,0.1)] transition-all duration-300">
            <div>
              <div className="w-11 h-11 bg-[#00F5A0]/10 rounded-xl flex items-center justify-center mb-5">
                <QrCode className="w-5 h-5 text-[#00F5A0]" />
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Crie campanhas sustentáveis e vincule $LEAF a produtos físicos ou digitais.
              </p>
            </div>
            <button
              id="btn-open-distribute-modal"
              onClick={openModal}
              className="w-full bg-[#00F5A0] text-[#0B0F0D] py-3.5 rounded-xl font-black text-sm hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(0,245,160,0.25)] flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Gerar / Vincular QR Code
            </button>
          </div>
        </div>

        {/* ── LINKS RÁPIDOS ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <Link
            href="/empresa/analytics"
            className="group bg-white/3 border border-white/8 rounded-2xl p-5 flex items-center justify-between hover:border-blue-400/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-sm text-slate-300">Analytics ESG</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
          </Link>
          <Link
            href="/empresa/missoes"
            className="group bg-white/3 border border-white/8 rounded-2xl p-5 flex items-center justify-between hover:border-purple-400/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-sm text-slate-300">Campanhas & Missões</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
          </Link>
        </div>

        {/* ── HISTÓRICO ────────────────────────────────────────────────────── */}
        <div className="bg-white/3 border border-white/8 rounded-3xl p-8">
          <h2 className="text-lg font-bold text-white mb-6">Últimas Transações no Protocolo</h2>
          <div className="flex justify-between items-center p-4 bg-[#0B0F0D]/60 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="bg-[#00F5A0]/10 p-2.5 rounded-xl">
                <TreePine className="w-4 h-4 text-[#00F5A0]" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Aquisição de Pacote Bosque</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Tx: stellar_0x...a1b2</p>
              </div>
            </div>
            <span className="text-[#00F5A0] font-bold text-sm">+500 $LEAF</span>
          </div>
        </div>

      </div>{/* /max-w */}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL DE DISTRIBUIÇÃO ────────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-[#111B15] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">

            {/* Fechar */}
            <button
              onClick={closeModal}
              id="btn-close-distribute-modal"
              className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ── Resultado da API ── */}
            {campaignResult && (
              <div className={`mb-6 p-4 rounded-2xl border ${
                campaignResult.success
                  ? 'bg-[#00F5A0]/5 border-[#00F5A0]/30'
                  : 'bg-red-500/5 border-red-500/30'
              }`}>
                {campaignResult.success ? (
                  <>
                    <p className="text-[#00F5A0] font-bold text-sm mb-1">✓ Impacto Ativado!</p>
                    <p className="text-xs text-slate-400 font-mono">
                      Campanha ID: {campaignResult.campaignId}
                    </p>
                    {campaignResult.qrCodeUrl && (
                      <p className="text-xs text-[#00F5A0]/60 mt-1 break-all">
                        QR: {campaignResult.qrCodeUrl}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-red-400 text-sm">{campaignResult.error}</p>
                )}
              </div>
            )}

            {/* ── Step: Escolha ── */}
            {step === 'choice' && !campaignResult && (
              <>
                <h2 id="modal-title" className="text-2xl font-bold text-white mb-2">
                  Como deseja distribuir?
                </h2>
                <p className="text-slate-400 mb-8 text-sm">
                  Escolha a origem do impacto para o seu cliente.
                </p>

                <div className="space-y-4">
                  <button
                    id="btn-type-new-campaign"
                    onClick={() => { setType('NEW'); setStep('form'); }}
                    className="w-full p-5 bg-white/4 border border-white/10 rounded-2xl text-left hover:border-[#00F5A0]/50 hover:bg-[#00F5A0]/5 transition-all group"
                  >
                    <span className="block font-bold text-white group-hover:text-[#00F5A0] transition-colors">
                      Nova Campanha Digital
                    </span>
                    <span className="text-xs text-slate-500 italic mt-1 block">
                      Ideal para Influencers, Eventos ou Redes Sociais.
                    </span>
                  </button>

                  <button
                    id="btn-type-link-product"
                    onClick={() => { setType('LINK'); setStep('form'); }}
                    className="w-full p-5 bg-white/4 border border-white/10 rounded-2xl text-left hover:border-[#00F5A0]/50 hover:bg-[#00F5A0]/5 transition-all group"
                  >
                    <span className="block font-bold text-white group-hover:text-[#00F5A0] transition-colors">
                      Vincular a Produto Físico
                    </span>
                    <span className="text-xs text-slate-500 italic mt-1 block">
                      Ativar QR Codes que já existem em embalagens.
                    </span>
                  </button>
                </div>
              </>
            )}

            {/* ── Step: Formulário ── */}
            {step === 'form' && !campaignResult && (
              <>
                <h2 id="modal-title" className="text-2xl font-bold text-white mb-2">
                  Configurar Ativação
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  Tipo: <span className="text-[#00F5A0] font-semibold">
                    {type === 'NEW' ? 'Nova Campanha Digital' : 'Produto Físico'}
                  </span>
                </p>

                <div className="space-y-5 mb-8">
                  {type === 'LINK' && (
                    <div>
                      <label
                        htmlFor="input-product-id"
                        className="text-xs text-slate-400 uppercase mb-2 block font-bold tracking-wider"
                      >
                        ID do Produto / Lote
                      </label>
                      <input
                        id="input-product-id"
                        type="text"
                        placeholder="Ex: MARATA-SUCO-001"
                        className="w-full bg-[#0B0F0D] border border-white/10 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#00F5A0] transition-colors"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="input-leaf-amount"
                      className="text-xs text-slate-400 uppercase mb-2 block font-bold tracking-wider"
                    >
                      Folhas ($LEAF) por Scan
                    </label>
                    <input
                      id="input-leaf-amount"
                      type="number"
                      min={1}
                      className="w-full bg-[#0B0F0D] border border-white/10 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#00F5A0] transition-colors"
                      value={leafAmount}
                      onChange={(e) => setLeafAmount(Number(e.target.value))}
                    />
                  </div>

                  {type === 'NEW' && (
                    <div>
                      <label
                        htmlFor="input-total-scans"
                        className="text-xs text-slate-400 uppercase mb-2 block font-bold tracking-wider"
                      >
                        Total de Resgates Disponíveis
                      </label>
                      <input
                        id="input-total-scans"
                        type="number"
                        min={1}
                        className="w-full bg-[#0B0F0D] border border-white/10 p-3.5 rounded-xl text-sm focus:outline-none focus:border-[#00F5A0] transition-colors"
                        value={totalScans}
                        onChange={(e) => setTotalScans(Number(e.target.value))}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('choice')}
                    className="flex-1 text-slate-400 font-bold hover:text-white transition-colors py-3"
                  >
                    ← Voltar
                  </button>
                  <button
                    id="btn-confirm-distribute"
                    onClick={handleDistribute}
                    disabled={loading || (type === 'LINK' && !productId.trim())}
                    className="flex-1 bg-[#00F5A0] text-[#0B0F0D] py-3 rounded-xl font-black hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processando...
                      </>
                    ) : 'Ativar Agora'}
                  </button>
                </div>
              </>
            )}

            {/* ── Pós-sucesso: fechar ── */}
            {campaignResult?.success && (
              <button
                onClick={closeModal}
                className="w-full mt-4 bg-white/5 border border-white/10 py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
              >
                Fechar
              </button>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
