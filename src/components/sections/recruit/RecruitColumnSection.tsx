import React from 'react';
import Link from 'next/link';
import { getPublishedRecruitColumns } from '@/lib/actions/recruit-column';
import { PageData } from '@/components/admin/news/types';

interface RecruitColumnSectionProps {
  initialColumns?: PageData[];
}

export default async function RecruitColumnSection({ initialColumns }: RecruitColumnSectionProps) {
  const columns = initialColumns || (await getPublishedRecruitColumns());

  // 公開記事が0本の場合は完全非表示 (DOM未出力)
  if (!columns || columns.length === 0) {
    return null;
  }

  const displayColumns = columns.slice(0, 3);

  return (
    <section className="bg-slate-900 py-16 text-slate-100 border-t border-slate-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-amber-400/10 px-3.5 py-1 text-xs font-bold tracking-widest text-amber-400 border border-amber-400/20 mb-2">
            COLUMN
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            セラピスト求人コラム
          </h2>
          <p className="mt-2 text-xs text-slate-400 sm:text-sm">
            お仕事内容や研修の疑問・ご不安を解消する解説コラムをご用意しています。
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayColumns.map((col) => {
            const articleUrl = `/recruit/column/${col.slug}`;
            const publishedDate = new Date(col.updatedAt);
            const dateStr = publishedDate.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <article
                key={col.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50"
              >
                <Link href={articleUrl} className="relative aspect-[16/10] overflow-hidden bg-slate-700">
                  {col.thumbnailUrl ? (
                    <img
                      src={col.thumbnailUrl}
                      alt={col.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800 text-amber-400 text-xs font-bold">
                      RECRUIT COLUMN
                    </div>
                  )}
                </Link>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                      <span className="font-semibold text-amber-400">求人コラム</span>
                      <time dateTime={publishedDate.toISOString()}>{dateStr}</time>
                    </div>

                    <h3 className="text-sm font-bold leading-snug text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      <Link href={articleUrl}>{col.title}</Link>
                    </h3>

                    {col.shortDescription && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">
                        {col.shortDescription}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-end">
                    <Link
                      href={articleUrl}
                      className="inline-flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform"
                    >
                      コラムを読む <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/recruit/column"
            className="inline-flex items-center rounded-full bg-amber-500 px-8 py-3 text-xs font-bold text-slate-950 shadow-md transition-all hover:bg-amber-400 hover:scale-105"
          >
            コラム一覧を見る <span className="ml-2 font-normal">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
