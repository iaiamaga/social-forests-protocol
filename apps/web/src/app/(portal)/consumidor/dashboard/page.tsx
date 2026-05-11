'use client';

import { useAuth } from '@/context/AuthContext';
import {
  Leaf,
  TreePine,
  Star,
  Award,
  Clock,
  ChevronRight,
  Sprout,
} from 'lucide-react';
import Link from 'next/link';

// ─── Tipos ────────────────────────────────────────────────────────────────────
type GuardianLevel = 'Semente' | 'Guardião' | 'Ancião' | 'Lenda';

interface GuardianTier {
  level: GuardianLevel;
  minLeaf: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
}

// ─── Config dos Níveis de Guardião ───────────────────────────────────────────
const GUARDIAN_TIERS: GuardianTier[] = [
  {
    level: 'Semente',
    minLeaf: 0,
    color: 'text-lime-400',
    bgColor: 'bg-lime-500/10',
    borderColor: 'border-lime-500/30',
    icon: <Sprout className="w-5 h-5" />,
    description: 'Você acaba de germinar no protocolo. Continue resgatando!',
  },
  {
    level: 'Guardião',
    minLeaf: 50,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    icon: <Leaf className="w-5 h-5" />,
    description: 'Você cuida ativamente de um Mogno Africano. Parabéns!',
  },
  {
    level: 'Ancião',
    minLeaf: 200,
    color: 'text-teal-300',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    icon: <TreePine className="w-5 h-5" />,
    description: 'Sua floresta cresce. O carbono que você reteve já faz diferença.',
  },
  {
    level: 'Lenda',
    minLeaf: 500,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    icon: <Star className="w-5 h-5" />,
    description: 'Status máximo. Você é uma lenda do Protocolo Florestas.Social.',
  },
];

function getCurrentTier(balance: number): { current: GuardianTier; next: GuardianTier | null; progress: number } {
  let current = GUARDIAN_TIERS[0];
  let next: GuardianTier | null = GUARDIAN_TIERS[1];

  for (let i = GUARDIAN_TIERS.length - 1; i >= 0; i--) {
    if (balance >= GUARDIAN_TIERS[i].minLeaf) {
      current = GUARDIAN_TIERS[i];
      next = GUARDIAN_TIERS[i + 1] ?? null;
      break;
    }
  }

  const from = current.minLeaf;
  const to = next ? next.minLeaf : current.minLeaf;
  const progress = next ? Math.min(100, ((balance - from) / (to - from)) * 100) : 100;

  return { current, next, progress };
}

// ─── Histórico mockado — será substituído por query Supabase/Stellar ─────────
const MOCK_HISTORY = [
  { id: 1, label: 'Resgate QR · Maratá Suco', amount: 10, date: '11/05/2026', txId: 'stellar_tx_abc123' },
  { id: 2, label: 'Resgate QR · Maratá Orgânico', amount: 10, date: '09/05/2026', txId: 'stellar_tx_def456' },
  { id: 3, label: 'Bônus de Missão · "Vá ao Parque"', amount: 25, date: '07/05/2026', txId: 'stellar_tx_ghi789' },
];

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function ConsumidorDashboard() {
  const { session } = useAuth();

  // Saldo mockado — integrar com Stellar Horizon / Supabase
  const leafBalance = 45;
  const { current, next, progress } = getCurrentTier(leafBalance);

  return (
    <div className="bg-[#0B0F0D] min-h-screen text-[#E0E2E1] p-6 md:p-10 font-sans">

      {/* ── BACKGROUND GLOW ──────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00F5A0]/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-emerald-900/15 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* ── HEADER ──────────────────────────────────────────────────────────── */}
        <header className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#00F5A0]/60 mb-1 font-bold">
            Florestas.Social · Oásis B2C
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Meu Impacto
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {session?.displayName
              ? `Olá, ${session.displayName} 🌿`
              : 'Bem-vindo ao seu Oásis Sustentável'}
          </p>
        </header>

        {/* ── CARD: SALDO & NÍVEL DE GUARDIÃO ─────────────────────────────────── */}
        <div className={`rounded-3xl border p-8 mb-6 ${current.bgColor} ${current.borderColor}`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
                Saldo Total
              </p>
              <p className="text-5xl font-black text-white font-mono">
                {leafBalance}
                <span className="text-xl ml-2 text-slate-400 font-medium">$LEAF</span>
              </p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${current.bgColor} border ${current.borderColor} ${current.color} shadow-lg`}>
              {current.icon}
            </div>
          </div>

          {/* Nível Atual */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-black uppercase tracking-widest ${current.color}`}>
                {current.level}
              </span>
              {next && (
                <span className="text-xs text-slate-500">
                  Próximo: <span className="text-slate-300 font-semibold">{next.level}</span> ({next.minLeaf} $LEAF)
                </span>
              )}
            </div>

            {/* Barra de Progresso */}
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  current.level === 'Lenda'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                    : 'bg-gradient-to-r from-[#00F5A0] to-emerald-300'
                }`}
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            {next ? (
              <p className="text-xs text-slate-500 mt-2">
                Faltam <span className="text-white font-semibold">{next.minLeaf - leafBalance} $LEAF</span> para{' '}
                <span className={`font-semibold ${next.color ?? 'text-white'}`}>{next.level}</span>
              </p>
            ) : (
              <p className="text-xs text-amber-400 mt-2 font-semibold">
                🏆 Nível máximo alcançado!
              </p>
            )}
          </div>

          {/* Descrição do Nível */}
          <p className="text-xs text-slate-400 leading-relaxed italic border-t border-white/10 pt-4">
            {current.description}
          </p>
        </div>

        {/* ── NÍVEIS (ROADMAP) ────────────────────────────────────────────────── */}
        <div className="bg-white/3 border border-white/8 rounded-3xl p-6 mb-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-5 flex items-center gap-2">
            <Award className="w-4 h-4" /> Jornada do Guardião
          </h2>
          <div className="space-y-3">
            {GUARDIAN_TIERS.map((tier) => {
              const isUnlocked = leafBalance >= tier.minLeaf;
              const isCurrent = tier.level === current.level;
              return (
                <div
                  key={tier.level}
                  className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
                    isCurrent
                      ? `${tier.bgColor} border ${tier.borderColor}`
                      : isUnlocked
                      ? 'bg-white/4'
                      : 'opacity-40'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked ? `${tier.bgColor} ${tier.color}` : 'bg-white/5 text-slate-600'
                  }`}>
                    {tier.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isUnlocked ? tier.color : 'text-slate-500'}`}>
                        {tier.level}
                      </span>
                      {isCurrent && (
                        <span className="text-[9px] bg-[#00F5A0]/20 text-[#00F5A0] border border-[#00F5A0]/30 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                          Atual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{tier.minLeaf} $LEAF para desbloquear</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── HISTÓRICO DE RESGATES ────────────────────────────────────────────── */}
        <div className="bg-white/3 border border-white/8 rounded-3xl p-6 mb-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-5 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Histórico de Resgates
          </h2>
          <div className="space-y-3">
            {MOCK_HISTORY.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-[#0B0F0D]/60 rounded-2xl border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#00F5A0]/10 rounded-xl flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-[#00F5A0]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{tx.label}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{tx.date} · {tx.txId}</p>
                  </div>
                </div>
                <span className="text-[#00F5A0] font-black text-sm shrink-0 ml-4">+{tx.amount} $LEAF</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── LINKS RÁPIDOS ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/consumidor/viveiro"
            className="group bg-white/3 border border-white/8 rounded-2xl p-5 flex items-center justify-between hover:border-emerald-400/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <TreePine className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold text-sm text-slate-300">Meu Viveiro</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </Link>
          <Link
            href="/consumidor/missoes"
            className="group bg-white/3 border border-white/8 rounded-2xl p-5 flex items-center justify-between hover:border-purple-400/30 transition-all"
          >
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-sm text-slate-300">Missões</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 transition-colors" />
          </Link>
        </div>

        <p className="mt-10 text-center text-slate-700 text-[10px] uppercase tracking-[0.2em]">
          Powered by Stellar Anchors · Etherfuse · SEP-0006
        </p>

      </div>
    </div>
  );
}
