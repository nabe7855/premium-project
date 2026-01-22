import { getPriceConfig } from '@/lib/actions/priceConfig';
import { notFound } from 'next/navigation';
import PricePageClient from './PricePageClient';

interface PricePageProps {
  params: {
    slug: string;
  };
}

export default async function PricePage({ params }: PricePageProps) {
  const { slug } = params;

  // 料金設定を取得
  const priceConfig = await getPriceConfig(slug);

  if (!priceConfig) {
    notFound();
  }

  return <PricePageClient priceConfig={priceConfig} />;
}

// 静的生成用のパラメータ生成
export async function generateStaticParams() {
  // 既存の店舗slugを返す
  return [{ slug: 'fukuoka' }, { slug: 'yokohama' }];
}
