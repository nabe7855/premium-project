import { getActivePartnerLinks } from '@/lib/actions/partnerLinks';
import { getStoreBySlug } from '@/lib/actions/store-actions';
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const result = await getStoreBySlug(params.slug);
  const store = result.store;
  if (!store) return { title: 'Not Found' };

  const storeName = store.name.replace('店', '');
  const title = `${storeName} 女性用風俗 おすすめサイト一覧 | ストロベリーボーイズ`;
  const description = `${storeName}・博多の女性用風俗でストロベリーボーイズが信頼するパートナーサイトをご紹介。信頼できるサイトのみを厳選掲載しています。`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export const revalidate = 3600;

export default async function StoreLinksPage({ params }: Props) {
  const { slug } = params;
  
  // Fetch store info
  const storeResult = await getStoreBySlug(slug);
  const store = storeResult.store;
  if (!store) notFound();

  // Fetch filtered links
  const result = await getActivePartnerLinks(slug);
  const links = result.links ?? [];

  const storeName = store.name.replace('店', '');

  const categories = [
    { id: 'general', label: '女性用風俗 情報サイト', emoji: '🌸', desc: '信頼できる女風情報をまとめたサイト' },
    { id: 'recruit', label: '求人・募集サイト', emoji: '💼', desc: '業界の求人・採用情報サイト' },
    { id: 'media', label: '関連メディア', emoji: '📰', desc: '女性向け風俗・癒しのメディア' },
  ];

  return (
    <>
      {/* JSON-LD 構造化データ（SEO） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `${storeName} 女性用風俗 おすすめサイト一覧 | ストロベリーボーイズ`,
            description: `${storeName}の女性用風俗情報。信頼できるパートナーサイト一覧。`,
            url: `https://www.sutoroberrys.jp/store/${slug}/links`,
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
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500/10 blur-[100px]" />
            <div className="absolute right-1/4 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-amber-500/10 blur-[100px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-300">{store.name} Partner Sites</span>
            </div>
            <h1 className="mb-6 bg-gradient-to-br from-white via-rose-100 to-amber-200 bg-clip-text font-serif text-4xl font-black tracking-tight text-transparent sm:text-6xl">
              {storeName}おすすめ
              <br className="sm:hidden" />
              パートナーサイト
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              ストロベリーボーイズ{storeName}店が厳選した、信頼できる女性用風俗情報サイト・求人サイト・関連メディアをご紹介します。
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {links.length} サイト掲載中
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                店舗厳選サイト
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="container mx-auto px-4 pb-4">
          <Link
            href={`/store/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-white"
          >
            ← {store.name} トップへ戻る
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
                    <div className="mb-10 flex flex-col items-center text-center sm:flex-row sm:text-left">
                      <div className="mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-3xl shadow-lg ring-1 ring-white/10 sm:mb-0 sm:mr-5">
                        {cat.emoji}
                      </div>
                      <div>
                        <h2 id={`cat-${cat.id}`} className="mb-1 font-serif text-2xl font-bold text-white sm:text-3xl">
                          {cat.label}
                        </h2>
                        <p className="text-sm text-slate-500">{cat.desc}</p>
                      </div>
                      <div className="ml-auto hidden h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent sm:ml-6 sm:block" />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {catLinks.map((link: any) => (
                        <a
                          key={link.id}
                          href={link.site_url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/5 shadow-xl ring-1 ring-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/30 hover:bg-white/10 hover:shadow-rose-500/10"
                        >
                          {link.banner_url ? (
                            <div className="relative aspect-[16/7] w-full overflow-hidden bg-slate-900">
                              <Image
                                src={link.banner_url}
                                alt={`${link.site_name} バナー`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="flex aspect-[16/7] w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                              <span className="text-4xl opacity-40">🔗</span>
                            </div>
                          )}
                          <div className="flex flex-1 flex-col p-5">
                            <h3 className="font-bold text-white group-hover:text-rose-200 transition-colors">
                              {link.site_name}
                            </h3>
                            {link.description && (
                              <p className="mt-2 mb-3 flex-1 text-sm leading-relaxed text-slate-400 line-clamp-2">
                                {link.description}
                              </p>
                            )}
                            <div className="mt-auto pt-2 flex items-center gap-2 text-[10px] text-slate-500">
                              <span className="truncate">{link.site_url.replace(/^https?:\/\//, '')}</span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
