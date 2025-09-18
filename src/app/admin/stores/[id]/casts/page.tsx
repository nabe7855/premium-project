'use client';

import { useState } from 'react';
import { Users, Tags, ArrowLeft } from 'lucide-react';
import StoreCastList from '@/components/admin/stores/StoreCastList';
import StatusManagement from '@/components/admin/casts/StatusManagement';

type Tab = 'casts' | 'statuses';

export default function StoreCastPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<Tab>('casts');

  const tabs = [
    { key: 'casts', label: '店舗別キャスト管理', icon: Users },
    { key: 'statuses', label: 'ステータスマスタ管理', icon: Tags },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-cyan-100 p-4 sm:p-6">
      {/* 戻るボタン */}
      <div className="mb-4">
        <a
          href="/admin/stores"
          className="inline-flex items-center gap-2 rounded bg-gray-700 px-3 py-1 text-white text-sm hover:bg-gray-600 transition"
        >
          <ArrowLeft size={16} />
          店舗一覧に戻る
        </a>
      </div>

      {/* タイトル */}
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 tracking-widest uppercase text-cyan-400 drop-shadow flex items-center gap-2">
        <Users size={24} className="text-cyan-400" />
        店舗管理画面
      </h1>
      <p className="text-gray-400 mb-6 text-xs sm:text-sm font-mono">
        [ STORE MODULE ] 店舗別キャスト管理 ＋ ステータスマスタ制御
      </p>

      {/* タブメニュー */}
      <div
        role="tablist"
        className="flex flex-wrap gap-2 border-b border-cyan-700/50 pb-2 mb-6"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-md font-medium transition-all
                ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-[0_0_12px_rgba(0,255,255,0.7)]'
                    : 'bg-gray-800/60 text-gray-400 hover:text-cyan-300 hover:bg-gray-700/60'
                }`}
            >
              <Icon size={16} />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* タブごとのコンテンツ */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-lg shadow-lg p-4 sm:p-6 min-h-[300px]">
        {activeTab === 'casts' && <StoreCastList storeId={params.id} />}
        {activeTab === 'statuses' && <StatusManagement />}
      </div>
    </div>
  );
}
