'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
    <div className="p-4 pb-24"> {/* ← 下に24（約6rem）の余白を追加 */}
      <h1 className="text-xl font-bold mb-4">店舗一覧</h1>
      <a
        href="/admin/stores/new"
        className="inline-block mb-4 rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
      >
        ＋ 新規店舗追加
      </a>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <li
            key={store.id}
            className="rounded-lg border p-4 shadow bg-white"
            style={{ borderTop: `4px solid ${store.theme_color || '#ccc'}` }}
          >
            {/* 画像プレビュー */}
            {store.image_url ? (
              <img
                src={store.image_url}
                alt={store.name}
                className="mb-2 h-32 w-full rounded object-cover"
              />
            ) : (
              <div className="mb-2 flex h-32 w-full items-center justify-center rounded bg-gray-100 text-gray-400">
                No Image
              </div>
            )}

            {/* 店舗名 & キャッチコピー */}
            <h2 className="text-lg font-bold">{store.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{store.catch_copy}</p>

            {/* 基本情報 */}
            <p className="text-xs text-gray-500">slug: {store.slug}</p>
            {store.address && <p className="text-xs text-gray-500">住所: {store.address}</p>}
            {store.phone && <p className="text-xs text-gray-500">電話: {store.phone}</p>}

            {/* アクションボタン */}
            <div className="mt-3 flex gap-2">
              <a
                href={`/admin/stores/${store.id}/edit`}
                className="flex-1 rounded bg-blue-500 px-3 py-1 text-center text-white hover:bg-blue-600 text-sm"
              >
                ✏ 編集
              </a>
              <button
                onClick={() => handleDelete(store.id)}
                className="flex-1 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600 text-sm"
              >
                🗑 削除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
