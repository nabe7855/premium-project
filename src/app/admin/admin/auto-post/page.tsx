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
  const [editingPost, setEditingPost] = useState<any>(null);

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setActiveTab('generate');
  };

  const tabs = [
    { id: 'generate', label: 'AI記事生成', icon: Sparkles },
    { id: 'scheduled', label: '予約一覧', icon: Calendar },
    { id: 'history', label: '履歴', icon: History },
    { id: 'status', label: 'システム状態', icon: Activity },
  ];

  return (
    <div className="space-y-4 px-2 py-4 md:space-y-6 md:px-0 md:py-0">
      {/* ヘッダーエリア */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white md:text-2xl">AI自動投稿管理</h2>
          <p className="text-xs text-brand-text-secondary md:text-sm">
            AIで記事を生成し、ポータルサイトへ自動投稿します。
          </p>
        </div>
      </div>

      {/* タブ切り替え - モバイルでは横スクロール可能に */}
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex min-w-max rounded-xl border border-white/5 bg-brand-secondary p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 md:px-6 md:py-2.5 md:text-sm ${
                  activeTab === tab.id
                    ? 'bg-brand-accent text-white shadow-lg'
                    : 'text-brand-text-secondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* コンテンツエリア */}
      <div className="min-h-[400px] rounded-xl border border-white/5 bg-brand-secondary/50 p-4 backdrop-blur-sm md:rounded-2xl md:p-6">
        {activeTab === 'generate' && (
          <PostGenerator
            initialData={editingPost}
            onCancel={() => {
              setEditingPost(null);
              setActiveTab('scheduled');
            }}
          />
        )}

        {activeTab === 'scheduled' && <PostList type="scheduled" onEdit={handleEditPost} />}

        {activeTab === 'history' && <PostList type="history" onEdit={handleEditPost} />}

        {activeTab === 'status' && <StatusBoard />}
      </div>
    </div>
  );
}
