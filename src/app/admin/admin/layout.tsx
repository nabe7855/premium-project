'use client';

import Header from '@/components/admin/layout/Header';
import Sidebar from '@/components/admin/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timestamp = new Date().toISOString();
    console.log(`[AdminLayout] useEffect triggered at ${timestamp}`, {
      loading,
      hasUser: !!user,
      isAuthenticated: user?.isAuthenticated,
      role: user?.role,
    });

    if (!loading) {
      if (!user || !user.isAuthenticated || user.role !== 'admin') {
        const redirectReason = !user
          ? 'No user session'
          : !user.isAuthenticated
            ? 'Not authenticated'
            : `Unauthorized role: ${user.role}`;
        console.warn(`[AdminLayout] Auth check failed (${redirectReason}), redirecting to login`);
        router.push('/admin/login');
      } else {
        console.log('[AdminLayout] Auth check passed, user is admin');
      }
    } else {
      console.log('[AdminLayout] Still loading auth state...');
    }
  }, [user, loading, router]);

  if (loading || !user || !user.isAuthenticated || user.role !== 'admin') {
    const reason = loading
      ? 'Loading...'
      : !user
        ? 'No user'
        : !user.isAuthenticated
          ? 'Not authenticated'
          : `Invalid role: ${user.role}`;

    console.log('[AdminLayout] Rendering loading screen. Reason:', reason);

    return (
      <div className="flex h-screen items-center justify-center bg-brand-primary">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand-accent" />
          <p className="mt-4 text-brand-text-secondary">認証中... ({reason})</p>
        </div>
      </div>
    );
  }

  // 現在のページタイトルを算出
  const getPageTitle = () => {
    if (pathname === '/admin/admin') return 'ダッシュボード';
    if (pathname.includes('/general-settings')) return '一般設定';
    if (pathname.includes('/all-cast')) return '全キャスト管理';
    if (pathname.includes('/stores/casts')) return '店舗別キャスト管理';
    if (pathname === '/admin/admin/stores') return '店舗管理';
    if (pathname.includes('/price-management')) return '料金管理';
    if (pathname === '/admin/admin/reservations') return '予約管理';
    if (pathname.includes('/advertising/list')) return '投稿済み広告';
    if (pathname.includes('/advertising')) return '広告・集客';
    if (pathname.includes('/ai/copywriter')) return 'AI広告コピー生成';
    if (pathname.includes('/ai/generate-intro')) return 'AI新人紹介生成';
    if (pathname.includes('/intro-list')) return '投稿済み紹介';
    if (pathname.includes('/hotels/masters')) return 'ホテルマスタ管理';
    if (pathname.includes('/hotels')) return 'ホテル管理';
    if (pathname.includes('/interview-reservations')) return '面接予約管理';
    if (pathname.includes('/recruit-management')) return '採用ページ管理';
    if (pathname.includes('/header-management')) return '共通ヘッダー管理';
    if (pathname.includes('/store-top-management')) return 'トップページ管理';
    if (pathname.includes('/page-request')) return 'ページ制作依頼';
    if (pathname.includes('/news-management')) return 'ニュースページ管理';
    if (pathname.includes('/banners')) return 'バナー管理';
    if (pathname.includes('/auto-post')) return 'AI自動投稿管理';
    return 'ダッシュボード';
  };

  return (
    <div className="flex h-screen bg-brand-primary font-sans text-brand-text">
      {/* サイドバー */}
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />

      {/* メイン領域 */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={getPageTitle()} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-brand-primary p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
