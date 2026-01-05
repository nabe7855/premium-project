<<<<<<< HEAD
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HeroSection from '@/components/sections/store/HeroSection';
import CastSliderSection from '@/components/sections/store/CastSliderSection';
import NewcomerSection from '@/components/sections/store/NewcomerSection';
import EventSection from '@/components/sections/store/EventSection';
import DiarySection from '@/components/sections/store/DiarySection';
import MediaSection from '@/components/sections/store/MediaSection';
import VideoSection from '@/components/sections/store/VideoSection';
import ReviewSection from '@/components/sections/store/ReviewSection';
import PlanSection from '@/components/sections/store/PlanSection';
import AIMatchingSection from '@/components/sections/store/AIMatchingSection';
import ClosingCTA from '@/components/sections/store/ClosingCTA';
import { getStoreData } from '@/lib/store/store-data';
import { StoreProvider } from '@/contexts/StoreContext';
import React from 'react';
import { BannerSlideSection } from '@/components/sections/BannerSlideSection';
import { TestimonialSection } from '@/components/sections/TestimonialSection';
import { getTodayCastsByStore } from '@/lib/getTodayCastsByStore'; // 👈 追加
=======
import CommonTopPage from '@/components/templates/store/common/page-templates/TopPage';
import FukuokaTopPage from '@/components/templates/store/fukuoka/page-templates/TopPage';
import { getTodayCastsByStore } from '@/lib/getTodayCastsByStore';
import { getStoreData } from '@/lib/store/store-data';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
>>>>>>> animation-test

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

<<<<<<< HEAD
=======
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
>>>>>>> animation-test
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

<<<<<<< HEAD
export default async function StorePage({ params }: StorePageProps) {
  const store = getStoreData(params.slug);

  if (!store) {
    notFound();
  }

  // ✅ Supabaseから今日のキャストを取得
=======
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
>>>>>>> animation-test
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

<<<<<<< HEAD
  return (
    <StoreProvider store={store}>
      <div className={`min-h-screen ${store.theme.bodyClass}`}>
=======
  // テンプレート振り分け
  if (store.template === 'fukuoka') {
    return (
      <div>
>>>>>>> animation-test
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
<<<<<<< HEAD

        <main>
          <HeroSection />
          <TestimonialSection />
          <BannerSlideSection />
          <CastSliderSection casts={todayCasts} /> {/* 👈 propsで渡す */}
          <NewcomerSection />
          <EventSection />
          <DiarySection />
          <MediaSection />
          <VideoSection />
          <ReviewSection />
          <PlanSection />
          <AIMatchingSection />
          <ClosingCTA />
        </main>
      </div>
    </StoreProvider>
  );
=======
        <FukuokaTopPage />
      </div>
    );
  }

  // その他の店舗は共通テンプレートを表示
  return <CommonTopPage store={store} todayCasts={todayCasts} structuredData={structuredData} />;
>>>>>>> animation-test
}
