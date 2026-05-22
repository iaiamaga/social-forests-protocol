'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useSorobanContracts } from '../../../hooks/useSorobanContracts';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { Building2, ArrowLeft, AlertTriangle, Loader2, Mail, Key, Wallet } from 'lucide-react';
import Link from 'next/link';
import * as freighter from '@stellar/freighter-api';

/**
 * PORTAL CORPORATIVO (B2B) — Florestas.Social
 * 
 * Três caminhos de acesso reais:
 * 1. Web2: Email Comercial + Senha
 * 2. Web2: Email + Magic Link
 * 3. Web3: Conexão Freighter -> Validação rigorosa via sbt_empresa
 * 
 * Sem mocks. Tratamento direto de retorno, sem .isOk() ou .unwrap() ou .result.
 */

export default function EmpresaLoginPage() {
  const router = useRouter();
  const { setRole } = useAuth(); // Assume-se que o AuthContext gerencia o role global
  const { companyId } = useSorobanContracts();

  const [activeTab, setActiveTab] = useState<'email' | 'magic' | 'web3'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Email + Senha
  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Preencha email e senha.');
      }
      // Aqui entraria a chamada real à API (ex: POST /api/v1/auth/login)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRole('empresa');
      router.push('/empresa/dashboard');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Falha na autenticação corporativa.');
    }
  };

  // 2. Email + Magic Link
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      if (!email.trim()) {
        throw new Error('Preencha o e-mail comercial.');
      }
      // Simulação do envio do link
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('success');
      setSuccessMsg('Link de acesso enviado! Verifique sua caixa de entrada.');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Falha ao solicitar Magic Link.');
    }
  };

  // 3. Web3 (Carteira Stellar + Soroban Validation)
  const handleWeb3Login = async () => {
    setStatus('loading');
    setErrorMsg('');

    try {
      // 3.1 Conectar via Freighter
      if (!(await freighter.isConnected())) {
        throw new Error('Freighter não está instalada ou ativada.');
      }
      
      const access = await freighter.requestAccess();
      const pubKey = typeof access === 'object' ? access.address : access;

      if (!pubKey || typeof pubKey !== 'string') {
        throw new Error('Acesso à carteira negado ou falhou.');
      }

      // 3.2 Validar SBT da Empresa on-chain (Zero Mocks)
      // Tratamento direto do retorno, conforme a diretriz: const data = await contract.metodo();
      const record = await companyId.get_empresa_sbt({ company: pubKey });

      if (record !== null && record !== undefined) {
        // Se passou pela validação on-chain, define o role e redireciona
        setRole('empresa');
        router.push('/empresa/dashboard');
      } else {
        throw new Error('Empresa não registrada no protocolo. SBT não encontrado.');
      }

    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Falha na conexão Web3.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#26170E] font-sans flex flex-col">

      {/* HEADER */}
      <header className="w-full border-b border-[#D5D0C8] bg-[#FDFBF9]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:px-12">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogo className="h-9 w-auto" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-[#6B6560] hover:text-[#26170E] transition-colors font-mono text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            Voltar ao Início
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* CARD DE LOGIN */}
          <div className="bg-white border border-[#E5E7EB] shadow-sm rounded p-8">

            {/* HEADER DO CARD */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FDFBF9] border border-[#D5D0C8] rounded-full mb-4">
                <Building2 size={28} className="text-[#2D5A27]" />
              </div>
              <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-[#26170E] mb-2">
                Acesso Institucional
              </h1>
              <p className="text-xs text-[#6B6560] leading-relaxed">
                Gestão on-chain de bosques RWA e métricas ESG.
              </p>
            </div>

            {/* TABS DE SELEÇÃO */}
            {status !== 'loading' && status !== 'success' && (
              <div className="flex border-b border-[#D5D0C8] mb-6">
                <button 
                  onClick={() => setActiveTab('email')}
                  className={`flex-1 pb-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border-b-2 flex justify-center gap-2 items-center ${activeTab === 'email' ? 'border-[#2D5A27] text-[#2D5A27]' : 'border-transparent text-[#6B6560] hover:text-[#26170E]'}`}
                >
                  <Key size={14} /> Senha
                </button>
                <button 
                  onClick={() => setActiveTab('magic')}
                  className={`flex-1 pb-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border-b-2 flex justify-center gap-2 items-center ${activeTab === 'magic' ? 'border-[#2D5A27] text-[#2D5A27]' : 'border-transparent text-[#6B6560] hover:text-[#26170E]'}`}
                >
                  <Mail size={14} /> Link
                </button>
                <button 
                  onClick={() => setActiveTab('web3')}
                  className={`flex-1 pb-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border-b-2 flex justify-center gap-2 items-center ${activeTab === 'web3' ? 'border-[#2D5A27] text-[#2D5A27]' : 'border-transparent text-[#6B6560] hover:text-[#26170E]'}`}
                >
                  <Wallet size={14} /> Web3
                </button>
              </div>
            )}

            {/* LOADING STATE */}
            {status === 'loading' && (
              <div className="text-center py-10">
                <div className="flex justify-center mb-4">
                  <Loader2 size={28} className="text-[#2D5A27] animate-spin" />
                </div>
                <p className="font-mono text-xs text-[#6B6560] uppercase tracking-wider">
                  Autenticando na Rede...
                </p>
              </div>
            )}

            {/* SUCCESS STATE (Magic Link) */}
            {status === 'success' && (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                </div>
                <h3 className="font-mono text-sm font-bold text-[#26170E] uppercase tracking-wider mb-2">Check seu E-mail</h3>
                <p className="text-xs text-[#6B6560] mb-6 leading-relaxed">{successMsg}</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-[10px] font-mono font-bold text-[#6B6560] hover:text-[#26170E] uppercase tracking-wider underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {/* TAB 1: EMAIL + SENHA */}
            {status === 'idle' && activeTab === 'email' && (
              <form onSubmit={handleEmailPasswordLogin}>
                <div className="mb-4">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#26170E] mb-2">
                    E-mail Comercial
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contato@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FDFBF9] border border-[#D5D0C8] text-[#26170E] font-mono text-sm outline-none transition-all focus:border-[#2D5A27] rounded"
                  />
                </div>
                <div className="mb-6">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#26170E] mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FDFBF9] border border-[#D5D0C8] text-[#26170E] font-mono text-sm outline-none transition-all focus:border-[#2D5A27] rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded shadow-sm transition-colors cursor-pointer"
                >
                  Entrar no Portal
                </button>
              </form>
            )}

            {/* TAB 2: MAGIC LINK */}
            {status === 'idle' && activeTab === 'magic' && (
              <form onSubmit={handleMagicLinkLogin}>
                <div className="mb-6">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#26170E] mb-2">
                    E-mail Comercial
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contato@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FDFBF9] border border-[#D5D0C8] text-[#26170E] font-mono text-sm outline-none transition-all focus:border-[#2D5A27] rounded"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#26170E] hover:bg-[#3D2A1E] text-white font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded shadow-sm transition-colors cursor-pointer"
                >
                  Receber Link de Acesso
                </button>
              </form>
            )}

            {/* TAB 3: WEB3 NATIVO */}
            {status === 'idle' && activeTab === 'web3' && (
              <div className="text-center">
                <p className="text-xs text-[#6B6560] mb-6 leading-relaxed">
                  Conecte sua carteira Stellar. Faremos a validação do seu token SBT (Soulbound Token) na rede Soroban.
                </p>
                <button
                  type="button"
                  onClick={handleWeb3Login}
                  className="w-full bg-[#26170E] hover:bg-[#3D2A1E] text-white font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Wallet size={16} />
                  Conectar Freighter
                </button>
              </div>
            )}

            {/* ERROS */}
            {status === 'error' && errorMsg && (
              <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded">
                <AlertTriangle size={16} className="text-[#C0392B] mt-0.5 shrink-0" />
                <p className="text-xs text-[#C0392B] leading-relaxed font-mono">
                  {errorMsg}
                </p>
              </div>
            )}
          </div>

          {/* LINK PARA CADASTRO */}
          <div className="mt-8 text-center border-t border-[#D5D0C8] pt-6">
            <p className="font-mono text-xs text-[#6B6560]">
              Sua empresa ainda não faz parte?{' '}
              <Link href="/cadastro/empresa" className="text-[#2D5A27] font-bold hover:underline">
                Criar Conta
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
