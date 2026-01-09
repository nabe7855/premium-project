import HotelCard from '@/components/lovehotels/HotelCard';
import Layout from '@/components/lovehotels/Layout';
import { stores } from '@/data/stores';
import { getHotels, mapDbHotelToHotel } from '@/lib/lovehotelApi';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
    area: string;
  };
}

const STORE_LOCATION: Record<string, { prefectureId: string; cityId?: string }> = {
  tokyo: { prefectureId: 'tokyo' },
  osaka: { prefectureId: 'osaka' },
  nagoya: { prefectureId: 'aichi' },
  fukuoka: { prefectureId: 'Fukuoka' },
  yokohama: { prefectureId: 'kanagawa', cityId: 'yokohama' },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const store = stores[params.slug];
  if (!store) return { title: 'Not Found' };

  const areaName = decodeURIComponent(params.area);

  return {
    title: `${store.displayName}周辺のおすすめホテル（${areaName}エリア） | Strawberry Boys`,
    description: `${store.displayName}の${areaName}エリア周辺で厳選されたブティックホテルをご紹介します。`,
  };
}

export default async function StoreAreaHotelPage({ params }: Props) {
  const store = stores[params.slug];
  const location = STORE_LOCATION[params.slug];

  if (!store || !location) notFound();

  const areaId = decodeURIComponent(params.area);

  // Fetch real hotels from DB
  const dbHotels = await getHotels({
    prefectureId: location.prefectureId,
    cityId: areaId, // params.area fits cityId for cities select
  });

  const hotels = dbHotels.map(mapDbHotelToHotel);
  const displayName = hotels.length > 0 ? (hotels[0] as any).city : areaId;

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
              <h1 className="text-4xl font-black text-gray-900">{displayName}</h1>
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
