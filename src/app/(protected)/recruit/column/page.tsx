import { Metadata } from 'next';
import { getPublishedRecruitColumns } from '@/lib/actions/recruit-column';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'セラピスト求人コラム｜女性用風俗の仕事を知る｜ストロベリーボーイズ',
  description: 'ストロベリーボーイズのセラピスト求人コラム。施術内容、研修体制、働き方、現役キャストの声など、お仕事のリアルをわかりやすく解説します。',
  alternates: {
    canonical: 'https://www.sutoroberrys.jp/recruit/column',
  },
  openGraph: {
    title: 'セラピスト求人コラム｜女性用風俗の仕事を知る｜ストロベリーボーイズ',
    description: 'ストロベリーボーイズのセラピスト求人コラム。仕事内容、研修、給与、現役キャストの声など。',
    type: 'website',
    url: 'https://www.sutoroberrys.jp/recruit/column',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'セラピスト求人コラム｜女性用風俗の仕事を知る｜ストロベリーボーイズ',
    description: 'ストロベリーボーイズのセラピスト求人コラム。仕事内容、研修、給与、現役キャストの声など。',
  },
};

export default async function RecruitColumnListPage() {
  // 公開済みの採用コラム記事を取得（0本の場合は404）
  const columns = await getPublishedRecruitColumns();

  if (!columns || columns.length === 0) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'セラピスト求人コラム｜ストロベリーボーイズ',
    description: '女性用風俗セラピストのお仕事解説コラム一覧。',
    url: 'https://www.sutoroberrys.jp/recruit/column',
    itemListElement: columns.map((col, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `https://www.sutoroberrys.jp/recruit/column/${col.slug}`,
      name: col.title,
    })),
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-20 pt-8 sm:pt-12">
      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* パンくずリスト */}
        <nav className="mb-6 text-xs text-slate-400" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-amber-400 transition-colors">
                ホーム
              </Link>
            </li>
            <li>&gt;</li>
            <li className="font-semibold text-slate-200" aria-current="page">
              セラピスト求人コラム
            </li>
          </ol>
        </nav>

        {/* ヘッダーエリア */}
        <header className="mb-10 text-center">
          <div className="inline-block rounded-full bg-amber-400/10 px-4 py-1 text-xs font-bold text-amber-400 border border-amber-400/20 mb-3 tracking-widest">
            RECRUIT COLUMN
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            セラピスト求人コラム
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
            女性用風俗セラピストの仕事内容、マンツーマン研修、収入の仕組み、現役スタッフの声まで、応募前のご不安を解決するコンテンツをお届けします。
          </p>
        </header>

        {/* 両店求人LP案内バナー */}
        <div className="mb-12 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/30 p-6 text-center shadow-lg">
          <h2 className="text-sm font-bold text-amber-300 mb-2">
            ＼ まずは各店舗の募集要項をチェック ／
          </h2>
          <p className="text-xs text-slate-300 mb-4">
            未経験歓迎・全額日払い・登録料0円。最短10日でデビュー可能！
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/store/fukuoka/recruit"
              className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-rose-500"
            >
              福岡店 セラピスト求人LPへ →
            </Link>
            <Link
              href="/store/yokohama/recruit"
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-amber-500"
            >
              横浜店 セラピスト求人LPへ →
            </Link>
          </div>
        </div>

        {/* コラム記事カード一覧 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {columns.map((col) => {
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
                className="group flex flex-col overflow-hidden rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-amber-500/10"
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

                    <h2 className="text-sm font-bold leading-snug text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      <Link href={articleUrl}>{col.title}</Link>
                    </h2>

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
      </div>
    </main>
  );
}
