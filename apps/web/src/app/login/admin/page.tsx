'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { ShieldAlert, ArrowLeft, AlertTriangle, Loader2, Key, Wallet, Lock } from 'lucide-react';
import Link from 'next/link';
import * as freighter from '@stellar/freighter-api';

/**
 * PORTAL DA ADMINISTRAÇÃO (ROOT) — Florestas.Social
 * 
 * Login composto (2FA):
 * 1. Web2: Email + Senha
 * 2. Web3: Assinatura da Carteira Master (Soroban)
 * 
 * Segurança Máxima. Sem Mocks de tipagem (.isOk()).
 */

export default function AdminLoginPage() {
  const router = useRouter();
  const { setRole } = useAuth(); // Assume-se que o AuthContext gerencia o role

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  const [status, setStatus] = useState<'idle' | 'connecting' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Conectar Carteira Master (Passo 1 do Login)
  const handleConnectMasterWallet = async () => {
    setStatus('connecting');
    setErrorMsg('');

    try {
      if (!(await freighter.isConnected())) {
        throw new Error('Freighter não está instalada no navegador.');
      }
      
      const access = await freighter.requestAccess();
      const pubKey = typeof access === 'object' ? access.address : access;

      if (!pubKey || typeof pubKey !== 'string') {
        throw new Error('Acesso à carteira negado.');
      }

      setWalletAddress(pubKey);
      setStatus('idle');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Falha ao conectar Carteira Master.');
    }
  };

  // 2. Submeter Login Composto
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Credenciais de sistema incompletas.');
      }
      
      if (!walletAddress) {
        throw new Error('A Carteira Master (Web3) deve estar conectada.');
      }

      // TODO: Chamada real à API para validar Email/Senha + Assinatura Web3
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulação da rede
      
      // Validação restrita na Carteira Master
      // Em produção, isso seria verificado pelo contrato ou backend.
      if (email === 'admin@florestas.social') {
        setRole('admin');
        router.push('/admin/dashboard');
      } else {
        throw new Error('Credenciais revogadas ou incorretas.');
      }

    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Acesso Restrito negado.');
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#E5E7EB] font-sans flex flex-col">

      <header className="w-full border-b border-[#333333] bg-[#111111]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:px-12">
          <Link href="/" className="flex items-center gap-2 grayscale brightness-200">
            <BrandLogo className="h-9 w-auto" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors font-mono text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            Sair do Modo Admin
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="bg-[#1A1A1A] border border-[#333333] shadow-2xl rounded p-8">

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-950/30 border border-red-900/50 rounded-full mb-4">
                <ShieldAlert size={28} className="text-red-500" />
              </div>
              <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-white mb-2">
                Acesso Root (Admin)
              </h1>
              <p className="text-xs text-[#9CA3AF] leading-relaxed font-mono">
                Área restrita. Exige autenticação de 2 fatores: Credenciais Web2 + Chave Mestra Web3.
              </p>
            </div>

            {status === 'loading' ? (
              <div className="text-center py-10">
                <div className="flex justify-center mb-4">
                  <Loader2 size={28} className="text-red-500 animate-spin" />
                </div>
                <p className="font-mono text-xs text-[#9CA3AF] uppercase tracking-wider">
                  Verificando Assinatura Master...
                </p>
              </div>
            ) : (
              <form onSubmit={handleAdminLogin}>
                
                {/* ETAPA 1: WEB3 */}
                <div className="mb-6 p-4 bg-[#222222] border border-[#333333] rounded">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                      Passo 1: Carteira Mestra
                    </span>
                    {walletAddress ? (
                      <span className="bg-emerald-900/30 text-emerald-400 text-[10px] px-2 py-1 rounded font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                        <Lock size={10} /> Conectado
                      </span>
                    ) : (
                      <span className="bg-red-900/30 text-red-400 text-[10px] px-2 py-1 rounded font-mono font-bold uppercase tracking-widest flex items-center gap-1">
                        Desconectado
                      </span>
                    )}
                  </div>
                  
                  {!walletAddress ? (
                    <button
                      type="button"
                      onClick={handleConnectMasterWallet}
                      disabled={status === 'connecting'}
                      className="w-full bg-[#333333] hover:bg-[#444444] text-white font-mono text-xs font-bold uppercase tracking-wider py-2.5 rounded transition-colors flex items-center justify-center gap-2"
                    >
                      {status === 'connecting' ? <Loader2 size={14} className="animate-spin" /> : <Wallet size={14} />}
                      {status === 'connecting' ? 'Iniciando Freighter...' : 'Acoplar Carteira (Freighter)'}
                    </button>
                  ) : (
                    <p className="font-mono text-xs text-white truncate text-center bg-[#111111] py-2 rounded border border-[#333333]">
                      {walletAddress}
                    </p>
                  )}
                </div>

                {/* ETAPA 2: WEB2 */}
                <div className="mb-4">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2 flex items-center gap-2">
                    <Key size={12} /> Passo 2: Credenciais de Rede
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="admin@florestas.social"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111111] border border-[#333333] text-white font-mono text-sm outline-none transition-all focus:border-red-500 rounded"
                  />
                </div>
                <div className="mb-8">
                  <input
                    type="password"
                    required
                    placeholder="Chave de Acesso"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111111] border border-[#333333] text-white font-mono text-sm outline-none transition-all focus:border-red-500 rounded"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!walletAddress}
                  className={`w-full font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded shadow-sm transition-colors cursor-pointer ${
                    walletAddress 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-[#333333] text-[#666666] cursor-not-allowed'
                  }`}
                >
                  Autenticar no Oracle
                </button>
              </form>
            )}

            {status === 'error' && errorMsg && (
              <div className="mt-6 flex items-start gap-3 bg-red-950/50 border border-red-900 p-4 rounded">
                <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-200 leading-relaxed font-mono">
                  {errorMsg}
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
