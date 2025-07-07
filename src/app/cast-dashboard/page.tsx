'use client';

import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/components/sections/cast-dashboard/Dashboard';
import LoginForm from '@/components/sections/cast-dashboard/LoginForm';

export default function CastDashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-rose-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-pink-500"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user?.isAuthenticated ? <Dashboard /> : <LoginForm />;
}
