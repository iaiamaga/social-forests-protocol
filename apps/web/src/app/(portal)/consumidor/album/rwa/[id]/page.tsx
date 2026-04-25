'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Flame, Wind, Ruler, Activity, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

import { mockNfts } from '@/lib/mocks/gamification';
import { NftSticker, StickerCard } from '@/components/gamification/StickerCard';
import { useSorobanContracts, TreeRecord } from '@/hooks/useSorobanContracts';

export default function RwaDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { getTreeRecord, forgeTree, isLoading: isContractLoading } = useSorobanContracts();
  
  const [oracleData, setOracleData] = useState<TreeRecord | null>(null);
  const [isForging, setIsForging] = useState(false);

  const sticker = mockNfts.find(s => s.id === id);

  useEffect(() => {
    if (!sticker || !sticker.isUnlocked) {
      router.push('/consumidor/album');
      return;
    }

    async function loadData() {
      const data = await getTreeRecord(id, 2026);
      setOracleData(data);
    }
    loadData();
  }, [id, sticker, router, getTreeRecord]);

  if (!sticker || !sticker.isUnlocked) return null;

  const handleForge = async () => {
    setIsForging(true);
    // Em um app real, passaríamos o endereço real do usuário
    const result = await forgeTree('GA2...MOCK_USER');
    if (result.success) {
      alert(result.message + `\nTransação: ${result.hash}`);
      // Idealmente mutaríamos o state global ou refetch do on-chain
    }
    setIsForging(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <Link href="/consumidor/album" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Livro
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Lado Esquerdo - A Carta */}
          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-[320px] lg:max-w-[400px]">
              <StickerCard sticker={sticker} />
            </div>
          </div>

          {/* Lado Direito - Detalhes e Oráculo */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> Ativo Verificado On-Chain
              </div>
              <h1 className="text-4xl font-extrabold text-white mb-2">{sticker.name}</h1>
              <p className="text-slate-400">
                Uma árvore real, plantada no Viveiro Maravilha, tokenizada como um Real World Asset (RWA) na rede Stellar Soroban.
              </p>
            </div>

            {/* Painel do Oráculo */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                Dados do Oráculo
                {isContractLoading && <span className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                  <Wind className="w-5 h-5 text-emerald-400 mb-2" />
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Carbono Sequestrado</p>
                  <p className="text-2xl font-bold text-white">{oracleData?.carbon_kg ?? '...'} <span className="text-sm text-emerald-400 font-normal">kg</span></p>
                </div>
                <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                  <Ruler className="w-5 h-5 text-blue-400 mb-2" />
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Altura Medida</p>
                  <p className="text-2xl font-bold text-white">{oracleData ? (oracleData.height_cm / 100).toFixed(1) : '...'} <span className="text-sm text-blue-400 font-normal">m</span></p>
                </div>
                <div className="bg-black/30 rounded-2xl p-4 border border-white/5 col-span-2 flex items-center justify-between">
                  <div>
                    <Activity className="w-5 h-5 text-purple-400 mb-2" />
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Saúde da Árvore</p>
                    <p className="text-lg font-bold text-white">{oracleData?.health_index ?? '...'} / 100</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase">Verificado por</p>
                    <p className="text-xs font-mono text-emerald-500/70">{oracleData?.verified_by ?? '...'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ação: Evoluir */}
            <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/10 border border-amber-500/20 rounded-3xl p-6">
              <h3 className="text-lg font-bold text-amber-400 mb-2 flex items-center gap-2">
                <Flame className="w-5 h-5" /> Evoluir Raridade
              </h3>
              <p className="text-sm text-slate-300 mb-6">
                Queime tokens LEAF (Folhas) para forjar este ativo e elevá-lo ao próximo nível de raridade. NFTs raros geram maior rendimento (Revenue Share).
              </p>
              
              {sticker.rarity === 'Lenda' ? (
                <div className="w-full py-4 text-center text-amber-500 font-bold bg-amber-500/10 rounded-xl border border-amber-500/20">
                  Nível Máximo Alcançado!
                </div>
              ) : (
                <button 
                  onClick={handleForge}
                  disabled={isForging}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2"
                >
                  {isForging ? 'Forjando na Blockchain...' : 'Queimar 1.000 LEAFs e Forjar'}
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
