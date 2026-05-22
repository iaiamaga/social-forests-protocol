'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import RoleGuard from '../../../components/RoleGuard';
import { useSorobanContracts } from '../../../hooks/useSorobanContracts';
import { BrandLogo } from '../../../components/ui/BrandLogo';

// IMPORTAÇÕES EXPLÍCITAS PARA EVITAR TS 2304
import { 
  Leaf, 
  TreePine, 
  MapPin, 
  Trophy, 
  LogOut, 
  Gift,
  ArrowUpRight,
  Flame,
  UserCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

/**
 * MICRO-MISSÃO 2: DASHBOARD DO GUARDIÃO (USUÁRIO B2C)
 * - Integração real Soroban (sbt_guardian e leaf_token).
 * - Gamificação: Componente <EarnedBadges /> (Eras do Guardião).
 * - Tipagem direta (sem .isOk() ou .unwrap()) (Resolvendo TS 2339).
 */

// --- Componente Inline: EarnedBadges (Gamificação Eras) ---
const EarnedBadges = ({ era, level, xp }: { era: number, level: number, xp: number }) => {
  // Nomes temáticos das eras do Guardião
  const erasMap: Record<number, { name: string, color: string, icon: React.ElementType }> = {
    1: { name: 'Semente Desperta', color: 'bg-[#E5E7EB] text-[#6B6560]', icon: Leaf },
    2: { name: 'Broto Resiliente', color: 'bg-emerald-100 text-emerald-800', icon: Leaf },
    3: { name: 'Raiz Profunda', color: 'bg-green-200 text-green-900', icon: TreePine },
    4: { name: 'Tronco Forte', color: 'bg-amber-100 text-amber-800', icon: TreePine },
    5: { name: 'Copa Majestosa', color: 'bg-orange-200 text-orange-900', icon: Trophy },
    6: { name: 'Bosque Ancestral', color: 'bg-purple-200 text-purple-900', icon: Trophy },
    7: { name: 'Guardião Supremo', color: 'bg-[#2D5A27] text-white', icon: Trophy },
  };

  const currentEraInfo = erasMap[era] || erasMap[1];
  const Icon = currentEraInfo.icon;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 border-white shadow-md ${currentEraInfo.color}`}>
          <Icon size={28} />
        </div>
        <div>
          <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-[#26170E]">
            Era {era}: {currentEraInfo.name}
          </h4>
          <p className="text-xs text-[#6B6560] font-mono mt-1">Nível {level} • {xp} XP</p>
        </div>
      </div>
      
      {/* Barra de Progresso XP (Visual) */}
      <div className="w-full bg-[#E5E7EB] rounded-full h-2 mt-2">
        <div 
          className="bg-[#2D5A27] h-2 rounded-full transition-all duration-1000" 
          style={{ width: `${Math.min((xp % 1000) / 10, 100)}%` }}
        ></div>
      </div>
      <p className="text-[10px] text-right text-[#6B6560] font-mono uppercase tracking-widest mt-1">
        Próximo Nível: {1000 - (xp % 1000)} XP
      </p>
    </div>
  );
};

export default function ConsumidorDashboardPage() {
  const { session, disconnect } = useAuth();
  const contracts = useSorobanContracts();

  const [guardianData, setGuardianData] = useState<{
    era: number;
    level: number;
    xp: number;
  } | null>(null);
  
  const [leafBalance, setLeafBalance] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadGuardianData() {
      if (!session?.address) return;
      
      try {
        setIsLoading(true);
        setErrorMsg('');

        // 1. Buscar Progresso do Guardião (SBT Reputation)
        const txGuardian = await contracts.guardianId.get_sbt({ user: session.address });
        const record = txGuardian.result;
        
        // Tratamento direto, sem `.unwrap()` ou `.isOk()`
        if (record) {
          setGuardianData({
            era: Number(record.era),
            level: Number(record.level),
            xp: Number(record.xp),
          });
        } else {
          setGuardianData(null);
        }

        // 2. Buscar Recompensas / Saldo Leaf
        const txBalance = await contracts.leafToken.balance({ id: session.address });
        if (txBalance?.result !== undefined) {
          setLeafBalance(txBalance.result.toString());
        }

      } catch (err: any) {
        console.error("Erro ao buscar dados do Guardião:", err);
        setErrorMsg('Falha de conexão com Soroban. Tentando exibir dados básicos.');
      } finally {
        setIsLoading(false);
      }
    }

    loadGuardianData();
  }, [session, contracts]);

  return (
    <RoleGuard allowedRoles={['consumidor']}>
      <div className="min-h-screen bg-[#FDFBF9] text-[#26170E] font-sans flex">
        
        {/* SIDEBAR LATERAL */}
        <aside className="w-64 border-r-2 border-[#D5D0C8] bg-white flex flex-col hidden md:flex">
          <div className="p-6 border-b border-[#D5D0C8]">
            <BrandLogo className="h-8 w-auto" />
          </div>
          
          <div className="p-6 flex-1">
            <p className="font-mono text-[10px] text-[#6B6560] font-bold uppercase tracking-widest mb-4">
              Ações do Guardião
            </p>
            <nav className="flex flex-col gap-2">
              <Link href="/consumidor/dashboard" className="flex items-center gap-3 bg-[#2D5A27] text-white px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider shadow-sm">
                <Trophy size={16} />
                Meu Progresso
              </Link>
              <button className="flex items-center gap-3 text-[#6B6560] hover:text-[#26170E] hover:bg-[#FDFBF9] px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors text-left">
                <TreePine size={16} />
                Minhas Árvores
              </button>
              <button className="flex items-center gap-3 text-[#6B6560] hover:text-[#26170E] hover:bg-[#FDFBF9] px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors text-left">
                <MapPin size={16} />
                Explorar Bosques
              </button>
              <button className="flex items-center gap-3 text-[#6B6560] hover:text-[#26170E] hover:bg-[#FDFBF9] px-4 py-3 rounded font-mono text-xs font-bold uppercase tracking-wider transition-colors text-left">
                <Gift size={16} />
                Resgatar Prêmios
              </button>
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-[#D5D0C8] bg-gray-50">
            <div className="mb-4">
              <p className="font-mono text-[10px] text-[#6B6560] font-bold uppercase tracking-widest mb-1">Guardião Conectado</p>
              <p className="font-mono text-xs text-[#26170E] truncate flex items-center gap-2" title={session?.address}>
                <UserCircle size={14} className="text-[#2D5A27]" />
                {session?.address ? `${session.address.slice(0, 5)}...${session.address.slice(-4)}` : 'Sincronizando...'}
              </p>
            </div>
            <button 
              onClick={disconnect}
              className="flex items-center gap-2 text-[#C0392B] hover:text-[#A93226] font-mono text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <LogOut size={14} />
              Sair da Floresta
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

          <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <h1 className="font-mono text-2xl font-bold uppercase tracking-wider text-[#26170E] mb-2">
                  Olá, Guardião
                </h1>
                <p className="text-sm text-[#6B6560]">
                  Sua jornada de regeneração planetária está ancorada na rede Stellar.
                </p>
              </div>
              
              <button className="bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 transition-colors shadow-md rounded flex items-center justify-center gap-2 border border-transparent">
                <Flame size={16} className="text-orange-300" />
                Forjar dNFT de Mogno
              </button>
            </div>

            {errorMsg && (
              <div className="mb-8 flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded">
                <AlertCircle size={18} className="text-[#C0392B] mt-0.5 shrink-0" />
                <p className="text-sm text-[#C0392B] font-mono">{errorMsg}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              
              {/* Card 1: Progresso / Gamificação */}
              <div className="md:col-span-2 bg-white border border-[#E5E7EB] rounded p-6 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b border-[#D5D0C8] pb-4">
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-[#2D5A27]" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6560]">Status On-Chain</h3>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded">
                    SBT_GUARDIAN
                  </span>
                </div>
                
                {isLoading ? (
                  <div className="animate-pulse flex gap-4 w-full">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-2 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                  </div>
                ) : guardianData ? (
                  <EarnedBadges 
                    era={guardianData.era} 
                    level={guardianData.level} 
                    xp={guardianData.xp} 
                  />
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <p className="font-mono text-sm text-[#6B6560] uppercase tracking-wider mb-2">Sem Progresso Registrado</p>
                    <p className="text-xs text-[#6B6560] text-center">Inicie sua jornada forjando sua primeira árvore.</p>
                  </div>
                )}
              </div>

              {/* Card 2: Saldo Leaf */}
              <div className="bg-white border border-[#E5E7EB] rounded p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Leaf size={18} className="text-[#2D5A27]" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6560]">Bolsa de Recompensas</h3>
                  </div>
                  
                  {isLoading ? (
                    <div className="h-10 bg-gray-100 rounded animate-pulse w-full mb-2"></div>
                  ) : (
                    <div className="flex items-baseline gap-2 mb-2">
                      <p className="font-mono text-4xl font-bold text-[#26170E]">{leafBalance}</p>
                      <span className="font-mono text-sm text-[#6B6560] uppercase tracking-wider">LEAF</span>
                    </div>
                  )}
                  <p className="text-[10px] text-[#6B6560] uppercase tracking-widest font-mono mt-1">
                    Utilize para forjar árvores reais
                  </p>
                </div>
                
                <button className="w-full mt-6 bg-[#FDFBF9] border border-[#D5D0C8] hover:bg-gray-50 text-[#26170E] font-mono text-[10px] font-bold uppercase tracking-wider py-2 rounded transition-colors flex items-center justify-center gap-2">
                  Receber / Enviar
                  <ArrowUpRight size={12} />
                </button>
              </div>

            </div>

            {/* Inventário Vazio */}
            <div className="bg-white border border-[#E5E7EB] shadow-sm rounded p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FDFBF9] border border-[#D5D0C8] border-dashed rounded-full mb-4">
                <TreePine size={24} className="text-[#D5D0C8]" />
              </div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-[#26170E] mb-2">
                Nenhum dNFT de Árvore Forjado
              </h2>
              <p className="text-xs text-[#6B6560] max-w-sm mx-auto mb-6">
                Você ainda não possui árvores ancoradas na sua carteira. Comece a regenerar forjando um Mogno usando seus tokens Leaf.
              </p>
            </div>

          </div>
        </main>

      </div>
    </RoleGuard>
  );
}
