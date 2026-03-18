import { getActivePartnerLinks } from '@/lib/actions/partnerLinks';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '福岡 女性用風俗 おすすめサイト一覧 | ストロベリーボーイズ',
  description:
    '福岡・博多の女性用風俗でストロベリーボーイズが信頼するパートナーサイトをご紹介。女風情報サイト、求人情報、関連メディアなど、信頼できるサイトのみを厳選掲載しています。',
  keywords: '福岡 女性用風俗 おすすめ, 博多 女風 情報, 女性用風俗 リンク集, ストロベリーボーイズ',
  openGraph: {
    title: '福岡 女性用風俗 おすすめサイト一覧 | ストロベリーボーイズ',
    description: '信頼できるパートナーサイト一覧。女風情報・求人・関連メディアを厳選してご紹介。',
    type: 'website',
  },
};

export const revalidate = 3600; // 1時間ごとにISR

export default async function LinksPage() {
  const result = await getActivePartnerLinks();
  const links = result.links ?? [];

  const categories = [
    { id: 'general', label: '女性用風俗 情報サイト', desc: '信頼できる女風情報をまとめたサイト' },
    { id: 'recruit', label: '求人・募集サイト', desc: '業界の求人・採用情報サイト' },
    { id: 'media', label: '関連メディア', desc: '女性向け風俗・癒しのメディア' },
  ];

  return (
    <>
      {/* ... (structured data part remains the same) */}
      {/* JSON-LD 構造化データ（SEO） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '福岡 女性用風俗 おすすめサイト一覧 | ストロベリーボーイズ',
            description:
              '福岡・博多の女性用風俗でストロベリーボーイズが信頼するパートナーサイト一覧。女風情報、求人、関連メディアを厳選掲載。',
            url: 'https://www.sutoroberrys.jp/links',
            publisher: {
              '@type': 'Organization',
              name: 'ストロベリーボーイズ',
              url: 'https://www.sutoroberrys.jp',
            },
          }),
        }}
      />

      <div className="min-h-screen bg-[#0f0f13] text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden py-20 sm:py-28">
          {/* Background gradients */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/10 blur-[100px]" />
            <div className="absolute right-1/4 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-amber-500/10 blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-300">Partner Sites</span>
            </div>
            <h1 className="mb-6 bg-gradient-to-br from-white via-rose-100 to-amber-200 bg-clip-text font-serif text-4xl font-black tracking-tight text-transparent sm:text-6xl">
              おすすめ
              <br className="sm:hidden" />
              パートナーサイト
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              ストロベリーボーイズが厳選した、信頼できる女性用風俗情報サイト・求人サイト・関連メディアをご紹介します。
              <br className="hidden sm:block" />
              女風に関するあらゆる情報がここから見つかります。
            </p>

            {/* SEO stats */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {links.length} サイト掲載中
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                すべて審査済み
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                随時更新
              </div>
            </div>
          </div>
        </div>

        {/* Back to main link */}
        <div className="container mx-auto px-4 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-white"
          >
            ← ストロベリーボーイズ トップへ戻る
          </Link>
        </div>

        {/* Partner Links by Category */}
        <main className="container mx-auto px-4 pb-24">
          {links.length === 0 ? (
            <div className="py-24 text-center text-slate-500">
              <p className="text-lg">現在、掲載中のサイトはありません。</p>
            </div>
          ) : (
            <div className="space-y-20">
              {categories.map((cat) => {
                const catLinks = links.filter((l: any) => l.category === cat.id);
                if (catLinks.length === 0) return null;
                return (
                  <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
                    {/* Category Header */}
                    <div className="mb-10 flex flex-col items-center text-center sm:flex-row sm:text-left">
                      <div>
                        <h2
                          id={`cat-${cat.id}`}
                          className="mb-1 font-serif text-2xl font-bold tracking-tight text-white sm:text-3xl"
                        >
                          {cat.label}
                        </h2>
                        <p className="text-sm text-slate-500">{cat.desc}</p>
                      </div>
                      <div className="ml-auto hidden h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent sm:ml-6 sm:block" />
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {catLinks.map((link: any, index: number) => (
                        <a
                          key={link.id}
                          href={link.site_url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/5 shadow-xl ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/30 hover:bg-white/10 hover:shadow-rose-500/10"
                        >
                          {/* Banner container with blurred background for flexibility */}
                          <div className="relative aspect-[16/7] w-full overflow-hidden bg-slate-900/50">
                            {/* Blurred background for inconsistent aspect ratios */}
                            {link.banner_url && (
                              <div
                                className="absolute inset-0 bg-cover bg-center opacity-20 blur-xl scale-110 grayscale-[30%]"
                                style={{ backgroundImage: `url(${link.banner_url})` }}
                              />
                            )}

                            {link.banner_url ? (
                              <Image
                                src={link.banner_url}
                                alt={`${link.site_name} バナー`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="relative z-10 h-full w-full object-contain p-2 opacity-95 transition-transform duration-500 group-hover:scale-105"
                                priority={index < 3}
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                                <span className="text-4xl opacity-40">🔗</span>
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-20" />
                          </div>

                          {/* Content */}
                          <div className="flex flex-1 flex-col p-5">
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <h3 className="font-bold text-white group-hover:text-rose-200 transition-colors">
                                {link.site_name}
                              </h3>
                              <svg
                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500 transition-colors group-hover:text-rose-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </div>
                            {link.description && (
                              <p className="mb-3 flex-1 text-sm leading-relaxed text-slate-400">
                                {link.description}
                              </p>
                            )}
                            {link.seo_keywords && (
                              <div className="mt-auto flex flex-wrap gap-1.5">
                                {link.seo_keywords.split(',').map((kw: string) => (
                                  <span
                                    key={kw}
                                    className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-300"
                                  >
                                    {kw.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                              <span className="truncate">
                                {link.site_url.replace(/^https?:\/\//, '')}
                              </span>
                            </div>
                          </div>

                          {/* Hover accent line */}
                          <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-rose-500 to-amber-500 transition-transform duration-300 group-hover:scale-x-100" />
                        </a>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {/* SEO Content Section */}
          <section className="mt-24 rounded-3xl border border-white/5 bg-white/3 p-8 sm:p-12">
            <h2 className="mb-6 font-serif text-2xl font-bold text-white">
              福岡・博多の女性用風俗について
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-slate-400 sm:text-base">
              <p>
                博多・天神エリアは、女性向け風俗（女性用風俗）の需要が急増しているエリアです。
                ストロベリーボーイズ福岡店では、上質なリラクゼーション体験を提供するとともに、
                信頼できる情報サイトや求人サイトと連携し、業界全体の透明性向上に努めています。
              </p>
              <p>
                このページでは、私たちが実際に把握・確認した信頼性の高いサイトのみを掲載しています。
                女性用風俗の情報収集や、キャスト・セラピストとしての活動を検討されている方は、
                ぜひ各サイトもご参考にしてください。
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
