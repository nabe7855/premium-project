import { Metadata } from 'next';
import { getRecruitColumnBySlug } from '@/lib/actions/recruit-column';
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
  const column = await getRecruitColumnBySlug(slug);
  if (!column) return { title: 'Not Found' };

  const title = `${column.title}｜ストロベリーボーイズ セラピスト求人コラム`;
  const description = column.shortDescription || column.title;
  const canonicalUrl = `https://www.sutoroberrys.jp/recruit/column/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: canonicalUrl,
      images: column.thumbnailUrl ? [{ url: column.thumbnailUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: column.thumbnailUrl ? [column.thumbnailUrl] : [],
    },
  };
}

export default async function RecruitColumnArticlePage({ params }: Props) {
  const { slug } = params;
  const column = await getRecruitColumnBySlug(slug);

  if (!column) {
    notFound();
  }

  const publishedDate = new Date(column.updatedAt);
  const dateStr = publishedDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: column.title,
    description: column.shortDescription || column.title,
    url: `https://www.sutoroberrys.jp/recruit/column/${slug}`,
    datePublished: publishedDate.toISOString(),
    dateModified: publishedDate.toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'ストロベリーボーイズ',
      url: 'https://www.sutoroberrys.jp',
    },
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-20 pt-8 sm:pt-12">
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* パンくずリスト */}
        <nav className="mb-6 text-xs text-slate-400" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 flex-wrap">
            <li>
              <Link href="/" className="hover:text-amber-400 transition-colors">
                ホーム
              </Link>
            </li>
            <li>&gt;</li>
            <li>
              <Link href="/recruit/column" className="hover:text-amber-400 transition-colors">
                セラピスト求人コラム
              </Link>
            </li>
            <li>&gt;</li>
            <li className="font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs" aria-current="page">
              {column.title}
            </li>
          </ol>
        </nav>

        {/* 記事ヘッダー */}
        <header className="mb-8 border-b border-slate-800 pb-8">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
            <span className="rounded-full bg-amber-400/10 px-3 py-1 font-bold text-amber-400 border border-amber-400/20">
              求人コラム
            </span>
            <time dateTime={publishedDate.toISOString()}>{dateStr}</time>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl leading-snug">
            {column.title}
          </h1>

          {column.shortDescription && (
            <p className="mt-4 text-sm leading-relaxed text-slate-300 bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
              {column.shortDescription}
            </p>
          )}
        </header>

        {/* サムネイル画像 */}
        {column.thumbnailUrl && (
          <div className="mb-10 overflow-hidden rounded-2xl border border-slate-800 shadow-xl">
            <img
              src={column.thumbnailUrl}
              alt={column.title}
              className="w-full max-h-[450px] object-cover"
            />
          </div>
        )}

        {/* 記事本文セクション */}
        <div className="space-y-8 text-slate-200 leading-relaxed">
          {column.sections && column.sections.length > 0 ? (
            column.sections.map((sec: any, idx: number) => {
              const secContent = sec.content || {};
              const title = secContent.title || secContent.heading;
              const description = secContent.description || secContent.text || secContent.body;
              const imageUrl = secContent.imageUrl || secContent.image;

              return (
                <section key={sec.id || idx} className="space-y-4">
                  {title && (
                    <h2 className="text-xl font-bold text-amber-300 border-l-4 border-amber-400 pl-3.5 py-0.5">
                      {title}
                    </h2>
                  )}

                  {imageUrl && (
                    <div className="my-4 overflow-hidden rounded-xl border border-slate-800">
                      <img
                        src={imageUrl}
                        alt={secContent.imageAlt || title || column.title}
                        className="w-full object-cover max-h-[360px]"
                      />
                    </div>
                  )}

                  {description && (
                    <div
                      className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  )}
                </section>
              );
            })
          ) : (
            <div className="text-sm text-slate-400">本文がまだ登録されていません。</div>
          )}
        </div>

        {/* 定型求人CTAボックス（全記事自動挿入） */}
        <div className="mt-14 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800/90 to-amber-950/40 p-6 sm:p-8 border border-amber-500/30 text-center shadow-xl">
          <span className="inline-block rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold text-amber-300 mb-3">
            RECRUIT INFORMATION
          </span>
          <h3 className="text-lg font-bold text-white mb-2 sm:text-xl">
            ストロベリーボーイズでセラピストとして活躍しませんか？
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-xl mx-auto leading-relaxed">
            未経験歓迎・週1日〜OK・全額日払い。充実したマンツーマン研修制度があるから安心。ご応募・お問い合わせは各店舗求人ページよりお気軽にご連絡ください。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/store/fukuoka/recruit"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3 text-xs font-bold text-white shadow-lg transition-all hover:scale-[1.02]"
            >
              福岡店 セラピスト求人LPを見る →
            </Link>
            <Link
              href="/store/yokohama/recruit"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 px-6 py-3 text-xs font-bold text-white shadow-lg transition-all hover:scale-[1.02]"
            >
              横浜店 セラピスト求人LPを見る →
            </Link>
          </div>
        </div>

        {/* コラム一覧へ戻るボタン */}
        <div className="mt-10 text-center">
          <Link
            href="/recruit/column"
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800 px-6 py-2.5 text-xs font-bold text-slate-300 shadow-sm transition-all hover:bg-slate-700 hover:text-white"
          >
            ← セラピスト求人コラム一覧へ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
