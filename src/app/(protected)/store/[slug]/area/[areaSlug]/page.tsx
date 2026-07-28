import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AreaLpClient, { AreaDetailInfo } from '@/components/sections/area/AreaLpClient';
import { getCastsByStore } from '@/lib/getCastsByStore';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import FukuokaHeader from '@/components/templates/store/fukuoka/sections/Header';
import FukuokaFooter from '@/components/templates/store/fukuoka/sections/Footer';
import YokohamaHeader from '@/components/templates/store/yokohama/sections/Header';
import YokohamaFooter from '@/components/templates/store/yokohama/sections/Footer';
import FukuokaMobileStickyButton from '@/components/templates/store/fukuoka/sections/MobileStickyButton';
import YokohamaMobileStickyButton from '@/components/templates/store/yokohama/sections/MobileStickyButton';

import { AREA_MAP, TARGET_AREAS } from '@/lib/area-data';

interface AreaPageProps {
  params: {
    slug: string;
    areaSlug: string;
  };
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const key = `${params.slug}-${params.areaSlug}`;
  const areaInfo = AREA_MAP[key];

  if (!areaInfo) {
    return { title: 'ページが見つかりません' };
  }

  const title = `【公式】${areaInfo.name}の女性用風俗・女風｜ストロベリーボーイズ${areaInfo.cityName}店【出張セラピー】`;
  const description = `${areaInfo.name}（${areaInfo.cityName}）で女性用風俗・女風・出張ホストをお探しならストロベリーボーイズ。${areaInfo.description}`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://www.sutoroberrys.jp/store/${params.slug}/area/${params.areaSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.sutoroberrys.jp/store/${params.slug}/area/${params.areaSlug}`,
      siteName: 'Strawberry Boys',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return TARGET_AREAS.map((a) => ({
    slug: a.slug,
    areaSlug: a.areaSlug,
  }));
}

import { getHotels, mapDbHotelToHotel } from '@/lib/lovehotelApi';

const STORE_LOCATION: Record<string, { prefectureId: string; cityId?: string }> = {
  fukuoka: { prefectureId: 'Fukuoka' },
  yokohama: { prefectureId: 'Kanagawa', cityId: 'Yokohama-shi' },
};

export default async function AreaLPPage({ params }: AreaPageProps) {
  const key = `${params.slug}-${params.areaSlug}`;
  const areaInfo = AREA_MAP[key];

  if (!areaInfo) {
    notFound();
  }

  const loc = STORE_LOCATION[params.slug] || { prefectureId: 'Fukuoka' };

  // 並列フェッチ (キャスト、設定、エリア対応ホテル)
  const [casts, topConfigResult, dbHotels] = await Promise.all([
    getCastsByStore(params.slug),
    getStoreTopConfig(params.slug, { skipCasts: true }),
    getHotels({ prefectureId: loc.prefectureId, cityId: loc.cityId }),
  ]);

  const topConfig = topConfigResult.success ? (topConfigResult.config as StoreTopPageConfig) : null;
  const hotels = (dbHotels || []).map(mapDbHotelToHotel);

  // JSON-LD (Service & FAQPage リッチリザルト対応)
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${areaInfo.name}出張女性用風俗サービス - ストロベリーボーイズ${areaInfo.cityName}店`,
    provider: {
      '@type': 'Organization',
      name: 'Strawberry Boys',
      url: 'https://www.sutoroberrys.jp',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: `${areaInfo.name}（${areaInfo.cityName}）`,
    },
    description: areaInfo.description,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${areaInfo.name}エリアでホテルや自宅への出張利用は可能ですか？`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `はい、${areaInfo.name}エリア内の提携ホテル・シティホテル・ご自宅への出張利用に対応しております。`,
        },
      },
      {
        '@type': 'Question',
        name: '初めての利用でも安心して利用できますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'はい、完全審査制のイケメンセラピストが丁寧におもてなしいたします。明朗会計で事前の不安もしっかりサポートいたします。',
        },
      },
      {
        '@type': 'Question',
        name: '予約方法はどのようになりますか？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Web予約フォームまたは公式LINEより24時間いつでも簡単にご予約いただけます。',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ヘッダー */}
      {params.slug === 'yokohama' && topConfig?.header && <YokohamaHeader config={topConfig.header} />}
      {params.slug === 'fukuoka' && topConfig?.header && <FukuokaHeader config={topConfig.header} />}

      <main className="min-h-screen">
        <AreaLpClient areaInfo={areaInfo} casts={casts} hotels={hotels} storeSlug={params.slug} />
      </main>

      {/* フッター */}
      {params.slug === 'yokohama' && topConfig?.footer && <YokohamaFooter config={topConfig.footer} />}
      {params.slug === 'fukuoka' && topConfig?.footer && <FukuokaFooter config={topConfig.footer} />}

      {/* モバイル追従予約ボタン */}
      {params.slug === 'fukuoka' && (
        <FukuokaMobileStickyButton
          config={topConfig?.footer?.bottomNav}
          isVisible={topConfig?.footer?.isBottomNavVisible}
        />
      )}
      {params.slug === 'yokohama' && (
        <YokohamaMobileStickyButton
          config={topConfig?.footer?.bottomNav}
          isVisible={topConfig?.footer?.isBottomNavVisible}
        />
      )}
    </>
  );
}
