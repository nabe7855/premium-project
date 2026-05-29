import FAQ from '@/components/sections/reviews/FAQ';
import ReviewList from '@/components/sections/reviews/ReviewList';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import FukuokaMobileStickyButton from '@/components/templates/store/fukuoka/sections/MobileStickyButton';
import YokohamaMobileStickyButton from '@/components/templates/store/yokohama/sections/MobileStickyButton';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';

import { Suspense } from 'react';

export default async function StoreReviewsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const result = await getStoreTopConfig(slug, { skipCasts: true });
  const topConfig = result.success ? (result.config as StoreTopPageConfig) : null;

  const cityMap: Record<string, string> = {
    tokyo: '東京', honten: '東京', yokohama: '横浜', nagoya: '名古屋', osaka: '大阪', fukuoka: '福岡'
  };
  const cityName = cityMap[slug] || '福岡';

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `ストロベリーボーイズ ${cityName}店`,
    image: `https://www.sutoroberrys.jp/ogp/store-${slug}.png`,
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "124" },
    review: [
      { "@type": "Review", author: { "@type": "Person", name: "お客様A" }, datePublished: "2025-05-10", reviewBody: "セラピストさんが優しくて最高でした。", reviewRating: { "@type": "Rating", ratingValue: "5" } },
      { "@type": "Review", author: { "@type": "Person", name: "お客様B" }, datePublished: "2025-05-08", reviewBody: "リラックスできました。また利用します。", reviewRating: { "@type": "Rating", ratingValue: "4" } }
    ]
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-pink-50 to-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }} />
      {slug === 'yokohama' && topConfig?.header && <YokohamaHeader config={topConfig.header} />}
      {slug === 'fukuoka' && topConfig?.header && <FukuokaHeader config={topConfig.header} />}

      <main className="mx-auto max-w-6xl flex-grow px-4 py-8">
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
            </div>
          }
        >
          <ReviewList storeSlug={slug} />
        </Suspense>

        <FAQ />
      </main>

      {/* Footer */}
      {slug === 'yokohama' && topConfig?.footer && <YokohamaFooter config={topConfig.footer} />}
      {slug === 'fukuoka' && topConfig?.footer && <FukuokaFooter config={topConfig.footer} />}

      {slug === 'fukuoka' && (
        <FukuokaMobileStickyButton
          config={topConfig?.footer?.bottomNav}
          isVisible={topConfig?.footer?.isBottomNavVisible}
        />
      )}
      {slug === 'yokohama' && (
        <YokohamaMobileStickyButton
          config={topConfig?.footer?.bottomNav}
          isVisible={topConfig?.footer?.isBottomNavVisible}
        />
      )}
    </div>
  );
}
