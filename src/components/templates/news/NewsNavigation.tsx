'use client';

import { PageData } from '@/components/admin/news/types';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NewsNavigationProps {
  currentPage: PageData;
  prevPage?: PageData;
  nextPage?: PageData;
  relatedPages: PageData[];
  recommendedPages: PageData[];
  storeSlug: string;
}

const NewsNavigation: React.FC<NewsNavigationProps> = ({
  currentPage,
  prevPage,
  nextPage,
  relatedPages,
  recommendedPages,
  storeSlug,
}) => {
  return (
    <div className="mx-auto max-w-2xl space-y-16 px-6 py-12">
      {/* Prev / Next */}
      <div className="flex flex-col gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center">
        {prevPage && (
          <Link
            href={`/store/${storeSlug}/news/${prevPage.slug}`}
            className="group flex flex-1 items-start gap-4 rounded-xl p-4 transition-colors hover:bg-slate-50"
          >
            <ChevronLeft className="mt-1 h-5 w-5 text-slate-400" />
            <div className="flex-1">
              <span className="text-[10px] font-bold text-slate-400">前の記事</span>
              <h4 className="mt-1 line-clamp-2 text-sm font-bold text-slate-700 group-hover:text-slate-900">
                {prevPage.title}
              </h4>
            </div>
          </Link>
        )}
        <div className="hidden h-12 w-px bg-slate-100 sm:block" />
        {nextPage && (
          <Link
            href={`/store/${storeSlug}/news/${nextPage.slug}`}
            className="group flex flex-1 items-start gap-4 rounded-xl p-4 text-right transition-colors hover:bg-slate-50"
          >
            <div className="flex-1">
              <span className="text-[10px] font-bold text-slate-400">次の記事</span>
              <h4 className="mt-1 line-clamp-2 text-sm font-bold text-slate-700 group-hover:text-slate-900">
                {nextPage.title}
              </h4>
            </div>
            <div className="mt-1 rotate-180">
              <ChevronLeft className="h-5 w-5 text-slate-400" />
            </div>
          </Link>
        )}
      </div>

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
