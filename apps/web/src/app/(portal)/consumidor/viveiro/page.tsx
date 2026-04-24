'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Sprout, 
  Leaf, 
  TreePine, 
  Wind, 
  Droplets,
  Award,
  ArrowRight,
  TrendingUp,
  History,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

import RoleGuard from '@/components/RoleGuard';
import { useAccountBalance } from '@/hooks/useAccountBalance';
import { useHeroState } from '@/hooks/useHeroState';
import { useUserImpact } from '@/hooks/useUserImpact';
import { StickerAlbum } from '@/components/gamification/StickerAlbum';
import { NftSticker } from '@/components/gamification/StickerCard';
import { MedalBoard } from '@/components/gamification/MedalBoard';
import { Medal } from '@/components/gamification/MedalBadge';

export default function ConsumidorDashboard() {
  const { session } = useAuth();
  
  // Hydration com Hooks Soroban SDK
  const { xlmBalance, isLoading: isBalanceLoading, error: balanceError } = useAccountBalance(session?.address ?? null);
  const heroState = useHeroState(session?.address ?? null);
  const { impactPoints, isLoading: isImpactLoading, error: impactError } = useUserImpact(session?.address ?? null);

  const isGlobalLoading = isBalanceLoading || heroState.isLoading || isImpactLoading;
  const hasError = balanceError || heroState.error || impactError;

  const mockNfts: NftSticker[] = [
    { id: '1042', name: 'Mogno Africano #1042', rarity: 'Lenda', height: '3.2m', co2: '210kg', imageUrl: '🌳', isUnlocked: true },
    { id: '893', name: 'Mogno Africano #893', rarity: 'Raro', height: '1.5m', co2: '85kg', imageUrl: '🌲', isUnlocked: true },
    { id: '219', name: 'Mogno Africano #219', rarity: 'Comum', height: '0.4m', co2: '12kg', imageUrl: '🌱', isUnlocked: true },
    { id: '???', name: 'Próxima Semente', rarity: 'Bloqueado', isUnlocked: false },
  ];

  const mockMedals: Medal[] = [
    { id: 'm1', title: 'Pioneiro', description: 'Entrou no protocolo no primeiro ano.', tier: 'Ouro', icon: '🌟', isUnlocked: true, date: '10/01/2026' },
    { id: 'm2', title: 'Guardião Verde', description: 'Sequestrou mais de 100kg de CO2.', tier: 'Esmeralda', icon: '🛡️', isUnlocked: true, date: '05/03/2026' },
    { id: 'm3', title: 'Parceiro B2B', description: 'Primeira compra com cashback verde.', tier: 'Prata', icon: '🤝', isUnlocked: true, date: '12/04/2026' },
    { id: 'm4', title: 'Lenda Viva', description: 'Evolua uma árvore para o nível Lenda.', tier: 'Bronze', icon: '👑', isUnlocked: false },
  ];

  return (
    <RoleGuard allowedRoles={['consumidor']}>
      <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10">
        
        {/* Banner de Fallback (Graecful Degradation) */}
        {hasError && !isGlobalLoading && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3 mb-4 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-400/90 font-medium">
              Dados locais ativos — blockchain temporariamente indisponível. Seu impacto está salvo no seu dispositivo.
            </p>
          </div>
        )}

        {/* Header de Boas-Vindas */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              Seu Viveiro Digital <Sprout className="w-8 h-8 text-emerald-400" />
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Bem-vindo de volta! Acompanhe seu impacto ambiental e evolução das suas mudas.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-2 pr-4 shadow-lg backdrop-blur-md">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-inner border border-white/20">
              {session?.address ? session.address.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Conta Conectada</span>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-mono text-emerald-400">
                  {session?.address ? `${session.address.slice(0, 6)}...${session.address.slice(-4)}` : 'Usuário'}
                </span>
                <span className="text-xs text-slate-500">| {xlmBalance} XLM</span>
              </div>
            </div>
          </div>
        </header>

        {isGlobalLoading ? (
           <div className="h-64 flex items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
           </div>
        ) : (
          <>
            {/* Grid Principal de Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Saldo de Folhas */}
              <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl">
                    <Leaf className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Token de Utilidade
                  </span>
                </div>
                
                <div className="relative z-10">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Saldo de Folhas</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">{heroState.totalWeighted.toLocaleString()}</span>
                    <span className="text-emerald-400 font-medium">Folhas</span>
                  </div>
                </div>
              </div>

              {/* Impacto Ambiental (CO2) */}
              <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/40 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-all" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-blue-500/20 rounded-2xl">
                    <Wind className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    SBT Impact
                  </span>
                </div>
                
                <div className="relative z-10">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Impacto Verificado</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">{impactPoints}</span>
                    <span className="text-blue-400 font-medium">PTS</span>
                  </div>
                </div>
              </div>

              {/* Árvores e Evolução */}
              <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/20 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3 bg-purple-500/20 rounded-2xl">
                    <TreePine className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> RWA
                  </span>
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Árvores Reais</h2>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-white">{heroState.treesForged}</span>
                        <span className="text-purple-400 font-medium">Forjadas</span>
                      </div>
                    </div>
                  </div>
                  {/* Barra de Progresso para próxima árvore */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Progresso para próxima semente</span>
                      <span className="text-purple-300 font-medium">{heroState.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${heroState.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Seção Principal Inferior - GAMIFICAÇÃO */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-10">
              
              {/* Álbum de Figurinhas (Ativos Financeiros / RWAs) */}
              <div className="xl:col-span-2">
                <StickerAlbum stickers={mockNfts} />
              </div>

              {/* Quadro de Medalhas (Reputação / SBTs) */}
              <div className="xl:col-span-1">
                <MedalBoard medals={mockMedals} />
              </div>

            </div>
          </>
        )}
      </div>
    </main>
    </RoleGuard>
  );
}
