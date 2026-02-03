import { uploadNewsImage } from '@/lib/actions/news-pages';
import { getAllStores } from '@/lib/store/store-data';
import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { PageData } from './types';

interface NewsDashboardProps {
  pages: PageData[];
  onCreatePage: () => void;
  onEditPage: (id: string) => void;
  onDeletePage: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onUpdatePage: (id: string, data: Partial<PageData>) => void;
}

const NewsDashboard: React.FC<NewsDashboardProps> = ({
  pages,
  onCreatePage,
  onEditPage,
  onDeletePage,
  onToggleStatus,
  onUpdatePage,
}) => {
  const [editingPage, setEditingPage] = useState<PageData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stores = getAllStores();

  const handleQuickEditSave = () => {
    if (!editingPage) return;
    onUpdatePage(editingPage.id, {
      title: editingPage.title,
      shortDescription: editingPage.shortDescription,
      thumbnailUrl: editingPage.thumbnailUrl,
    });
    setEditingPage(null);
    toast.success('基本情報を更新しました');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPage) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pageId', editingPage.id);

    try {
      const url = await uploadNewsImage(formData);
      if (url) {
        setEditingPage({ ...editingPage, thumbnailUrl: url });
        toast.success('画像をアップロードしました');
      } else {
        toast.error('アップロードに失敗しました');
      }
    } catch (err) {
      toast.error('エラーが発生しました');
    } finally {
      setIsUploading(false);
    }
  };

  const handleStoreToggle = (pageId: string, currentStores: string[], storeSlug: string) => {
    const nextStores = currentStores.includes(storeSlug)
      ? currentStores.filter((s) => s !== storeSlug)
      : [...currentStores, storeSlug];
    onUpdatePage(pageId, { targetStoreSlugs: nextStores });
  };
  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-rose-500">
              Luxury CMS Dashboard
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">制作ページ一覧</h1>
          </div>
          <button
            onClick={onCreatePage}
            className="flex transform items-center gap-2 rounded-2xl bg-slate-900 px-8 py-3 font-bold text-white shadow-xl transition-all hover:bg-rose-600 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            新規ページ作成
          </button>
        </div>

        {pages.length === 0 ? (
          <div className="rounded-[3rem] border-2 border-dashed border-slate-200 bg-white p-20 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
              <svg
                className="h-10 w-10 text-slate-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <p className="font-medium text-slate-400">作成されたページはまだありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <div
                key={page.id}
                className="group flex flex-col overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-sm transition-all duration-500 hover:shadow-2xl"
              >
                <div
                  className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-slate-100"
                  onClick={() => onEditPage(page.id)}
                >
                  {page.thumbnailUrl ||
                  page.sections.find((s) => s.type === 'hero')?.content.imageUrl ? (
                    <img
                      src={
                        page.thumbnailUrl ||
                        page.sections.find((s) => s.type === 'hero')?.content.imageUrl
                      }
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={page.title}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      No Thumbnail
                    </div>
                  )}
                  <div className="absolute right-6 top-6">
                    <span
                      className={`rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${page.status === 'published' ? 'bg-green-500/90 text-white' : 'bg-slate-700/80 text-white'}`}
                    >
                      {page.status === 'published' ? '公開中' : '非公開'}
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPage(page.id);
                        }}
                        className="scale-90 transform rounded-full bg-white px-8 py-3 text-sm font-black text-slate-900 shadow-2xl transition-transform hover:bg-rose-500 hover:text-white group-hover:scale-100"
                      >
                        エディタを開く
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPage(page);
                        }}
                        className="scale-90 transform rounded-full bg-slate-900/80 px-8 py-3 text-sm font-black text-white shadow-2xl backdrop-blur-md transition-transform hover:bg-rose-500 group-hover:scale-100"
                      >
                        基本情報を編集
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-10">
                  <h3 className="mb-3 truncate text-2xl font-black tracking-tight text-slate-900">
                    {page.title}
                  </h3>
                  <p className="mb-6 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-relaxed text-slate-400">
                    {page.shortDescription ||
                      '説明文が設定されていません。編集画面から設定できます。'}
                  </p>
                  <div className="mb-8 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      最終更新:
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {new Date(page.updatedAt).toLocaleDateString()}{' '}
                      {new Date(page.updatedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {/* Store Selection */}
                  <div className="mb-6 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      表示対象店舗:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {stores.map((store) => {
                        const isSelected = (page.targetStoreSlugs || []).includes(store.slug);
                        return (
                          <button
                            key={store.slug}
                            onClick={() =>
                              handleStoreToggle(page.id, page.targetStoreSlugs || [], store.slug)
                            }
                            className={`rounded-xl px-3 py-1.5 text-[10px] font-bold transition-all ${
                              isSelected
                                ? 'bg-rose-500 text-white shadow-md'
                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                            }`}
                          >
                            {store.city}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-8">
                    <button
                      onClick={() => onToggleStatus(page.id)}
                      className="flex items-center gap-2 text-xs font-bold text-slate-400 transition-colors hover:text-rose-500"
                    >
                      {page.status === 'published' ? (
                        <>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                            />
                          </svg>
                          非公開にする
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          公開する
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('本当に削除しますか？')) onDeletePage(page.id);
                      }}
                      className="flex items-center gap-2 text-xs font-bold text-red-300 transition-colors hover:text-red-500"
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
                          strokeWidth={2.5}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Edit Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-[3rem] bg-white shadow-2xl duration-300 animate-in fade-in zoom-in">
            <div className="relative p-10">
              <button
                onClick={() => setEditingPage(null)}
                className="absolute right-8 top-8 text-slate-400 hover:text-slate-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="mb-8 text-2xl font-black text-slate-900">基本情報の編集</h2>

              <div className="space-y-6">
                {/* Thumbnail Edit */}
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    サムネイル画像
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative aspect-video cursor-pointer overflow-hidden rounded-2xl bg-slate-100 transition-all hover:ring-4 hover:ring-rose-500/20"
                  >
                    {editingPage.thumbnailUrl ? (
                      <img
                        src={editingPage.thumbnailUrl}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold text-slate-400">
                        クリックして画像をアップロード
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-xs font-bold text-white">画像を変更する</span>
                    </div>
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                {/* Title Edit */}
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    タイトル
                  </label>
                  <input
                    type="text"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full rounded-2xl bg-slate-50 px-6 py-4 font-bold text-slate-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                    placeholder="ページタイトルを入力"
                  />
                </div>

                {/* Description Edit */}
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    簡単な説明
                  </label>
                  <textarea
                    value={editingPage.shortDescription || ''}
                    onChange={(e) =>
                      setEditingPage({ ...editingPage, shortDescription: e.target.value })
                    }
                    className="h-32 w-full resize-none rounded-2xl bg-slate-50 px-6 py-4 font-medium text-slate-600 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-rose-500/10"
                    placeholder="一覧に表示される説明文を入力"
                  />
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  onClick={() => setEditingPage(null)}
                  className="flex-1 rounded-2xl py-4 font-bold text-slate-400 transition-colors hover:bg-slate-50"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleQuickEditSave}
                  className="flex-1 rounded-2xl bg-rose-500 py-4 font-bold text-white shadow-lg shadow-rose-500/30 transition-all hover:bg-rose-600 active:scale-95"
                >
                  保存する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDashboard;
