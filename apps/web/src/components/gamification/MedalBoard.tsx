'use client';

import React from 'react';
import { MedalBadge, Medal } from './MedalBadge';
import { Award } from 'lucide-react';

interface MedalBoardProps {
  medals: Medal[];
}

export function MedalBoard({ medals }: MedalBoardProps) {
  const unlockedCount = medals.filter(m => m.isUnlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Quadro de Medalhas <span className="text-slate-500 text-sm font-normal">({unlockedCount}/{medals.length} conquistas)</span>
        </h2>
        <div className="bg-amber-500/10 text-amber-400 text-xs px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5">
          <Award className="w-4 h-4" /> SBT
        </div>
      </div>

      <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
        <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
          {medals.map(medal => (
            <MedalBadge key={medal.id} medal={medal} />
          ))}
        </div>
      </div>
    </div>
  );
}
