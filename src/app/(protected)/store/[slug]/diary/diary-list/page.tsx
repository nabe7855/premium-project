import DiaryListContent from '@/components/sections/diary/DiaryListContent';
import Header from '@/components/templates/store/fukuoka/sections/Header';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

import { Suspense } from 'react';

export default async function DiaryListPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const result = await getStoreTopConfig(slug, { skipCasts: true });
  const topConfig = result.success ? (result.config as StoreTopPageConfig) : null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-pink-50 to-white">
      {/* Header (Server fetched config ensures it renders immediately) */}
      {topConfig?.header && <Header config={topConfig.header} />}

      <div className="flex-grow pt-24 sm:pt-28 md:pt-32">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
            </div>
          }
        >
          <DiaryListContent storeSlug={slug} />
        </Suspense>
      </div>

      {/* Footer */}
      {slug === 'yokohama' && topConfig?.footer && <YokohamaFooter config={topConfig.footer} />}
      {slug === 'fukuoka' && topConfig?.footer && <FukuokaFooter config={topConfig.footer} />}
    </div>
  );
}
