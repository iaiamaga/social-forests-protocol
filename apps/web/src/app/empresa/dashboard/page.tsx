'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import RoleGuard from '../../../components/RoleGuard';
import { useSorobanContracts } from '../../../hooks/useSorobanContracts';
import { BrandLogo } from '../../../components/ui/BrandLogo';

// IMPORTAÇÃO EXPLICITA DE ÍCONES (Resolvendo TS 2304)
import { 
  Building2, 
  Leaf, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight, 
  Settings, 
  LogOut, 
  FileText,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

/**
 * MICRO-MISSÃO 1: DASHBOARD DA EMPRESA (B2B)
 * - Entrega Integral.
 * - Zero Mocks: Integração Soroban via get_empresa_sbt e leafToken.balance
 * - Tipagem TS: Tratamento direto (sem .isOk() ou .unwrap()), resolvendo TS 2339.
 */

// --- Componente Inline: EsgBadges (ODS) ---
const EsgBadges = ({ badges = [] }: { badges: number[] }) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-[#FDFBF9] border border-[#D5D0C8] border-dashed rounded text-center">
        <p className="font-mono text-xs text-[#6B6560] uppercase tracking-wider mb-2">Sem Selos ODS</p>
        <p className="text-xs text-[#6B6560]">Esta empresa ainda não desbloqueou selos de impacto.</p>
      </div>
    );
  }

  const odsMap: Record<number, { title: string, color: string }> = {
    13: { title: 'Ação Contra a Mudança Global do Clima', color: 'bg-emerald-600' },
    15: { title: 'Vida Terrestre', color: 'bg-green-500' },
    12: { title: 'Consumo e Produção Responsáveis', color: 'bg-yellow-600' },
    8:  { title: 'Trabalho Decente e Crescimento Econômico', color: 'bg-red-800' }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((odsId, idx) => {
        const info = odsMap[odsId] || { title: `ODS #${odsId}`, color: 'bg-[#2D5A27]' };
        return (
          <div 
            key={idx} 
            className={`flex items-center gap-2 ${info.color} text-white px-3 py-1.5 rounded shadow-sm`}
            title={info.title}
          >
            <span className="font-mono text-xs font-bold">ODS {odsId}</span>
          </div>
        );
      })}
    </div>
  );
};

// --- Componente Principal ---
export default function EmpresaDashboardPage() {
  const { session, disconnect } = useAuth();
  const contracts = useSorobanContracts();

  const [esgData, setEsgData] = useState<{
    carbonSeq: number;
    biomass: number;
    badges: number[];
    verified: boolean;
  } | null>(null);
  
  const [leafBalance, setLeafBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadOnChainData() {
      if (!session?.address) return;
      
      try {
        setIsLoading(true);
        setErrorMsg('');

        // 1. Buscar Registro da Empresa (SBT)
        // O nome correto no contrato exportado é get_empresa_sbt
        const txSbt = await contracts.companyId.get_empresa_sbt({ company: session.address });
        
        // RESOLUÇÃO TS 2339: Sem .unwrap() nem .isOk(). O tx.result contém o dado se a simulação ocorreu.
        const record = txSbt.result;
        
        if (record) {
          setEsgData({
            carbonSeq: Number(record.carbon_seq_g) / 1000, // conversão g para kg
            biomass: Number(record.biomass_kg),
            badges: Array.from(record.ods_badges || []),
            verified: record.verified
          });
        } else {
          setEsgData(null);
        }

        // 2. Buscar Saldo de Leafs
        // O método no contrato de token padrão Soroban é `balance`
        const txBalance = await (contracts.leafToken as any).balance({ id: session.address });
        if (txBalance?.result !== undefined) {
          setLeafBalance(txBalance.result.toString());
        }

      } catch (err: any) {
        console.error("Erro ao carregar dados on-chain:", err);
        setErrorMsg('Falha ao conectar com o Ledger. ' + (err.message || ''));
      } finally {
        setIsLoading(false);
      }
    }

    loadOnChainData();
  }, [session, contracts]);

  return (
    <RoleGuard allowedRoles={['empresa']}>
      <div className="min-h-screen bg-[#FDFBF9] text-[#26170E] font-sans flex">
        
        {/* SIDEBAR LATERAL */}
        <aside className="w-64 border-r-2 border-[#D5D0C8] bg-white flex flex-col hidden md:flex">
          <div className="p-6 border-b border-[#D5D0C8]">
            <BrandLogo className="h-8 w-auto" />
          </div>
          
          <div className="p-6 flex-1">
            <p className="font-mono text-[10px] text-[#6B6560] font-bold uppercase tracking-widest mb-4">
              Navegação
            </p>
            <nav className="flex flex-col gap-2">
              <Link href="/empresa/dashboard" className="flex items-center gap-3 bg-[#2D5A27] text-white px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider">
                <Building2 size={16} />
                Painel ESG
              </Link>
              <button className="flex items-center gap-3 text-[#6B6560] hover:text-[#26170E] hover:bg-[#FDFBF9] px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors text-left">
                <Leaf size={16} />
                Módulo Leaf
              </button>
              <button className="flex items-center gap-3 text-[#6B6560] hover:text-[#26170E] hover:bg-[#FDFBF9] px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors text-left">
                <FileText size={16} />
                Relatórios
              </button>
              <button className="flex items-center gap-3 text-[#6B6560] hover:text-[#26170E] hover:bg-[#FDFBF9] px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors text-left">
                <Settings size={16} />
                Configurações
              </button>
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-[#D5D0C8] bg-gray-50">
            <div className="mb-4">
              <p className="font-mono text-[10px] text-[#6B6560] font-bold uppercase tracking-widest mb-1">Carteira Conectada</p>
              <p className="font-mono text-xs text-[#26170E] truncate" title={session?.address}>
                {session?.address ? `${session.address.slice(0, 5)}...${session.address.slice(-4)}` : 'Desconectado'}
              </p>
            </div>
            <button 
              onClick={disconnect}
              className="flex items-center gap-2 text-[#C0392B] hover:text-[#A93226] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <LogOut size={14} />
              Desconectar
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
                <h1 className="font-mono text-2xl font-bold uppercase tracking-wider text-[#26170E] mb-2">
                  Painel de Impacto ESG
                </h1>
                <p className="text-sm text-[#6B6560]">
                  Gestão on-chain das suas métricas ambientais.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#26170E] font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-colors shadow-sm rounded flex items-center gap-2">
                  <FileText size={16} />
                  Ver Relatório ESG
                </button>
                <button className="bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-mono text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-colors shadow-sm rounded flex items-center gap-2">
                  <ArrowUpRight size={16} />
                  Adquirir Folhas (On-Ramp)
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
              
              {/* Card 1: Saldo Leaf */}
              <div className="bg-white border border-[#E5E7EB] rounded p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf size={18} className="text-[#2D5A27]" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6560]">Saldo Leaf</h3>
                </div>
                {isLoading ? (
                  <div className="h-8 bg-gray-100 rounded animate-pulse w-24"></div>
                ) : (
                  <p className="font-mono text-3xl font-bold text-[#26170E]">{leafBalance}</p>
                )}
                <p className="text-[10px] text-[#6B6560] mt-2 uppercase tracking-widest font-mono">Tokens Disponíveis</p>
              </div>

              {/* Card 2: Carbono */}
              <div className="bg-white border border-[#E5E7EB] rounded p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={18} className="text-[#2D5A27]" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6560]">C-Sequestrado</h3>
                </div>
                {isLoading ? (
                  <div className="h-8 bg-gray-100 rounded animate-pulse w-24"></div>
                ) : (
                  <p className="font-mono text-3xl font-bold text-[#26170E]">
                    {esgData ? esgData.carbonSeq.toLocaleString() : '0'} <span className="text-base text-[#6B6560]">kg</span>
                  </p>
                )}
                <p className="text-[10px] text-[#6B6560] mt-2 uppercase tracking-widest font-mono">Emissões Compensadas</p>
              </div>

              {/* Card 3: Biomassa */}
              <div className="bg-white border border-[#E5E7EB] rounded p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf size={18} className="text-[#2D5A27]" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6560]">Biomassa Financiada</h3>
                </div>
                {isLoading ? (
                  <div className="h-8 bg-gray-100 rounded animate-pulse w-24"></div>
                ) : (
                  <p className="font-mono text-3xl font-bold text-[#26170E]">
                    {esgData ? esgData.biomass.toLocaleString() : '0'} <span className="text-base text-[#6B6560]">kg</span>
                  </p>
                )}
                <p className="text-[10px] text-[#6B6560] mt-2 uppercase tracking-widest font-mono">Ativos RWA em Custódia</p>
              </div>

              {/* Card 4: Auditoria */}
              <div className="bg-white border border-[#E5E7EB] rounded p-6 shadow-sm flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={18} className="text-[#2D5A27]" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6560]">Status Auditoria</h3>
                </div>
                {isLoading ? (
                  <div className="h-8 bg-gray-100 rounded animate-pulse w-full"></div>
                ) : (
                  <div>
                    {esgData?.verified ? (
                      <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded">
                        Validado Vereda
                      </span>
                    ) : (
                      <span className="inline-block bg-amber-100 text-amber-800 border border-amber-300 font-mono text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded">
                        Auditoria Pendente
                      </span>
                    )}
                  </div>
                )}
                <p className="text-[10px] text-[#6B6560] mt-3 uppercase tracking-widest font-mono">Registro Oracle</p>
              </div>

            </div>

            <div className="bg-white border border-[#E5E7EB] shadow-sm rounded p-8">
              <div className="border-b border-[#D5D0C8] pb-6 mb-6">
                <h2 className="font-mono text-lg font-bold uppercase tracking-wider text-[#26170E] mb-2">
                  Selos de Impacto ESG
                </h2>
                <p className="text-sm text-[#6B6560]">
                  Reconhecimentos alinhados aos Objetivos de Desenvolvimento Sustentável da ONU, ancorados on-chain.
                </p>
              </div>
              
              {isLoading ? (
                <div className="flex gap-3">
                  <div className="h-8 w-24 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-8 w-24 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ) : (
                <EsgBadges badges={esgData?.badges || []} />
              )}
            </div>

          </div>
        </main>

      </div>
    </RoleGuard>
  );
}