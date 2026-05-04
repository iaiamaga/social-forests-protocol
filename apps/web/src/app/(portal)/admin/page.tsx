"use client";

import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";

export default function AdminPage() {
  // Removido 'session' para limpar o aviso do terminal
  const { isLoading } = useAuth();

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-black text-white uppercase italic">Painel Administrativo</h1>
        <p className="text-emerald-500 font-bold mb-8">Gestão do Protocolo Florestas.Social</p>

        {isLoading ? (
          <p className="text-slate-500">Carregando dados mestre...</p>
        ) : (
          <div className="bg-slate-900 p-8 rounded-[32px] border border-slate-800">
            <p className="text-slate-400">Bem-vindo, Administrador. Aqui você faz a gestão dos contratos de Mogno Africano.</p>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}