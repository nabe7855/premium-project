import CommonTopPage from '@/components/templates/store/common/page-templates/TopPage';
import FukuokaTopPage from '@/components/templates/store/fukuoka/page-templates/TopPage';
import YokohamaTopPage from '@/components/templates/store/yokohama/page-templates/TopPage';
import { getTodayCastsByStore } from '@/lib/getTodayCastsByStore';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { DEFAULT_STORE_TOP_CONFIG, StoreTopPageConfig } from '@/lib/store/storeTopConfig';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface StorePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const store = getStoreData(params.slug);

  if (!store) {
    return {
      title: 'ページが見つかりません',
    };
  }

  // DBから最新の設定を取得 (失敗した場合はデフォルトを使用)
  const topConfigResult = await getStoreTopConfig(params.slug);
  const config = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  // 動的な値を抽出 (設定がない場合はフォールバック)
  const shopName = config?.footer?.shopInfo?.name || store.name;
  const mainHeading = config?.hero?.mainHeading || '';
  const subHeading = config?.hero?.subHeading || '';
  const description = config?.hero?.description?.replace(/\n/g, ' ') || store.seo.description;
  const ogImage = config?.hero?.images?.[0] || store.seo.ogImage;

  const title = config?.hero?.mainHeading
    ? `${shopName} | ${mainHeading}${subHeading}`
    : `${shopName} | 女性専用リラクゼーション`;

  return {
    title,
    description,
    keywords: store.seo.keywords,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: shopName,
        },
      ],
      type: 'website',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `https://strawberry-boy.com/${params.slug}`,
    },
  };
}

export function generateStaticParams() {
  return [{ slug: 'tokyo' }, { slug: 'osaka' }, { slug: 'nagoya' }, { slug: 'yokohama' }];
}

export const dynamicParams = true;

export default async function StorePage({ params }: StorePageProps) {
  console.log('🔍 StorePage params:', params);
  const store = getStoreData(params.slug);
  console.log(`🔍 getStoreData('${params.slug}'):`, store ? 'Found' : 'Not Found');

  if (!store) {
    console.error(`❌ Store data not found for slug: ${params.slug}`);
    notFound();
  }

  // 店舗トップ設定を取得
  const topConfigResult = await getStoreTopConfig(params.slug);
  const topConfig = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

  // Supabaseから今日のキャストを取得
  const todayCasts = await getTodayCastsByStore(params.slug);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: topConfig?.footer?.shopInfo?.name || store.name,
    description: topConfig?.hero?.description?.replace(/\n/g, ' ') || store.seo.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: store.city,
      addressCountry: 'JP',
    },
    telephone: topConfig?.footer?.shopInfo?.phone || store.contact.phone,
    url: `https://strawberry-boy.com/${params.slug}`,
    image: topConfig?.hero?.images?.[0] || store.seo.ogImage,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '247',
    },
    review: store.reviews.slice(0, 3).map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
      },
      reviewBody: review.content,
    })),
  };

  // テンプレート振り分け
  if (store.template === 'fukuoka') {
    return (
      <div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <FukuokaTopPage config={topConfig as any} />
      </div>
    );
  }

  if (store.template === 'yokohama') {
    return (
      <div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <YokohamaTopPage config={topConfig as any} />
      </div>
    );
  }

  // その他の店舗は共通テンプレートを表示
  return (
    <CommonTopPage
      store={store}
      todayCasts={todayCasts}
      structuredData={structuredData}
      topConfig={topConfig}
    />
  );
}
