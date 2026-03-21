import ScheduleContent from '@/components/sections/schedule/ScheduleContent';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

import { Suspense } from 'react';

export default async function SchedulePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const result = await getStoreTopConfig(slug, { skipCasts: true });
  const topConfig = result.success ? (result.config as StoreTopPageConfig) : null;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header (Server fetched config ensures it renders immediately) */}
      {slug === 'yokohama' && topConfig?.header && <YokohamaHeader config={topConfig.header} />}
      {slug === 'fukuoka' && topConfig?.header && <FukuokaHeader config={topConfig.header} />}

      {/* Header Spacer */}
      <div className="h-[54px] md:h-[65px]" />

      <div className="flex-grow">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
            </div>
          }
        >
          <ScheduleContent storeSlug={slug} />
        </Suspense>
      </div>

      {/* Footer */}
      {slug === 'yokohama' && topConfig?.footer && <YokohamaFooter config={topConfig.footer} />}
      {slug === 'fukuoka' && topConfig?.footer && <FukuokaFooter config={topConfig.footer} />}
    </div>
  );
}
