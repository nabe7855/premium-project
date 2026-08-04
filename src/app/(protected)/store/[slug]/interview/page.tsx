import { Metadata } from 'next';
import { getInterviewArticles } from '@/lib/actions/interview';
import { getStoreData } from '@/lib/store/store-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const storeData = await getStoreData(slug);
  if (!storeData) return { title: 'Not Found' };

  const { articles } = await getInterviewArticles({ area: slug });
  if (!articles || articles.length === 0) {
    return { title: 'Not Found' };
  }

  const title = `セラピストインタビュー｜${storeData.name}`;
  const description = `${storeData.name}所属セラピストのインタビュー一覧。施術のこだわり、人柄、プライベートの素顔までマンツーマン取材でご紹介します。`;
  const canonicalUrl = `https://www.sutoroberrys.jp/store/${slug}/interview`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function StoreInterviewHubPage({ params }: Props) {
  const { slug } = params;
  const storeData = await getStoreData(slug);
  if (!storeData) notFound();

  // その店舗の公開済みインタビューを取得（0本の場合は404）
  const { articles: rawArticles } = await getInterviewArticles({ area: slug });
  const articles = (rawArticles || []).filter((a): a is NonNullable<typeof a> => a !== null);
  if (articles.length === 0) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `セラピストインタビュー｜${storeData.name}`,
    description: '施術のこだわりや人柄など、セラピストの素顔をインタビューでご紹介します。',
    url: `https://www.sutoroberrys.jp/store/${slug}/interview`,
    itemListElement: articles.map((article, idx) => {
      const meta = article.interview_meta as any;
      const castLink = meta?.cast_links?.[0];
      const castSlug = castLink?.cast_id || castLink?.cast_name_romaji || 'unknown';
      return {
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://www.sutoroberrys.jp/store/${slug}/interview/${castSlug}/${article.slug}`,
        name: article.title,
      };
    }),
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] pb-16 pt-6 sm:pt-10">
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* パンくずリスト */}
        <nav className="mb-6 text-xs text-slate-500" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href={`/store/${slug}`} className="hover:text-rose-500 transition-colors">
                {storeData.name} TOP
              </Link>
            </li>
            <li>&gt;</li>
            <li className="font-semibold text-slate-800" aria-current="page">
              セラピストインタビュー
            </li>
          </ol>
        </nav>

        {/* ヘッダーエリア */}
        <header className="mb-10 text-center">
          <div className="inline-block rounded-full bg-rose-100 px-4 py-1 text-xs font-bold text-rose-600 mb-3 tracking-widest">
            INTERVIEW
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl font-serif">
            セラピストインタビュー
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600">
            施術のこだわりや人柄など、セラピストの素顔をインタビューでご紹介します。
          </p>
        </header>

        {/* インタビュー記事一覧グリッド */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const meta = article.interview_meta as any;
            const castLink = meta?.cast_links?.[0];
            const castName = castLink?.cast_name || 'セラピスト';
            const castSlug = castLink?.cast_id || castLink?.cast_name_romaji || 'unknown';
            const articleUrl = `/store/${slug}/interview/${castSlug}/${article.slug}`;

            const publishedDate = article.published_at ? new Date(article.published_at) : new Date(article.created_at);
            const dateStr = publishedDate.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <article
                key={article.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-slate-100"
              >
                <Link href={articleUrl} className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {article.thumbnail_url ? (
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-rose-50 text-rose-300 text-sm font-semibold">
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
                      <time dateTime={publishedDate.toISOString()}>{dateStr}</time>
                    </div>

                    <h2 className="text-base font-bold leading-snug text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-2">
                      <Link href={articleUrl}>{article.title}</Link>
                    </h2>

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
                      記事を読む <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
