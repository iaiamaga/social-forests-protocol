'use client';

import React from 'react';
import { StickerCard, NftSticker } from './StickerCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface StickerAlbumProps {
  stickers: NftSticker[];
}

export function StickerAlbum({ stickers }: StickerAlbumProps) {
  const unlockedCount = stickers.filter(s => s.isUnlocked).length;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Álbum de RWAs <span className="text-slate-500 text-sm font-normal">({unlockedCount}/{stickers.length} ativos)</span>
        </h2>
        <Link href="/consumidor/album" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
          Ver Álbum Completo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-md">
        {stickers.map(sticker => (
          <StickerCard key={sticker.id} sticker={sticker} />
        ))}
      </div>
    </div>
  );
}
