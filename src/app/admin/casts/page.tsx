'use client';

import { ArrowLeft, Users } from 'lucide-react';
import CastManagement from '@/components/admin/casts/CastManagement';

export default function CastAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-cyan-100 p-4 sm:p-6">
      {/* 戻るボタン */}
      <div className="mb-4">
        <a
          href="/admin"
          className="inline-flex items-center gap-2 rounded bg-gray-700 px-3 py-1 text-white text-sm hover:bg-gray-600 transition"
        >
          <ArrowLeft size={16} />
          管理ダッシュボードに戻る
        </a>
      </div>

      {/* タイトル */}
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-4 tracking-widest uppercase text-cyan-400 drop-shadow flex items-center gap-2">
        <Users size={24} className="text-cyan-400" />
        キャスト管理画面
      </h1>
      <p className="text-gray-400 mb-6 text-xs sm:text-sm font-mono">
        [ CAST MODULE ] プロフィール・所属店舗・コメント制御システム
      </p>

      {/* キャスト管理コンテンツ */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-lg shadow-lg p-4 sm:p-6 min-h-[300px]">
        <CastManagement />
      </div>
    </div>
  );
}
