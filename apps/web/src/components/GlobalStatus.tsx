"use client";

import { useAuth } from "@/context/AuthContext";
import { useAccountBalance } from "@/hooks/useAccountBalance";
import { Leaf } from "lucide-react";

export function GlobalStatus() {
    const { session } = useAuth();

    // CORREÇÃO: Tratamento para que o endereço nunca seja undefined
    const { leafBalance, isLoading } = useAccountBalance(session?.address ?? null);

    return (
        <div className="bg-slate-900/50 border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-4">
            <Leaf className="text-emerald-500" size={20} />
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saldo Leaf</p>
                <p className="text-sm font-bold text-white">
                    {isLoading ? "..." : leafBalance}
                </p>
            </div>
        </div>
    );
}