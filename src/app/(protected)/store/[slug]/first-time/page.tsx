import FirstTimePageContent from '@/components/sections/guide/first-time/FirstTimePageContent';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const store = getStoreData(params.slug);

  if (!store) {
    notFound();
  }

  // 店舗トップ設定を取得
  const topConfigResult = await getStoreTopConfig(params.slug);
  const topConfig = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  return (
    <>
      {store.template === 'fukuoka' ? (
        <FukuokaHeader config={topConfig.header} />
      ) : store.template === 'yokohama' ? (
        <YokohamaHeader config={topConfig.header} />
      ) : null}
      <FirstTimePageContent slug={params.slug} />
    </>
  );
}
