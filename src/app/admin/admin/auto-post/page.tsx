'use client';

import PostGenerator from '@/components/admin/auto-post/PostGenerator';
import PostList from '@/components/admin/auto-post/PostList';
import StatusBoard from '@/components/admin/auto-post/StatusBoard';
import { Activity, Calendar, History, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function AutoPostPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'scheduled' | 'history' | 'status'>(
    'generate',
  );

  const tabs = [
    { id: 'generate', label: 'AI記事生成', icon: Sparkles },
    { id: 'scheduled', label: '予約一覧', icon: Calendar },
    { id: 'history', label: '履歴', icon: History },
    { id: 'status', label: 'システム状態', icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* ヘッダーエリア */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI自動投稿管理</h2>
          <p className="text-sm text-brand-text-secondary">
            AIで記事を生成し、ポータルサイトへ自動投稿します。
          </p>
        </div>
      </div>

      {/* タブ切り替え */}
      <div className="flex w-fit rounded-xl border border-white/5 bg-brand-secondary p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-brand-accent text-white shadow-lg'
                  : 'text-brand-text-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* コンテンツエリア */}
      <div className="min-h-[400px] rounded-2xl border border-white/5 bg-brand-secondary/50 p-6 backdrop-blur-sm">
        {activeTab === 'generate' && <PostGenerator />}

        {activeTab === 'scheduled' && <PostList type="scheduled" />}

        {activeTab === 'history' && <PostList type="history" />}

        {activeTab === 'status' && <StatusBoard />}
      </div>
    </div>
  );
}
