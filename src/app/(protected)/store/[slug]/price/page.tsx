import { getPriceConfig } from '@/lib/actions/priceConfig';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { STORE_META } from '@/lib/store/storeMeta';
import PricePageClient from './PricePageClient';

interface PricePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PricePageProps): Promise<Metadata> {
  const s = STORE_META[params.slug];
  if (!s) return {};
  
  const title = `${s.city}店の料金システム｜女性用風俗・出張ホスト｜ストロベリーボーイズ${s.city}店`;
  const desc = `${s.city}（${s.area}）の女性用風俗「ストロベリーボーイズ${s.city}店」の料金システム。完全審査制のイケメンセラピストによる極上のリラクゼーションを明朗会計でご利用いただけます。`;
  
  return {
    title,
    description: desc,
    alternates: { canonical: `https://www.sutoroberrys.jp/store/${params.slug}/price` },
    openGraph: {
      title,
      description: desc,
      url: `https://www.sutoroberrys.jp/store/${params.slug}/price`,
      images: [{ url: `/ogp/store-${params.slug}.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [`/ogp/store-${params.slug}.png`]
    }
  };
}

export default async function PricePage({ params }: PricePageProps) {
  const { slug } = params;

  // 店舗データを取得
  const store = getStoreData(slug);
  if (!store) {
    notFound();
  }

  // 料金設定を取得
  const priceConfig = await getPriceConfig(slug);

  if (!priceConfig) {
    notFound();
  }

  // 店舗トップページの設定を取得 (ヘッダー用)
  const configResponse = await getStoreTopConfig(slug);
  const config = configResponse.success ? configResponse.config : null;

  return <PricePageClient priceConfig={priceConfig} config={config} />;
}

// 静的生成用のパラメータ生成
export async function generateStaticParams() {
  // 既存の店舗slugを返す
  return [{ slug: 'fukuoka' }, { slug: 'yokohama' }];
}
