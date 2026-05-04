"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSorobanContracts, TreeRecord } from "@/hooks/useSorobanContracts";
import { Leaf, Ruler } from "lucide-react"; // Removidos Activity e MapPin

export default function TreeDetailsPage() {
  const { id } = useParams();
  const { getTreeRecord } = useSorobanContracts();
  const [oracleData, setOracleData] = useState<TreeRecord | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await getTreeRecord(id as string);
        setOracleData(data);
      }
    };
    fetchData();
  }, [id, getTreeRecord]);

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <div className="bg-[#1a110a] border-2 border-orange-900/20 rounded-[40px] p-8 shadow-2xl">
        <h1 className="text-[#FFA800] text-3xl font-black italic mb-6 uppercase">Detalhes do RWA</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
            <Leaf className="text-emerald-400 mb-2" size={24} />
            <p className="text-slate-500 text-xs font-bold uppercase">Carbono Seqüestrado</p>
            <p className="text-2xl font-bold text-white">{oracleData?.carbon_kg ?? '...'} kg</p>
          </div>

          <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
            <Ruler className="text-blue-400 mb-2" size={24} />
            <p className="text-slate-500 text-xs font-bold uppercase">Altura Estimada</p>
            <p className="text-2xl font-bold text-white">
              {oracleData ? (oracleData.height_cm / 100).toFixed(1) : '...'} m
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}