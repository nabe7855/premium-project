import type { Metadata } from 'next';
import { STORE_META } from '@/lib/store/storeMeta';
import VideosClient from './VideosClient';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const s = STORE_META[slug];
  if (!s) return {};

  const title = `動画一覧｜${s.city}の女性用風俗｜ストロベリーボーイズ${s.city}店`;
  const description = `${s.city}（${s.area}）の女性用風俗「ストロベリーボーイズ${s.city}店」のセラピストの雰囲気がわかる動画一覧。実際の接客風景やインタビューなど、写真だけでは伝わらないイケメンセラピストの魅力をお届けします。`;

  return {
    title,
    description,
    alternates: { canonical: `https://www.sutoroberrys.jp/store/${slug}/videos` },
    openGraph: {
      title,
      description,
      url: `https://www.sutoroberrys.jp/store/${slug}/videos`,
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

export default function VideosPage({ params }: Props) {
  return <VideosClient />;
}
