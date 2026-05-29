import type { Metadata } from 'next';
import { STORE_META } from '@/lib/store/storeMeta';
import GuideClient from './GuideClient';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const s = STORE_META[slug];
  if (!s) return {};

  const title = `${s.city}店 ご利用システム｜女性用風俗｜ストロベリーボーイズ${s.city}店`;
  const description = `${s.city}（${s.area}）の女性用風俗「ストロベリーボーイズ${s.city}店」のご利用システム。ご利用のルールやマナー、よくある質問などをまとめております。初めての方も安心してご利用いただけるよう丁寧にサポートいたします。`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.sutoroberrys.jp/store/${slug}/guide` },
    openGraph: {
      title,
      description,
      url: `https://www.sutoroberrys.jp/store/${slug}/guide`,
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

export default function GuidePage({ params }: Props) {
  return <GuideClient />;
}
