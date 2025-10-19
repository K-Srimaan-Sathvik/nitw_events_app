import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type User = { id: number; name: string; email: string; role: 'admin' | 'leader' | 'student' };

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (u: User, t: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    login: (u, t) => {
      setUser(u);
      setToken(t);
      localStorage.setItem('user', JSON.stringify(u));
      localStorage.setItem('token', t);
    },
    logout: () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
