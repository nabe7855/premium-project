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
import { getReviewsByStore } from '@/lib/getReviewsByStore';

import { Suspense } from 'react';
import type { Metadata } from 'next';
import { STORE_META } from '@/lib/store/storeMeta';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const s = STORE_META[slug];
  if (!s) return {};

  const title = `お客様の声・口コミ｜${s.city}の女性用風俗｜ストロベリーボーイズ${s.city}店`;
  const description = `${s.city}（${s.area}）の女性用風俗「ストロベリーボーイズ${s.city}店」をご利用いただいたお客様からのリアルな声・口コミをご紹介します。完全審査制の高品質なサービスを体験したお客様の感想をご確認ください。`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.sutoroberrys.jp/store/${slug}/reviews` },
    openGraph: {
      title,
      description,
      url: `https://www.sutoroberrys.jp/store/${slug}/reviews`,
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

export default async function StoreReviewsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // 並列で設定と初期口コミを取得
  const [result, initialReviewsData] = await Promise.all([
    getStoreTopConfig(slug, { skipCasts: true }),
    getReviewsByStore(slug, { limit: 20, offset: 0 })
  ]);
  
  const topConfig = result.success ? (result.config as StoreTopPageConfig) : null;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-pink-50 to-white">
      {slug === 'yokohama' && topConfig?.header && <YokohamaHeader config={topConfig.header} />}
      {slug === 'fukuoka' && topConfig?.header && <FukuokaHeader config={topConfig.header} />}

      <main className="mx-auto max-w-6xl flex-grow px-4 py-8">
        <h1 className="sr-only">お客様の声・口コミ</h1>
        {/* 特集：お客様体験談インタビュー (あやさん) */}
        <div className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 p-1 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between rounded-[22px] bg-white p-6 md:p-8">
            <div className="flex-1 pr-0 md:pr-6 mb-6 md:mb-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-3.5 py-1 text-[11px] font-bold text-pink-600 mb-3">
                <span>✨ リアル体験ストーリー</span>
              </div>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-gray-800 leading-snug mb-3">
                「このままおばあさんになりたくなかった」
              </h2>
              <p className="text-xs md:text-sm leading-relaxed text-gray-600 mb-4">
                夫はいるのに、女として見てもらえない——。半年以上迷った既婚のあやさん（30代・子育て中）が、予約ボタンを押すまでのリアルな葛藤と体験記。
              </p>
              <a
                href="/amolab/voice-aya"
                className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-pink-500 transition-colors hover:text-pink-600"
              >
                あやさんの体験談を読む <span className="text-base">→</span>
              </a>
            </div>
            <div className="w-full md:w-56 flex-shrink-0 relative aspect-[16/10] overflow-hidden rounded-2xl bg-pink-50">
              <img
                src="/images/amolab/aya/aya-photo-top.webp"
                alt="あやさん体験談"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500 border-t-transparent"></div>
            </div>
          }
        >
          <ReviewList storeSlug={slug} initialData={initialReviewsData} />
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
