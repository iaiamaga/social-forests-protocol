'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useSorobanContracts } from '../../../hooks/useSorobanContracts';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { Leaf, ArrowLeft, AlertTriangle, Loader2, Wallet } from 'lucide-react';
import Link from 'next/link';
import * as freighter from '@stellar/freighter-api';

/**
 * PORTAL DO GUARDIÃO (B2C) — Florestas.Social
 * 
 * Dois caminhos de acesso reais:
 * 1. Web2 (Account Abstraction): Login SSO (Google)
 * 2. Web3: Conexão Freighter -> Validação via sbt_guardian
 * 
 * Correção de Tipagem: Tratamento direto do tx.result.
 */

export default function UsuarioLoginPage() {
  const router = useRouter();
  const { setRole, connectGoogle } = useAuth();
  const { guardianId } = useSorobanContracts();

  const [activeTab, setActiveTab] = useState<'sso' | 'web3'>('sso');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Web2: SSO / Google (Account Abstraction)
  const handleGoogleLogin = async () => {
    setStatus('loading');
    setErrorMsg('');

    try {
      // O connectGoogle é o nosso wrapper para a lógica de abstração
      // onde a carteira Stellar é gerada por trás (Sprint 2)
      await connectGoogle();
      
      // Assume-se validação de existência do Guardião feita no backend no fluxo Web2
      setRole('consumidor');
      router.push('/consumidor/dashboard');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Falha na autenticação via SSO.');
    }
  };

  // 2. Web3: Carteira Stellar NATIVA
  const handleWeb3Login = async () => {
    setStatus('loading');
    setErrorMsg('');

    try {
      // 2.1 Conexão Freighter
      if (!(await freighter.isConnected())) {
        throw new Error('A carteira Freighter não está instalada ou ativada.');
      }
      
      const access = await freighter.requestAccess();
      const pubKey = typeof access === 'object' ? access.address : access;

      if (!pubKey || typeof pubKey !== 'string') {
        throw new Error('Acesso à carteira negado ou cancelado.');
      }

      // 2.2 Validação SBT do Guardião On-Chain (Zero Mocks)
      const tx = await guardianId.get_sbt({ user: pubKey });
      const record = tx.result;

      // Tratamento direto, sem .isOk() ou .unwrap()
      if (record !== null && record !== undefined) {
        setRole('consumidor');
        router.push('/consumidor/dashboard');
      } else {
        throw new Error('SBT de Guardião não encontrado. Você precisa se registrar na rede.');
      }

    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Falha na conexão Web3.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] text-[#26170E] font-sans flex flex-col">

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

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="bg-white border border-[#E5E7EB] shadow-sm rounded p-8">

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FDFBF9] border border-[#D5D0C8] rounded-full mb-4">
                <Leaf size={28} className="text-[#2D5A27]" />
              </div>
              <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-[#26170E] mb-2">
                Portal do Guardião
              </h1>
              <p className="text-xs text-[#6B6560] leading-relaxed">
                Forje árvores reais, suba de era e ganhe prêmios com a sua carteira ecológica.
              </p>
            </div>

            {status !== 'loading' && (
              <div className="flex border-b border-[#D5D0C8] mb-6">
                <button 
                  onClick={() => setActiveTab('sso')}
                  className={`flex-1 pb-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border-b-2 flex justify-center gap-2 items-center ${activeTab === 'sso' ? 'border-[#2D5A27] text-[#2D5A27]' : 'border-transparent text-[#6B6560] hover:text-[#26170E]'}`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Conta Google
                </button>
                <button 
                  onClick={() => setActiveTab('web3')}
                  className={`flex-1 pb-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border-b-2 flex justify-center gap-2 items-center ${activeTab === 'web3' ? 'border-[#2D5A27] text-[#2D5A27]' : 'border-transparent text-[#6B6560] hover:text-[#26170E]'}`}
                >
                  <Wallet size={14} /> Web3 Stellar
                </button>
              </div>
            )}

            {status === 'loading' && (
              <div className="text-center py-10">
                <div className="flex justify-center mb-4">
                  <Loader2 size={28} className="text-[#2D5A27] animate-spin" />
                </div>
                <p className="font-mono text-xs text-[#6B6560] uppercase tracking-wider">
                  Sincronizando com a Ledger...
                </p>
              </div>
            )}

            {status === 'idle' && activeTab === 'sso' && (
              <div className="text-center">
                <p className="text-xs text-[#6B6560] mb-6 leading-relaxed">
                  Acesse com fricção zero via Account Abstraction. O protocolo vai pagar as taxas (fees) das transações na Soroban para você.
                </p>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-[#D5D0C8] hover:bg-gray-50 text-[#26170E] font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded shadow-sm flex items-center justify-center gap-3 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Entrar com Google
                </button>
              </div>
            )}

            {status === 'idle' && activeTab === 'web3' && (
              <div className="text-center">
                <p className="text-xs text-[#6B6560] mb-6 leading-relaxed">
                  Conecte sua carteira nativa para controle total das suas chaves privadas. Faremos a validação do SBT do Guardião na Soroban.
                </p>
                <button
                  type="button"
                  onClick={handleWeb3Login}
                  className="w-full bg-[#2D5A27] hover:bg-[#1E3F1A] text-white font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Wallet size={16} />
                  Conectar Freighter
                </button>
              </div>
            )}

            {status === 'error' && errorMsg && (
              <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded">
                <AlertTriangle size={16} className="text-[#C0392B] mt-0.5 shrink-0" />
                <p className="text-xs text-[#C0392B] leading-relaxed font-mono">
                  {errorMsg}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center border-t border-[#D5D0C8] pt-6">
            <p className="font-mono text-xs text-[#6B6560]">
              Ainda não é um Guardião?{' '}
              <Link href="/cadastro/usuario" className="text-[#2D5A27] font-bold hover:underline">
                Criar Conta (Grátis)
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
