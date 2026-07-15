import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getStoreData } from '@/lib/store/store-data';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';

import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import DiagnosisSection from '@/components/sections/casts/casts/DiagnosisSection';

interface Props {
  params: { slug: string };
}

import { STORE_META } from '@/lib/store/storeMeta';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = STORE_META[params.slug];
  const title = `キャスト相性診断｜${store?.city || ''}の女性用風俗｜ストロベリーボーイズ${store?.city || ''}店`;
  const description = `${store?.city || ''}（${store?.area || ''}）の女性用風俗「ストロベリーボーイズ${store?.city || ''}店」のイケメンセラピスト相性診断。あなたにぴったりのキャストを、簡単な質問に答えるだけでご提案します。`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.sutoroberrys.jp/store/${params.slug}/matching` },
    openGraph: {
      title,
      description,
      url: `https://www.sutoroberrys.jp/store/${params.slug}/matching`,
      images: [{ url: `/ogp/store-${params.slug}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/ogp/store-${params.slug}.png`]
    }
  };
}

export default async function MatchingPage({ params }: Props) {
  const store = getStoreData(params.slug);
  if (!store) {
    notFound();
  }

  const topConfigResult = await getStoreTopConfig(params.slug);
  const topConfig = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  return (
    <div className="min-h-screen bg-neutral-50">
      {store.template === 'fukuoka' ? (
        <FukuokaHeader config={topConfig.header} />
      ) : store.template === 'yokohama' ? (
        <YokohamaHeader config={topConfig.header} />
      ) : null}

      <main className="mx-auto max-w-4xl px-4 py-12 pt-24 md:px-0 md:pt-32">
        <h1 className="sr-only">セラピスト相性診断</h1>
        <DiagnosisSection />
      </main>

      {store.template === 'yokohama' ? (
        <YokohamaFooter config={topConfig.footer} />
      ) : (
        <FukuokaFooter config={topConfig.footer} />
      )}
    </div>
  );
}
