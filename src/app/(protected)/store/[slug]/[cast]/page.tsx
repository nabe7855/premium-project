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

export default function CastPage({ params }: Props) {
  // params contains store (mapped to slug in route maybe?) and cast
  // Wait, route is /store/[slug]/[cast]/page.tsx so params has slug and cast.
  // The client component expects { params: { store: string; cast: string; } } but is using it loosely.
  return <CastClient params={{ store: params.slug, cast: params.cast }} />;
}
