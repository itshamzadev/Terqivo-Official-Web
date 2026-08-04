import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PublicUser { id: string; name: string; email: string; username: string; avatar?: string; emailVerified: boolean; status: string; role: 'user'; createdAt?: string; lastLoginAt?: string; }
interface AuthContextType { user: PublicUser | null; isAuthenticated: boolean; isLoading: boolean; emailVerified: boolean; login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>; signup: (data: Record<string, string>) => Promise<{ success: boolean; message?: string; data?: any }>; logout: () => Promise<void>; refreshCurrentUser: () => Promise<void>; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null); const [isLoading, setIsLoading] = useState(true);
  const refreshCurrentUser = async () => { try { const res = await fetch('/api/auth/me?type=user'); const data = await res.json(); setUser(res.ok && data.success ? data.data.user : null); } catch { setUser(null); } finally { setIsLoading(false); } };
  useEffect(() => { void refreshCurrentUser(); }, []);
  const login = async (identifier: string, password: string, rememberMe = false) => { const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, password, rememberMe, accountType: 'user' }) }); const data = await res.json(); if (res.ok && data.success) { setUser(data.data.user); return { success: true, message: data.message }; } return { success: false, message: data.message || 'Invalid credentials' }; };
  const signup = async (data: Record<string, string>) => { const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); const result = await res.json(); if (res.ok && result.success) { setUser(result.data.user); return result; } return result; };
  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'user' }) }).catch(() => undefined); setUser(null); };
  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, emailVerified: Boolean(user?.emailVerified), login, signup, logout, refreshCurrentUser }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within an AuthProvider'); return context; }
