'use client';

import Header from '@/components/admin/layout/Header';
import Sidebar from '@/components/admin/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Page } from '@/types/dashboard';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || !user.isAuthenticated || user.role !== 'admin') {
        router.push('/admin/login');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.isAuthenticated || user.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-primary">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-brand-accent" />
          <p className="mt-4 text-brand-text-secondary">認証中...</p>
        </div>
      </div>
    );
  }

  // 現在のページタイトルを算出
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'ダッシュボード';
      case 'all-cast':
        return '全キャスト管理';
      case 'store-cast':
        return '店舗別キャスト管理';
      case 'stores':
        return '店舗管理';
      case 'advertising':
        return '広告・集客';
      case 'ai-copywriter':
        return 'AI広告コピー生成';
      case 'ai-generate-intro':
        return 'AI新人紹介生成';
      case 'intro-list':
        return '投稿済み紹介';
      case 'advertising-list':
        return '投稿済み広告';
      case 'hotels':
        return 'ホテル管理';
      case 'hotel-masters':
        return 'ホテルマスタ管理';
      default:
        return 'ダッシュボード';
    }
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
