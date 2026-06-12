import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { AuthUser, LoginInput, RegisterInput } from '../types/auth.types';
import { clearAuthToken, getAuthToken, setAuthToken } from '../utils/authToken';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  login: (input: LoginInput) => Promise<string | null>;
  register: (input: RegisterInput) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    if (!getAuthToken()) {
      setStatus('anonymous');
      return;
    }

    authService.me().then((res) => {
      if (res.success && res.data) {
        setUser(res.data);
        setStatus('authenticated');
      } else {
        clearAuthToken();
        setUser(null);
        setStatus('anonymous');
      }
    });
  }, []);

  async function handleLogin(input: LoginInput): Promise<string | null> {
    const res = await authService.login(input);
    if (!res.success || !res.data) return res.error ?? 'Login failed';
    setAuthToken(res.data.token);
    setUser(res.data.user);
    setStatus('authenticated');
    return null;
  }

  async function handleRegister(input: RegisterInput): Promise<string | null> {
    const res = await authService.register(input);
    if (!res.success || !res.data) return res.error ?? 'Registration failed';
    setAuthToken(res.data.token);
    setUser(res.data.user);
    setStatus('authenticated');
    return null;
  }

  function logout(): void {
    authService.logout().catch(() => undefined);
    clearAuthToken();
    setUser(null);
    setStatus('anonymous');
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login: handleLogin, register: handleRegister, logout }),
    [user, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
