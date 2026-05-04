'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Evita o erro de cascading render movendo a atualização para o próximo frame
    const handle = requestAnimationFrame(() => {
      setIsReady(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!isReady || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="text-5xl animate-bounce mb-4 text-emerald-400">🌳</div>
        <p className="text-slate-400 font-medium font-mono uppercase tracking-widest text-xs">
          Verificando Credenciais...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4 opacity-80" />
        <h1 className="text-2xl font-black text-white mb-2 uppercase">Área Reservada</h1>
        <p className="text-slate-400 max-w-md mb-8">
          Acesse sua carteira para validar sua identidade no protocolo.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 px-8 rounded-2xl transition-all"
        >
          CONECTAR AGORA
        </button>
      </div>
    );
  }

  if (!allowedRoles.includes(session.role)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2 uppercase">Acesso Negado</h1>
        <p className="text-slate-400 max-w-sm mb-2 leading-relaxed">
          Sua credencial de <strong>{session.role}</strong> não tem permissão para este painel.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-all border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> VOLTAR AO PAINEL
        </button>
      </div>
    );
  }

  return <>{children}</>;
}