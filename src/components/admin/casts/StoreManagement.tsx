'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Store {
  id: string;
  name: string;
}

export default function StoreManagement() {
  const [stores, setStores] = useState<Store[]>([]);
  const [newStoreName, setNewStoreName] = useState('');
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // 初期ロード
  useEffect(() => {
    const loadStores = async () => {
      const { data, error } = await supabase.from('stores').select('id, name');
      if (error) {
        console.error(error);
        return;
      }
      setStores(data || []);
    };
    loadStores();
  }, []);

  // 店舗追加
  const handleAddStore = async () => {
    if (!newStoreName.trim()) return;

    const { data, error } = await supabase
      .from('stores')
      .insert([{ name: newStoreName }])
      .select();

    if (error) {
      console.error(error);
      alert('店舗の追加に失敗しました');
      return;
    }

    if (data && data.length > 0) {
      setStores((prev) => [...prev, data[0]]);
      setNewStoreName('');
    }
  };

  // 店舗削除
  const handleDeleteStore = async (id: string) => {
    const { error } = await supabase.from('stores').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert('店舗の削除に失敗しました');
      return;
    }
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  // 店舗更新
  const handleUpdateStore = async () => {
    if (!editingStoreId || !editingName.trim()) return;

    const { error } = await supabase
      .from('stores')
      .update({ name: editingName })
      .eq('id', editingStoreId);

    if (error) {
      console.error(error);
      alert('店舗の更新に失敗しました');
      return;
    }

    setStores((prev) =>
      prev.map((s) => (s.id === editingStoreId ? { ...s, name: editingName } : s))
    );
    setEditingStoreId(null);
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">店舗管理</h1>

      {/* 追加フォーム */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-md font-semibold mb-2">新しい店舗を追加</h3>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            placeholder="例: 新宿本店"
            className="flex-1 border rounded px-2 py-1"
          />
          <button
            onClick={handleAddStore}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            追加
          </button>
        </div>
      </div>

      {/* 店舗一覧 */}
      <h2 className="text-lg font-semibold mb-2">既存の店舗</h2>
      <div className="space-y-2">
        {stores.map((store) => (
          <div
            key={store.id}
            className="flex items-center justify-between border rounded px-2 py-1"
          >
            <div className="flex items-center gap-2">
              {editingStoreId === store.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border rounded px-1 py-0.5"
                  />
                  <button
                    onClick={handleUpdateStore}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    保存
                  </button>
                </>
              ) : (
                <span
                  onClick={() => {
                    setEditingStoreId(store.id);
                    setEditingName(store.name);
                  }}
                  className="cursor-pointer px-2 py-1 rounded text-sm bg-gray-100"
                >
                  {store.name}
                </span>
              )}
            </div>

            {/* 削除ボタン */}
            <button
              onClick={() => handleDeleteStore(store.id)}
              className="text-red-500 text-sm hover:underline"
            >
              🗑 削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
