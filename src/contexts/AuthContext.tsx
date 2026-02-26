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
    try {
      const {
        data: { user: supabaseUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (supabaseUser) {
        const role = await fetchUserRole(supabaseUser.id, supabaseUser.email!);
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          isAuthenticated: true,
          role,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Auth refresh error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    refreshUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event change:', event);

      if (session?.user) {
        const role = await fetchUserRole(session.user.id, session.user.email!);
        setUser({
          id: session.user.id,
          email: session.user.email!,
          isAuthenticated: true,
          role,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
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
