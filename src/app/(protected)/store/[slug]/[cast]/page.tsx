import type { Metadata } from 'next';
import { STORE_META } from '@/lib/store/storeMeta';
import { getCastProfileBySlug } from '@/lib/getCastProfileBySlug';
import CastClient from './CastClient';

interface Props {
  params: {
    slug: string;
    cast: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, cast: castSlug } = params;
  const s = STORE_META[slug];
  const cast = await getCastProfileBySlug(castSlug);

  if (!s || !cast || !cast.isActive) return {
    title: 'セラピストが見つかりません | ストロベリーボーイズ',
  };

  const title = `${cast.name}のプロフィール｜${s.city}の女性用風俗｜ストロベリーボーイズ${s.city}店`;
  const description = `${s.city}（${s.area}）の女性用風俗「ストロベリーボーイズ${s.city}店」に在籍するイケメンセラピスト、${cast.name}のプロフィール。${cast.catchCopy || ''} ${cast.aiSummary ? cast.aiSummary.slice(0, 50) + '...' : ''}`;
  const siteUrl = 'https://www.sutoroberrys.jp';
  const pageUrl = `${siteUrl}/store/${slug}/cast/${castSlug}`;
  
  // profile image logic - assuming galleryItems[0] exists
  const firstGalleryItem = cast.galleryItems && cast.galleryItems.length > 0 ? cast.galleryItems[0] : null;
  const image = firstGalleryItem ? (typeof firstGalleryItem === 'string' ? firstGalleryItem : (firstGalleryItem as any).url || (firstGalleryItem as any).src || `/ogp/store-${slug}.png`) : `/ogp/store-${slug}.png`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [{ url: image, width: 1200, height: 630, alt: cast.name }],
      type: 'profile',
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}

export default async function CastPage({ params }: Props) {
  const { slug, cast: castSlug } = params;
  const s = STORE_META[slug];
  const cast = await getCastProfileBySlug(castSlug);

  const cityName = s?.city || '福岡';
  const reviews = (cast as any)?.reviews || [];
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 5), 0) / reviewCount).toFixed(1)
    : '4.9';

  const castSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: cast?.name || 'セラピスト',
    jobTitle: 'セラピスト',
    worksFor: {
      '@type': 'Organization',
      name: `ストロベリーボーイズ${cityName}店`,
      url: `https://www.sutoroberrys.jp/store/${slug}`,
    },
    url: `https://www.sutoroberrys.jp/store/${slug}/cast/${castSlug}`,
    image: cast?.imageUrl || `/ogp/store-${slug}.png`,
    description: cast?.catchCopy || `${cityName}の女性用風俗ストロベリーボーイズ${cityName}店のセラピスト`,
  };

  if (reviewCount > 0) {
    castSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: reviewCount,
      bestRating: '5',
      worstRating: '1',
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(castSchema) }}
      />
      <CastClient params={{ store: params.slug, cast: params.cast }} />
    </>
  );
}
