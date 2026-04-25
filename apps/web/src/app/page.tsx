'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  Globe2, 
  Sun, 
  Moon, 
  Languages, 
  Building2,
  Users,
  TreePine,
  LineChart
} from 'lucide-react';

// ==========================================
// DICIONÁRIO DE TRADUÇÃO (EN / PT)
// ==========================================
const dict = {
  pt: {
    heroTag: "Protocolo Soroban (Stellar Testnet)",
    heroTitlePart1: "Prosperidade",
    heroTitleHighlight: "Programável",
    heroSubtitle: "Transforme engajamento sustentável em impacto real. O Florestas.social conecta empresas e consumidores em um movimento de reflorestamento rastreável com Cashback Verde e NFTs.",
    btnB2C: "Entrar no Protocolo",
    btnB2B: "Agendar Diagnóstico",
    howItWorks: "Como funciona em 4 passos",
    step1Title: "1. Empresa Ativa",
    step1Desc: "A marca define a ação e deposita valor em Cashback Verde (LEAFs).",
    step2Title: "2. Cliente Acumula",
    step2Desc: "O consumidor interage, compra e ganha frações de árvores reais.",
    step3Title: "3. Árvore Plantada",
    step3Desc: "A meta é atingida, a árvore é forjada (NFT RWA) e plantada no mundo físico.",
    step4Title: "4. Relatório ESG",
    step4Desc: "A marca ganha dados auditáveis de abatimento do Débito de Carbono (C-DEBT).",
    trustTitle: "Sustentabilidade com Dados e Transparência",
    trustSubtitle: "Mostre impacto ESG real com tecnologia que conecta cada compra a árvores plantadas.",
    tCard1Title: "Árvores Reais",
    tCard1Desc: "Cada ativo possui geolocalização e fotos validadas por Oráculo.",
    tCard2Title: "Créditos ESG",
    tCard2Desc: "Dados prontos para auditorias corporativas e prova Net Zero.",
    tCard3Title: "Engajamento",
    tCard3Desc: "Fidelize clientes não com pontos genéricos, mas com patrimônio ecológico."
  },
  en: {
    heroTag: "Soroban Protocol (Stellar Testnet)",
    heroTitlePart1: "Programmable",
    heroTitleHighlight: "Prosperity",
    heroSubtitle: "Transform sustainable engagement into real impact. Florestas.social connects companies and consumers in a traceable reforestation movement with Green Cashback and NFTs.",
    btnB2C: "Enter Protocol",
    btnB2B: "Book a Demo",
    howItWorks: "How it works in 4 steps",
    step1Title: "1. Brand Activates",
    step1Desc: "The company sets the rules and deposits Green Cashback (LEAFs).",
    step2Title: "2. Client Accumulates",
    step2Desc: "Consumers engage, buy, and earn fractions of real trees.",
    step3Title: "3. Tree Planted",
    step3Desc: "The goal is reached, the tree is forged (RWA NFT) and physically planted.",
    step4Title: "4. ESG Report",
    step4Desc: "The brand receives auditable data reducing Carbon Debt (C-DEBT).",
    trustTitle: "Sustainability with Data and Transparency",
    trustSubtitle: "Show real ESG impact with technology that connects every purchase to planted trees.",
    tCard1Title: "Real Trees",
    tCard1Desc: "Every asset has geolocation and oracle-validated photos.",
    tCard2Title: "ESG Credits",
    tCard2Desc: "Data ready for corporate audits and Net Zero proofs.",
    tCard3Title: "Engagement",
    tCard3Desc: "Retain clients not with generic points, but with ecological wealth."
  }
};

export default function LandingPage() {
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Checagem simples do sistema do usuário para o tema inicial
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  const t = dict[lang];

  // Helper para facilitar a troca de classes do Tailwind entre claro/escuro
  const isDark = theme === 'dark';
  
  // Design Tokens (Tailwind)
  const bgMain = isDark ? 'bg-slate-950' : 'bg-slate-50';
  const textMain = isDark ? 'text-white' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-600';
  const glassPanel = isDark 
    ? 'bg-slate-900/40 border border-slate-800 backdrop-blur-md' 
    : 'bg-white/60 border border-slate-200 backdrop-blur-md shadow-xl';
  const glassCardHover = isDark ? 'hover:bg-slate-900/60' : 'hover:bg-white/90';

  if (!mounted) return null; // Evita hydration mismatch no tema

  return (
    <main className={`min-h-screen ${bgMain} transition-colors duration-500 relative overflow-hidden flex flex-col font-sans`}>
      
      {/* Background Decorativo Dinâmico */}
      <div className={`absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${isDark ? 'bg-emerald-600/10' : 'bg-emerald-300/30'}`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${isDark ? 'bg-green-500/10' : 'bg-green-300/30'}`} />

      {/* ====================================================
          HEADER
          ==================================================== */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl drop-shadow-lg">🌳</span>
          <span className={`text-xl font-extrabold tracking-tight ${textMain}`}>
            Florestas<span className="text-emerald-500">.Social</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Toggles */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'} backdrop-blur-md`}>
            <button 
              onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
              className={`p-1.5 rounded-full transition-colors flex items-center gap-1.5 text-xs font-bold ${textMain}`}
              title="Change Language"
            >
              <Languages className="w-4 h-4" /> {lang.toUpperCase()}
            </button>
            <div className={`w-px h-4 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
            <button 
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-1.5 rounded-full transition-colors ${textMain}`}
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 hover:text-amber-400" /> : <Moon className="w-4 h-4 hover:text-indigo-500" />}
            </button>
          </div>

          <Link 
            href="/login" 
            className={`hidden sm:block px-6 py-2.5 rounded-full font-bold transition-all backdrop-blur-md border ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' 
                : 'bg-slate-900 hover:bg-slate-800 text-white border-transparent shadow-md hover:shadow-lg'
            }`}
          >
            Login
          </Link>
        </div>
      </header>

      {/* ====================================================
          HERO SECTION
          ==================================================== */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10 pt-16 pb-12">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-8 animate-fade-in-up ${
          isDark 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-emerald-100 border-emerald-200 text-emerald-700'
        }`}>
          <ShieldCheck className="w-4 h-4" />
          <span>{t.heroTag}</span>
        </div>
        
        <h1 className={`text-5xl md:text-7xl font-black tracking-tight max-w-4xl leading-[1.1] mb-6 animate-fade-in-up ${textMain}`} style={{animationDelay: '100ms'}}>
          {t.heroTitlePart1} <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500 drop-shadow-sm">
            {t.heroTitleHighlight}
          </span>
        </h1>
        
        <p className={`text-lg md:text-xl max-w-2xl mb-12 leading-relaxed animate-fade-in-up font-medium ${textSub}`} style={{animationDelay: '200ms'}}>
          {t.heroSubtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{animationDelay: '300ms'}}>
          <Link 
            href="/login" 
            className="group bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-extrabold px-8 py-4 rounded-full shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
          >
            <Users className="w-5 h-5" /> {t.btnB2C} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="https://calendar.app.google/GcnAotw1pnYJ9G1r5" 
            target="_blank" 
            rel="noreferrer"
            className={`font-extrabold px-8 py-4 rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-md border ${
              isDark 
                ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' 
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-md hover:shadow-lg'
            }`}
          >
            <Building2 className="w-5 h-5" /> {t.btnB2B}
          </a>
        </div>
      </div>

      {/* ====================================================
          CORE LOOP (4 STEPS)
          ==================================================== */}
      <div className="w-full max-w-7xl mx-auto px-6 py-20 relative z-10">
        <h2 className={`text-2xl md:text-3xl font-extrabold text-center mb-12 ${textMain}`}>
          {t.howItWorks}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: t.step1Title, desc: t.step1Desc, icon: Building2 },
            { step: '02', title: t.step2Title, desc: t.step2Desc, icon: Leaf },
            { step: '03', title: t.step3Title, desc: t.step3Desc, icon: TreePine },
            { step: '04', title: t.step4Title, desc: t.step4Desc, icon: LineChart }
          ].map((item, i) => (
            <div key={i} className={`relative p-8 rounded-3xl ${glassPanel} ${glassCardHover} transition-all duration-300 group overflow-hidden`}>
              <div className={`absolute -right-4 -top-4 text-8xl font-black opacity-[0.03] select-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {item.step}
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 relative z-10 ${
                isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-bold mb-2 relative z-10 ${textMain}`}>{item.title}</h3>
              <p className={`text-sm leading-relaxed relative z-10 ${textSub}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ====================================================
          TRUST & ESG DATA
          ==================================================== */}
      <div className={`w-full relative z-10 ${isDark ? 'bg-slate-900/30 border-t border-white/5' : 'bg-slate-100/50 border-t border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 ${textMain}`}>{t.trustTitle}</h2>
          <p className={`text-lg max-w-2xl mx-auto mb-16 ${textSub}`}>{t.trustSubtitle}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { title: t.tCard1Title, desc: t.tCard1Desc, icon: Globe2, color: 'blue' },
              { title: t.tCard2Title, desc: t.tCard2Desc, icon: ShieldCheck, color: 'emerald' },
              { title: t.tCard3Title, desc: t.tCard3Desc, icon: Users, color: 'purple' }
            ].map((feature, i) => {
              const bgIconDark = feature.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : feature.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400';
              const bgIconLight = feature.color === 'blue' ? 'bg-blue-100 text-blue-600' : feature.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600';
              
              return (
                <div key={i} className={`p-8 rounded-3xl ${isDark ? 'bg-slate-900/50' : 'bg-white shadow-lg'} transition-all`}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isDark ? bgIconDark : bgIconLight}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${textMain}`}>{feature.title}</h3>
                  <p className={`text-sm leading-relaxed ${textSub}`}>{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </main>
  );
}
