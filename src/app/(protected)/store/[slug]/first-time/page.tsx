import FirstTimePageContent from '@/components/sections/guide/first-time/FirstTimePageContent';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getFirstTimeConfig } from '@/lib/store/firstTimeActions';
import { mergeConfig } from '@/lib/store/firstTimeConfig';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: {
    slug: string;
  };
}

import { STORE_META } from '@/lib/store/storeMeta';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;
  const s = STORE_META[slug];
  if (!s) return {};

  const title = `初めての方へ｜${s.city}の女性用風俗｜ストロベリーボーイズ${s.city}店`;
  const description = `${s.city}（${s.area}）の女性用風俗「ストロベリーボーイズ${s.city}店」を初めてご利用されるお客様へ。安心・安全の完全審査制、秘密厳守、明朗会計など、当店が多くのお客様に選ばれる理由とご利用の流れをご案内します。`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.sutoroberrys.jp/store/${slug}/first-time` },
    openGraph: {
      title,
      description,
      url: `https://www.sutoroberrys.jp/store/${slug}/first-time`,
      images: [{ url: `/ogp/store-${slug}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/ogp/store-${slug}.png`]
    }
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  const store = getStoreData(slug);

  if (!store) {
    notFound();
  }

  // 設定データをサーバーサイドで並列取得して TTFB を最適化
  const [topConfigResult, firstTimeConfigResult] = await Promise.all([
    getStoreTopConfig(slug),
    getFirstTimeConfig(slug),
  ]);

  const topConfig = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  const firstTimeConfig = firstTimeConfigResult.success && firstTimeConfigResult.config
    ? mergeConfig(firstTimeConfigResult.config)
    : mergeConfig({});

  return (
    <>
      {store.template === 'fukuoka' ? (
        <FukuokaHeader config={topConfig.header} />
      ) : store.template === 'yokohama' ? (
        <YokohamaHeader config={topConfig.header} />
      ) : null}
      <main className="min-h-screen">
        <h1 className="sr-only">はじめての方へ</h1>
        <FirstTimePageContent 
          slug={slug} 
          storeName={store.name} 
          config={firstTimeConfig}
        />
      </main>
    </>
  );
}
