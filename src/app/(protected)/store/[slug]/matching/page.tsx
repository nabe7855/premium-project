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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = getStoreData(params.slug);
  return {
    title: `${store?.name || params.slug} - キャスト相性診断 | Strawberry Boys`,
    description: `あなたにぴったりのキャストを診断。3つの質問に答えるだけで相性抜群のキャストをご提案します。`,
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
