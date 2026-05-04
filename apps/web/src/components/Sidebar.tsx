"use client";

import { useAuth } from "@/context/AuthContext";
import { useAccountBalance } from "@/hooks/useAccountBalance";
import { LayoutDashboard, LogOut } from "lucide-react"; // Trees e MessageSquare removidos
import Link from "next/link";

export function Sidebar() {
  const { session, disconnect } = useAuth();
  const { leafBalance, isLoading } = useAccountBalance(session?.address ?? null);

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col h-screen sticky top-0">
      <div className="p-8 text-emerald-500 font-black text-2xl tracking-tighter">
        FLORESTAS.SOCIAL
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link href="/dashboard" className="flex items-center gap-3 p-4 text-slate-400 hover:text-white hover:bg-slate-900 rounded-2xl transition-all">
          <LayoutDashboard size={20} /> <span className="font-bold">Dashboard</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-900">
        <div className="bg-slate-900 p-4 rounded-2xl mb-4">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Seu Saldo</p>
          <p className="text-white font-bold">{isLoading ? "..." : leafBalance} LEAF</p>
        </div>
        <button onClick={disconnect} className="w-full flex items-center gap-3 p-4 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all font-bold">
          <LogOut size={20} /> Sair
        </button>
      </div>
    </aside>
  );
}