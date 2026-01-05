import CommonTopPage from '@/components/templates/store/common/page-templates/TopPage';
import FukuokaTopPage from '@/components/templates/store/fukuoka/page-templates/TopPage';
import { getTodayCastsByStore } from '@/lib/getTodayCastsByStore';
import { getStoreData } from '@/lib/store/store-data';
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

  // 福岡店の場合は専用のメタデータロジック
  if (store.template === 'fukuoka') {
    return {
      title: 'LUMIÈRE 福岡 | 女性専用リラクゼーション',
      description:
        '福岡で愛される女性専用リラクゼーション。厳選されたセラピストが、心を込めてお迎えします。',
      keywords: '福岡,リラクゼーション,女性専用,メンズセラピスト,癒し',
      openGraph: {
        title: 'LUMIÈRE 福岡 | 女性専用リラクゼーション',
        description:
          '福岡で愛される女性専用リラクゼーション。厳選されたセラピストが、心を込めてお迎えします。',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
            width: 1200,
            height: 630,
            alt: 'LUMIÈRE 福岡',
          },
        ],
        type: 'website',
        locale: 'ja_JP',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'LUMIÈRE 福岡 | 女性専用リラクゼーション',
        description:
          '福岡で愛される女性専用リラクゼーション。厳選されたセラピストが、心を込めてお迎えします。',
        images: [
          'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
        ],
      },
      alternates: {
        canonical: `https://strawberry-boy.com/${params.slug}`,
      },
    };
  }

  // その他の店舗は既存のメタデータ
  return {
    title: store.seo.title,
    description: store.seo.description,
    keywords: store.seo.keywords,
    openGraph: {
      title: store.seo.title,
      description: store.seo.description,
      images: [
        {
          url: store.seo.ogImage,
          width: 1200,
          height: 630,
          alt: store.seo.title,
        },
      ],
      type: 'website',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title: store.seo.title,
      description: store.seo.description,
      images: [store.seo.ogImage],
    },
    alternates: {
      canonical: `https://strawberry-boy.com/${params.slug}`,
    },
  };
}

export function generateStaticParams() {
  return [{ slug: 'tokyo' }, { slug: 'osaka' }, { slug: 'nagoya' }];
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

  // Supabaseから今日のキャストを取得
  const todayCasts = await getTodayCastsByStore(params.slug);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: store.name,
    description: store.seo.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: store.city,
      addressCountry: 'JP',
    },
    telephone: store.contact.phone,
    url: `https://strawberry-boy.com/${params.slug}`,
    image: store.seo.ogImage,
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
        <FukuokaTopPage />
      </div>
    );
  }

  // その他の店舗は共通テンプレートを表示
  return <CommonTopPage store={store} todayCasts={todayCasts} structuredData={structuredData} />;
}
