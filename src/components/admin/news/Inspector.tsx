import { stores } from '@/data/stores';
import { uploadNewsImage } from '@/lib/actions/news-pages';
import React from 'react';
import { toast } from 'sonner';
import { PageData, SectionData } from './types';

interface InspectorProps {
  section: SectionData | null;
  page: PageData | null;
  onUpdateSection: (data: SectionData) => void;
  onUpdatePage: (data: Partial<PageData>) => void;
  onDeleteSection: (id: string) => void;
}

const Inspector: React.FC<InspectorProps> = ({
  section,
  page,
  onUpdateSection,
  onUpdatePage,
  onDeleteSection,
}) => {
  // ... (Inspector function start)

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'section' | 'page',
    field: string = 'imageUrl',
  ) => {
    const file = e.target.files?.[0];
    if (!file || !page) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('pageId', page.id);

      const promise = uploadNewsImage(formData);

      toast.promise(promise, {
        loading: '画像をアップロード中...',
        success: 'アップロード完了',
        error: 'アップロード失敗',
      });

      const publicUrl = await promise;

      if (publicUrl) {
        if (target === 'section' && section) {
          onUpdateSection({
            ...section,
            content: { ...section.content, [field]: publicUrl },
          });
        } else if (target === 'page') {
          onUpdatePage({ [field]: publicUrl });
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('画像のアップロードに失敗しました');
    }
  };

  // ページ全体の設定
  if (!section) {
    if (!page) return null;
    return (
      <div className="flex h-full w-full shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl md:w-80 md:p-8">
        <h3 className="mb-8 flex items-center gap-3 text-base font-black text-slate-900">
          <div className="rounded-xl bg-rose-500 p-2 text-white shadow-lg">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          ページ設定
        </h3>
        <div className="space-y-8">
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-900">
              ページタイトル
            </label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => onUpdatePage({ title: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              placeholder="ダッシュボード用タイトル"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-900">
              URLスラッグ
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500">/news/</span>
              <input
                type="text"
                value={page.slug}
                onChange={(e) => onUpdatePage({ slug: e.target.value })}
                className="flex-1 rounded-2xl border border-slate-200 p-3 text-xs font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                placeholder="url-slug"
              />
            </div>
            <p className="mt-2 text-[9px] font-medium text-slate-500">
              URLの一部として使用されます（例: www.sutoroberrys.jp/news/url-slug）
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-900">
              配信対象店舗ごとの設定
            </label>
            <div className="flex flex-col gap-3">
              {Object.values(stores).map((store) => {
                const isSelected = page.targetStoreSlugs?.includes(store.id);
                // storeSettings から対象店舗の設定を取得（無ければ初期値）
                const storeSetting = page.storeSettings?.[store.id] || { status: 'private', publishedAt: null };
                const isPublished = storeSetting.status === 'published';

                return (
                  <div key={store.id} className={`rounded-2xl border p-4 transition-all shadow-sm ${isSelected ? 'border-rose-200 bg-rose-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const current = page.targetStoreSlugs || [];
                            const next = e.target.checked
                              ? [...current, store.id]
                              : current.filter((s) => s !== store.id);
                            onUpdatePage({ targetStoreSlugs: next });
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700">{store.emoji} {store.displayName}</span>
                      </label>
                      {isSelected && (
                        <select
                          value={storeSetting.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as 'published' | 'private';
                            const newSettings = { ...(page.storeSettings || {}) };
                            if (!newSettings[store.id]) {
                              newSettings[store.id] = { status: newStatus, publishedAt: newStatus === 'published' ? new Date().toISOString() : null };
                            } else {
                              newSettings[store.id] = {
                                ...newSettings[store.id],
                                status: newStatus,
                                // 初めて公開にする時は現在時刻をセット、それ以外は元の時間を維持
                                publishedAt: newStatus === 'published' && !newSettings[store.id].publishedAt ? new Date().toISOString() : newSettings[store.id].publishedAt
                              };
                            }
                            onUpdatePage({ storeSettings: newSettings });
                          }}
                          className={`rounded-xl border px-3 py-1.5 text-[10px] font-bold outline-none cursor-pointer ${
                            isPublished ? 'border-green-300 bg-green-50 text-green-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                          }`}
                        >
                          <option value="private">非公開</option>
                          <option value="published">公開中</option>
                        </select>
                      )}
                    </div>
                    {isSelected && (
                      <div className="pl-7 mt-3 border-t border-rose-100 pt-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 block">公開日時</label>
                        <input
                          type="datetime-local"
                          value={storeSetting.publishedAt ? new Date(new Date(storeSetting.publishedAt).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''}
                          onChange={(e) => {
                            const newDateISO = e.target.value ? new Date(e.target.value).toISOString() : null;
                            const newSettings = { ...(page.storeSettings || {}) };
                            if (!newSettings[store.id]) {
                              newSettings[store.id] = { status: 'private', publishedAt: newDateISO };
                            } else {
                              newSettings[store.id] = { ...newSettings[store.id], publishedAt: newDateISO };
                            }
                            onUpdatePage({ storeSettings: newSettings });
                          }}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-700 outline-none transition-colors focus:border-rose-400 disabled:opacity-50 disabled:bg-slate-50"
                        />
                        <p className="mt-1.5 text-[9px] text-slate-400">
                          {isPublished ? 'この日時が新しいほど一覧の上に表示されます。' : '状態を「公開中」にすると日付セット・表示が有効になります。'}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-900">
              一覧用サムネイル
            </label>
            <p className="mb-3 text-[10px] leading-tight text-slate-400">
              ダッシュボードで表示される画像です。未設定時はHero画像が表示されます。
            </p>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50">
              {page.thumbnailUrl ? (
                <img src={page.thumbnailUrl} className="h-full w-full object-cover" alt="" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                  <svg
                    className="mb-2 h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-[10px] font-black">クリックして設定</span>
                </div>
              )}
              <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <svg className="mb-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-[11px] font-black">画像をアップロード</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'page', 'thumbnailUrl')}
                />
              </label>
              {page.thumbnailUrl && (
                <button
                  onClick={() => onUpdatePage({ thumbnailUrl: '' })}
                  className="absolute right-4 top-4 transform rounded-full bg-white/90 p-2 text-red-500 shadow-lg transition-all hover:bg-white active:scale-90"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-900">
              一覧用の簡単な説明文
            </label>
            <textarea
              value={page.shortDescription || ''}
              onChange={(e) => onUpdatePage({ shortDescription: e.target.value })}
              className="h-32 w-full rounded-[1.5rem] border border-slate-200 p-4 text-xs font-bold leading-relaxed text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              placeholder="制作したページの内容を一言で説明しましょう。ユーザーが一覧から選ぶ際のヒントになります。"
            />
            <p className="mt-2 text-right text-[9px] font-black text-slate-400">
              {page.shortDescription?.length || 0} 文字
            </p>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-900">
              タグ設定（ハッシュタグ）
            </label>
            <div className="flex flex-wrap gap-2">
              {(page.tags || []).map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600"
                >
                  #{tag}
                  <button
                    onClick={() => {
                      const next = (page.tags || []).filter((_, i) => i !== idx);
                      onUpdatePage({ tags: next });
                    }}
                    className="hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="タグを追加してEnter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = e.currentTarget.value.trim().replace(/^#/, '');
                    if (val && !(page.tags || []).includes(val)) {
                      onUpdatePage({ tags: [...(page.tags || []), val] });
                      e.currentTarget.value = '';
                    }
                  }
                }}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold outline-none focus:border-rose-400"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // セクション個別の設定
  const handleFieldChange = (field: string, value: any) => {
    onUpdateSection({ ...section, content: { ...section.content, [field]: value } });
  };

  const hasImage = ['hero', 'campaign', 'cast_list', 'ranking', 'gallery'].includes(section.type);

  return (
    <div className="flex h-full w-full shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl md:w-80 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-base font-black text-slate-900">セクション編集</h3>
        <button
          onClick={() => onDeleteSection(section.id)}
          className="transform rounded-xl bg-red-50 p-2 text-red-400 shadow-sm transition-all hover:bg-red-500 hover:text-white active:scale-90"
          title="このレイヤーを削除"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-900">
            見出しタイトル
          </label>
          <input
            type="text"
            value={section.content.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-rose-100"
          />
        </div>
        {hasImage && section.type !== 'gallery' && (
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-900">
              メイン画像
            </label>
            <div className="group relative aspect-video overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
              {section.content.imageUrl ? (
                <img src={section.content.imageUrl} className="h-full w-full object-cover" alt="" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  No Image
                </div>
              )}
              <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  画像をアップロード
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'section', 'imageUrl')}
                />
              </label>
            </div>
          </div>
        )}
        {['hero', 'campaign', 'cast_list'].includes(section.type) && (
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-900">
              サブテキスト / ラベル
            </label>
            <input
              type="text"
              value={section.content.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        )}
        {section.type !== 'gallery' && (
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-900">
              説明文 / ボディコピー
            </label>
            <textarea
              value={section.content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="h-40 w-full rounded-xl border border-slate-200 p-4 text-xs font-bold leading-relaxed text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        )}
        {['hero', 'campaign', 'cast_list', 'cta'].includes(section.type) && (
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-900">
              アクションボタン文言
            </label>
            <input
              type="text"
              value={section.content.buttonText || ''}
              onChange={(e) => handleFieldChange('buttonText', e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:ring-2 focus:ring-rose-100"
            />
          </div>
        )}

        {/* List items for sections like ranking and gallery */}
        {['ranking', 'gallery', 'sns_links', 'price'].includes(section.type) && (
          <div>
            <label className="mb-4 block text-[10px] font-black uppercase tracking-widest text-slate-900">
              リスト項目設定
            </label>
            <div className="space-y-4">
              {section.content.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-900">項目 {index + 1}</span>
                    <button
                      onClick={() => {
                        const newItems = [...(section.content.items || [])];
                        newItems.splice(index, 1);
                        handleFieldChange('items', newItems);
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Dynamic item fields based on section type */}
                  <div className="space-y-3">
                    {['ranking', 'gallery', 'price'].includes(section.type) && (
                      <div className="group relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-white shadow-inner">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} className="h-full w-full object-cover" alt="" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] font-bold text-slate-400">
                            No Image
                          </div>
                        )}
                        <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="text-[9px] font-black">変更</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file || !page) return;
                              const formData = new FormData();
                              formData.append('file', file);
                              formData.append('pageId', page.id);
                              const publicUrl = await uploadNewsImage(formData);
                              if (publicUrl) {
                                const newItems = [...(section.content.items || [])];
                                newItems[index] = { ...item, imageUrl: publicUrl };
                                handleFieldChange('items', newItems);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}

                    {['ranking', 'price', 'sns_links'].includes(section.type) && (
                      <input
                        type="text"
                        value={item.name || ''}
                        onChange={(e) => {
                          const newItems = [...(section.content.items || [])];
                          newItems[index] = { ...item, name: e.target.value };
                          handleFieldChange('items', newItems);
                        }}
                        className="w-full rounded-lg border border-slate-200 p-2 text-[11px] font-bold text-slate-900 outline-none placeholder:text-slate-300"
                        placeholder={
                          section.type === 'sns_links' ? 'プラットフォーム名' : '名前 / ラベル'
                        }
                        readOnly={section.type === 'sns_links'}
                      />
                    )}

                    {section.type === 'sns_links' && (
                      <input
                        type="text"
                        value={item.url || ''}
                        onChange={(e) => {
                          const newItems = [...(section.content.items || [])];
                          newItems[index] = { ...item, url: e.target.value };
                          handleFieldChange('items', newItems);
                        }}
                        className="w-full rounded-lg border border-slate-200 p-2 text-[11px] font-bold text-slate-900 outline-none placeholder:text-slate-300"
                        placeholder="URL (https://...)"
                      />
                    )}

                    {section.type === 'price' && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.time || ''}
                          onChange={(e) => {
                            const newItems = [...(section.content.items || [])];
                            newItems[index] = { ...item, time: e.target.value };
                            handleFieldChange('items', newItems);
                          }}
                          className="w-16 rounded-lg border border-slate-200 p-2 text-[11px] font-bold text-slate-900 outline-none"
                          placeholder="分"
                        />
                        <input
                          type="text"
                          value={item.price || ''}
                          onChange={(e) => {
                            const newItems = [...(section.content.items || [])];
                            newItems[index] = { ...item, price: e.target.value };
                            handleFieldChange('items', newItems);
                          }}
                          className="flex-1 rounded-lg border border-slate-200 p-2 text-[11px] font-bold text-slate-900 outline-none"
                          placeholder="料金 (¥)"
                        />
                      </div>
                    )}

                    {['ranking', 'price'].includes(section.type) && (
                      <textarea
                        value={item.text || item.description || ''}
                        onChange={(e) => {
                          const newItems = [...(section.content.items || [])];
                          newItems[index] = {
                            ...item,
                            [section.type === 'price' ? 'description' : 'text']: e.target.value,
                          };
                          handleFieldChange('items', newItems);
                        }}
                        className="w-full rounded-lg border border-slate-200 p-2 text-[11px] font-medium text-slate-900 outline-none"
                        placeholder="説明文"
                      />
                    )}
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  let newItem;
                  if (section.type === 'price') {
                    newItem = {
                      name: 'New Menu',
                      time: '60',
                      price: '10,000',
                      description: '説明を入力',
                    };
                  } else if (section.type === 'sns_links') {
                    newItem = { name: 'Instagram', url: '' };
                  } else {
                    newItem = { name: 'Item Name', text: '説明を入力', imageUrl: '' };
                  }
                  handleFieldChange('items', [...(section.content.items || []), newItem]);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-[10px] font-black text-slate-500 transition-all hover:border-rose-400 hover:bg-rose-50 hover:text-rose-600"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                項目を追加
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inspector;
