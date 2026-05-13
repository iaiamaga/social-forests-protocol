'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { connectFreighter, connectGoogle, isLoading, session } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleFreighter() {
    try {
      setError(null);
      await connectFreighter();
      // Freighter = Web3 nativo → fluxo B2B (Empresa/Admin)
      router.push('/empresa/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar carteira');
    }
  }

  async function handleGoogle() {
    try {
      setError(null);
      await connectGoogle();
      // Google = Account Abstraction → fluxo B2C (Consumidor)
      router.push('/consumidor/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar com Google');
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-emerald-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Background glow — purely decorative */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-emerald-400/5 rounded-full blur-2xl" />
      </div>

      {/* Logo e tagline */}
      <div className="mb-10 text-center relative z-10">
        <div className="text-7xl mb-4 drop-shadow-lg select-none">🌳</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Florestas<span className="text-green-400">.Social</span>
        </h1>
        <p className="text-green-300/70 mt-3 text-sm tracking-wide">
          Finanças Regenerativas · Rede Stellar · Mogno Africano
        </p>
      </div>

      {/* Card de login */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 relative z-10">

        {/* Header do card */}
        <div className="px-8 py-6 text-center border-b border-white/10">
          <p className="text-green-400/80 text-xs font-semibold uppercase tracking-widest mb-1">
            Acesso ao Protocolo
          </p>
          <h2 className="text-xl font-semibold text-white">Como você quer entrar?</h2>
        </div>

        <div className="p-8 space-y-5">

          {/* Google — Web2 (Account Abstraction) */}
          <div>
            <p className="text-xs text-white/30 mb-2.5 text-center font-medium uppercase tracking-wide">
              Consumidor — entrada sem crypto
            </p>
            <button
              id="btn-google-login"
              onClick={handleGoogle}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-green-50 text-gray-700 font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Entrar com Google — Fricção Zero
            </button>
          </div>

          {/* Separador */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="mx-4 text-white/30 text-xs">ou entre com carteira</span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* Freighter — Web3 Native */}
          <div>
            <p className="text-xs text-white/30 mb-2.5 text-center font-medium uppercase tracking-wide">
              Empresa / Admin — Stellar nativo
            </p>
            <button
              id="btn-freighter-login"
              onClick={handleFreighter}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-lg shadow-green-900/30"
            >
              <span className="text-lg" aria-hidden="true">💳</span>
              {isLoading ? 'Conectando...' : 'Conectar Carteira Freighter'}
            </button>
          </div>

          {/* Erro */}
          {error && (
            <div
              role="alert"
              className="bg-red-900/30 border border-red-500/30 text-red-300 text-sm px-4 py-3 rounded-xl"
            >
              {error}
            </div>
          )}

          {/* Rodapé do card */}
          <p className="pt-1 text-xs text-center text-white/20 leading-relaxed">
            Ao entrar você concorda com o modelo de Account Abstraction e patrocínio de fees via Soroban.
          </p>
        </div>
      </div>

      {/* Links informativos */}
      <div className="mt-8 flex gap-6 text-xs text-green-400/60 relative z-10">
        <a
          href="https://github.com/G0vermind/social-forests-protocol"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-300 transition-colors"
        >
          GitHub
        </a>
        <span className="text-white/20">·</span>
        <a href="/lightpaper" className="hover:text-green-300 transition-colors">Lightpaper</a>
        <span className="text-white/20">·</span>
        <a
          href="https://stellar.expert/explorer/testnet"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-300 transition-colors"
        >
          Testnet Explorer
        </a>
      </div>
    </main>
  );
}
