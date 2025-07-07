import { useState, useEffect } from 'react';
import { AuthUser } from '@/types/cast-dashboard';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('cast-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simplified authentication - any username/password combination works
      if (username.trim() && password.trim()) {
        const authUser: AuthUser = {
          username,
          isAuthenticated: true,
        };
        setUser(authUser);
        localStorage.setItem('cast-user', JSON.stringify(authUser));
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cast-user');
  };

  return {
    user,
    loading,
    login,
    logout,
  };
}
