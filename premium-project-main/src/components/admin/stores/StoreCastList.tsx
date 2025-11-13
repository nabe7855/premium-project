'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Status {
  id: string;
  name: string;
  label_color?: string;
  text_color?: string;
}

interface Cast {
  id: string;
  name: string;
  statuses: Status[];
  priority?: number | null;
}

export default function StoreCastList({ storeId }: { storeId: string }) {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);

  // 初期ロード
  useEffect(() => {
    const load = async () => {
      // 在籍中キャスト＋priority
      const { data: castData, error: castError } = await supabase
        .from('casts')
        .select(`
          id,
          name,
          is_active,
          cast_statuses ( status_master ( id, name, label_color, text_color ) ),
          cast_store_memberships!inner (
            store_id,
            priority
          )
        `)
        .eq('cast_store_memberships.store_id', storeId)
        .eq('is_active', true);

      if (castError) console.error(castError);

      // タグマスタ
      const { data: statusData } = await supabase
        .from('status_master')
        .select('id, name, label_color, text_color');

      setStatuses(statusData || []);
      setCasts(
        castData?.map((c: any) => ({
          id: c.id,
          name: c.name,
          statuses: c.cast_statuses?.map((cs: any) => cs.status_master) || [],
          priority: c.cast_store_memberships?.[0]?.priority ?? null,
        })) ?? []
      );
    };
    load();
  }, [storeId]);

  // ✅ おすすめ順位更新
  const handlePriorityChange = async (castId: string, value: number) => {
    setCasts((prev) =>
      prev.map((c) => (c.id === castId ? { ...c, priority: value } : c))
    );

    const { error } = await supabase
      .from('cast_store_memberships')
      .update({ priority: value })
      .eq('cast_id', castId)
      .eq('store_id', storeId);

    if (error) {
      console.error(error);
      alert('おすすめ順位の更新に失敗しました');
    }
  };

  // ✅ タグ更新
  const handleToggleStatus = async (
    castId: string,
    status: Status,
    checked: boolean
  ) => {
    if (checked) {
      await supabase.from('cast_statuses').insert({
        cast_id: castId,
        status_id: status.id,
        created_at: new Date().toISOString(),
      });
    } else {
      await supabase
        .from('cast_statuses')
        .delete()
        .eq('cast_id', castId)
        .eq('status_id', status.id);
    }

    setCasts((prev) =>
      prev.map((c) =>
        c.id === castId
          ? {
              ...c,
              statuses: checked
                ? [...c.statuses, status]
                : c.statuses.filter((s) => s.id !== status.id),
            }
          : c
      )
    );
  };

  return (
    <div>
      <ul className="space-y-4">
        {casts.map((cast) => (
          <li
            key={cast.id}
            className="rounded-xl border border-cyan-600/40 bg-gray-900 shadow-lg shadow-cyan-500/20 p-4 transition hover:shadow-cyan-400/40 hover:border-cyan-400/60"
          >
            {/* キャスト名 */}
            <h2 className="font-bold text-lg sm:text-xl mb-3 text-cyan-300 tracking-wide">
              {cast.name}
            </h2>

            {/* おすすめ順位 */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1 text-cyan-200">
                おすすめ順位
              </label>
              <input
                type="number"
                min={1}
                value={cast.priority ?? ''}
                onChange={(e) =>
                  handlePriorityChange(cast.id, parseInt(e.target.value) || 0)
                }
                className="w-24 rounded bg-gray-800 border border-cyan-600/50 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-cyan-400"
                placeholder="例: 1"
              />
            </div>

            {/* ステータス（タグ） */}
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => {
                const checked = cast.statuses.some((s) => s.id === status.id);
                return (
                  <label
                    key={status.id}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm cursor-pointer border transition-all
                      ${
                        checked
                          ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white border-cyan-400 shadow shadow-cyan-400/40'
                          : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        handleToggleStatus(cast.id, status, e.target.checked)
                      }
                      className="hidden"
                    />
                    {status.name}
                  </label>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
