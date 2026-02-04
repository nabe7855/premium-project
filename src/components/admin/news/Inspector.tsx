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
      <div className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white p-8 shadow-2xl">
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
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
              ページタイトル
            </label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => onUpdatePage({ title: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs font-bold outline-none transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              placeholder="ダッシュボード用タイトル"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
              URLスラッグ
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400">/news/</span>
              <input
                type="text"
                value={page.slug}
                onChange={(e) => onUpdatePage({ slug: e.target.value })}
                className="flex-1 rounded-2xl border border-slate-200 p-3 text-xs font-bold outline-none transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                placeholder="url-slug"
              />
            </div>
            <p className="mt-2 text-[9px] text-slate-400">
              URLの一部として使用されます（例: strawberry-boy.com/news/url-slug）
            </p>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
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
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
              一覧用の簡単な説明文
            </label>
            <textarea
              value={page.shortDescription || ''}
              onChange={(e) => onUpdatePage({ shortDescription: e.target.value })}
              className="h-32 w-full rounded-[1.5rem] border border-slate-200 p-4 text-xs font-medium leading-relaxed outline-none transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              placeholder="制作したページの内容を一言で説明しましょう。ユーザーが一覧から選ぶ際のヒントになります。"
            />
            <p className="mt-2 text-right text-[9px] text-slate-300">
              {page.shortDescription?.length || 0} 文字
            </p>
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
    <div className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-l border-slate-200 bg-white p-8 shadow-2xl">
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
          <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
            見出しタイトル
          </label>
          <input
            type="text"
            value={section.content.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold outline-none transition-all focus:ring-2 focus:ring-rose-100"
          />
        </div>
        {hasImage && section.type !== 'gallery' && (
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
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
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
              サブテキスト / ラベル
            </label>
            <input
              type="text"
              value={section.content.subtitle || ''}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none transition-all focus:ring-2 focus:ring-rose-100"
            />
          </div>
        )}
        {section.type !== 'gallery' && (
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
              説明文 / ボディコピー
            </label>
            <textarea
              value={section.content.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="h-40 w-full rounded-xl border border-slate-200 p-4 text-xs leading-relaxed outline-none transition-all focus:ring-2 focus:ring-rose-100"
            />
          </div>
        )}
        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-400">
            アクションボタン文言
          </label>
          <input
            type="text"
            value={section.content.buttonText || ''}
            onChange={(e) => handleFieldChange('buttonText', e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-xs font-bold outline-none transition-all focus:ring-2 focus:ring-rose-100"
          />
        </div>
      </div>
    </div>
  );
};

export default Inspector;
