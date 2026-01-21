import React from 'react';
import { PageData } from './types';

interface NewsDashboardProps {
  pages: PageData[];
  onCreatePage: () => void;
  onEditPage: (id: string) => void;
  onDeletePage: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const NewsDashboard: React.FC<NewsDashboardProps> = ({
  pages,
  onCreatePage,
  onEditPage,
  onDeletePage,
  onToggleStatus,
}) => {
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
                    <span className="scale-90 transform rounded-full bg-white px-8 py-3 text-sm font-black text-slate-900 shadow-2xl transition-transform group-hover:scale-100">
                      編集する
                    </span>
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
    </div>
  );
};

export default NewsDashboard;
