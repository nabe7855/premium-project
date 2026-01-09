import AreaExplorer from '@/components/lovehotels/AreaExplorer';
import FeatureArticleCarousel from '@/components/lovehotels/FeatureArticleCarousel';
import HotelCard from '@/components/lovehotels/HotelCard';
import Layout from '@/components/lovehotels/Layout';
import SearchHero from '@/components/lovehotels/SearchHero';
import { stores } from '@/data/stores';
import { getHotels, getPrefectureDetails, mapDbHotelToHotel } from '@/lib/lovehotelApi';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 0;

interface Props {
  params: {
    slug: string;
  };
}

// Store slug to location filter mapping
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

  return {
    title: `${store.displayName}周辺のおすすめホテル | Strawberry Boys`,
    description: `${store.displayName}周辺で厳選されたブティックホテルをご紹介します。エリアやこだわり条件から簡単に検索できます。`,
  };
}

export default async function StoreHotelRootPage({ params }: Props) {
  const store = stores[params.slug];
  const location = STORE_LOCATION[params.slug];

  if (!store || !location) notFound();

  // Fetch dynamic city/area data for AreaExplorer
  const dbCities = await getPrefectureDetails(location.prefectureId);

  const dynamicPrefecture = {
    // Keep basic structure, but data comes from DB
    id: location.prefectureId,
    name: store.displayName.replace('周辺', ''),
    count: 0, // Not strictly needed for UI display here
    cities: dbCities,
  };

  // Fetch hotels from DB
  // Make sure getHotels is called dynamically to avoid static build scaling issues if data changes often
  // Next.js might cache this, user can add `export const revalidate = 0;` if they want real-time.
  // For now, let's assume default caching is fine or add specific revalidation if requested.
  const dbHotels = await getHotels({
    prefectureId: location.prefectureId,
    cityId: location.cityId, // Optional, works if defined (e.g. yokohama)
  });

  const hotels = dbHotels.map(mapDbHotelToHotel);

  return (
    <Layout>
      <div className="duration-500 animate-in fade-in">
        <SearchHero />

        {/* Feature Articles Carousel */}
        <FeatureArticleCarousel slug={params.slug} />

        <AreaExplorer prefecture={dynamicPrefecture} />

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <div className="flex items-baseline gap-4">
                <h1 className="text-4xl font-black text-gray-900">{store.displayName}周辺</h1>
                <span className="font-bold text-gray-400">のホテルを探す</span>
              </div>
              <p className="mt-2 font-medium text-gray-500">
                {dynamicPrefecture.name}内の人気ホテルをピックアップ
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
