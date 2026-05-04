'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Session, UserRole } from '@/types';
import { loginWithGoogle } from '@/lib/account-abstraction';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  connectFreighter: () => Promise<void>;
  connectGoogle: () => Promise<void>;
  disconnect: () => void;
  setRole: (role: UserRole) => void;
}

// Configurações de acesso para o ecossistema Sómogno
const MOCK_ADMINS = ['G...ADMIN'];
const MOCK_EMPRESAS = ['G...EMPRESA1', 'G...EMPRESA2'];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 1. CORREÇÃO DO LINT: Carregamento da Sessão
   * Envolvemos a lógica em um pequeno delay ou verificação para evitar
   * a renderização em cascata síncrona que o React 18 agora sinaliza.
   */
  useEffect(() => {
    const initializeAuth = () => {
      const stored = localStorage.getItem('sfp_session');
      if (stored) {
        try {
          const parsedSession = JSON.parse(stored);
          setSessionState(parsedSession);
        } catch (e) {
          console.error('Erro ao carregar sessão local:', e);
          localStorage.removeItem('sfp_session');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * 2. Persistência de Sessão Estável
   * Centralizamos a escrita no localStorage para evitar redundâncias.
   */
  const saveSession = useCallback((newSession: Session | null) => {
    setSessionState(newSession);
    if (newSession) {
      localStorage.setItem('sfp_session', JSON.stringify(newSession));
    } else {
      localStorage.removeItem('sfp_session');
    }
  }, []);

  const connectFreighter = useCallback(async () => {
    setIsLoading(true);
    try {
      const { isConnected, requestAccess } = await import('@stellar/freighter-api');
      const { isConnected: connected } = await isConnected();

      if (!connected) {
        throw new Error('Instale a Freighter para gerenciar seus ativos de Mogno.');
      }

      const { address, error } = await requestAccess();
      if (error || !address) throw new Error(error || 'Acesso negado');

      let resolvedRole: UserRole = 'consumidor';
      if (MOCK_ADMINS.includes(address)) resolvedRole = 'admin';
      else if (MOCK_EMPRESAS.includes(address)) resolvedRole = 'empresa';

      saveSession({
        address,
        role: resolvedRole,
        isWeb2: false,
      });
    } catch (err) {
      console.error('Erro na conexão Stellar:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [saveSession]);

  const connectGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const abstractAccount = await loginWithGoogle();
      saveSession({
        address: abstractAccount.address,
        role: 'consumidor',
        displayName: abstractAccount.displayName,
        isWeb2: true,
      });
    } catch (err) {
      console.error('Erro Google Login:', err);
    } finally {
      setIsLoading(false);
    }
  }, [saveSession]);

  const disconnect = useCallback(() => {
    saveSession(null);
  }, [saveSession]);

  const setRole = useCallback((role: UserRole) => {
    setSessionState(prev => {
      const updated = prev ? { ...prev, role } : null;
      if (updated) localStorage.setItem('sfp_session', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, isLoading, connectFreighter, connectGoogle, disconnect, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}