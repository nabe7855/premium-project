import CommonHeader from '@/components/sections/layout/Header';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getPublishedPagesByStore } from '@/lib/actions/news-pages';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { notFound } from 'next/navigation';
import NewsListClient from './NewsListClient';

interface StoreNewsPageProps {
  params: {
    slug: string;
  };
}

export default async function StoreNewsPage({ params }: StoreNewsPageProps) {
  const { slug } = params;
  const store = getStoreData(slug);

  if (!store) {
    notFound();
  }

  const [newsPages, topConfigResult] = await Promise.all([
    getPublishedPagesByStore(slug),
    getStoreTopConfig(slug),
  ]);

  const config = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  const recommendedIds = config.recommendedNewsIds || [];
  const recommendedPages = newsPages.filter((page) => recommendedIds.includes(page.id));

  // Decide which Header/Footer to use based on template
  const isFukuoka = store.template === 'fukuoka';
  const isYokohama = store.template === 'yokohama';

  // Use Fukuoka's footer as default if not Yokohama (as seen in common template)
  const HeaderComponent = isFukuoka
    ? (FukuokaHeader as any)
    : isYokohama
      ? (YokohamaHeader as any)
      : (CommonHeader as any);
  const FooterComponent = isYokohama ? (YokohamaFooter as any) : (FukuokaFooter as any);

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderComponent config={config.header} />

      <main className="flex-grow pt-20 md:pt-24">
        <NewsListClient
          news={newsPages}
          storeSlug={slug}
          config={config}
          recommendedPages={recommendedPages}
        />
      </main>

      <FooterComponent config={config.footer} />
    </div>
  );
}
