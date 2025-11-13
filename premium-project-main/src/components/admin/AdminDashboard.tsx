'use client';

import Link from 'next/link';
import { Store, Users } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-cyan-100 p-6 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-widest uppercase text-cyan-400 drop-shadow-lg">
        管理ダッシュボード
      </h1>
      <p className="text-gray-400 mb-8 sm:mb-10 font-mono text-xs sm:text-sm">
        [ SYSTEM ONLINE ] 店舗・キャスト制御モジュール
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8">
        {/* 店舗管理 */}
        <Link
          href="/admin/stores"
          className="group block rounded-lg border border-cyan-500/40 bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 sm:p-6 shadow-lg backdrop-blur-sm transition transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="bg-cyan-500/20 text-cyan-400 p-2 sm:p-3 rounded-full ring-2 ring-cyan-400/40 shadow-inner">
              <Store className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="font-bold text-base sm:text-lg group-hover:text-cyan-300">
              🏬 店舗管理
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 font-mono">
            店舗データの追加・編集・削除
          </p>
        </Link>

        {/* キャスト管理 */}
        <Link
          href="/admin/casts"
          className="group block rounded-lg border border-cyan-500/40 bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-4 sm:p-6 shadow-lg backdrop-blur-sm transition transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)]"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="bg-cyan-500/20 text-cyan-400 p-2 sm:p-3 rounded-full ring-2 ring-cyan-400/40 shadow-inner">
              <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="font-bold text-base sm:text-lg group-hover:text-cyan-300">
              👥 キャスト管理
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 font-mono">
            プロフィールや在籍データを制御
          </p>
        </Link>
      </div>
    </div>
  );
}
