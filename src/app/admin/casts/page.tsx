'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Store {
  id: string;
  name: string;
}

interface Status {
  id: string;
  name: string;
}

interface Cast {
  id: string;
  name: string;
  manager_comment?: string;
  is_active: boolean;
  catch_copy?: string; // ✨ キャッチコピー
  stores: Store[];
  statuses: Status[];
}

export default function CastListPage() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [openCastId, setOpenCastId] = useState<string | null>(null);

  const [newStatusName, setNewStatusName] = useState('');
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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
          cast_store_memberships (
            stores (
              id,
              name
            )
          ),
          cast_statuses (
            status_master (
              id,
              name
            )
          )
        `);

      const { data: storeData } = await supabase.from('stores').select('id, name');
      const { data: statusData } = await supabase.from('status_master').select('id, name');

      if (castError) console.error(castError);

      const formatted: Cast[] =
        castData?.map((c: any) => ({
          id: c.id,
          name: c.name,
          manager_comment: c.manager_comment,
          is_active: c.is_active,
          catch_copy: c.catch_copy,
          stores: c.cast_store_memberships?.map((cs: any) => cs.stores) || [],
          statuses: c.cast_statuses?.map((cs: any) => cs.status_master) || [],
        })) ?? [];

      setCasts(formatted);
      setStores(storeData || []);
      setStatuses(statusData || []);
    };
    loadData();
  }, []);

  // 更新処理
  const handleUpdate = async (cast: Cast) => {
    try {
      const { error: castError } = await supabase
        .from('casts')
        .update({
          manager_comment: cast.manager_comment,
          is_active: cast.is_active,
          catch_copy: cast.catch_copy,
        })
        .eq('id', cast.id);
      if (castError) throw castError;

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

      await supabase.from('cast_statuses').delete().eq('cast_id', cast.id);
      if (cast.statuses.length > 0) {
        const inserts = cast.statuses.map((s) => ({
          cast_id: cast.id,
          status_id: s.id,
          created_at: new Date().toISOString(),
        }));
        await supabase.from('cast_statuses').insert(inserts);
      }

      alert('更新しました');
    } catch (err) {
      console.error(err);
      alert('更新に失敗しました');
    }
  };

  // 状態タグ追加
  const handleAddStatus = async () => {
    if (!newStatusName.trim()) return;
    const { data, error } = await supabase
      .from('status_master')
      .insert([{ name: newStatusName }])
      .select();
    if (error) {
      console.error(error);
      alert('状態タグの追加に失敗しました');
      return;
    }
    if (data && data.length > 0) {
      setStatuses((prev) => [...prev, data[0]]);
      setNewStatusName('');
    }
  };

  // 状態タグ削除
  const handleDeleteStatus = async (id: string) => {
    const { error } = await supabase.from('status_master').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert('状態タグの削除に失敗しました');
      return;
    }
    setStatuses((prev) => prev.filter((s) => s.id !== id));
  };

  // 状態タグ更新
  const handleUpdateStatus = async (id: string, newName: string) => {
    if (!newName.trim()) return;
    const { error } = await supabase.from('status_master').update({ name: newName }).eq('id', id);
    if (error) {
      console.error(error);
      alert('状態タグの更新に失敗しました');
      return;
    }
    setStatuses((prev) => prev.map((s) => (s.id === id ? { ...s, name: newName } : s)));
    setEditingStatusId(null);
  };

  // ✅ 在籍中・離籍中で分割
  const activeCasts = casts.filter((c) => c.is_active);
  const inactiveCasts = casts.filter((c) => !c.is_active);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">キャスト一覧</h1>

      {/* 状態タグ追加フォーム（ページ上部） */}
      <div className="mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-md font-semibold mb-2">状態タグを追加</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newStatusName}
            onChange={(e) => setNewStatusName(e.target.value)}
            placeholder="例: 新人 / 店長一押し"
            className="flex-1 border rounded px-2 py-1"
          />
          <button
            onClick={handleAddStatus}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            追加
          </button>
        </div>
      </div>

      {/* 在籍中 */}
      <h2 className="text-lg font-semibold mt-6 mb-2">✅ 在籍中</h2>
      <ul className="space-y-4">
        {activeCasts.map((cast) => (
          <li key={cast.id} className="rounded-lg border shadow bg-white">
            {renderCastDetail(cast)}
          </li>
        ))}
      </ul>

      {/* 離籍中 */}
      <h2 className="text-lg font-semibold mt-8 mb-2">🚫 離籍中</h2>
      <ul className="space-y-4 opacity-70">
        {inactiveCasts.map((cast) => (
          <li key={cast.id} className="rounded-lg border shadow bg-white">
            {renderCastDetail(cast)}
          </li>
        ))}
      </ul>
    </div>
  );

  // 🔽 共通のキャスト詳細UI
  function renderCastDetail(cast: Cast) {
    return (
      <>
        <button
          onClick={() => setOpenCastId(openCastId === cast.id ? null : cast.id)}
          className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center"
        >
          {cast.name}
          <span>{openCastId === cast.id ? '▲' : '▼'}</span>
        </button>

        {openCastId === cast.id && (
          <div className="px-4 pb-4">
            {/* 在籍ステータス */}
            <label className="block text-sm font-medium mt-2 mb-1">在籍ステータス</label>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={cast.is_active}
                onChange={(e) =>
                  setCasts((prev) =>
                    prev.map((c) =>
                      c.id === cast.id ? { ...c, is_active: e.target.checked } : c
                    )
                  )
                }
              />
              <span>{cast.is_active ? '在籍中（公開）' : '非公開'}</span>
            </div>

            {/* 所属店舗 */}
            <label className="block text-sm font-medium mt-2 mb-1">所属店舗</label>
            <div className="space-y-1">
              {stores.map((store) => {
                const checked = cast.stores.some((s) => s.id === store.id);
                return (
                  <label key={store.id} className="flex items-center space-x-2">
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
                    />
                    <span>{store.name}</span>
                  </label>
                );
              })}
            </div>

            {/* 状態タグ一覧 */}
            <label className="block text-sm font-medium mt-4 mb-1">状態タグ</label>
            <div className="flex flex-col gap-2">
              {statuses.map((status) => {
                const checked = cast.statuses.some((s) => s.id === status.id);
                return (
                  <div
                    key={status.id}
                    className="flex items-center justify-between border rounded px-2 py-1"
                  >
                    <div className="flex items-center gap-2">
                      {editingStatusId === status.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => handleUpdateStatus(status.id, editingName)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateStatus(status.id, editingName);
                            }
                          }}
                          className="border rounded px-1 py-0.5"
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => {
                            setEditingStatusId(status.id);
                            setEditingName(status.name);
                          }}
                          className="cursor-pointer"
                        >
                          {status.name}
                        </span>
                      )}

                      {/* キャストに付与するチェックボックス */}
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          setCasts((prev) =>
                            prev.map((c) =>
                              c.id === cast.id
                                ? {
                                    ...c,
                                    statuses: e.target.checked
                                      ? [...c.statuses, status]
                                      : c.statuses.filter((s) => s.id !== status.id),
                                }
                                : c
                            )
                          )
                        }
                      />
                    </div>

                    {/* 削除ボタン */}
                    <button
                      onClick={() => handleDeleteStatus(status.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      🗑 削除
                    </button>
                  </div>
                );
              })}
            </div>

            {/* キャッチコピー */}
            <label className="block text-sm font-medium mt-4">キャッチコピー</label>
            <input
              type="text"
              value={cast.catch_copy ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                setCasts((prev) =>
                  prev.map((c) => (c.id === cast.id ? { ...c, catch_copy: value } : c))
                );
              }}
              className="w-full border rounded p-2 my-1"
              placeholder="例: 究極の癒し系男子"
            />

            {/* 店長コメント */}
            <label className="block text-sm font-medium mt-4">店長コメント</label>
            <textarea
              value={cast.manager_comment ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                setCasts((prev) =>
                  prev.map((c) => (c.id === cast.id ? { ...c, manager_comment: value } : c))
                );
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
      </>
    );
  }
}
