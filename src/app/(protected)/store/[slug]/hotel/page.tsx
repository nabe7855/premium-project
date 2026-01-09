import AreaExplorer from '@/components/lovehotels/AreaExplorer';
import FeatureArticleCarousel from '@/components/lovehotels/FeatureArticleCarousel';
import HotelCard from '@/components/lovehotels/HotelCard';
import Layout from '@/components/lovehotels/Layout';
import SearchHero from '@/components/lovehotels/SearchHero';
import { PREFECTURES } from '@/data/lovehotels';
import { stores } from '@/data/stores';
import { getHotels } from '@/lib/lovehotelApi';
import { Hotel } from '@/types/lovehotels';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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
  fukuoka: { prefectureId: 'fukuoka' },
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

// Map DB hotel data to frontend Hotel interface
const mapDbHotelToHotel = (dbHotel: any): Hotel => {
  // Use the first exterior image or legacy image_url
  const exteriorImages =
    dbHotel.lh_hotel_images?.filter((img: any) => img.category === 'exterior') || [];
  const mainImage = exteriorImages.length > 0 ? exteriorImages[0].url : dbHotel.image_url || '';

  return {
    id: dbHotel.id,
    name: dbHotel.name,
    prefecture: dbHotel.lh_prefectures?.name || '',
    city: dbHotel.lh_cities?.name || '',
    area: dbHotel.lh_areas?.name || '',
    address: dbHotel.address || '',
    phone: dbHotel.phone || '',
    website: dbHotel.website || '',
    imageUrl: mainImage,
    // Legacy price support (fallback)
    minPriceRest: dbHotel.min_price_rest,
    minPriceStay: dbHotel.min_price_stay,
    // New pricing structure
    restPriceMinWeekday: dbHotel.rest_price_min_weekday,
    restPriceMaxWeekday: dbHotel.rest_price_max_weekday,
    restPriceMinWeekend: dbHotel.rest_price_min_weekend,
    restPriceMaxWeekend: dbHotel.rest_price_max_weekend,
    stayPriceMinWeekday: dbHotel.stay_price_min_weekday,
    stayPriceMaxWeekday: dbHotel.stay_price_max_weekday,
    stayPriceMinWeekend: dbHotel.stay_price_min_weekend,
    stayPriceMaxWeekend: dbHotel.stay_price_max_weekday,
    rating: dbHotel.rating || 0,
    reviewCount: dbHotel.review_count || 0,
    amenities:
      dbHotel.lh_hotel_amenities?.map((a: any) => a.lh_amenities?.name).filter(Boolean) || [],
    services: dbHotel.lh_hotel_services?.map((s: any) => s.lh_services?.name).filter(Boolean) || [],
    distanceFromStation: dbHotel.distance_from_station || '',
    roomCount: dbHotel.room_count || 0,
    description: dbHotel.description || '',
  };
};

export default async function StoreHotelRootPage({ params }: Props) {
  const store = stores[params.slug];
  const location = STORE_LOCATION[params.slug];

  if (!store || !location) notFound();

  // Find the prefecture object for AreaExplorer (using mock master data for explorer structure if needed, or DB if consistent)
  // Currently AreaExplorer uses PREFECTURES constant. We need to match the prefectureId.
  const prefecture = PREFECTURES.find((p) => p.id === location.prefectureId);

  if (!prefecture) notFound();

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

        <AreaExplorer prefecture={prefecture} />

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <div className="flex items-baseline gap-4">
                <h1 className="text-4xl font-black text-gray-900">{store.displayName}周辺</h1>
                <span className="font-bold text-gray-400">のホテルを探す</span>
              </div>
              <p className="mt-2 font-medium text-gray-500">
                {prefecture.name}内の人気ホテルをピックアップ
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
