'use client';

import { deleteCastProfile } from '@/actions/cast-auth';
import { supabase } from '@/lib/supabaseClient';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  ai_summary?: string;
  stores: Store[];
}

export default function CastManagement() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [openCastId, setOpenCastId] = useState<string | null>(null);

  // 初期ロード
  useEffect(() => {
    const loadData = async () => {
      const { data: castData, error: castError } = await supabase.from('casts').select(`
          id,
          name,
          manager_comment,
          is_active,
          catch_copy,
          ai_summary,
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
          ai_summary: c.ai_summary,
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
      await supabase
        .from('casts')
        .update({
          manager_comment: cast.manager_comment,
          is_active: cast.is_active,
          catch_copy: cast.catch_copy,
          ai_summary: cast.ai_summary,
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

  const handleDelete = async (castId: string, castName: string) => {
    // 1段階目の確認
    if (!confirm(`キャスト「${castName}」を完全に削除しますか？\nこの操作は取り消せません。`)) {
      return;
    }

    // 2段階目の確認（注意喚起含め）
    if (
      !confirm(
        `【最終確認】\n「${castName}」に関連するすべてのデータ（プロフィール、画像、口コミ、つぶやき、出勤情報、アカウント）が完全に消去され、二度と復元できません。\n本当に削除しますか？`,
      )
    ) {
      return;
    }

    try {
      const result = await deleteCastProfile(castId);
      if (result.success) {
        alert('キャストを削除しました');
        setCasts((prev) => prev.filter((c) => c.id !== castId));
        setOpenCastId(null);
      } else {
        alert(`削除に失敗しました: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('削除中にエラーが発生しました');
    }
  };

  const activeCasts = casts.filter((c) => c.is_active);
  const inactiveCasts = casts.filter((c) => !c.is_active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-4 text-cyan-100 sm:p-6">
      <h1 className="mb-6 text-2xl font-extrabold tracking-wider text-cyan-400 drop-shadow-lg sm:text-3xl">
        キャスト一覧
      </h1>

      {/* 在籍中 */}
      <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-cyan-300">
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
      <h2 className="mb-2 mt-8 flex items-center gap-2 text-lg font-semibold text-red-400">
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
          className={`flex w-full items-center justify-between px-4 py-3 text-left font-semibold transition ${
            cast.is_active ? 'text-cyan-200 hover:text-cyan-400' : 'text-red-400 hover:text-red-300'
          } `}
        >
          {cast.name}
          <span>{openCastId === cast.id ? '▲' : '▼'}</span>
        </button>

        {openCastId === cast.id && (
          <div className="space-y-4 border-t border-gray-700 bg-gray-950/50 px-4 pb-4 text-sm">
            {/* 在籍ステータス */}
            <div>
              <label className="mb-1 block font-medium">在籍ステータス</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cast.is_active}
                  onChange={(e) =>
                    setCasts((prev) =>
                      prev.map((c) =>
                        c.id === cast.id ? { ...c, is_active: e.target.checked } : c,
                      ),
                    )
                  }
                  className="h-4 w-4 accent-cyan-500"
                />
                <span>{cast.is_active ? '在籍中（公開）' : '非公開'}</span>
              </div>
            </div>

            {/* 所属店舗 */}
            <div>
              <label className="mb-1 block font-medium">所属店舗</label>
              <div className="flex flex-wrap gap-2">
                {stores.map((store) => {
                  const checked = cast.stores.some((s) => s.id === store.id);
                  return (
                    <label
                      key={store.id}
                      className={`cursor-pointer rounded border px-2 py-1 text-sm ${
                        checked
                          ? 'border-cyan-400 bg-cyan-600 text-white'
                          : 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                                : c,
                            ),
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
              <label className="mb-1 block font-medium">キャッチコピー</label>
              <input
                type="text"
                value={cast.catch_copy ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setCasts((prev) =>
                    prev.map((c) => (c.id === cast.id ? { ...c, catch_copy: value } : c)),
                  );
                }}
                className="w-full rounded border border-cyan-700/50 bg-gray-800 px-2 py-1 text-white focus:ring-2 focus:ring-cyan-400"
                placeholder="例: 究極の癒し系男子"
              />
            </div>

            {/* 店長コメント */}
            <div>
              <label className="mb-1 block font-medium">店長コメント</label>
              <textarea
                value={cast.manager_comment ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setCasts((prev) =>
                    prev.map((c) => (c.id === cast.id ? { ...c, manager_comment: value } : c)),
                  );
                }}
                className="w-full rounded border border-cyan-700/50 bg-gray-800 px-2 py-1 text-white focus:ring-2 focus:ring-cyan-400"
                placeholder="店長コメントを入力"
              />
            </div>

            {/* AI要約 */}
            <div className="rounded-lg border border-purple-500/30 bg-purple-900/10 p-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="font-bold text-purple-300">✨ AI口コミ要約</label>
                <button
                  onClick={async () => {
                    const { data: reviews, error } = await supabase
                      .from('reviews')
                      .select(
                        `
                        comment,
                        rating,
                        review_tag_links (
                          review_tag_master ( name )
                        )
                      `,
                      )
                      .eq('cast_id', cast.id);

                    if (error || !reviews) {
                      alert('口コミの取得に失敗しました');
                      return;
                    }

                    if (reviews.length === 0) {
                      alert('まだ口コミがありません');
                      return;
                    }

                    const reviewTexts = reviews
                      .map((r: any) => {
                        const tags = r.review_tag_links
                          ?.map((tl: any) => tl.review_tag_master?.name)
                          .filter(Boolean)
                          .join(', ');
                        return `【評価: ${r.rating}】${tags ? `[タグ: ${tags}] ` : ''}${r.comment}`;
                      })
                      .join('\n---\n');

                    const prompt = `以下のキャスト「${cast.name}」に対するお客様の口コミデータを元に、この方の魅力や人気の理由を2〜3文で親しみやすく要約してください。
ユーザーページに「AIによる口コミ要約」として掲載します。

口コミデータ:
${reviewTexts}
`;
                    // クリップボードにコピー
                    try {
                      await navigator.clipboard.writeText(prompt);
                      alert(
                        'AI分析用のプロンプトをクリップボードにコピーしました。\n外部AI（ChatGPT等）に貼り付けて要約を作成してください。',
                      );
                    } catch (err) {
                      console.error(err);
                      console.log('Prompt:', prompt);
                      alert('コピーに失敗しました。コンソールからプロンプトを確認してください。');
                    }
                  }}
                  className="rounded bg-purple-600 px-3 py-1 text-xs font-bold text-white hover:bg-purple-500"
                >
                  分析用プロンプト作成
                </button>
              </div>
              <textarea
                value={cast.ai_summary ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setCasts((prev) =>
                    prev.map((c) => (c.id === cast.id ? { ...c, ai_summary: value } : c)),
                  );
                }}
                className="h-24 w-full rounded border border-purple-700/50 bg-gray-800 px-2 py-1 text-sm text-white focus:ring-2 focus:ring-purple-400"
                placeholder="AIで生成した要約文をここに貼り付けてください"
              />
              <p className="mt-1 text-[10px] text-purple-300/60">
                ※この文章はユーザーページのプロフィール上部に表示されます。
              </p>
            </div>

            {/* 保存ボタン */}
            <button
              onClick={() => handleUpdate(cast)}
              className="mt-2 w-full rounded bg-cyan-600 px-3 py-2 font-semibold text-white shadow-lg shadow-cyan-400/40 hover:bg-cyan-500"
            >
              保存
            </button>

            {/* 削除ボタン */}
            <div className="mt-6 border-t border-red-900/30 pt-4">
              <button
                onClick={() => handleDelete(cast.id, cast.name)}
                className="flex w-full items-center justify-center gap-2 rounded border border-red-500/30 bg-red-900/30 px-3 py-2 font-semibold text-red-400 transition-colors hover:bg-red-600 hover:text-white"
              >
                <Trash2 size={16} />
                キャストを完全に削除する
              </button>
              <p className="mt-2 text-balance text-center text-[10px] text-red-500/70">
                ※プロフィール、口コミ、画像など、全データが削除され復元できません。
              </p>
            </div>
          </div>
        )}
      </>
    );
  }
}
