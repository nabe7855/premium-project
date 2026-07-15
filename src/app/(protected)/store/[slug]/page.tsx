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

const STORE_META: Record<string, {
  city: string; cityKana: string; area: string; areaKw: string[];
}> = {
  tokyo:   { city: "東京",   cityKana: "とうきょう", area: "新宿・渋谷・池袋", areaKw: ["新宿","渋谷","池袋","東京駅","品川"] },
  honten:  { city: "東京",   cityKana: "とうきょう", area: "新宿・渋谷・池袋", areaKw: ["新宿","渋谷","池袋","東京駅","品川"] },
  yokohama:{ city: "横浜",   cityKana: "よこはま",   area: "みなとみらい・関内", areaKw: ["みなとみらい","関内","桜木町","新横浜"] },
  nagoya:  { city: "名古屋", cityKana: "なごや",     area: "栄・名古屋駅",     areaKw: ["栄","名駅","金山","伏見"] },
  osaka:   { city: "大阪",   cityKana: "おおさか",   area: "梅田・難波",       areaKw: ["梅田","難波","心斎橋","天王寺"] },
  fukuoka: { city: "福岡",   cityKana: "ふくおか",   area: "天神・博多",       areaKw: ["天神","博多","中洲"] },
};

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

  const s = STORE_META[params.slug];
  
  if (s) {
    let title = `${s.city}の女性用風俗・出張ホスト｜ストロベリーボーイズ${s.city}店【${s.area}対応】`;
    let metaDescription = `${s.city}（${s.area}）で女性用風俗・出張ホストをお探しならストロベリーボーイズ${s.city}店。完全審査制のイケメンセラピストがホテル・ご自宅で極上の癒しを提供します。`;

    if (params.slug === 'fukuoka') {
      title = `福岡・博多の女性用風俗｜ストロベリーボーイズ福岡店`;
      metaDescription = `福岡（博多・天神・中洲）で女性用風俗・出張ホストをお探しならストロベリーボーイズ福岡店。完全審査制のイケメンセラピストがホテル・ご自宅で極上の癒しをお届け。追加料金なしの明朗会計、初めての方も安心のサポート体制。当日予約OK。`;
    }

    return {
      title: { absolute: title },
      description: metaDescription,
      keywords: ["女性用風俗", "女風", "出張ホスト", s.city, ...s.areaKw, "セラピスト", "女性専用"],
      alternates: { canonical: `https://www.sutoroberrys.jp/store/${params.slug}` },
      openGraph: {
        title, 
        description: metaDescription,
        url: `https://www.sutoroberrys.jp/store/${params.slug}`,
        siteName: "ストロベリーボーイズ",
        images: [{ url: `/ogp/store-${params.slug}.png`, width: 1200, height: 630, alt: shopName }],
        locale: "ja_JP", 
        type: "website",
      },
      twitter: { 
        card: "summary_large_image", 
        title, 
        description: metaDescription, 
        images: [`/ogp/store-${params.slug}.png`] 
      },
    };
  }

  // フォールバック（定義外の店舗）
  const title = `${store.city}の女性用風俗｜ストロベリーボーイズ${store.city}店【${store.city}対応】`;
  const metaDescription = config?.hero?.description?.replace(/\n/g, ' ') || store.seo.description;

  return {
    title: { absolute: title },
    description: metaDescription,
    keywords: store.seo.keywords,
    openGraph: {
      title,
      description: metaDescription,
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
      url: `https://www.sutoroberrys.jp/store/${params.slug}`,
      siteName: "ストロベリーボーイズ",
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
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
export const revalidate = 300;
export const dynamic = 'force-static';

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
      reception_hours: true,
    } as any,
  });

  // 各種データを並列で取得して表示速度を向上
  const [topConfigResult, todayCasts, newsPages] = await Promise.all([
    getStoreTopConfig(params.slug),
    getTodayCastsByStore(params.slug),
    getPublishedPagesByStore(params.slug),
  ]);

  const topConfig = topConfigResult.success
    ? (topConfigResult.config as StoreTopPageConfig)
    : DEFAULT_STORE_TOP_CONFIG;

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
        businessHours: (dbStore as any).business_hours || topConfig?.footer?.shopInfo?.businessHours || staticStore?.businessHours || '',
        receptionHours: (dbStore as any).reception_hours || topConfig?.footer?.shopInfo?.receptionHours || staticStore?.receptionHours || '',
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

  const areaServedData = store.city === '福岡' 
    ? [
        { '@type': 'City', name: '福岡市博多区' },
        { '@type': 'City', name: '福岡市中央区' },
        { '@type': 'City', name: '福岡市南区' },
        { '@type': 'City', name: '福岡市早良区' },
        { '@type': 'City', name: '福岡市東区' },
        { '@type': 'City', name: '福岡市西区' },
        { '@type': 'City', name: '福岡市城南区' }
      ]
    : store.city === '横浜'
    ? [
        { '@type': 'City', name: '横浜市西区' },
        { '@type': 'City', name: '横浜市中区' },
        { '@type': 'City', name: '横浜市神奈川区' },
        { '@type': 'City', name: '横浜市南区' }
      ]
    : { '@type': 'City', name: store.city };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://www.sutoroberrys.jp/store/${params.slug}#localbusiness`,
    name: `ストロベリーボーイズ${store.city}店`,
    description: topConfig?.hero?.description?.replace(/\n/g, ' ') || store.seo.description,
    address: {
      '@type': 'PostalAddress',
      'streetAddress': topConfig?.footer?.shopInfo?.address || store.address,
      'addressLocality': store.city,
      'addressRegion': store.city === '福岡' ? '福岡県' : store.city === '横浜' ? '神奈川県' : '',
      'addressCountry': 'JP',
    },
    areaServed: areaServedData,
    telephone: '+81-50-5491-3991',
    url: `https://www.sutoroberrys.jp/store/${params.slug}`,
    image: topConfig?.hero?.images?.[0] || store.seo.ogImage,
    priceRange: '¥¥',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '12:00',
        closes: '05:00',
      },
    ],
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: '女性用風俗・女性専用リラクゼーション',
    provider: {
      '@type': 'LocalBusiness',
      name: `ストロベリーボーイズ${store.city}店`,
    },
    areaServed: areaServedData,
    serviceType: '女性用風俗・出張リラクゼーション',
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: 'https://www.sutoroberrys.jp/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '店舗一覧',
        item: 'https://www.sutoroberrys.jp/store',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: store.city === '福岡' ? '福岡店' : store.city === '横浜' ? '横浜店' : `${store.city}店`,
        item: `https://www.sutoroberrys.jp/store/${params.slug}`,
      },
    ],
  };

  const structuredData = [localBusinessSchema, serviceSchema, breadcrumbSchema];

  // SEO用H1テキスト
  const s = STORE_META[params.slug];
  const h1Text = s
    ? `${s.city}の女性用風俗｜ストロベリーボーイズ${s.city}店【${params.slug === 'fukuoka' ? '博多・天神・中洲' : s.area}対応】`
    : `${store.city}の女性用風俗｜ストロベリーボーイズ${store.city}店【${store.city}対応】`;

  // テンプレート振り分け
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <h1 className="sr-only">{h1Text}</h1>
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
