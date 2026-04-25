'use client';

import React from 'react';
import { StickerCard } from '@/components/gamification/StickerCard';
import { MedalBadge } from '@/components/gamification/MedalBadge';
import { mockNfts, mockMedals } from '@/lib/mocks/gamification';
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AlbumCompletoPage() {

  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <Link href="/consumidor/viveiro" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-medium mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Viveiro
        </Link>

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5" /> Coleção Completa
            </div>
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
              Seu Livro de Impacto
            </h1>
            <p className="text-slate-400 mt-2 max-w-xl">
              Visualize em detalhes todos os ativos do mundo real que você plantou e as reputações imutáveis que conquistou.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-md">
              <div className="text-center">
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">RWAs</span>
                <span className="text-2xl font-bold text-white">3<span className="text-slate-600">/5</span></span>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="text-center">
                <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">SBTs</span>
                <span className="text-2xl font-bold text-emerald-400">3<span className="text-emerald-900">/4</span></span>
              </div>
            </div>
          </div>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            Figurinhas de Ativos <span className="text-emerald-400"><Sparkles className="w-5 h-5" /></span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {mockNfts.map(sticker => (
              <div key={sticker.id} className="transform transition-transform hover:-translate-y-2">
                <StickerCard sticker={sticker} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Medalhas de Reputação</h2>
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 backdrop-blur-md flex flex-wrap gap-10">
            {mockMedals.map(medal => (
              <MedalBadge key={medal.id} medal={medal} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
