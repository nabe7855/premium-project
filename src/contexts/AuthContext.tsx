'use client';

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
    try {
      const { data: roleData, error } = await supabase
        .from('roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.warn('Role fetch warning:', error.message);
      }

      return roleData?.role;
    } catch (err) {
      console.error('Unexpected role fetch error:', err);
      return undefined;
    }
  };

  const refreshUser = async () => {
    console.log('[AuthContext] refreshUser started');
    try {
      const {
        data: { user: supabaseUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.warn('[AuthContext] getUser error:', authError.message);
        throw authError;
      }

      if (supabaseUser) {
        console.log('[AuthContext] supabaseUser found, fetching role...');
        const role = await fetchUserRole(supabaseUser.id, supabaseUser.email!);
        console.log('[AuthContext] role fetched:', role);
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          isAuthenticated: true,
          role,
        });
      } else {
        console.log('[AuthContext] No supabaseUser found');
        setUser(null);
      }
    } catch (err) {
      console.error('[AuthContext] Auth refresh error:', err);
      setUser(null);
    } finally {
      console.log('[AuthContext] refreshUser finished, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[AuthContext] Provider mounted');
    // Initial fetch
    refreshUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        '[AuthContext] onAuthStateChange event:',
        event,
        'sessionUser:',
        session?.user?.id,
      );

      if (session?.user) {
        console.log('[AuthContext] Session exists, updating user and role...');
        const role = await fetchUserRole(session.user.id, session.user.email!);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          isAuthenticated: true,
          role,
        });
      } else {
        console.log('[AuthContext] No session, clearing user state');
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('[AuthContext] Unsubscribing from auth changes');
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
