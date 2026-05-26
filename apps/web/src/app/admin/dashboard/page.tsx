'use client';

import { useState, useEffect } from 'react';
import { requestAccess, isAllowed } from '@stellar/freighter-api';
import { useSorobanContracts } from '@/hooks/useSorobanContracts';
import {
  LayoutDashboard, Building2, Wallet, Leaf, ShieldAlert
} from 'lucide-react';

// --- CONFIGURAÇÃO: COLOQUE A SUA CARTEIRA ADMIN AQUI ---
const ADMIN_WALLET_ADDRESS = "GA2HL42P3LDEQPZY4BSA2V43JIK5H2SYK4QYPDY5DLPINFB6WSP4TTBX";

export default function AdminDashboard() {
  const { companyId } = useSorobanContracts();

  // --- ESTADOS ---
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- CONEXÃO AUTOMÁTICA ---
  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const access = await requestAccess();
      if (access.address) {
        if (access.address !== ADMIN_WALLET_ADDRESS) {
          setError("Acesso Restrito: Carteira não autorizada.");
          setAddress(null);
        } else {
          setAddress(access.address);
        }
      }
    } catch (e) {
      setError("Erro ao comunicar com a carteira.");
    } finally {
      setIsConnecting(false);
    }
  };

  // --- TELA DE LOGIN (WALLET ONLY) ---
  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] text-white p-6">
        <div className="bg-[#141414] p-16 rounded-3xl border border-[#262626] w-full max-w-2xl text-center shadow-2xl">
          <Leaf size={80} className="text-[#13E89B] mx-auto mb-10" />
          <h1 className="text-5xl font-bold mb-6">Painel Administrativo</h1>
          <p className="text-gray-400 mb-12 text-2xl">Acesso exclusivo via Carteira Stellar</p>

          {error && (
            <div className="bg-red-900/20 border border-red-900 p-6 rounded-2xl text-red-400 mb-8 text-xl flex items-center justify-center gap-4">
              <ShieldAlert size={32} /> {error}
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full py-8 rounded-2xl bg-[#13E89B] text-[#0A0A0A] font-bold text-3xl hover:bg-[#10c482]"
          >
            {isConnecting ? "Conectando..." : "Conectar Carteira"}
          </button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD ADMIN (ACESSO LIVRE) ---
  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      {/* MENU LATERAL */}
      <aside className="w-96 bg-[#141414] border-r border-[#262626] p-12 hidden md:block">
        <h2 className="text-4xl font-bold mb-20 flex items-center gap-4">
          <Leaf className="text-[#13E89B]" size={40} />
          <span>Protocolo</span>
        </h2>
        <nav className="space-y-10 text-3xl text-gray-400">
          <div className="flex items-center gap-6 text-[#13E89B]"><LayoutDashboard size={40} /> Painel</div>
          <div className="flex items-center gap-6"><Building2 size={40} /> Empresas</div>
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 p-16">
        <header className="flex justify-between items-center mb-20">
          <h1 className="text-5xl font-bold">Visão Geral do Admin</h1>
          <div className="text-2xl text-[#13E89B] font-mono bg-[#141414] px-10 py-5 rounded-full border border-[#262626]">
            {address.slice(0, 8)}...{address.slice(-8)}
          </div>
        </header>

        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-8">Status do Sistema</h2>
          <p className="text-2xl text-gray-400">Sistema operativo e conectado com a Blockchain.</p>
        </div>
      </main>
    </div>
  );
}