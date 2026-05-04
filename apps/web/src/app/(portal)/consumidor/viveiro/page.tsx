"use client";

import { useAuth } from "@/context/AuthContext";
import { useHeroState } from "@/hooks/useHeroState";
import { GlobalStatus } from "@/components/GlobalStatus";
import { ArrowUp, Loader2, Leaf } from "lucide-react";

export default function ViveiroPage() {
  const { session } = useAuth();
  const address = session?.address || null;
  const hero = useHeroState(address);

  return (
    <div className="max-w-6xl mx-auto p-6 pb-40">
      <GlobalStatus />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-[#1a110a] border-2 border-orange-900/20 rounded-[40px] p-10 shadow-2xl">
            <h3 className="text-[#947D71] text-xs font-black uppercase mb-2">Protocolo Florestal</h3>
            <p className="text-[#FFA800] text-4xl font-black italic">CONTRATO RWA ATIVO</p>
            <div className="mt-8 bg-black/40 p-6 rounded-2xl border border-white/5 flex items-center gap-6">
              <Leaf className="text-[#13E89B]" size={40} />
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Folhas para Conversão</p>
                <p className="text-4xl font-black text-white">1000 / 100</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => hero.forgeTree()}
            disabled={hero.isForging || !address}
            className={`w-full font-black py-12 rounded-[32px] transition-all flex flex-col items-center justify-center gap-2 uppercase
              ${!address
                ? 'bg-slate-900 text-slate-600'
                : hero.isForging
                  ? 'bg-slate-800 text-slate-500'
                  : 'bg-[#13E89B] hover:bg-emerald-400 text-slate-950 active:scale-95 shadow-[0_0_40px_rgba(19,232,155,0.3)]'
              }`}
          >
            <span className="flex items-center gap-3 text-xl">
              {hero.isForging ? <Loader2 className="animate-spin" /> : "FORJAR RWA VERDE"}
              {!hero.isForging && <ArrowUp size={28} />}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}