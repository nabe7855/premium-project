import CommonTopPage from '@/components/templates/store/common/page-templates/TopPage';
import FukuokaTopPage from '@/components/templates/store/fukuoka/page-templates/TopPage';
import YokohamaTopPage from '@/components/templates/store/yokohama/page-templates/TopPage';
import { getPublishedPagesByStore } from '@/lib/actions/news-pages';
import { getTodayCastsByStore } from '@/lib/getTodayCastsByStore';
import { prisma } from '@/lib/prisma';
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
      canonical: `https://www.sutoroberrys.jp/store/${params.slug}`,
    },
  };
}

export function generateStaticParams() {
  return [{ slug: 'fukuoka' }, { slug: 'yokohama' }];
}

export const dynamicParams = true;

export default async function StorePage({ params }: StorePageProps) {
  console.log('🔍 StorePage params:', params);
  const staticStore = getStoreData(params.slug);

  // DBから最新の店舗情報を取得
  const dbStore = await prisma.store.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      name: true,
      slug: true,
      address: true,
      phone: true,
      catch_copy: true,
      image_url: true,
      theme_color: true,
      tags: true,
      description: true,
      line_id: true,
      line_url: true,
      notification_email: true,
      business_hours: true,
    } as any,
  });

  const store = dbStore
    ? ({
        ...staticStore,
        ...dbStore,
        name: dbStore.name || staticStore?.name || '',
        contact: {
          phone: dbStore.phone || staticStore?.contact.phone || '',
          line:
            dbStore.line_url ||
            ((dbStore as any).line_id
              ? `https://line.me/R/ti/p/${(dbStore as any).line_id.startsWith('@') ? (dbStore as any).line_id : '@' + (dbStore as any).line_id}`
              : staticStore?.contact.line || ''),
          email: dbStore.notification_email || staticStore?.contact.email || '',
        },
        address: dbStore.address || staticStore?.address || '',
        businessHours: (dbStore as any).business_hours || staticStore?.businessHours || '',
        seo: {
          ...staticStore?.seo,
          description: dbStore.description || staticStore?.seo.description || '',
        },
        template: staticStore?.template || 'common',
        reviews: staticStore?.reviews || [],
      } as any)
    : staticStore;

  console.log(`🔍 getStoreData('${params.slug}'):`, store ? 'Found' : 'Not Found');

  if (!store) {
    console.error(`❌ Store data not found for slug: ${params.slug}`);
    notFound();
  }

  // 各種データを並列で取得して表示速度を向上
  const [topConfigResult, todayCasts, newsPages] = await Promise.all([
    getStoreTopConfig(params.slug),
    getTodayCastsByStore(params.slug),
    getPublishedPagesByStore(params.slug),
  ]);

  const topConfig = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

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
    url: `https://www.sutoroberrys.jp/store/${params.slug}`,
    image: topConfig?.hero?.images?.[0] || store.seo.ogImage,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '247',
    },
    review: store.reviews?.slice(0, 3).map((review: any) => ({
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {store.template === 'fukuoka' ? (
        <FukuokaTopPage
          config={topConfig as any}
          newsPages={newsPages}
          storeSlug={params.slug}
          todayCasts={todayCasts}
        />
      ) : store.template === 'yokohama' ? (
        <YokohamaTopPage
          config={topConfig as any}
          newsPages={newsPages}
          storeSlug={params.slug}
          todayCasts={todayCasts}
        />
      ) : (
        <CommonTopPage
          store={store}
          todayCasts={todayCasts}
          structuredData={structuredData}
          topConfig={topConfig}
          newsPages={newsPages}
        />
      )}
    </>
  );
}
