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
  stores: Store[];
  statuses: Status[];
}

export default function CastListPage() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [openCastId, setOpenCastId] = useState<string | null>(null);

  // ✅ 状態タグ管理用
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
          cast_store_memberships (
            stores ( id, name )
          ),
          cast_statuses (
            status_master ( id, name )
          )
        `);

      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id, name');

      const { data: statusData, error: statusError } = await supabase
        .from('status_master')
        .select('id, name');

      if (castError) console.error(castError);
      if (storeError) console.error(storeError);
      if (statusError) console.error(statusError);

      const formatted: Cast[] =
        castData?.map((c: any) => ({
          id: c.id,
          name: c.name,
          manager_comment: c.manager_comment,
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
        .update({ manager_comment: cast.manager_comment })
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
        const { error: insertError } = await supabase
          .from('cast_store_memberships')
          .insert(inserts);
        if (insertError) throw insertError;
      }

      await supabase.from('cast_statuses').delete().eq('cast_id', cast.id);
      if (cast.statuses.length > 0) {
        const inserts = cast.statuses.map((s) => ({
          cast_id: cast.id,
          status_id: s.id,
          created_at: new Date().toISOString(),
        }));
        const { error: statusInsertError } = await supabase
          .from('cast_statuses')
          .insert(inserts);
        if (statusInsertError) throw statusInsertError;
      }

      alert('更新しました');
    } catch (err) {
      console.error(err);
      alert('更新に失敗しました');
    }
  };

  // ✅ 状態タグを追加
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

  // ✅ 状態タグを削除
  const handleDeleteStatus = async (id: string) => {
    const { error } = await supabase.from('status_master').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert('状態タグの削除に失敗しました');
      return;
    }
    setStatuses((prev) => prev.filter((s) => s.id !== id));
  };

  // ✅ 状態タグを更新（名前変更）
  const handleUpdateStatus = async (id: string, newName: string) => {
    if (!newName.trim()) return;
    const { error } = await supabase
      .from('status_master')
      .update({ name: newName })
      .eq('id', id);
    if (error) {
      console.error(error);
      alert('状態タグの更新に失敗しました');
      return;
    }
    setStatuses((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
    setEditingStatusId(null);
  };

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-bold mb-4">キャスト一覧</h1>

      <ul className="space-y-4">
        {casts.map((cast, idx) => (
          <li key={cast.id} className="rounded-lg border shadow bg-white">
            <button
              onClick={() =>
                setOpenCastId(openCastId === cast.id ? null : cast.id)
              }
              className="w-full text-left px-4 py-3 font-semibold flex justify-between items-center"
            >
              {cast.name}
              <span>{openCastId === cast.id ? '▲' : '▼'}</span>
            </button>

            {openCastId === cast.id && (
              <div className="px-4 pb-4">
                {/* 店舗一覧 */}
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
                            setCasts((prev) =>
                              prev.map((c, i) =>
                                i === idx
                                  ? {
                                      ...c,
                                      stores: e.target.checked
                                        ? [...c.stores, store]
                                        : c.stores.filter(
                                            (s) => s.id !== store.id
                                          ),
                                    }
                                  : c
                              )
                            );
                          }}
                        />
                        <span>{store.name}</span>
                      </label>
                    );
                  })}
                </div>

                {/* 状態タグ一覧 */}
                <label className="block text-sm font-medium mt-4 mb-1">
                  状態タグ
                </label>
                <div className="flex flex-col gap-2">
                  {statuses.map((status) => {
                    const checked = cast.statuses.some(
                      (s) => s.id === status.id
                    );
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
                              onBlur={() =>
                                handleUpdateStatus(status.id, editingName)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleUpdateStatus(
                                    status.id,
                                    editingName
                                  );
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
                            onChange={(e) => {
                              setCasts((prev) =>
                                prev.map((c) =>
                                  c.id === cast.id
                                    ? {
                                        ...c,
                                        statuses: e.target.checked
                                          ? [...c.statuses, status]
                                          : c.statuses.filter(
                                              (s) => s.id !== status.id
                                            ),
                                      }
                                    : c
                                )
                              );
                            }}
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

                {/* 管理者専用: 状態タグ追加フォーム */}
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={newStatusName}
                    onChange={(e) => setNewStatusName(e.target.value)}
                    placeholder="新しいタグ名を入力"
                    className="border rounded px-2 py-1 flex-1"
                  />
                  <button
                    onClick={handleAddStatus}
                    className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600 text-sm"
                  >
                    追加
                  </button>
                </div>

                {/* 店長コメント */}
                <label className="block text-sm font-medium mt-4">
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
