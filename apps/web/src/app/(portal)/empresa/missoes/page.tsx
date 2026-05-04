"use client";

import { useAuth } from "@/context/AuthContext";
import { Target } from "lucide-react"; // 'Leaf' e 'Trophy' removidos para zerar os avisos

export default function EmpresaMissoesPage() {
  const { session } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
          Missões ESG
        </h1>
        <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm">
          Empresa: {session?.address?.slice(0, 6)}...
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD DE IMPACTO: FOCO EM ATIVOS DE MOGNO AFRICANO */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <div className="bg-blue-500/20 w-fit p-3 rounded-2xl mb-4 border border-blue-500/30">
            <Target className="text-blue-400" size={32} />
          </div>
          <h3 className="text-white font-bold text-xl mb-2 tracking-tight">
            Neutralização de Carbono
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Neutralize emissões através do manejo certificado de **Mogno Africano** (*Khaya senegalensis*).
            Utilize seus ativos on-chain no protocolo **Florestas.Social**.
          </p>
        </div>
      </div>
    </div>
  );
}