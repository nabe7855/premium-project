import React from 'react';

export const DiaryDetailSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto animate-pulse px-3 py-4 sm:px-4 sm:py-6 md:py-8">
      {/* 読了バーのダミー */}
      <div className="fixed left-0 right-0 top-0 z-[100] h-1 bg-gray-100" />

      {/* パンくずリスト */}
      <div className="mb-4 flex gap-2 pt-4">
        <div className="h-4 w-12 rounded bg-gray-200" />
        <div className="h-4 w-4 rounded bg-gray-100" />
        <div className="h-4 w-16 rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* メイン記事エリア */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className="aspect-[4/3] w-full bg-gray-100 sm:aspect-[16/9]" />
            <div className="p-4 sm:p-8">
              <div className="mb-4 h-8 w-3/4 rounded-lg bg-gray-200 sm:h-10" />
              <div className="mb-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200" />
                <div className="h-4 w-32 rounded bg-gray-200" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-5/6 rounded bg-gray-100" />
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-2/3 rounded bg-gray-100" />
              </div>
            </div>
          </div>

          {/* キャストカードのダミー */}
          <div className="rounded-2xl bg-gray-100 p-6 h-48" />
        </div>

        {/* サイドバー */}
        <div className="hidden space-y-6 lg:block">
          <div className="h-64 rounded-2xl bg-gray-100" />
          <div className="h-32 rounded-2xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
};
