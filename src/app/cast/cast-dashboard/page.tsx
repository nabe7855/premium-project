'use client';

import Dashboard from '@/components/sections/cast-dashboard/dashboard/Dashboard';
import { useAuth } from '@/hooks/useAuth';
import { CastProfile } from '@/types/cast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CastDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [castProfile, setCastProfile] = useState<CastProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const router = useRouter();

  // 1. ログアウト検知 -> ログイン画面へ
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // 2. プロフィール取得（userオブジェクトそのものへの依存を減らし、ID変更時のみフルロードする）
  useEffect(() => {
    const fetchProfile = async () => {
      if (user && user.isAuthenticated && user.role === 'cast') {
        // すでにプロフィールがあり、かつユーザーIDも一致している場合はLoading画面を出さない
        if (castProfile && castProfile.userId === user.id) {
          console.log('[CastDashboardPage] Profile already loaded, skipping full loading screen');
          return;
        }

        setProfileLoading(true);
        try {
          const { getCastProfile } = await import('@/lib/getCastProfile');
          const profile = await getCastProfile(user.id);

          if (!profile) {
            router.push('/login');
          } else {
            setCastProfile(profile);
          }
        } catch (err) {
          console.error('[CastDashboardPage] Fetch profile error:', err);
        } finally {
          setProfileLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user?.id, user?.isAuthenticated, user?.role, router, castProfile]);


  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-white to-rose-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-pink-500"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ 認証済みならダッシュボード
  if (user && user.isAuthenticated && castProfile) {
    return <Dashboard cast={castProfile} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-400">
      Redirecting...
    </div>
  );
}
