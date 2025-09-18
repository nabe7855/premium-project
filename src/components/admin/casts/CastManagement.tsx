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
  is_active: boolean;
  catch_copy?: string;
  stores: Store[];
}

export default function CastManagement() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [openCastId, setOpenCastId] = useState<string | null>(null);

  // 初期ロード
  useEffect(() => {
    const loadData = async () => {
      const { data: castData, error: castError } = await supabase
        .from('casts')
        .select(`
          id,
          name,
          manager_comment,
          is_active,
          catch_copy,
          cast_store_memberships ( stores ( id, name ) )
        `);

      const { data: storeData } = await supabase.from('stores').select('id, name');

      if (castError) console.error(castError);

      const formatted: Cast[] =
        castData?.map((c: any) => ({
          id: c.id,
          name: c.name,
          manager_comment: c.manager_comment,
          is_active: c.is_active,
          catch_copy: c.catch_copy,
          stores: c.cast_store_memberships?.map((cs: any) => cs.stores) || [],
        })) ?? [];

      setCasts(formatted);
      setStores(storeData || []);
    };
    loadData();
  }, []);

  // 更新処理
  const handleUpdate = async (cast: Cast) => {
    try {
      await supabase.from('casts')
        .update({
          manager_comment: cast.manager_comment,
          is_active: cast.is_active,
          catch_copy: cast.catch_copy,
        })
        .eq('id', cast.id);

      // 店舗リレーション更新
      await supabase.from('cast_store_memberships').delete().eq('cast_id', cast.id);
      if (cast.stores.length > 0) {
        const inserts = cast.stores.map((s) => ({
          cast_id: cast.id,
          store_id: s.id,
          start_date: new Date().toISOString().split('T')[0],
          end_date: '2099-12-31',
        }));
        await supabase.from('cast_store_memberships').insert(inserts);
      }

      alert('更新しました');
    } catch (err) {
      console.error(err);
      alert('更新に失敗しました');
    }
  };

  const activeCasts = casts.filter((c) => c.is_active);
  const inactiveCasts = casts.filter((c) => !c.is_active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-cyan-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 tracking-wider text-cyan-400 drop-shadow-lg">
        キャスト一覧
      </h1>

      {/* 在籍中 */}
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-cyan-300">
        ✅ 在籍中
      </h2>
      <ul className="space-y-3">
        {activeCasts.map((cast) => (
          <li
            key={cast.id}
            className="rounded-lg border border-cyan-700/50 bg-gray-900 shadow-md shadow-cyan-500/20"
          >
            {renderCastDetail(cast)}
          </li>
        ))}
      </ul>

      {/* 離籍中 */}
      <h2 className="text-lg font-semibold mt-8 mb-2 flex items-center gap-2 text-red-400">
        🚫 離籍中
      </h2>
      <ul className="space-y-3 opacity-80">
        {inactiveCasts.map((cast) => (
          <li
            key={cast.id}
            className="rounded-lg border border-red-700/50 bg-gray-800 shadow-md shadow-red-500/20"
          >
            {renderCastDetail(cast)}
          </li>
        ))}
      </ul>
    </div>
  );

  function renderCastDetail(cast: Cast) {
    return (
      <>
        <button
  onClick={() => setOpenCastId(openCastId === cast.id ? null : cast.id)}
  className={`w-full text-left px-4 py-3 font-semibold flex justify-between items-center transition
    ${cast.is_active
      ? 'text-cyan-200 hover:text-cyan-400'
      : 'text-red-400 hover:text-red-300'}
  `}
>
  {cast.name}
  <span>{openCastId === cast.id ? '▲' : '▼'}</span>
</button>

        {openCastId === cast.id && (
          <div className="px-4 pb-4 space-y-4 text-sm bg-gray-950/50 border-t border-gray-700">
            {/* 在籍ステータス */}
            <div>
              <label className="block font-medium mb-1">在籍ステータス</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cast.is_active}
                  onChange={(e) =>
                    setCasts((prev) =>
                      prev.map((c) => (c.id === cast.id ? { ...c, is_active: e.target.checked } : c))
                    )
                  }
                  className="accent-cyan-500 w-4 h-4"
                />
                <span>{cast.is_active ? '在籍中（公開）' : '非公開'}</span>
              </div>
            </div>

            {/* 所属店舗 */}
            <div>
              <label className="block font-medium mb-1">所属店舗</label>
              <div className="flex flex-wrap gap-2">
                {stores.map((store) => {
                  const checked = cast.stores.some((s) => s.id === store.id);
                  return (
                    <label
                      key={store.id}
                      className={`px-2 py-1 rounded text-sm cursor-pointer border ${
                        checked
                          ? 'bg-cyan-600 text-white border-cyan-400'
                          : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setCasts((prev) =>
                            prev.map((c) =>
                              c.id === cast.id
                                ? {
                                    ...c,
                                    stores: e.target.checked
                                      ? [...c.stores, store]
                                      : c.stores.filter((s) => s.id !== store.id),
                                }
                                : c
                            )
                          )
                        }
                        className="hidden"
                      />
                      {store.name}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* キャッチコピー */}
            <div>
              <label className="block font-medium mb-1">キャッチコピー</label>
              <input
                type="text"
                value={cast.catch_copy ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setCasts((prev) => prev.map((c) => (c.id === cast.id ? { ...c, catch_copy: value } : c)));
                }}
                className="w-full border border-cyan-700/50 rounded bg-gray-800 text-white px-2 py-1 focus:ring-2 focus:ring-cyan-400"
                placeholder="例: 究極の癒し系男子"
              />
            </div>

            {/* 店長コメント */}
            <div>
              <label className="block font-medium mb-1">店長コメント</label>
              <textarea
                value={cast.manager_comment ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setCasts((prev) => prev.map((c) => (c.id === cast.id ? { ...c, manager_comment: value } : c)));
                }}
                className="w-full border border-cyan-700/50 rounded bg-gray-800 text-white px-2 py-1 focus:ring-2 focus:ring-cyan-400"
                placeholder="店長コメントを入力"
              />
            </div>

            {/* 保存ボタン */}
            <button
              onClick={() => handleUpdate(cast)}
              className="mt-2 w-full rounded bg-cyan-600 hover:bg-cyan-500 px-3 py-2 text-white font-semibold shadow-lg shadow-cyan-400/40"
            >
              保存
            </button>
          </div>
        )}
      </>
    );
  }
}
