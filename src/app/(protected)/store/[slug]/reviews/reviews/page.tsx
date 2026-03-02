'use client';

import FAQ from '@/components/sections/reviews/FAQ';
import ReviewList from '@/components/sections/reviews/ReviewList';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { useEffect, useState } from 'react';

export default function StoreReviewsPage({ params }: { params: { slug: string } }) {
  const [topConfig, setTopConfig] = useState<StoreTopPageConfig | null>(null);

  useEffect(() => {
    getStoreTopConfig(params.slug).then((res) => {
      if (res.success && res.config) {
        setTopConfig(res.config as StoreTopPageConfig);
      }
    });
  }, [params.slug]);
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-pink-50 to-white">
      {params.slug === 'yokohama' && topConfig?.header && (
        <YokohamaHeader config={topConfig.header} />
      )}
      {params.slug === 'fukuoka' && topConfig?.header && (
        <FukuokaHeader config={topConfig.header} />
      )}

      <main className="mx-auto max-w-6xl flex-grow px-4 py-8">
        {/* ✅ storeSlug を渡して ReviewList に任せる */}
        <ReviewList storeSlug={params.slug} />

        <FAQ />
      </main>

      {/* Footer */}
      {params.slug === 'yokohama' && topConfig?.footer && (
        <YokohamaFooter config={topConfig.footer} />
      )}
      {params.slug === 'fukuoka' && topConfig?.footer && (
        <FukuokaFooter config={topConfig.footer} />
      )}
    </div>
  );
}
