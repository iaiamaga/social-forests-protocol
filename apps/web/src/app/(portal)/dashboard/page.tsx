"use client";

import { useAuth } from "@/context/AuthContext";
import { useAccountBalance } from "@/hooks/useAccountBalance";
import { Leaf, Wallet } from "lucide-react"; // ArrowUpRight removido
import { useState } from "react";

export default function DashboardPage() {
  const { session } = useAuth();
  const { leafBalance, isLoading } = useAccountBalance(session?.address ?? null);
  const xlmBalance = "0.00";

  const [lang] = useState<"pt" | "en">(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.lang.startsWith("pt") ? "pt" : "en";
    }
    return "pt";
  });

  const text = {
    pt: { title: "Viveiro Digital", balanceLabel: "Saldo de Folhas", unit: "Folhas" },
    en: { title: "Digital Nursery", balanceLabel: "Leaf Balance", unit: "LEAF" }
  }[lang];

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10">
      <div>
        <h1 className="text-5xl font-black text-white tracking-tight italic">{text.title}</h1>
        <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm mt-2">
          Social Forest Protocol | Sómogno
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-slate-900 border-2 border-emerald-500/20 rounded-[48px] p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <p className="text-slate-500 text-sm font-black uppercase tracking-[0.3em] mb-4">
              {text.balanceLabel}
            </p>
            <div className="flex items-baseline gap-4">
              <h2 className="text-8xl font-black text-white tracking-tighter">
                {isLoading ? "..." : leafBalance}
              </h2>
              <span className="text-emerald-500 font-bold text-3xl uppercase">{text.unit}</span>
            </div>
          </div>
          <Leaf className="absolute -right-10 -bottom-10 opacity-[0.03] text-emerald-500" size={350} />
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-[48px] p-12 shadow-2xl backdrop-blur-md flex items-center justify-between">
          <div className="bg-blue-500/20 p-5 rounded-3xl">
            <Wallet className="text-blue-400" size={40} />
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs font-black uppercase mb-1">Saldo XLM</p>
            <p className="text-3xl font-black text-white">{xlmBalance}</p>
          </div>
        </div>
      </div>
    </div>
  );
}