'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/admin/layout/Sidebar';
import Header from '@/components/admin/layout/Header';
import { Page } from '@/types/dashboard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [currentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
      default:
        return 'ダッシュボード';
    }
  };

  return (
    <div className="flex h-screen bg-brand-primary text-brand-text font-sans">
      {/* サイドバー */}
      <Sidebar

        isOpen={isSidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* メイン領域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={getPageTitle()}
          onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-primary p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
