'use client';

import { ForestNFT } from '@/hooks/useForest';
import { Leaf } from 'lucide-react';

interface ForestGalleryProps {
    nfts: ForestNFT[];
    loading: boolean;
}

export function ForestGallery({ nfts, loading }: ForestGalleryProps) {
    if (loading) {
        return <div className="text-slate-500 font-mono animate-pulse">Sincronizando ativos...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
                <div key={nft.id} className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden hover:border-emerald-500/50 transition-all group">
                    <div className="aspect-square bg-slate-800 relative">
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full border border-white/10">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                {nft.rarity}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Leaf size={14} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                {nft.species}
                            </span>
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tight">
                            {nft.name}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    );
}