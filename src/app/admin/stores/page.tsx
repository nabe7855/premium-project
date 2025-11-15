'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Store, Edit3, Users, Trash2, ArrowLeft } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  catch_copy?: string;
  image_url?: string;
  theme_color?: string;
}

export default function StoreListPage() {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const loadStores = async () => {
      const { data, error } = await supabase.from('stores').select('*');
      if (error) console.error(error);
      else setStores(data || []);
    };
    loadStores();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    await supabase.from('stores').delete().eq('id', id);
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-cyan-100 p-4 sm:p-6">
      {/* 戻るボタン */}
      <div className="mb-6">
        <a
          href="/admin"
          className="inline-flex items-center gap-2 rounded bg-gray-800/70 px-3 py-2 text-sm text-cyan-300 hover:bg-gray-700 hover:text-cyan-100 transition shadow"
        >
          <ArrowLeft size={16} />
          管理ダッシュボードに戻る
        </a>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-widest uppercase text-cyan-400 drop-shadow">
        店舗一覧
      </h1>
      <p className="text-gray-400 mb-6 text-sm font-mono">
        [ STORES MODULE ] 店舗データ制御システム
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <a
          href="/admin/stores/new"
          className="rounded bg-pink-600 px-4 py-2 text-white text-sm hover:bg-pink-700 transition shadow"
        >
          ＋ 新規店舗追加
        </a>
        <a
          href="/admin/casts"
          className="rounded bg-purple-600 px-4 py-2 text-white text-sm hover:bg-purple-700 transition shadow"
        >
          👥 全キャスト管理
        </a>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <li
            key={store.id}
            className="group rounded-lg border border-cyan-500/30 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-4 shadow-md hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition transform hover:-translate-y-1 hover:scale-[1.01]"
          >
            {/* 画像プレビュー */}
            {store.image_url ? (
              <img
                src={store.image_url}
                alt={store.name}
                className="mb-3 h-32 w-full rounded object-cover border border-gray-700"
              />
            ) : (
              <div className="mb-3 flex h-32 w-full items-center justify-center rounded bg-gray-800 text-gray-500 text-sm border border-gray-700">
                No Image
              </div>
            )}

            {/* 店舗名 & キャッチコピー */}
            <h2 className="text-lg font-bold text-cyan-300">{store.name}</h2>
            <p className="text-xs text-gray-400 mb-3">{store.catch_copy}</p>

            {/* 基本情報 */}
            <p className="text-[11px] text-gray-500">slug: {store.slug}</p>
            {store.address && (
              <p className="text-[11px] text-gray-500">住所: {store.address}</p>
            )}
            {store.phone && (
              <p className="text-[11px] text-gray-500">電話: {store.phone}</p>
            )}

            {/* アクションボタン */}
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`/admin/stores/${store.id}/edit`}
                className="flex items-center justify-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-white text-sm hover:bg-blue-700 transition"
              >
                <Edit3 size={14} /> 編集
              </a>
              <a
                href={`/admin/stores/${store.id}/casts`}
                className="flex items-center justify-center gap-2 rounded bg-green-600 px-3 py-1.5 text-white text-sm hover:bg-green-700 transition"
              >
                <Users size={14} /> 店舗在籍キャスト一覧
              </a>
              <button
                onClick={() => handleDelete(store.id)}
                className="flex items-center justify-center gap-2 rounded bg-red-600 px-3 py-1.5 text-white text-sm hover:bg-red-700 transition"
              >
                <Trash2 size={14} /> 削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
