'use client';

import { PageData } from '@/components/admin/news/types';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NewsNavigationProps {
  currentPage: PageData;
  prevPage?: PageData;
  nextPage?: PageData;
  relatedPages: PageData[];
  recommendedPages: PageData[];
  storeSlug: string;
  showListButton?: boolean;
}

const NewsNavigation: React.FC<NewsNavigationProps> = ({
  currentPage,
  prevPage,
  nextPage,
  relatedPages,
  recommendedPages,
  storeSlug,
  showListButton = true,
}) => {
  return (
    <div className="mx-auto max-w-2xl space-y-16 px-6 py-12">
      {/* Prev / Next Article Navigation (note.com style) */}
      <nav className="border-y border-dashed border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Previous */}
          <div className="flex min-h-[100px] items-center border-b border-dashed border-slate-100 sm:border-b-0 sm:border-r">
            {prevPage ? (
              <Link
                href={`/store/${storeSlug}/news/${prevPage.slug}`}
                className="group flex w-full items-center gap-4 px-6 py-5 transition-colors hover:bg-slate-50"
              >
                <ChevronLeft className="h-6 w-6 shrink-0 text-slate-300 transition-colors group-hover:text-slate-600" />
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-bold tracking-wider text-slate-400">
                    前の記事
                  </span>
                  <h4 className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-slate-800 group-hover:text-rose-500">
                    {prevPage.title}
                  </h4>
                </div>
              </Link>
            ) : (
              <div className="w-full px-6 py-5" />
            )}
          </div>

          {/* Next */}
          <div className="flex min-h-[100px] items-center">
            {nextPage ? (
              <Link
                href={`/store/${storeSlug}/news/${nextPage.slug}`}
                className="group flex w-full items-center gap-4 px-6 py-5 transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-left text-xs font-bold tracking-wider text-slate-400 sm:text-right">
                    次の記事
                  </span>
                  <h4 className="mt-1 line-clamp-2 text-left text-[15px] font-bold leading-snug text-slate-800 group-hover:text-rose-500 sm:text-right">
                    {nextPage.title}
                  </h4>
                </div>
                <ChevronRight className="h-6 w-6 shrink-0 text-slate-300 transition-colors group-hover:text-rose-600" />
              </Link>
            ) : (
              <div className="w-full px-6 py-5" />
            )}
          </div>
        </div>
      </nav>

      {/* Recommended (Pickup) */}
      {recommendedPages.length > 0 && (
        <section>
          <h3 className="mb-6 text-lg font-bold text-slate-900">ピックアップされています</h3>
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
            {recommendedPages.map((page) => (
              <Link
                key={page.id}
                href={`/store/${storeSlug}/news/${page.slug}`}
                className="group relative w-64 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-full flex-col justify-between gap-4">
                  <h4 className="text-md line-clamp-2 font-bold leading-snug text-slate-800 group-hover:text-rose-500">
                    {page.title}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">おすすめ記事</span>
                  </div>
                </div>
                {page.thumbnailUrl && (
                  <div className="absolute bottom-6 right-4 h-12 w-16 overflow-hidden rounded-lg">
                    <img
                      src={page.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover opacity-60"
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
          {showListButton && (
            <div className="mt-8 text-center">
              <Link
                href={`/store/${storeSlug}/news`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-10 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:shadow-sm"
              >
                ニュース一覧を見る
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Other Posts by Creator (Related) */}
      {relatedPages.length > 0 && (
        <section>
          <h3 className="mb-8 text-lg font-bold text-slate-900">この店舗の他の記事</h3>
          <div className="space-y-8">
            {relatedPages.map((page) => (
              <Link
                key={page.id}
                href={`/store/${storeSlug}/news/${page.slug}`}
                className="group flex items-center justify-between gap-6"
              >
                <div className="flex-1 space-y-2">
                  <h4 className="text-md font-bold leading-tight text-slate-800 transition-colors group-hover:text-rose-500">
                    {page.title}
                  </h4>
                  <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
                    <span>{new Date(page.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {page.thumbnailUrl && (
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                    <img src={page.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  </div>
                )}
              </Link>
            ))}
            <div className="pt-4 text-center">
              <Link
                href={`/store/${storeSlug}/news`}
                className="text-sm font-bold text-slate-400 transition-colors hover:text-slate-600"
              >
                もっとみる
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsNavigation;
