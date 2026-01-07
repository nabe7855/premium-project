import AreaExplorer from '@/components/lovehotels/AreaExplorer';
import HotelCard from '@/components/lovehotels/HotelCard';
import Layout from '@/components/lovehotels/Layout';
import SearchHero from '@/components/lovehotels/SearchHero';
import { MOCK_HOTELS, PREFECTURES } from '@/data/lovehotels';
import { stores } from '@/data/stores';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  };
}

const SLUG_TO_PREF: Record<string, string> = {
  tokyo: '東京都',
  osaka: '大阪府',
  nagoya: '愛知県',
  fukuoka: '福岡県',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = stores[params.slug];
  if (!store) return { title: 'Not Found' };

  return {
    title: `${store.displayName}周辺のおすすめホテル | Strawberry Boys`,
    description: `${store.displayName}周辺で厳選されたブティックホテルをご紹介します。エリアやこだわり条件から簡単に検索できます。`,
  };
}

export default function StoreHotelRootPage({ params }: Props) {
  const store = stores[params.slug];
  const prefName = SLUG_TO_PREF[params.slug];

  const prefecture = PREFECTURES.find((p) => p.name === prefName);

  if (!store || !prefName || !prefecture) notFound();

  // 該当する県内のホテルのみを抽出
  const hotels = MOCK_HOTELS.filter((h) => h.prefecture === prefName);

  return (
    <Layout>
      <div className="duration-500 animate-in fade-in">
        <SearchHero />

        <AreaExplorer prefecture={prefecture} />

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <div className="flex items-baseline gap-4">
                <h1 className="text-4xl font-black text-gray-900">{store.displayName}周辺</h1>
                <span className="font-bold text-gray-400">のホテルを探す</span>
              </div>
              <p className="mt-2 font-medium text-gray-500">
                {prefName}内の人気ホテルをピックアップ
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
              {hotels.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="font-bold text-gray-400">
                    現在、このエリアのホテル情報は準備中です。
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
