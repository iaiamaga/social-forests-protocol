'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { Shield, Building2, Leaf, X, Globe } from 'lucide-react';

const LOCALIZED_TEXT: Record<string, Record<string, string>> = {
  pt: {
    hero_tag: "Protocolo RWA & ReFi • Mogno Africano",
    hero_title: "Converta Crescimento Biológico em Ativo Digital",
    hero_subtitle: "O primeiro protocolo que une conformidade ESG estruturada para empresas e recompensas ecológicas reais para consumidores finais.",
    code_title: "Coletar Impacto",
    code_desc: "Insira o código do seu QR Code físico para iniciar o resgate de suas folhas de mogno.",
    code_placeholder: "Digite o código (Ex: MARATA-100)",
    btn_redeem: "Resgatar Impacto",
    btn_access: "Acessar Plataforma",
    modal_title: "Portal de Acesso",
    modal_desc: "Selecione o seu perfil para prosseguir à plataforma Florestas.Social:",
    portal_admin: "Portal do Administrador",
    portal_admin_desc: "Parâmetros regulatórios e oráculos",
    portal_empresa: "Portal Corporativo (B2B)",
    portal_empresa_desc: "Gestão de bosques RWA e campanhas de cashback",
    portal_usuario: "Portal do Guardião (B2C)",
    portal_usuario_desc: "Viveiro de mudas, missões ecológicas e carteira digital",
    alert_code_empty: "Por favor, digite um código de resgate.",
    footer_text: "© 2026 Florestas.Social Protocol • Reflorestando a economia"
  },
  en: {
    hero_tag: "RWA & ReFi Protocol • African Mahogany",
    hero_title: "Convert Biological Growth into Digital Assets",
    hero_subtitle: "The first protocol combining structured ESG compliance for companies with real ecological rewards for consumers.",
    code_title: "Collect Impact",
    code_desc: "Enter your physical QR Code value to start redeeming your mahogany leaves.",
    code_placeholder: "Enter the code (e.g., MARATA-100)",
    btn_redeem: "Redeem Impact",
    btn_access: "Access Platform",
    modal_title: "Access Portal",
    modal_desc: "Select your profile to proceed to the Florestas.Social platform:",
    portal_admin: "Administrator Portal",
    portal_admin_desc: "Regulatory parameters and oracle management",
    portal_empresa: "Corporate Portal (B2B)",
    portal_empresa_desc: "Manage RWA tree forests and cashback campaigns",
    portal_usuario: "Guardian Portal (B2C)",
    portal_usuario_desc: "Seedling nursery, eco-missions and digital wallet",
    alert_code_empty: "Please enter a redemption code.",
    footer_text: "© 2026 Florestas.Social Protocol • Reforesting the economy"
  },
  es: {
    hero_tag: "Protocolo RWA y ReFi • Caoba Africana",
    hero_title: "Convierta el Crecimiento Biológico en Activos Digitales",
    hero_subtitle: "El primer protocolo que une el cumplimiento ESG estructurado para empresas y recompensas ecológicas reales para consumidores.",
    code_title: "Colectar Impacto",
    code_desc: "Ingrese el código de su QR Code físico para iniciar el rescate de sus hojas de caoba.",
    code_placeholder: "Ingrese el código (Ej: MARATA-100)",
    btn_redeem: "Redimir Impacto",
    btn_access: "Acceder a la Plataforma",
    modal_title: "Portal de Acceso",
    modal_desc: "Seleccione su perfil para continuar en Florestas.Social:",
    portal_admin: "Portal del Administrador",
    portal_admin_desc: "Parámetros regulatorios y oráculos",
    portal_empresa: "Portal Corporativo (B2B)",
    portal_empresa_desc: "Gestión de bosques RWA y campañas de devolución",
    portal_usuario: "Portal del Guardián (B2C)",
    portal_usuario_desc: "Vivero de plántulas, misiones ecológicas y billetera digital",
    alert_code_empty: "Por favor, ingrese un código de redención.",
    footer_text: "© 2026 Florestas.Social Protocol • Reforestando la economía"
  },
  fr: {
    hero_tag: "Protocole RWA & ReFi • Acajou Africain",
    hero_title: "Convertir la Croissance Biologique en Actifs Numériques",
    hero_subtitle: "Le premier protocole alliant conformité ESG structurée pour les entreprises et récompenses écologiques réelles pour les consommateurs.",
    code_title: "Collecter l'Impact",
    code_desc: "Saisissez la valeur de votre QR Code physique pour réclamer vos feuilles d'acajou.",
    code_placeholder: "Saisissez le code (Ex: MARATA-100)",
    btn_redeem: "Réclamer l'Impact",
    btn_access: "Accéder à la Plateforme",
    modal_title: "Portail d'Accès",
    modal_desc: "Sélectionnez votre profil pour accéder à Florestas.Social :",
    portal_admin: "Portail Administrateur",
    portal_admin_desc: "Paramètres réglementaires et oracles",
    portal_empresa: "Portail Entreprise (B2B)",
    portal_empresa_desc: "Gérer les forêts RWA et les campagnes de cashback",
    portal_usuario: "Portail Gardien (B2C)",
    portal_usuario_desc: "Pépinière, éco-missions et portefeuille numérique",
    alert_code_empty: "Veuillez saisir un code de réclamation.",
    footer_text: "© 2026 Florestas.Social Protocol • Reboiser l'économie"
  },
  de: {
    hero_tag: "RWA & ReFi-Protokoll • Afrikanisches Mahagoni",
    hero_title: "Biologisches Wachstum in Digitale Vermögenswerte Umwandeln",
    hero_subtitle: "Das erste Protokoll, das strukturierte ESG-Compliance für Unternehmen mit echten ökologischen Belohnungen für Verbraucher verbindet.",
    code_title: "Auswirkung Sammeln",
    code_desc: "Geben Sie Ihren physischen QR-Code-Wert ein, um Ihre Mahagoni-Blätter einzulösen.",
    code_placeholder: "Code eingeben (z.B. MARATA-100)",
    btn_redeem: "Auswirkung Einlösen",
    btn_access: "Plattform Aufrufen",
    modal_title: "Zugangsportal",
    modal_desc: "Wählen Sie Ihr Profil aus, um bei Florestas.Social fortzufahren:",
    portal_admin: "Administrator-Portal",
    portal_admin_desc: "Regulatorische Parameter und Orakelverwaltung",
    portal_empresa: "Unternehmensportal (B2B)",
    portal_empresa_desc: "RWA-Wälder verwalten und Cashback-Kampagnen erstellen",
    portal_usuario: "Wächterportal (B2C)",
    portal_usuario_desc: "Setzlingsgärtnerei, Öko-Missionen und digitale Geldbörse",
    alert_code_empty: "Bitte geben Sie einen Einlösungscode ein.",
    footer_text: "© 2026 Florestas.Social Protocol • Wiederaufforstung der Wirtschaft"
  },
  zh: {
    hero_tag: "RWA & ReFi 协议 • 非洲桃花心木",
    hero_title: "将生物生长转化为数字资产",
    hero_subtitle: "首个将企业结构化 ESG 合规与消费者真实生态回报相结合的协议。",
    code_title: "收集影响",
    code_desc: "输入您的物理二维码数值以开始兑换您的桃花心木树叶。",
    code_placeholder: "输入代码 (例如: MARATA-100)",
    btn_redeem: "兑换影响",
    btn_access: "访问平台",
    modal_title: "访问门户",
    modal_desc: "选择您的个人资料以继续访问 Florestas.Social：",
    portal_admin: "管理员门户",
    portal_admin_desc: "监管参数和预言机管理",
    portal_empresa: "企业门户 (B2B)",
    portal_empresa_desc: "管理 RWA 森林和返利活动",
    portal_usuario: "守护者门户 (B2C)",
    portal_usuario_desc: "树苗苗圃、生态任务和数字钱包",
    alert_code_empty: "请输入兑换代码。",
    footer_text: "© 2026 Florestas.Social Protocol • 重振生态经济"
  },
  ja: {
    hero_tag: "RWA & ReFi プロトコル • アフリカンマホガニー",
    hero_title: "生物的成長をデジタル資産に変換",
    hero_subtitle: "企業向けの構造化されたESGコンプライアンスと、消費者向けのリアルな環境報酬を組み合わせた初のプロトコル。",
    code_title: "インパクトを収集",
    code_desc: "物理QRコードの値を入力して、マホガニーの葉の引き換えを開始します。",
    code_placeholder: "コードを入力 (例: MARATA-100)",
    btn_redeem: "インパクトを引き換える",
    btn_access: "プラットフォームにアクセス",
    modal_title: "アクセス・ポータル",
    modal_desc: "プロファイルを選択して Florestas.Social に進みます：",
    portal_admin: "管理者ポータル",
    portal_admin_desc: "規制パラメータとオラクルの管理",
    portal_empresa: "企業ポータル (B2B)",
    portal_empresa_desc: "RWA樹木森林 of アフリカンマホガニーの管理とキャッシュバック",
    portal_usuario: "ガーディアンポータル (B2C)",
    portal_usuario_desc: "苗木苗床、エコミッション、デジタルウォレット",
    alert_code_empty: "引き換えコードを入力してください。",
    footer_text: "© 2026 Florestas.Social Protocol • 経済の再植林"
  }
};

export default function LandingPage() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [redeemCode, setRedeemCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const t = (key: string) => {
    return LOCALIZED_TEXT[language]?.[key] || LOCALIZED_TEXT['pt']?.[key] || key;
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) {
      alert(t('alert_code_empty'));
      return;
    }
    router.push(`/resgate?code=${encodeURIComponent(redeemCode.trim())}`);
  };

  return (
    <div className="bg-[#FDFBF9] min-h-screen text-[#26170E] font-sans selection:bg-[#2D5A27] selection:text-white flex flex-col justify-between relative overflow-hidden">
      
      {/* BACKGROUND DECOR (ELEGANT LIGHT SWIRLS/BLURS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2D5A27]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2D5A27]/5 blur-[120px] rounded-full"></div>
      </div>

      {/* HEADER */}
      <header className="relative z-10 w-full border-b border-[#D5D0C8] bg-[#FDFBF9]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:px-12">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <BrandLogo className="h-9 w-auto" />
          </div>

          {/* Controls & CTA */}
          <div className="flex items-center gap-4">
            {/* Language Selector Dropdown */}
            <div className="relative flex items-center bg-[#FDFBF9] border border-[#D5D0C8] rounded px-3 py-1.5 text-xs font-mono">
              <Globe size={14} className="mr-2 text-[#6B6560]" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent border-none outline-none font-bold uppercase cursor-pointer text-[#26170E]"
                aria-label="Select Language"
              >
                <option value="pt">PT</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
                <option value="zh">ZH</option>
                <option value="ja">JA</option>
              </select>
            </div>

            {/* Acessar Plataforma CTA */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2D5A27] hover:bg-[#1E3F1A] text-white px-5 py-2.5 rounded font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              {t('btn_access')}
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-10 flex-grow max-w-7xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-12 gap-12 items-center w-full">
        {/* Left Side: Brand Text */}
        <div className="md:col-span-7 flex flex-col justify-center text-left">
          <div className="inline-block text-[#2D5A27] text-xs font-mono font-bold uppercase tracking-widest mb-4">
            {t('hero_tag')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-mono text-[#26170E] leading-tight tracking-tight mb-6">
            {t('hero_title')}
          </h1>
          <p className="text-[#6B6560] text-base md:text-lg max-w-xl mb-8 leading-relaxed">
            {t('hero_subtitle')}
          </p>
        </div>

        {/* Right Side: Code Capture Form Container */}
        <div className="md:col-span-5 flex justify-center items-center w-full">
          <div className="sf-card-elevated w-full max-w-md p-8 bg-white border border-[#D5D0C8] rounded">
            <div className="text-center mb-6">
              <span className="text-4xl" role="img" aria-label="leaf">🍃</span>
              <h2 className="sf-heading text-lg text-[#26170E] mt-3 mb-2">
                {t('code_title')}
              </h2>
              <p className="text-xs text-[#6B6560] leading-relaxed">
                {t('code_desc')}
              </p>
            </div>

            <form onSubmit={handleRedeemSubmit} className="space-y-4">
              <div>
                <label className="sf-label block text-[10px] text-[#26170E] font-bold mb-1">
                  Código de Impacto
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('code_placeholder')}
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  className="sf-input w-full"
                />
              </div>

              <button
                type="submit"
                className="sf-btn-primary w-full bg-[#2D5A27] hover:bg-[#1E3F1A] text-white flex items-center justify-center py-3.5"
              >
                {t('btn_redeem')}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#D5D0C8] bg-white py-8 px-6 text-center w-full">
        <div className="opacity-40 flex justify-center gap-8 mb-6 grayscale hover:grayscale-0 transition-all text-xs font-mono font-bold text-[#6B6560]">
          <span className="tracking-tighter">ETHERFUSE</span>
          <span className="tracking-tighter">STELLAR / SOROBAN</span>
          <span className="tracking-tighter">VEREDA VERIFY</span>
        </div>
        <p className="text-[#6B6560] text-[10px] font-mono uppercase tracking-widest">
          {t('footer_text')}
        </p>
      </footer>

      {/* ACCESS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#26170E]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-md bg-[#FDFBF9] border-2 border-[#26170E] shadow-[8px_8px_0px_#26170E] rounded p-6 md:p-8 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-[#6B6560] hover:text-[#26170E] transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Modal Content */}
            <div className="mb-6">
              <h3 className="sf-heading text-xl text-[#26170E] mb-2 pr-8">
                {t('modal_title')}
              </h3>
              <p className="text-xs text-[#6B6560] leading-relaxed">
                {t('modal_desc')}
              </p>
            </div>

            {/* Redirection Options */}
            <div className="space-y-4">
              {/* Option 1: Admin Portal */}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  router.push('/login/admin');
                }}
                className="w-full text-left p-4 bg-white border border-[#D5D0C8] hover:border-[#2D5A27] hover:bg-[#FDFBF9] transition-all flex items-start gap-4 group"
              >
                <div className="p-2.5 bg-red-50 text-[#C0392B] rounded group-hover:scale-105 transition-transform">
                  <Shield size={20} />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#26170E] group-hover:text-[#2D5A27]">
                    {t('portal_admin')}
                  </h4>
                  <p className="text-[10px] text-[#6B6560] mt-1 leading-normal">
                    {t('portal_admin_desc')}
                  </p>
                </div>
              </button>

              {/* Option 2: Corporate Portal (B2B) */}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  router.push('/login/empresa');
                }}
                className="w-full text-left p-4 bg-white border border-[#D5D0C8] hover:border-[#2D5A27] hover:bg-[#FDFBF9] transition-all flex items-start gap-4 group"
              >
                <div className="p-2.5 bg-blue-50 text-blue-800 rounded group-hover:scale-105 transition-transform">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#26170E] group-hover:text-[#2D5A27]">
                    {t('portal_empresa')}
                  </h4>
                  <p className="text-[10px] text-[#6B6560] mt-1 leading-normal">
                    {t('portal_empresa_desc')}
                  </p>
                </div>
              </button>

              {/* Option 3: Guardian Portal (B2C) */}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  router.push('/login/usuario');
                }}
                className="w-full text-left p-4 bg-white border border-[#D5D0C8] hover:border-[#2D5A27] hover:bg-[#FDFBF9] transition-all flex items-start gap-4 group"
              >
                <div className="p-2.5 bg-emerald-50 text-[#2D5A27] rounded group-hover:scale-105 transition-transform">
                  <Leaf size={20} />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#26170E] group-hover:text-[#2D5A27]">
                    {t('portal_usuario')}
                  </h4>
                  <p className="text-[10px] text-[#6B6560] mt-1 leading-normal">
                    {t('portal_usuario_desc')}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}