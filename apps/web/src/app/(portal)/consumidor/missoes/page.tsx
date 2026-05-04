"use client";

import { useAuth } from "@/context/AuthContext";
import { Target } from "lucide-react"; // Leaf e Trophy removidos aqui

export default function EmpresaMissoesPage() {
  const { session } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Missões ESG</h1>
        <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm">Empresa: {session?.address?.slice(0, 6)}...</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <Target className="text-blue-400 mb-4" size={32} />
          <h3 className="text-white font-bold text-xl mb-2">Neutralização de Carbono</h3>
          <p className="text-slate-400 text-sm">
            Neutralize emissões através do manejo certificado de Mogno Africano (Khaya senegalensis).
          </p>
        </div>
      </div>
    </div>
  );
}