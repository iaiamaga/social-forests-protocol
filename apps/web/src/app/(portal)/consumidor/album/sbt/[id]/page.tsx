'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Award, LockKeyhole, CalendarDays, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

import { mockMedals } from '@/lib/mocks/gamification';
import { MedalBadge } from '@/components/gamification/MedalBadge';

export default function SbtDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const medal = mockMedals.find(m => m.id === id);

  if (!medal || !medal.isUnlocked) {
    if (typeof window !== 'undefined') router.push('/consumidor/album');
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-10 relative overflow-hidden flex flex-col">
      {/* Background Decorativo com cor condicional à tier */}
      <div className={`absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[150px] pointer-events-none opacity-20
        ${medal.tier === 'Ouro' ? 'bg-amber-500' : 
          medal.tier === 'Prata' ? 'bg-slate-300' :
          medal.tier === 'Bronze' ? 'bg-orange-800' :
          'bg-emerald-500'
        }
      `} />

      <div className="max-w-4xl mx-auto w-full relative z-10 flex-1 flex flex-col">
        <Link href="/consumidor/album" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium mb-12 transition-colors self-start">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Livro
        </Link>

        <div className="flex-1 flex flex-col items-center text-center max-w-2xl mx-auto w-full pt-8">
          
          {/* Medalha em Destaque */}
          <div className="mb-10 transform scale-150">
            <MedalBadge medal={medal} />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-xs font-semibold mb-6">
            <Award className="w-4 h-4" /> Reputação Soulbound (SBT)
          </div>

          <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl">{medal.title}</h1>
          
          <p className="text-xl text-slate-400 mb-12 leading-relaxed">
            {medal.description}
          </p>

          {/* Dados On-chain do SBT */}
          <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="bg-black/30 rounded-2xl p-4 border border-white/5 flex items-start gap-3">
              <LockKeyhole className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Status Criptográfico</p>
                <p className="text-sm font-semibold text-white">Intransferível (Soulbound)</p>
                <p className="text-xs text-slate-500 mt-1">Este ativo está vinculado permanentemente à sua carteira.</p>
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-4 border border-white/5 flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Data da Conquista</p>
                <p className="text-sm font-semibold text-white">{medal.date}</p>
                <p className="text-xs text-slate-500 mt-1">Registrado no ledger da rede Soroban.</p>
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-4 border border-white/5 flex items-start gap-3 sm:col-span-2">
              <LinkIcon className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">ID do Token (Rede Testnet)</p>
                <p className="text-xs font-mono text-emerald-500/70 truncate">
                  CAX3...{medal.id.toUpperCase()}...MOCK_SBT_ADDR
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
