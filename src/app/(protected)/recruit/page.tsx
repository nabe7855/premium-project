import { Metadata } from 'next';
import { getPublishedRecruitColumns } from '@/lib/actions/recruit-column';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'セラピスト求人情報｜女性用風俗ストロベリーボーイズ【公式採用情報】',
  description: '女性用風俗ストロベリーボーイズの公式セラピスト求人ポータル。福岡店・横浜店の募集要項、未経験向けマンツーマン研修、収入例、求人コラムをご紹介。',
  alternates: {
    canonical: 'https://www.sutoroberrys.jp/recruit',
  },
  openGraph: {
    title: 'セラピスト求人情報｜女性用風俗ストロベリーボーイズ【公式採用情報】',
    description: '女性用風俗ストロベリーボーイズの公式セラピスト求人ポータル。',
    type: 'website',
    url: 'https://www.sutoroberrys.jp/recruit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'セラピスト求人情報｜女性用風俗ストロベリーボーイズ【公式採用情報】',
    description: '女性用風俗ストロベリーボーイズの公式セラピスト求人ポータル。',
  },
};

export default async function RecruitHubPage() {
  const columns = await getPublishedRecruitColumns();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'セラピスト求人情報｜女性用風俗ストロベリーボーイズ',
    description: 'ストロベリーボーイズ公式セラピスト求人ポータルハブ',
    url: 'https://www.sutoroberrys.jp/recruit',
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-8 sm:pt-12">
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
              セラピスト求人情報
            </li>
          </ol>
        </nav>

        {/* ヒーローヘッダー */}
        <header className="mb-12 text-center">
          <div className="inline-block rounded-full bg-amber-400/10 px-4 py-1 text-xs font-bold text-amber-400 border border-amber-400/20 mb-3 tracking-widest">
            STRAWBERRY BOYS RECRUIT
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl leading-snug">
            あなたの魅力を、最高の仲間とともに。
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
            ストロベリーボーイズは、未経験から月収50万円以上を目指せる女性専用リラクゼーションサロンです。全額日払い・登録料0円・完全個別の丁寧な講習体制でお迎えします。
          </p>
        </header>

        {/* 店舗別求人LPナビゲーションカード */}
        <div className="mb-16">
          <h2 className="text-center text-lg font-bold text-amber-300 mb-6 sm:text-xl">
            ▼ ご希望の勤務エリアをお選びください
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* 福岡店 */}
            <div className="group relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 p-6 sm:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/60">
              <div className="mb-4 inline-block rounded-lg bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300">
                FUKUOKA STORE
              </div>
              <h3 className="text-xl font-bold text-white mb-2">福岡店 セラピスト求人</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                天神・博多エリア中心。九州エリア最高水準のバック率とアットホームなサポート体制。
              </p>
              <Link
                href="/store/fukuoka/recruit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-rose-600 px-6 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-rose-500"
              >
                福岡店の求人募集要項を見る →
              </Link>
            </div>

            {/* 横浜店 */}
            <div className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 p-6 sm:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60">
              <div className="mb-4 inline-block rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                YOKOHAMA STORE
              </div>
              <h3 className="text-xl font-bold text-white mb-2">横浜店 セラピスト求人</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                みなとみらい・関内エリア中心。首都圏での高収入・プライバシー完全保護環境。
              </p>
              <Link
                href="/store/yokohama/recruit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-amber-600 px-6 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-amber-500"
              >
                横浜店の求人募集要項を見る →
              </Link>
            </div>
          </div>
        </div>

        {/* 採用コラムセクション（公開記事が1本以上の場合のみDOM出力） */}
        {columns && columns.length > 0 && (
          <section className="mt-16 border-t border-slate-800 pt-12">
            <div className="mb-8 text-center">
              <span className="inline-block rounded-full bg-amber-400/10 px-3.5 py-1 text-xs font-bold tracking-widest text-amber-400 border border-amber-400/20 mb-2">
                COLUMN
              </span>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                セラピスト求人コラム
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                仕事内容・研修・給与システムを分かりやすく解説
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {columns.slice(0, 3).map((col) => {
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
                    className="group flex flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50"
                  >
                    <Link href={articleUrl} className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                      {col.thumbnailUrl ? (
                        <img
                          src={col.thumbnailUrl}
                          alt={col.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-900 text-amber-400 text-xs font-bold">
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
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
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

            <div className="mt-8 text-center">
              <Link
                href="/recruit/column"
                className="inline-flex items-center rounded-full bg-slate-800 border border-slate-700 px-6 py-2.5 text-xs font-bold text-amber-400 shadow-md transition-all hover:bg-slate-700 hover:text-amber-300"
              >
                コラム一覧を見る →
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
