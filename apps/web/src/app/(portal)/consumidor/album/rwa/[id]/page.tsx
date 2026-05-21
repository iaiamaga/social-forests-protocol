'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSorobanContracts, DnftRecord } from "@/hooks/useSorobanContracts";
import { Leaf, Ruler } from "lucide-react";
import ClientOnly from "@/components/ClientOnly";

export default function TreeDetailsPage() {
  const { id } = useParams();
  const { forestMythosVault } = useSorobanContracts();
  const [oracleData, setOracleData] = useState<DnftRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id && forestMythosVault) {
        setLoading(true);
        try {
          // Chamada corrigida para o método gerado pelo Soroban
          const result = await forestMythosVault.get_dnft({ token_id: Number(id) });

          if (result && result.result) {
            setOracleData(result.result as unknown as DnftRecord);
          }
        } catch (err) {
          console.error("Erro ao buscar dados na blockchain:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id, forestMythosVault]);

  return (
    <ClientOnly>
      <div className="max-w-4xl mx-auto p-6 pb-20">
        <div className="bg-[#1a110a] border-2 border-orange-900/20 rounded-[40px] p-8 shadow-2xl">
          <h1 className="text-[#FFA800] text-3xl font-black italic mb-6 uppercase">
            Detalhes do RWA
          </h1>

          {loading ? (
            <p className="text-white text-center">Carregando dados da rede...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <Leaf className="text-emerald-400 mb-2" size={24} />
                <p className="text-slate-500 text-xs font-bold uppercase">Carbono (g)</p>
                <p className="text-2xl font-bold text-white">
                  {oracleData?.carbon_g ?? '0'} g
                </p>
              </div>

              <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                <Ruler className="text-blue-400 mb-2" size={24} />
                <p className="text-slate-500 text-xs font-bold uppercase">Fase Biológica</p>
                <p className="text-2xl font-bold text-white">
                  {oracleData?.phase ?? '...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  );
}