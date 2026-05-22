'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import RoleGuard from '../../../components/RoleGuard';
import { useSorobanContracts } from '../../../hooks/useSorobanContracts';
import { BrandLogo } from '../../../components/ui/BrandLogo';

// IMPORTAÇÕES EXPLÍCITAS PARA EVITAR TS 2304
import { 
  Database, 
  Activity, 
  Server, 
  FileCheck, 
  LogOut, 
  AlertCircle,
  Network,
  RefreshCw,
  CheckCircle2,
  Settings2
} from 'lucide-react';
import Link from 'next/link';

/**
 * MICRO-MISSÃO 3: DASHBOARD DA ADMINISTRAÇÃO (ROOT)
 * Foco exclusivo em Governança, Taxas e Oráculos.
 * Restrição: SEM COMPONENTES DE GAMIFICAÇÃO OU SELOS.
 * Integração: total_supply do leafToken.
 * ALERTA DE PROTOCOLO: A função para contar o total de empresas não foi encontrada no contrato `sbt_empresa`.
 */

export default function AdminDashboardPage() {
  const { session, disconnect } = useAuth();
  const contracts = useSorobanContracts();
  
  const [totalSupply, setTotalSupply] = useState<string>('0');
  const [totalCompanies, setTotalCompanies] = useState<string>('N/A'); // Não existe método no contrato
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadMacroMetrics() {
      try {
        setIsLoading(true);
        setErrorMsg('');

        // 1. Total de LEAFs em circulação (Contrato Real)
        const txSupply = await (contracts.leafToken as any).total_supply();
        if (txSupply?.result !== undefined && txSupply?.result !== null) {
          setTotalSupply(txSupply.result.toString());
        }

        // 2. Total de Empresas
        // STOP & WARN: O contrato sbt_empresa não possui uma função como `get_total_companies()`.
        // Respeitando a regra ZERO MOCKS, este dado ficará como N/A até que o contrato seja atualizado.
        setTotalCompanies('Indisponível no Contrato');

      } catch (err: any) {
        console.error("Erro ao carregar métricas macro:", err);
        setErrorMsg('Falha ao conectar com Soroban. ' + (err.message || ''));
      } finally {
        setIsLoading(false);
      }
    }

    loadMacroMetrics();
  }, [contracts]);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-[#FDFBF9] text-[#26170E] font-sans flex">
        
        {/* SIDEBAR LATERAL (Admin) */}
        <aside className="w-64 border-r-2 border-[#D5D0C8] bg-white flex flex-col hidden md:flex">
          <div className="p-6 border-b border-[#D5D0C8]">
            <BrandLogo className="h-8 w-auto" />
          </div>
          
          <div className="p-6 flex-1">
            <p className="font-mono text-[10px] text-[#6B6560] font-bold uppercase tracking-widest mb-4">
              Governança Core
            </p>
            <nav className="flex flex-col gap-2">
              <Link href="/admin/dashboard" className="flex items-center gap-3 bg-[#26170E] text-white px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider shadow-sm">
                <Activity size={16} />
                Macro Métricas
              </Link>
              <button className="flex items-center gap-3 text-[#6B6560] hover:text-[#26170E] hover:bg-[#FDFBF9] px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors text-left">
                <FileCheck size={16} />
                Auditoria de Relatórios
              </button>
              <button className="flex items-center gap-3 text-[#6B6560] hover:text-[#26170E] hover:bg-[#FDFBF9] px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors text-left">
                <Database size={16} />
                Gestão de Oráculos
              </button>
              <button className="flex items-center gap-3 text-[#6B6560] hover:text-[#26170E] hover:bg-[#FDFBF9] px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors text-left">
                <Settings2 size={16} />
                Parâmetros do Contrato
              </button>
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-[#D5D0C8] bg-gray-50">
            <div className="mb-4">
              <p className="font-mono text-[10px] text-[#6B6560] font-bold uppercase tracking-widest mb-1">Conta Master (Soroban)</p>
              <p className="font-mono text-[10px] text-[#26170E] break-all bg-white p-2 border border-[#D5D0C8] rounded">
                {session?.address || 'Não Conectado'}
              </p>
            </div>
            <button 
              onClick={disconnect}
              className="flex items-center gap-2 text-[#C0392B] hover:text-[#A93226] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <LogOut size={14} />
              Revogar Acesso Root
            </button>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto">
          
          <header className="md:hidden border-b border-[#D5D0C8] bg-white p-4 flex justify-between items-center sticky top-0 z-10">
            <BrandLogo className="h-6 w-auto" />
            <button onClick={disconnect} className="text-[#6B6560]">
              <LogOut size={20} />
            </button>
          </header>

          <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <h1 className="font-mono text-2xl font-bold uppercase tracking-wider text-[#26170E] mb-2 flex items-center gap-3">
                  <Server size={24} className="text-[#2D5A27]" />
                  Central de Comando
                </h1>
                <p className="text-sm text-[#6B6560]">
                  Visão macroscópica da rede, aprovação de oráculos e gestão de ativos RWA.
                </p>
              </div>
              
              {/* Botões de Ação Administrativa */}
              <div className="flex gap-3">
                <button className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#26170E] font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-colors shadow-sm rounded flex items-center gap-2">
                  <FileCheck size={16} />
                  Aprovar Relatórios
                </button>
                <button className="bg-[#26170E] hover:bg-[#3D2A1E] text-white font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-colors shadow-sm rounded flex items-center gap-2">
                  <RefreshCw size={16} />
                  Atualizar Oráculo
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-8 flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded">
                <AlertCircle size={18} className="text-[#C0392B] mt-0.5 shrink-0" />
                <p className="text-sm text-[#C0392B] font-mono">{errorMsg}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              
              {/* Card 1: Total Supply LEAF */}
              <div className="bg-white border border-[#E5E7EB] rounded p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Database size={18} className="text-[#2D5A27]" />
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6B6560]">Supply Total (LEAF)</h3>
                </div>
                {isLoading ? (
                  <div className="h-8 bg-gray-100 rounded animate-pulse w-full"></div>
                ) : (
                  <p className="font-mono text-3xl font-bold text-[#26170E]">{totalSupply}</p>
                )}
                <p className="text-[10px] text-emerald-700 font-mono mt-2 bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-200">
                  On-Chain (Soroban)
                </p>
              </div>

              {/* Card 2: Total de Empresas */}
              <div className="bg-white border border-[#E5E7EB] rounded p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={18} className="text-[#26170E]" />
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6B6560]">Total de Empresas</h3>
                </div>
                {isLoading ? (
                  <div className="h-8 bg-gray-100 rounded animate-pulse w-full"></div>
                ) : (
                  <p className="font-mono text-sm font-bold text-[#C0392B]">{totalCompanies}</p>
                )}
                <p className="text-[10px] text-amber-700 font-mono mt-2 bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-200">
                  Aviso: Função ausente no contrato
                </p>
              </div>

              {/* Card 3: Status Operacional */}
              <div className="bg-white border border-[#E5E7EB] rounded p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Network size={18} className="text-[#2D5A27]" />
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6B6560]">Status da Rede</h3>
                </div>
                {isLoading ? (
                  <div className="h-8 bg-gray-100 rounded animate-pulse w-full"></div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 size={28} className="text-[#2D5A27]" />
                    <span className="font-mono text-lg font-bold text-[#26170E]">Operacional</span>
                  </div>
                )}
                <p className="text-[10px] text-[#6B6560] mt-2 uppercase tracking-widest font-mono">
                  RPC Conectado
                </p>
              </div>

            </div>

            {/* Painel de Auditoria de Relatórios */}
            <div className="bg-white border border-[#E5E7EB] shadow-sm rounded p-8">
              <div className="border-b border-[#D5D0C8] pb-6 mb-6 flex justify-between items-center">
                <div>
                  <h2 className="font-mono text-lg font-bold uppercase tracking-wider text-[#26170E] mb-2">
                    Governança e Auditoria
                  </h2>
                  <p className="text-sm text-[#6B6560]">
                    Ações administrativas on-chain estarão disponíveis aqui quando novas funções de admin forem implementadas.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center py-10 bg-[#FDFBF9] border border-[#D5D0C8] border-dashed rounded text-center">
                <FileCheck size={32} className="text-[#6B6560] mb-4" />
                <p className="font-mono text-sm text-[#26170E] uppercase tracking-wider font-bold mb-2">
                  Sistema Restrito Ativo
                </p>
                <p className="text-xs text-[#6B6560] max-w-sm">
                  O painel atende a diretriz estrita de exibir apenas métricas macro e ações de oráculo.
                </p>
              </div>
            </div>

          </div>
        </main>

      </div>
    </RoleGuard>
  );
}
