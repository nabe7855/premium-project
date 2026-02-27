'use client';

import { getRoleFromServer } from '@/actions/auth-debug';
import { supabase } from '@/lib/supabaseClient';
import { AuthUser } from '@/types/cast-dashboard';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string, email: string) => {
    const startTime = Date.now();
    console.log(`[AuthContext] fetchUserRole started for ${userId}`);

    // タイムアウトPromise（4秒）
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 4000),
    );

    try {
      // 1. まずはクライアントサイド（Supabase JS）で試行
      console.log('[AuthContext] Attempting client-side role fetch...');
      const clientRolePromise = supabase
        .from('roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle()
        .then((res) => ({ source: 'client', data: res.data, error: res.error }));

      // クライアントサイドとタイムアウトのレース
      const result: any = await Promise.race([clientRolePromise, timeoutPromise]);

      if (result && !result.error && result.data) {
        console.log(
          `[AuthContext] fetchUserRole success (client): ${result.data.role} in ${Date.now() - startTime}ms`,
        );
        return result.data.role;
      }

      if (result?.error) {
        console.warn(
          `[AuthContext] Client-side role fetch returned error: ${result.error.message}`,
        );
      }
    } catch (err: any) {
      console.warn(`[AuthContext] Client-side role fetch failed or timed out: ${err.message}`);
    }

    // 2. クライアントサイドが失敗した、もしくは遅い場合はサーバーサイドへ切り替え
    console.log('[AuthContext] Switching to server-side role fallback...');
    try {
      const serverResult = await getRoleFromServer(userId);
      if (serverResult.success) {
        console.log(
          `[AuthContext] fetchUserRole success (server): ${serverResult.role} in ${Date.now() - startTime}ms`,
        );
        return serverResult.role;
      }
    } catch (serverErr) {
      console.error('[AuthContext] Server-side fallback failed:', serverErr);
    }

    console.log(`[AuthContext] fetchUserRole failed both ways in ${Date.now() - startTime}ms`);
    return undefined;
  };

  const refreshUser = async () => {
    const startTime = Date.now();
    console.log(`[AuthContext] refreshUser started at ${new Date(startTime).toISOString()}`);

    try {
      console.log('[AuthContext] Fetching current session and user...');
      // getUser() だけでなく、まず getSession() で現在のセッションを素早く確認
      const {
        data: { session },
      } = await supabase.auth.getSession();

      let supabaseUser = session?.user || null;

      if (!supabaseUser) {
        // セッションがなければ getUser でサーバーから最新情報を取得試行
        const {
          data: { user: freshlyFetchedUser },
          error: authError,
        } = await supabase.auth.getUser();
        if (!authError) supabaseUser = freshlyFetchedUser;
      }

      if (supabaseUser) {
        console.log(`[AuthContext] User identified (${supabaseUser.id}), updating state...`);
        // 役割の取得（これもタイムアウト付き）
        const role = await fetchUserRole(supabaseUser.id, supabaseUser.email || '');

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          isAuthenticated: true,
          role,
        });
        console.log('[AuthContext] User state updated successfully');
      } else {
        console.log('[AuthContext] No authenticated user found');
        setUser(null);
      }
    } catch (err) {
      console.error('[AuthContext] Auth refresh error:', err);
      setUser(null);
    } finally {
      const duration = Date.now() - startTime;
      console.log(`[AuthContext] refreshUser finished in ${duration}ms, setting loading to false`);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[AuthContext] Provider mounted at', new Date().toISOString());

    // Safety timeout: force loading to false after 10 seconds if still loading
    const safetyTimeout = setTimeout(() => {
      setLoading((prevLoading) => {
        if (prevLoading) {
          console.warn(
            '[AuthContext] Safety timeout reached! Forcing loading to false because it hung too long.',
          );
          return false;
        }
        return prevLoading;
      });
    }, 10000);

    // Initial fetch
    refreshUser();

    // Listen for auth changes
    console.log('[AuthContext] Setting up onAuthStateChange listener...');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        `[AuthContext] onAuthStateChange event: ${event} at ${new Date().toISOString()}`,
        'sessionUser:',
        session?.user?.id,
      );

      try {
        if (session?.user) {
          console.log('[AuthContext] Session exists, updating user and role...');
          const role = await fetchUserRole(session.user.id, session.user.email || '');
          console.log('[AuthContext] onAuthStateChange role fetched:', role);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            isAuthenticated: true,
            role,
          });
        } else {
          console.log('[AuthContext] No session in onAuthStateChange, clearing user state');
          setUser(null);
        }
      } catch (err) {
        console.error('[AuthContext] Error in onAuthStateChange callback:', err);
      } finally {
        console.log('[AuthContext] onAuthStateChange callback finishing, setting loading to false');
        setLoading(false);
      }
    });

    return () => {
      console.log('[AuthContext] Unmounting Provider, cleaning up...');
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        const role = await fetchUserRole(data.user.id, data.user.email!);
        setUser({
          id: data.user.id,
          email: data.user.email!,
          isAuthenticated: true,
          role,
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
