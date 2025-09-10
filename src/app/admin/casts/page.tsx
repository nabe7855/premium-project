'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Store {
  id: string;
  name: string;
}

interface Cast {
  id: string;
  name: string;
  manager_comment?: string;
  stores: Store[];
}

export default function CastListPage() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [openCastId, setOpenCastId] = useState<string | null>(null); // 👈 どのキャストを開いているか

  // 初期ロード
  useEffect(() => {
    const loadData = async () => {
      const { data: castData, error: castError } = await supabase
        .from('casts')
        .select(`
          id,
          name,
          manager_comment,
          cast_store_memberships (
            store_id,
            stores ( id, name )
          )
        `);

      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id, name');

      if (castError) console.error(castError);
      if (storeError) console.error(storeError);

      const formatted = (castData || []).map((c) => ({
        id: c.id,
        name: c.name,
        manager_comment: c.manager_comment,
        stores: c.cast_store_memberships?.map((cs: any) => cs.stores) || [],
      }));

      setCasts(formatted);
      setStores(storeData || []);
    };
    loadData();
  }, []);

  // 更新処理
  const handleUpdate = async (cast: Cast) => {
    const { error: castError } = await supabase
      .from('casts')
      .update({ manager_comment: cast.manager_comment })
      .eq('id', cast.id);

    if (castError) {
      console.error(castError);
      alert('キャスト更新に失敗しました');
      return;
    }

    const { error: deleteError } = await supabase
      .from('cast_store_memberships')
      .delete()
      .eq('cast_id', cast.id);

    if (deleteError) {
      console.error(deleteError);
      alert('所属店舗削除に失敗しました');
      return;
    }

    const inserts = cast.stores.map((s) => ({
      cast_id: cast.id,
      store_id: s.id,
      start_date: new Date().toISOString().split('T')[0],
      end_date: '2099-12-31', // ✅ 仮の終了日
    }));

    if (inserts.length > 0) {
      const { error: insertError } = await supabase
        .from('cast_store_memberships')
        .insert(inserts);

      if (insertError) {
        console.error(insertError);
        alert('所属店舗追加に失敗しました');
        return;
      }
    }

    alert('更新しました');
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">キャスト一覧</h1>

      <ul className="space-y-4">
        {casts.map((cast, idx) => (
          <li key={cast.id} className="rounded-lg border shadow bg-white">
            {/* キャスト名（クリックでタブを開閉） */}
            <button
              onClick={() =>
                setOpenCastId(openCastId === cast.id ? null : cast.id)
              }
              className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center"
            >
              {cast.name}
              <span>{openCastId === cast.id ? '▲' : '▼'}</span>
            </button>

            {/* 詳細タブ */}
            {openCastId === cast.id && (
              <div className="px-4 pb-4">
                {/* 店舗一覧 + チェックボックス */}
                <label className="block text-sm font-medium mt-2 mb-1">
                  所属店舗
                </label>
                <div className="space-y-1">
                  {stores.map((store) => {
                    const checked = cast.stores.some((s) => s.id === store.id);
                    return (
                      <label
                        key={store.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const newCasts = [...casts];
                            if (e.target.checked) {
                              newCasts[idx].stores = [...cast.stores, store];
                            } else {
                              newCasts[idx].stores = cast.stores.filter(
                                (s) => s.id !== store.id
                              );
                            }
                            setCasts(newCasts);
                          }}
                        />
                        <span>{store.name}</span>
                      </label>
                    );
                  })}
                </div>

                {/* 店長コメント */}
                <label className="block text-sm font-medium mt-2">
                  店長コメント
                </label>
                <textarea
                  value={cast.manager_comment || ''}
                  onChange={(e) => {
                    const newCasts = [...casts];
                    newCasts[idx].manager_comment = e.target.value;
                    setCasts(newCasts);
                  }}
                  className="w-full border rounded p-2 my-1"
                  placeholder="店長コメントを入力"
                />

                <button
                  onClick={() => handleUpdate(cast)}
                  className="mt-2 w-full rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600 text-sm"
                >
                  保存
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
