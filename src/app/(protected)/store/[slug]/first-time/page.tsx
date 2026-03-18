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
      <FirstTimePageContent 
        slug={slug} 
        storeName={store.name} 
        config={firstTimeConfig}
      />
    </>
  );
}
