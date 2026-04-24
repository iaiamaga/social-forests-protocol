'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

export interface Medal {
  id: string;
  title: string;
  description: string;
  tier: 'Bronze' | 'Prata' | 'Ouro' | 'Esmeralda';
  icon: string;
  isUnlocked: boolean;
  date?: string;
}

export function MedalBadge({ medal }: { medal: Medal }) {
  const [isHovered, setIsHovered] = useState(false);

  const tierStyles = {
    Bronze: 'from-orange-800 to-amber-900 border-orange-700/50 text-orange-400',
    Prata: 'from-slate-400 to-slate-600 border-slate-300/50 text-slate-200',
    Ouro: 'from-amber-400 to-yellow-600 border-yellow-300/50 text-amber-100',
    Esmeralda: 'from-emerald-400 to-green-700 border-emerald-300/50 text-emerald-100',
  };

  const style = tierStyles[medal.tier];

  return (
    <div 
      className="relative flex flex-col items-center group cursor-help"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: medal.isUnlocked ? 5 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl border-2 shadow-xl relative
          ${medal.isUnlocked 
            ? `bg-gradient-to-br ${style}` 
            : 'bg-slate-800 border-slate-700 text-slate-600 grayscale opacity-50'
          }
        `}
      >
        {medal.isUnlocked && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        )}
        <span className="relative z-10 drop-shadow-md">{medal.icon}</span>
      </motion.div>
      
      <p className={`mt-3 text-xs text-center font-semibold tracking-wide ${medal.isUnlocked ? 'text-slate-300' : 'text-slate-600'}`}>
        {medal.title}
      </p>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg p-3 z-50 shadow-2xl animate-in fade-in zoom-in duration-200">
          <p className="text-xs font-bold text-white mb-1">{medal.title}</p>
          <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">{medal.description}</p>
          {medal.isUnlocked ? (
            <p className="text-[9px] text-emerald-400 font-mono">Conquistado em: {medal.date}</p>
          ) : (
            <p className="text-[9px] text-slate-500 font-mono">Trancado. Cumpra requisitos.</p>
          )}
        </div>
      )}
    </div>
  );
}
