'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Lock, Wind, Ruler } from 'lucide-react';
import React from 'react';

export interface NftSticker {
  id: string;
  name: string;
  rarity: 'Comum' | 'Raro' | 'Lenda' | 'Bloqueado';
  height?: string;
  co2?: string;
  age?: string;
  imageUrl?: string;
  isUnlocked: boolean;
}

export function StickerCard({ sticker }: { sticker: NftSticker }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isLenda = sticker.rarity === 'Lenda';

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full aspect-[2/3] rounded-2xl flex flex-col justify-between p-4 cursor-pointer overflow-hidden shadow-xl
        ${!sticker.isUnlocked 
          ? 'bg-slate-900/40 border border-slate-800' 
          : 'bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-500/30'
        }
      `}
    >
      {/* FOIL EFFECT para Lenda */}
      {isLenda && sticker.isUnlocked && (
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge mix-blend-overlay">
          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,215,0,0.4)_50%,transparent_75%)] bg-[length:200%_100%] animate-shimmer" />
        </div>
      )}

      {/* INNER CONTENT em 3D */}
      <div style={{ transform: 'translateZ(30px)' }} className="flex flex-col h-full pointer-events-none relative z-10">
        
        {/* Top Header do Card */}
        <div className="flex justify-between items-start mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded
            ${!sticker.isUnlocked ? 'bg-slate-800 text-slate-500' :
              isLenda ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              sticker.rarity === 'Raro' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }
          `}>
            {sticker.rarity}
          </span>
          {sticker.isUnlocked && (
            <span className="text-[10px] font-mono text-emerald-500/60">#{sticker.id}</span>
          )}
        </div>

        {/* Centro (Imagem ou Lock) */}
        <div className="flex-1 flex items-center justify-center">
          {!sticker.isUnlocked ? (
            <div className="flex flex-col items-center opacity-30">
              <Lock className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-4xl filter grayscale opacity-50 text-slate-700">🌳</span>
            </div>
          ) : (
            <span className={`text-6xl drop-shadow-2xl transition-transform ${isLenda ? 'scale-110' : ''}`}>
              {sticker.imageUrl || '🌲'}
            </span>
          )}
        </div>

        {/* Rodapé / Oráculo */}
        <div className="mt-4 pt-3 border-t border-white/5">
          <h3 className={`font-bold mb-2 truncate ${!sticker.isUnlocked ? 'text-slate-600' : 'text-slate-200'}`}>
            {sticker.name}
          </h3>
          
          {sticker.isUnlocked ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-black/20 rounded-md px-1.5 py-1">
                <Wind className="w-3 h-3 text-emerald-400" />
                <span>{sticker.co2} CO₂</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-black/20 rounded-md px-1.5 py-1">
                <Ruler className="w-3 h-3 text-emerald-400" />
                <span>{sticker.height}</span>
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-slate-500 bg-black/20 rounded-md px-2 py-1 text-center">
              Requer mais folhas para desbloquear
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
