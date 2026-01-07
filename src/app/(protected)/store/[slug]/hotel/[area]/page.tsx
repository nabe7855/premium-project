import HotelCard from '@/components/lovehotels/HotelCard';
import Layout from '@/components/lovehotels/Layout';
import { MOCK_HOTELS, PREFECTURES } from '@/data/lovehotels';
import { stores } from '@/data/stores';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
    area: string;
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

  // Area ID から表示名を取得
  const prefName = SLUG_TO_PREF[params.slug];
  const prefecture = PREFECTURES.find((p) => p.name === prefName);
  const city = prefecture?.cities.find((c) => c.id === params.area);
  const displayName = city?.name || params.area;

  return {
    title: `${store.displayName}周辺のおすすめホテル（${displayName}エリア） | Strawberry Boys`,
    description: `${store.displayName}の${displayName}エリア周辺で厳選されたブティックホテルをご紹介します。`,
  };
}

export default function StoreAreaHotelPage({ params }: Props) {
  const store = stores[params.slug];
  const prefName = SLUG_TO_PREF[params.slug];

  if (!store || !prefName) notFound();

  const prefecture = PREFECTURES.find((p) => p.name === prefName);
  const city = prefecture?.cities.find((c) => c.id === params.area);
  const areaName = city?.name || decodeURIComponent(params.area);

  // 該当する県内 かつ エリア内のホテルを抽出
  const hotels = MOCK_HOTELS.filter((h) => {
    const matchPref = h.prefecture === prefName;
    const matchArea = city ? h.city === city.name : h.area === areaName;
    return matchPref && matchArea;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Link
            href={`/store/${params.slug}/hotel`}
            className="group mb-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm transition-all hover:border-rose-500 hover:bg-rose-500 hover:text-white active:scale-95"
          >
            ← {store.displayName}周辺一覧へ
          </Link>

          <div className="mb-12">
            <div className="flex items-baseline gap-4">
              <h1 className="text-4xl font-black text-gray-900">{areaName}</h1>
              <span className="font-bold text-gray-400">エリアのホテル</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
            {hotels.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="font-bold text-gray-400">
                  このエリアには現在ホテル情報がありません。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
