'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-[#0B0F0D] min-h-screen text-[#E0E2E1] font-sans selection:bg-[#00F5A0] selection:text-[#0B0F0D]">

      {/* BACKGROUND DECOR (BLURS) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#00F5A0]/5 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-[#00F5A0]/5 blur-[120px] rounded-full"></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex justify-between items-center p-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌲</span>
          <span className="font-black text-xl tracking-tighter uppercase">Florestas<span className="text-[#00F5A0]">.Social</span></span>
        </div>
        <Link
          href="/login"
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-full text-sm font-bold transition-all"
        >
          Entrar no Portal
        </Link>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block bg-[#00F5A0]/10 border border-[#00F5A0]/20 text-[#00F5A0] text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6">
            Protocolo RWA & ReFi • Powered by Stellar
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-8">
            Converta <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5A0] to-white">Crescimento Biológico</span> em Ativo Digital.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            O primeiro protocolo mundial que transforma Mogno Africano em colateral programável, unindo conformidade ESG para empresas e recompensas reais para consumidores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/checkout"
              className="bg-[#00F5A0] text-[#0B0F0D] px-8 py-4 rounded-2xl font-black text-center shadow-[0_0_30px_rgba(0,245,160,0.3)] hover:scale-105 transition-all"
            >
              ADQUIRIR BOSQUE (B2B)
            </Link>
            <Link
              href="/resgate"
              className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black text-center hover:bg-white/10 transition-all"
            >
              RESGATAR FOLHAS (B2C)
            </Link>
          </div>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#1A2E24] p-8 rounded-[2.5rem] border border-white/5 hover:border-[#00F5A0]/30 transition-all group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">🏢</div>
            <h3 className="text-xl font-black mb-2 italic">Empresas</h3>
            <p className="text-sm text-gray-400">Onboarding fiduciário via Etherfuse. Transforme passivo ambiental em métricas auditáveis on-chain com lastro real.</p>
          </div>
          <div className="bg-[#1A2E24] p-8 rounded-[2.5rem] border border-white/5 hover:border-[#00F5A0]/30 transition-all group">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">🤳</div>
            <h3 className="text-xl font-black mb-2 italic">Consumidores</h3>
            <p className="text-sm text-gray-400">Escaneie QR Codes em produtos e ganhe $LEAF. Sua jornada de Guardião começa com um simples scan.</p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 p-12 text-center">
        <div className="opacity-30 flex justify-center gap-8 mb-8 grayscale hover:grayscale-0 transition-all">
          <span className="font-bold tracking-tighter">ETHERFUSE</span>
          <span className="font-bold tracking-tighter">STELLAR / SOROBAN</span>
          <span className="font-bold tracking-tighter">VEREDA VERIFY</span>
        </div>
        <p className="text-gray-600 text-xs uppercase tracking-widest">© 2026 Florestas.Social Protocol • Reflorestando a economia</p>
      </footer>
    </div>
  );
}