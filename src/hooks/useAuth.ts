'use client';

import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const { user, loading, login, logout, refreshUser } = useAuthContext();

  return {
    user,
    loading,
    login,
    logout,
    refreshUser,
  };
}
