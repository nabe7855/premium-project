'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Dashboard from '@/components/sections/cast-dashboard/dashboard/Dashboard';
import LoginForm from '@/components/sections/cast-dashboard/LoginForm';
import { CastProfile } from '@/types/cast'; // ✅ 本物をインポート

export default function CastDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [castProfile, setCastProfile] = useState<CastProfile | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);

      // ✅ 現在ログイン中のユーザーを取得
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAuthenticated(false);
        setCastProfile(null);
        setLoading(false);
        return;
      }

      // ✅ roles テーブルでロールを確認
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError || !roleData || roleData.role !== 'cast') {
        setIsAuthenticated(false);
        setCastProfile(null);
        setLoading(false);
        return;
      }

      // ✅ getCastProfile を利用するのがベスト
      const { getCastProfile } = await import('@/lib/getCastProfile');
      const profile = await getCastProfile(user.id);

      if (!profile) {
        setIsAuthenticated(false);
        setCastProfile(null);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setCastProfile(profile);
      setLoading(false);
    };

    checkUser();
  }, []);

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

  // ✅ キャストログイン済みならプロフィール付きダッシュボードを表示
  return isAuthenticated && castProfile ? (
    <Dashboard cast={castProfile} />
  ) : (
    <LoginForm />
  );
}
