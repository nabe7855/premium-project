import { Metadata } from 'next';
import { getPublishedRecruitColumns } from '@/lib/actions/recruit-column';
import { getInterviewArticles } from '@/lib/actions/interview';
import Link from 'next/link';
import React from 'react';

export const metadata: Metadata = {
  title: 'セラピスト求人・採用情報｜女性用風俗ストロベリーボーイズ(福岡・横浜)',
  description: '女性用風俗ストロベリーボーイズの公式セラピスト求人・採用情報ポータル。福岡（博多・天神・中洲）および横浜（みなとみらい・関内）でセラピスト大募集。週1日〜OK・未経験歓迎・全額日払い・登録料0円・完全個別の講習体制でお迎えします。',
  alternates: {
    canonical: 'https://www.sutoroberrys.jp/recruit',
  },
  openGraph: {
    title: 'セラピスト求人・採用情報｜女性用風俗ストロベリーボーイズ(福岡・横浜)',
    description: '女性用風俗ストロベリーボーイズの公式セラピスト求人・採用情報ポータル。',
    type: 'website',
    url: 'https://www.sutoroberrys.jp/recruit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'セラピスト求人・採用情報｜女性用風俗ストロベリーボーイズ(福岡・横浜)',
    description: '女性用風俗ストロベリーボーイズの公式セラピスト求人・採用情報ポータル。',
  },
};

import { getMediaArticles } from '@/lib/actions/media';

export default async function RecruitHubPage() {
  const [columns, interviewResult, ikeoResult] = await Promise.all([
    getPublishedRecruitColumns(),
    getInterviewArticles({ limit: 3 }),
    getMediaArticles('ikeo', 'recruit'),
  ]);

  const interviews = interviewResult?.articles || [];
  const ikeoArticles = ikeoResult?.success
    ? (ikeoResult.articles || [])
        .filter((a: any) => a.status === 'published')
        .map((a: any) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          thumbnailUrl: a.eyecatch_image || '/ogp/default-v2.png',
          updatedAt: a.updated_at || a.created_at,
          url: `/ikeo/${a.slug}`,
        }))
    : [];

  const displayColumns = ikeoArticles.length > 0 ? ikeoArticles : columns.map((c: any) => ({ ...c, url: `/recruit/column/${c.slug}` }));

  // BreadcrumbList JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: 'https://www.sutoroberrys.jp',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'セラピスト求人',
        item: 'https://www.sutoroberrys.jp/recruit',
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-8 sm:pt-12">
      {/* 構造化データ (BreadcrumbListのみ。JobPostingは置かない) */}
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
              セラピスト求人
            </li>
          </ol>
        </nav>

        {/* 1-1. ヒーローセクション */}
        <header className="mb-12 text-center">
          <div className="inline-block rounded-full bg-amber-400/10 px-4 py-1 text-xs font-bold text-amber-400 border border-amber-400/20 mb-3 tracking-widest">
            STRAWBERRY BOYS RECRUIT PORTAL
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl leading-snug">
            セラピスト求人・採用情報｜ストロベリーボーイズ
          </h1>
          <p className="font-serif text-lg font-bold text-amber-300 mt-2 sm:text-xl">
            誰かの&quot;癒し&quot;を仕事にする。
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
            ストロベリーボーイズは福岡・横浜でセラピストを募集しています。未経験から安心してスタートできる環境を整えてお待ちしております。
          </p>
          <div className="mt-6">
            <a
              href="#stores"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-7 py-3 text-xs font-bold text-slate-950 shadow-lg transition-all hover:brightness-110"
            >
              ▼ 募集要項・勤務エリアを選ぶ
            </a>
          </div>
        </header>

        {/* 1-2. 店舗求人カードセクション (既存2枚の強化) */}
        <section id="stores" className="mb-16 scroll-mt-10">
          <h2 className="text-center text-lg font-bold text-amber-300 mb-6 sm:text-xl">
            ▼ ご希望の勤務エリアをお選びください
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* 福岡店 */}
            <div className="group relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 p-6 sm:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/60">
              <div className="mb-3 inline-block rounded-lg bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300">
                福岡店（博多・天神・中洲）
              </div>
              <h3 className="text-xl font-bold text-white mb-2">福岡店 セラピスト求人</h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                天神・博多・中洲エリア中心。九州最高水準の還元率とアットホームなサポート体制。
              </p>

              {/* 条件チップ（テキストのみ・金額数値なし） */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="rounded-md bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-rose-300">
                  週1日〜OK
                </span>
                <span className="rounded-md bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-rose-300">
                  未経験歓迎
                </span>
                <span className="rounded-md bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-rose-300">
                  全額日払い
                </span>
                <span className="rounded-md bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-rose-300">
                  登録料0円
                </span>
                <span className="rounded-md bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-rose-300">
                  顔出しなし可
                </span>
              </div>

              <Link
                href="/store/fukuoka/recruit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-rose-600 px-6 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-rose-500"
              >
                福岡店の求人詳細を見る →
              </Link>
            </div>

            {/* 横浜店 */}
            <div className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 via-amber-950/30 to-slate-900 p-6 sm:p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/60">
              <div className="mb-3 inline-block rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                横浜店（みなとみらい・関内）
              </div>
              <h3 className="text-xl font-bold text-white mb-2">横浜店 セラピスト求人</h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                みなとみらい・関内エリア中心。首都圏での高収入・プライバシー完全保護環境。
              </p>

              {/* 条件チップ（テキストのみ・金額数値なし） */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="rounded-md bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                  週1日〜OK
                </span>
                <span className="rounded-md bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                  未経験歓迎
                </span>
                <span className="rounded-md bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                  全額日払い
                </span>
                <span className="rounded-md bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                  登録料0円
                </span>
                <span className="rounded-md bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                  顔出しなし可
                </span>
              </div>

              <Link
                href="/store/yokohama/recruit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-amber-600 px-6 py-3 text-xs font-bold text-white shadow-lg transition-all hover:bg-amber-500"
              >
                横浜店の求人詳細を見る →
              </Link>
            </div>
          </div>
        </section>

        {/* 1-3. 「働き方は選べる」ペルソナセクション (新設) */}
        <section className="mb-16 rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-10">
          <div className="mb-8 text-center">
            <span className="inline-block rounded-full bg-amber-400/10 px-3.5 py-1 text-xs font-bold tracking-widest text-amber-400 border border-amber-400/20 mb-2 uppercase">
              PERSONA & WORKSTYLE
            </span>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              あなたに合わせた「選べる働き方」
            </h2>
            <p className="mt-2 text-xs text-slate-300">
              目標や生活スタイルに合わせて、理想のペースでご活躍いただけます。
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* 週末だけの副業型 */}
            <div className="flex flex-col justify-between rounded-2xl bg-slate-950 p-6 border border-slate-800 shadow-md">
              <div>
                <span className="inline-block rounded-md bg-rose-500/20 px-2.5 py-0.5 text-[11px] font-bold text-rose-300 mb-3">
                  週1日〜 / Wワーク
                </span>
                <h3 className="text-base font-bold text-white mb-2">週末だけの副業型</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  本業を続けながら週末や空き時間だけで働きたい方向け。本業への影響や身バレを防ぐ完全プライバシー対策を徹底しておりますので安心して活動できます。
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs">
                <Link href="/store/fukuoka/recruit" className="font-bold text-rose-400 hover:underline">
                  福岡店詳細 →
                </Link>
                <span className="text-slate-600">|</span>
                <Link href="/store/yokohama/recruit" className="font-bold text-amber-400 hover:underline">
                  横浜店詳細 →
                </Link>
              </div>
            </div>

            {/* 本業がっつり型 */}
            <div className="flex flex-col justify-between rounded-2xl bg-slate-950 p-6 border border-amber-500/30 shadow-md">
              <div>
                <span className="inline-block rounded-md bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 mb-3">
                  週4〜6日 / 本業メイン
                </span>
                <h3 className="text-base font-bold text-white mb-2">本業がっつり型</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  本業としてしっかり稼ぎたい方向け。未経験からでもプロとして指名を獲得できるよう、完全個別の実技・接客講習でバックアップします。
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs">
                <Link href="/store/fukuoka/recruit" className="font-bold text-rose-400 hover:underline">
                  福岡店詳細 →
                </Link>
                <span className="text-slate-600">|</span>
                <Link href="/store/yokohama/recruit" className="font-bold text-amber-400 hover:underline">
                  横浜店詳細 →
                </Link>
              </div>
            </div>

            {/* 両立型 */}
            <div className="flex flex-col justify-between rounded-2xl bg-slate-950 p-6 border border-slate-800 shadow-md">
              <div>
                <span className="inline-block rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 mb-3">
                  自由シフト / 夢・学業両立
                </span>
                <h3 className="text-base font-bold text-white mb-2">学業・他活動との両立型</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  学業や資格勉強、別の夢と両立しながら自分のペースで出勤。スケジュール変更にも柔軟に対応できる自由度の高いシフト制です。
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs">
                <Link href="/store/fukuoka/recruit" className="font-bold text-rose-400 hover:underline">
                  福岡店詳細 →
                </Link>
                <span className="text-slate-600">|</span>
                <Link href="/store/yokohama/recruit" className="font-bold text-amber-400 hover:underline">
                  横浜店詳細 →
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            ※ 収入イメージや給与シミュレーションは、各店舗の求人詳細ページにて公開中です。
          </p>
        </section>

        {/* 1-4. 採用コラムフィード (公開記事が1本以上の場合のみDOM出力) */}
        {columns && columns.length > 0 && (
          <section className="mb-16 border-t border-slate-800 pt-12">
            <div className="mb-8 text-center">
              <span className="inline-block rounded-full bg-amber-400/10 px-3.5 py-1 text-xs font-bold tracking-widest text-amber-400 border border-amber-400/20 mb-2 uppercase">
                RECRUIT COLUMN
              </span>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                セラピスト求人コラム
              </h2>
              <p className="mt-2 text-xs text-slate-300">
                仕事内容・研修・給与システムを分かりやすく解説
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayColumns.slice(0, 3).map((col: any) => {
                const articleUrl = col.url;
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
                          IKEO LAB
                        </div>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                          <span className="font-semibold text-amber-400">求人コラム・イケオラボ</span>
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
                href="/ikeo"
                className="inline-flex items-center rounded-full bg-slate-900 border border-slate-700 px-6 py-2.5 text-xs font-bold text-amber-400 shadow-md transition-all hover:bg-slate-800 hover:text-amber-300"
              >
                イケオラボコラム一覧を見る →
              </Link>
            </div>
          </section>
        )}

        {/* 1-5. 「働く人を知る」セラピストインタビューセクション (公開記事が1本以上の場合のみDOM出力) */}
        {interviews && interviews.length > 0 && (
          <section className="mb-16 border-t border-slate-800 pt-12">
            <div className="mb-8 text-center">
              <span className="inline-block rounded-full bg-rose-500/10 px-3.5 py-1 text-xs font-bold tracking-widest text-rose-400 border border-rose-500/20 mb-2 uppercase">
                INTERVIEW
              </span>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                働く人を知る — セラピストインタビュー
              </h2>
              <p className="mt-2 text-xs text-slate-300">
                現場で活躍するキャストのリアルな仕事感やインタビューをご紹介
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {interviews.slice(0, 3).map((art) => {
                const meta = art.interview_meta as any;
                const castLink = meta?.cast_links?.find((l: any) => l.cast_id || l.cast_name_romaji) || meta?.cast_links?.[0];
                const castName = castLink?.cast_name || 'セラピスト';
                const castSlug = castLink?.cast_id || castLink?.cast_name_romaji || 'cast';
                const storeSlug = meta?.area === 'yokohama' || meta?.area === '横浜' ? 'yokohama' : 'fukuoka';
                const articleUrl = `/store/${storeSlug}/interview/${castSlug}/${art.slug}`;

                const publishedDate = art.published_at ? new Date(art.published_at) : new Date(art.created_at);
                const dateStr = publishedDate.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });

                const imageUrl = (art as any).eyecatch_url || art.thumbnail_url;

                return (
                  <article
                    key={art.id}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-rose-400/50"
                  >
                    <Link href={articleUrl} className="relative aspect-[16/10] overflow-hidden bg-slate-800">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={art.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-rose-950/40 text-rose-300 text-xs font-bold">
                          CAST INTERVIEW
                        </div>
                      )}
                      {meta?.vol_number != null && (
                        <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md">
                          Vol.{meta.vol_number}
                        </span>
                      )}
                    </Link>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                          <span className="font-semibold text-rose-400">{castName} さん</span>
                          <time dateTime={publishedDate.toISOString()}>{dateStr}</time>
                        </div>

                        <h3 className="text-sm font-bold leading-snug text-white group-hover:text-rose-300 transition-colors line-clamp-2">
                          <Link href={articleUrl}>{art.title}</Link>
                        </h3>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
                        <Link
                          href={articleUrl}
                          className="inline-flex items-center text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform"
                        >
                          インタビューを読む <span className="ml-1">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/store/fukuoka/interview"
                className="inline-flex items-center rounded-full bg-slate-900 border border-slate-700 px-6 py-2.5 text-xs font-bold text-rose-400 shadow-md transition-all hover:bg-slate-800 hover:text-rose-300"
              >
                インタビュー一覧を見る →
              </Link>
            </div>
          </section>
        )}

        {/* 1-6. 系列サイトリンク行 */}
        <section className="mb-16 border-t border-slate-800 pt-12">
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 text-center">
            <span className="inline-block rounded-full bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-400 mb-3 tracking-wider">
              GROUP STORES
            </span>
            <h2 className="text-base font-bold text-white mb-2 sm:text-lg">
              グループ全体の募集状況
            </h2>
            <p className="text-xs text-slate-300 mb-6 max-w-xl mx-auto leading-relaxed">
              大阪・東京・名古屋の系列グループ店舗での求人応募・採用状況につきましては、各店のグループ公式サイトにてご確認ください。
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://sutoroberrys-osaka.com/main.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition-all hover:bg-slate-700 hover:text-amber-300"
              >
                <span>ストロベリーボーイズ 大阪店 採用情報</span>
                <span className="text-[10px] text-slate-400">↗</span>
              </a>
              <a
                href="https://sutoroberrys.com/main/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition-all hover:bg-slate-700 hover:text-amber-300"
              >
                <span>ストロベリーボーイズ 東京店 採用情報</span>
                <span className="text-[10px] text-slate-400">↗</span>
              </a>
              <a
                href="https://sutoroberrys-aichi.com/main.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition-all hover:bg-slate-700 hover:text-amber-300"
              >
                <span>ストロベリーボーイズ 名古屋店 採用情報</span>
                <span className="text-[10px] text-slate-400">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* 1-7. 末尾応募CTA */}
        <section className="rounded-3xl bg-gradient-to-br from-rose-950/50 via-slate-900 to-amber-950/40 border border-amber-500/30 p-8 sm:p-12 text-center shadow-2xl">
          <div className="inline-block rounded-full bg-amber-400/20 px-4 py-1 text-xs font-bold text-amber-300 mb-3 tracking-widest">
            CONTACT & ENTRY
          </div>
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl mb-3">
            まずは話を聞いてみる
          </h2>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
            「自分に向いているか相談したい」「実際の講習内容について聞いてみたい」など、事前のご質問も歓迎しています。各店舗の公式LINEまたはフォームよりお気軽にお問い合わせください。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/store/fukuoka/recruit"
              className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-rose-500"
            >
              福岡店 求人募集要項を見る →
            </Link>
            <Link
              href="/store/yokohama/recruit"
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg transition-all hover:bg-amber-500"
            >
              横浜店 求人募集要項を見る →
            </Link>
          </div>

          <p className="mt-6 text-[11px] text-slate-400">
            ※ 詳しい応募要項・LINE応募導線は各店舗の求人ページ内にございます。
          </p>
        </section>
      </div>
    </main>
  );
}

