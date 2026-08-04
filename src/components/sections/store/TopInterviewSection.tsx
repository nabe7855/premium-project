import React from 'react';
import Link from 'next/link';

export interface TopInterviewItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  thumbnail_url?: string | null;
  published_at?: Date | string | null;
  created_at: Date | string;
  interview_meta?: any;
}

interface TopInterviewSectionProps {
  storeSlug: string;
  articles?: TopInterviewItem[];
}

export default function TopInterviewSection({ storeSlug, articles = [] }: TopInterviewSectionProps) {
  // 公開中のインタビュー記事が0本の場合は完全非表示（空セクション・メッセージ表示禁止）
  if (!articles || articles.length === 0) {
    return null;
  }

  const displayArticles = articles.slice(0, 3);

  return (
    <section className="relative bg-gradient-to-b from-white via-rose-50/30 to-white py-12 sm:py-16 border-t border-rose-100/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* セクションヘッダー */}
        <div className="mb-8 text-center sm:mb-12">
          <span className="inline-block rounded-full bg-rose-100 px-3.5 py-1 text-xs font-bold tracking-widest text-rose-600 mb-2">
            INTERVIEW
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-serif">
            セラピストインタビュー
          </h2>
          <p className="mt-2 text-xs text-slate-500 sm:text-sm">
            施術のこだわりや人柄など、セラピストの素顔をご紹介します。
          </p>
        </div>

        {/* 記事カードグリッド */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayArticles.map((article) => {
            const meta = article.interview_meta;
            const castLink = meta?.cast_links?.[0];
            const castName = castLink?.cast_name || 'セラピスト';
            const castSlug = castLink?.cast_id || castLink?.cast_name_romaji || 'unknown';
            const articleUrl = `/store/${storeSlug}/interview/${castSlug}/${article.slug}`;

            const pubDate = article.published_at ? new Date(article.published_at) : new Date(article.created_at);
            const dateStr = pubDate.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <article
                key={article.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-slate-100/80"
              >
                <Link href={articleUrl} className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {article.thumbnail_url ? (
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-rose-50 text-rose-300 text-xs font-semibold">
                      INTERVIEW
                    </div>
                  )}
                  {meta?.vol_number != null && (
                    <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                      Vol.{meta.vol_number}
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-rose-500">{castName}</span>
                      <time dateTime={pubDate.toISOString()}>{dateStr}</time>
                    </div>

                    <h3 className="text-sm font-bold leading-snug text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                      <Link href={articleUrl}>{article.title}</Link>
                    </h3>

                    {article.excerpt && (
                      <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <Link
                      href={articleUrl}
                      className="inline-flex items-center text-xs font-bold text-rose-500 group-hover:translate-x-1 transition-transform"
                    >
                      詳しく読む <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* 一覧ページへのリンクボタン */}
        <div className="mt-8 text-center sm:mt-12">
          <Link
            href={`/store/${storeSlug}/interview`}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-3 text-sm font-bold text-white shadow-md shadow-rose-200 transition-all hover:opacity-90 hover:shadow-lg hover:scale-[1.02]"
          >
            インタビュー一覧を見る <span className="ml-2 font-normal">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
