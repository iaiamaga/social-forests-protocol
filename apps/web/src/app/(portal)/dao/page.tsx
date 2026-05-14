"use client";

import { useState } from "react";
import {
  Vote,
  Users,
  FileText,
  Zap,
  ThumbsUp,
  ThumbsDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Sprout,
  Hammer,
  Landmark,
  ExternalLink,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
type ProposalStatus = "active" | "passed" | "rejected";

interface Proposal {
  id: string;
  tag: string;
  tagIcon: React.ElementType;
  title: string;
  description: string;
  status: ProposalStatus;
  endsIn: string;
  favor: number;
  contra: number;
  quorum: number;
  author: string;
  votes: number;
}

/* ─── Data ───────────────────────────────────────────────── */
const networkStats = [
  {
    label: "Total de Membros",
    value: "1.250",
    unit: "detentores",
    icon: Users,
    color: "emerald",
  },
  {
    label: "Propostas Ativas",
    value: "3",
    unit: "em votação",
    icon: FileText,
    color: "violet",
  },
  {
    label: "Poder Delegado",
    value: "87,4%",
    unit: "dos tokens",
    icon: Zap,
    color: "amber",
  },
];

const initialProposals: Proposal[] = [
  {
    id: "SFP-007",
    tag: "Cultivo",
    tagIcon: Sprout,
    title: "Aprovação de novo lote de Mogno Africano (Safra 2026)",
    description:
      "Proposta para autorizar a produção de 12.000 novas mudas de Mogno Africano no Viveiro Maravilha para a safra de 2026, com alocação de 45.000 Folhas do tesouro da DAO para custeio.",
    status: "active",
    endsIn: "2d 14h restantes",
    favor: 68,
    contra: 17,
    quorum: 42,
    author: "0x4f3a…9c12",
    votes: 523,
  },
  {
    id: "SFP-006",
    tag: "Parceria",
    tagIcon: Hammer,
    title: "Integração da serraria Sómogno ao painel de rastreamento on-chain",
    description:
      "Conectar o sistema de gestão da Sómogno ao contrato de oracle do protocolo, permitindo que os dados de produção (m³/lote) sejam registrados automaticamente na blockchain e auditáveis pelos membros.",
    status: "active",
    endsIn: "5d 3h restantes",
    favor: 82,
    contra: 8,
    quorum: 67,
    author: "0xa812…ff04",
    votes: 841,
  },
  {
    id: "SFP-005",
    tag: "Governança",
    tagIcon: Landmark,
    title: "Ajuste do quórum mínimo para 30% (revisão semestral)",
    description:
      "Revisão do parâmetro de quórum mínimo de 25% para 30% dos tokens delegados, aumentando a representatividade das decisões conforme crescimento da base de membros.",
    status: "passed",
    endsIn: "Encerrada",
    favor: 91,
    contra: 4,
    quorum: 78,
    author: "0xd239…8b77",
    votes: 1102,
  },
];

/* ─── Sub-components ──────────────────────────────────────── */

const statusConfig: Record<
  ProposalStatus,
  { label: string; icon: React.ElementType; classes: string }
> = {
  active: {
    label: "Ativa",
    icon: Clock,
    classes: "bg-violet-500/10 text-violet-300 border-violet-500/30",
  },
  passed: {
    label: "Aprovada",
    icon: CheckCircle2,
    classes: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  },
  rejected: {
    label: "Rejeitada",
    icon: AlertCircle,
    classes: "bg-red-500/10 text-red-300 border-red-500/30",
  },
};

const tagColorMap: Record<string, string> = {
  Cultivo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Parceria: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Governança: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const [voted, setVoted] = useState<"favor" | "contra" | null>(null);
  const { label, icon: StatusIcon, classes } = statusConfig[proposal.status];
  const TagIcon = proposal.tagIcon;
  const isActive = proposal.status === "active";

  const total = proposal.favor + proposal.contra;
  const favorPct = Math.round((proposal.favor / total) * 100);
  const contraPct = 100 - favorPct;

  return (
    <div className="group relative">
      {/* Hover glow */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500/20 to-slate-900/0 opacity-0 blur-sm transition-all duration-500 group-hover:opacity-100" />

      <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-sm overflow-hidden">
        {/* Top stripe */}
        <div className="h-px w-full bg-gradient-to-r from-violet-500/40 via-emerald-500/20 to-transparent" />

        <div className="p-5 md:p-6">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Proposal ID */}
              <span className="rounded-lg bg-slate-800 border border-slate-700/60 px-2.5 py-1 text-xs font-mono font-bold text-slate-400">
                {proposal.id}
              </span>

              {/* Tag */}
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tagColorMap[proposal.tag] ?? ""}`}
              >
                <TagIcon className="h-3 w-3" strokeWidth={1.8} />
                {proposal.tag}
              </span>
            </div>

            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${classes}`}
            >
              <StatusIcon className="h-3 w-3" strokeWidth={2} />
              {label}
            </span>
          </div>

          {/* Title & description */}
          <h3 className="text-base font-bold text-white mb-2 leading-snug">
            {proposal.title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">
            {proposal.description}
          </p>

          {/* ── Progress bar ── */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ThumbsUp className="h-3 w-3" />
                A favor {favorPct}%
              </span>
              <span className="flex items-center gap-1 text-red-400 font-medium">
                Contra {contraPct}%
                <ThumbsDown className="h-3 w-3" />
              </span>
            </div>

            {/* Bar */}
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                style={{ width: `${favorPct}%` }}
              />
              <div
                className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-red-500/80 to-rose-400/60"
                style={{ width: `${contraPct}%` }}
              />
            </div>

            {/* Quorum indicator */}
            <div className="flex items-center gap-1.5 mt-2">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-[11px] text-slate-600">
                Quórum:{" "}
                <span
                  className={
                    proposal.quorum >= 30
                      ? "text-emerald-500 font-semibold"
                      : "text-amber-500 font-semibold"
                  }
                >
                  {proposal.quorum}%
                </span>{" "}
                atingido · {proposal.votes.toLocaleString()} votos computados
              </span>
            </div>
          </div>

          {/* ── Voting buttons ── */}
          <div className="flex gap-3">
            <button
              disabled={!isActive}
              onClick={() => setVoted(voted === "favor" ? null : "favor")}
              className={`
                flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-bold
                transition-all duration-200 active:scale-95
                ${!isActive
                  ? "cursor-not-allowed border-slate-700/40 bg-slate-800/30 text-slate-600"
                  : voted === "favor"
                  ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.2)]"
                  : "border-slate-700/60 bg-slate-800/50 text-slate-300 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-300"
                }
              `}
            >
              <ThumbsUp className="h-4 w-4" strokeWidth={1.8} />
              A favor
            </button>

            <button
              disabled={!isActive}
              onClick={() => setVoted(voted === "contra" ? null : "contra")}
              className={`
                flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-bold
                transition-all duration-200 active:scale-95
                ${!isActive
                  ? "cursor-not-allowed border-slate-700/40 bg-slate-800/30 text-slate-600"
                  : voted === "contra"
                  ? "border-red-500/60 bg-red-500/20 text-red-300 shadow-[0_0_16px_rgba(239,68,68,0.2)]"
                  : "border-slate-700/60 bg-slate-800/50 text-slate-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-300"
                }
              `}
            >
              <ThumbsDown className="h-4 w-4" strokeWidth={1.8} />
              Contra
            </button>
          </div>

          {voted && isActive && (
            <p className="mt-2.5 text-center text-xs text-slate-500 animate-fade-in">
              Voto registrado ·{" "}
              <span className={voted === "favor" ? "text-emerald-400" : "text-red-400"}>
                {voted === "favor" ? "A favor ✓" : "Contra ✗"}
              </span>
              {" "}· assine na sua carteira para confirmar on-chain
            </p>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {proposal.endsIn}
            </span>
            <span>
              por{" "}
              <span className="font-mono text-slate-500">{proposal.author}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */

export default function DaoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white pb-24 md:pb-10">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-violet-600/12 blur-[120px]" />
        <div className="absolute bottom-1/3 left-0 h-64 w-64 rounded-full bg-emerald-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-5 py-8 md:py-10">

        {/* ── PAGE HEADER ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/50 px-3 py-1 text-xs text-slate-400 backdrop-blur-sm">
              <Vote className="h-3.5 w-3.5 text-violet-400" />
              Governança On-Chain
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Governança{" "}
            <span className="text-violet-400">Social Forest DAO</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Vote em propostas, delegue seu poder e molde o futuro do protocolo. Cada Árvore Real concede poder de voto proporcional.
          </p>
        </div>

        {/* ── NETWORK STATS ── */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 mb-3">
            Estatísticas da Rede
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {networkStats.map(({ label, value, unit, icon: Icon, color }) => {
              const colorMap: Record<string, { icon: string; value: string; bg: string; border: string }> = {
                emerald: {
                  icon: "text-emerald-400",
                  value: "text-emerald-300",
                  bg: "bg-emerald-500/5",
                  border: "border-emerald-500/15",
                },
                violet: {
                  icon: "text-violet-400",
                  value: "text-violet-300",
                  bg: "bg-violet-500/5",
                  border: "border-violet-500/15",
                },
                amber: {
                  icon: "text-amber-400",
                  value: "text-amber-300",
                  bg: "bg-amber-500/5",
                  border: "border-amber-500/15",
                },
              };
              const c = colorMap[color];

              return (
                <div
                  key={label}
                  className={`flex flex-col gap-2 rounded-2xl border ${c.border} ${c.bg} p-4`}
                >
                  <Icon className={`h-5 w-5 ${c.icon}`} strokeWidth={1.5} />
                  <div>
                    <p className={`text-xl font-extrabold leading-none ${c.value}`}>
                      {value}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1 leading-tight">
                      {unit}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      {label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── GROWTH METER ── */}
        <div className="mb-8 rounded-2xl border border-slate-700/40 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              Participação geral da DAO
            </div>
            <span className="text-sm font-bold text-emerald-400">73%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all duration-1000"
              style={{ width: "73%" }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-600">
            912 de 1.250 membros participaram nas últimas 4 semanas
          </p>
        </div>

        {/* ── PROPOSALS ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Propostas Recentes
            </h2>
            <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              <ExternalLink className="h-3 w-3" />
              Ver todas
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {initialProposals.map((p) => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
          </div>
        </section>

        {/* ── NEW PROPOSAL CTA ── */}
        <div className="mt-8 rounded-2xl border border-dashed border-slate-700/60 bg-slate-900/30 p-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10">
            <FileText className="h-5 w-5 text-violet-400" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-300">
              Tem uma proposta?
            </p>
            <p className="text-xs text-slate-600 mt-1 max-w-xs">
              Qualquer detentor de Árvore Real pode submeter uma proposta ao protocolo.
            </p>
          </div>
          <button className="mt-1 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-bold text-violet-300 transition-all hover:bg-violet-500/20 hover:border-violet-500/50 active:scale-95">
            Criar Proposta
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-700">
          Votos são registrados localmente. Integração on-chain via contrato de governança em desenvolvimento.
          <br />
          Snapshot a cada bloco · Rede Stellar Soroban
        </p>
      </div>
    </main>
  );
}
