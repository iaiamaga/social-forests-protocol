'use client';

import { useAuth } from '@/context/AuthContext';
import { useForest } from '@/hooks/useForest';
// CORREÇÃO: Importação nomeada com chaves para alinhar com o componente
import { ForestGallery } from '@/components/ForestGallery';
import { Sidebar } from '@/components/Sidebar';
import { GlobalStatus } from '@/components/GlobalStatus';

/**
 * Portal Florestas.Social
 * Dashboard principal para visualização de ativos de Mogno Africano.
 */
export default function HomePage() {
  const { session } = useAuth();
  const { nfts, loading } = useForest(session?.address ?? null);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar />

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
              Meus Ativos Verdes
            </h1>
            <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mt-1">
              Inventário de Mogno Africano | Sómogno
            </p>
          </div>
          <GlobalStatus />
        </header>

        <section className="space-y-8">
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-[32px]">
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              Bem-vindo ao protocolo **Florestas.Social**. Aqui você gerencia seus lotes de manejo
              e visualiza o impacto ambiental transformado em ativos digitais na rede Stellar.
            </p>
          </div>

          {/* Componente Galeria agora com a tipagem e exportação corretas */}
          <ForestGallery nfts={nfts} loading={loading} />
        </section>
      </main>
    </div>
  );
}