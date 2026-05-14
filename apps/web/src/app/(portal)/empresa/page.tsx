'use client';

import { useAuth } from '@/context/AuthContext';
import { 
  Building2, 
  Leaf, 
  Target, 
  Globe2, 
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Wallet
} from 'lucide-react';
import Link from 'next/link';

import RoleGuard from '@/components/RoleGuard';

export default function EmpresaDashboard() {
  const { session } = useAuth();

  const mockCompanyState = {
    nome: 'EcologCorp LTDA',
    status: 'Parceiro Verificado',
    poolFolhas: 45000, 
    folhasDistribuidas: 125000,
    odsScore: 12500, 
    carbonCredits: 2500, 
    lendaBonusAtivo: true,
  };

  return (
    <RoleGuard allowedRoles={['empresa']}>
      <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Decorativo Glassmorphism */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER INSTITUCIONAL */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">{mockCompanyState.nome}</h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> {mockCompanyState.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                Painel Executivo de Sustentabilidade
              </p>
            </div>
          </div>
          
          <div className="bg-slate-950/50 border border-white/5 rounded-2xl p-4 flex items-center gap-4 w-full md:w-auto">
            <Wallet className="w-8 h-8 text-slate-500" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Wallet Corporativa</p>
              <p className="text-sm font-mono text-emerald-400">
                {session?.address || 'GA3V...EMPRESA_MOCK'}
              </p>
            </div>
          </div>
        </header>

        {/* NAVEGAÇÃO PRINCIPAL B2B */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/empresa/cashback" className="group relative overflow-hidden bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/20 hover:border-emerald-500/50 rounded-3xl p-8 transition-all duration-500 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              Cashback Verde <ArrowRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-slate-400 mb-6">Recarregue sua Tesouraria via USDC (x402) e defina as regras de conversão (USDC para LEAFs).</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{mockCompanyState.poolFolhas.toLocaleString()}</span>
              <span className="text-emerald-500 font-medium text-sm">LEAFs no Pool</span>
            </div>
          </Link>

          <Link href="/empresa/missoes" className="group relative overflow-hidden bg-gradient-to-br from-purple-900/30 to-slate-900 border border-purple-500/20 hover:border-purple-500/50 rounded-3xl p-8 transition-all duration-500 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all" />
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              Campanhas & Missões <ArrowRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-slate-400 mb-6">Crie missões gamificadas que aparecem diretamente no Oásis B2C do seu cliente.</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">2</span>
              <span className="text-purple-400 font-medium text-sm">Campanhas Ativas</span>
            </div>
          </Link>

          <Link href="/empresa/analytics" className="group relative overflow-hidden bg-gradient-to-br from-blue-900/30 to-slate-900 border border-blue-500/20 hover:border-blue-500/50 rounded-3xl p-8 transition-all duration-500 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all" />
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              Analytics ESG <ArrowRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p className="text-sm text-slate-400 mb-6">Audite a redução do seu C-DEBT e extraia relatórios criptográficos das árvores plantadas.</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{(mockCompanyState.carbonCredits).toLocaleString()}</span>
              <span className="text-blue-400 font-medium text-sm">Créditos de Carbono</span>
            </div>
          </Link>

        </div>

        {/* RELATÓRIO DE IMPACTO RÁPIDO */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
          <div className="mb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                Visão Geral do Impacto <Globe2 className="w-5 h-5 text-emerald-400" />
              </h2>
              <p className="text-sm text-slate-400 max-w-2xl">
                O desempenho on-chain gerado através do engajamento dos seus clientes. 
                Cada folha distribuída movimenta a economia do protocolo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-black/30 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total de Folhas Distribuídas</p>
              <p className="text-4xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                {mockCompanyState.folhasDistribuidas.toLocaleString()}
              </p>
            </div>

            <div className={`border rounded-2xl p-6 flex items-center gap-5 transition-all ${
              mockCompanyState.lendaBonusAtivo 
                ? 'bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/30' 
                : 'bg-black/30 border-white/5'
            }`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
                mockCompanyState.lendaBonusAtivo ? 'bg-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-800 text-slate-500'
              }`}>
                {mockCompanyState.lendaBonusAtivo ? <CheckCircle2 className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-bold ${mockCompanyState.lendaBonusAtivo ? 'text-amber-400' : 'text-slate-400'}`}>
                    Selo RWA Legendário
                  </h4>
                  {mockCompanyState.lendaBonusAtivo && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">Desbloqueado</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Um de seus clientes alcançou a raridade máxima (Árvore Lenda) usando seu cashback. Isso credencia sua empresa a emitir C-CRED premium.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </main>
    </RoleGuard>
  );
}
