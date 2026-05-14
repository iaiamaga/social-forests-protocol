'use client';

import { useState } from 'react';
import { ArrowLeft, CreditCard, Leaf, Settings2, Zap, Save } from 'lucide-react';
import Link from 'next/link';

import RoleGuard from '@/components/RoleGuard';

export default function EmpresaCashbackPage() {
  const [showFundModal, setShowFundModal] = useState(false);
  const [conversionRate, setConversionRate] = useState(5); // 1 BRL = 5 LEAFs
  const poolFolhas = 45000;

  return (
    <RoleGuard allowedRoles={['empresa']}>
      <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        
        {/* Background Decorativo */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          
          <Link href="/empresa" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </Link>

          <header>
            <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center gap-3">
              Tesouraria & Cashback <Leaf className="w-8 h-8 text-emerald-400" />
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Gerencie o seu saldo de LEAFs e defina como eles são distribuídos automaticamente nas compras dos seus clientes (via x402 Payment ou API Customizada).
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CARREGAR SALDO (STRIPE) */}
            <div className="bg-slate-900/40 border border-emerald-500/20 rounded-3xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
              
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Seu Saldo Atual</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black text-white">{poolFolhas.toLocaleString()}</span>
                  <span className="text-emerald-400 font-bold text-lg">LEAFs</span>
                </div>
                <p className="text-sm text-slate-400 mb-8 max-w-sm">
                  LEAFs são gerados na rede Stellar apenas quando o Oráculo prova que uma árvore real foi plantada e está sequestrando carbono.
                </p>
              </div>

              <button 
                onClick={() => setShowFundModal(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:-translate-y-1"
              >
                <CreditCard className="w-5 h-5" /> Adicionar Fundos (Fiat On-Ramp)
              </button>
            </div>

            {/* REGRAS DE CONVERSÃO */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                  <Settings2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white">Regras de Automação</h2>
              </div>

              <div className="bg-black/30 border border-white/5 rounded-2xl p-5 mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">
                  Taxa de Conversão Padrão
                </label>
                <div className="flex items-center gap-4">
                  <div className="bg-slate-800 px-4 py-3 rounded-xl font-mono text-slate-300 font-bold w-full text-center">
                    R$ 1,00 Gasto
                  </div>
                  <Zap className="w-6 h-6 text-slate-600 shrink-0" />
                  <div className="flex items-center w-full">
                    <input 
                      type="number" 
                      value={conversionRate}
                      onChange={(e) => setConversionRate(Number(e.target.value))}
                      className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-l-xl font-bold font-mono w-full outline-none text-center"
                    />
                    <div className="bg-emerald-500/20 border border-l-0 border-emerald-500/30 px-3 py-3 rounded-r-xl text-emerald-400 font-bold text-sm">
                      LEAFs
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl">
                  <div>
                    <h4 className="font-bold text-white text-sm">x402 Payment Gateway</h4>
                    <p className="text-xs text-slate-400">Distribui via pagamento USDC on-chain</p>
                  </div>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl opacity-60">
                  <div>
                    <h4 className="font-bold text-white text-sm">Integração Shopify App</h4>
                    <p className="text-xs text-slate-400">Inativo. Requer chave de API.</p>
                  </div>
                  <div className="w-10 h-5 bg-slate-700 rounded-full relative cursor-not-allowed">
                    <div className="w-4 h-4 bg-slate-500 rounded-full absolute left-0.5 top-0.5" />
                  </div>
                </div>
              </div>

              <button className="w-full border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
                <Save className="w-4 h-4" /> Salvar Configurações
              </button>
            </div>

          </div>
        </div>

        {/* Modal Simulado de Checkout */}
        {showFundModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
              <button onClick={() => setShowFundModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white">Adquirir Impacto (Fiat)</h2>
                <p className="text-sm text-slate-400 mt-2">Você está comprando LEAFs atreladas a RWAs do Viveiro Maravilha.</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl p-4 text-left transition-colors flex justify-between items-center group">
                  <div>
                    <div className="text-white font-bold group-hover:text-emerald-400">10.000 Folhas</div>
                  </div>
                  <div className="font-mono text-emerald-400">R$ 1.000</div>
                </button>
                <button className="w-full bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 rounded-xl p-4 text-left transition-colors flex justify-between items-center group relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-[8px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-bl-lg font-bold">RECOMENDADO</div>
                  <div>
                    <div className="text-emerald-400 font-bold group-hover:text-emerald-300">50.000 Folhas</div>
                  </div>
                  <div className="font-mono text-emerald-400">R$ 5.000</div>
                </button>
              </div>

              <button 
                onClick={() => {
                  alert("Integração x402: O USDC é depositado on-chain, o Soroban journey_orchestrator é chamado para credenciar LEAFs à empresa.");
                  setShowFundModal(false);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Pagar com Cartão / Pix
              </button>
            </div>
          </div>
        )}

      </main>
    </RoleGuard>
  );
}
