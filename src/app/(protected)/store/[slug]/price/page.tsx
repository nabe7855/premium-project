import { getPriceConfig } from '@/lib/actions/priceConfig';
import { getStoreTopConfig } from '@/lib/store/getStoreTopConfig';
import { getStoreData } from '@/lib/store/store-data';
import { notFound } from 'next/navigation';
import PricePageClient from './PricePageClient';

interface PricePageProps {
  params: {
    slug: string;
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
