import Layout from '@/components/lovehotels/Layout';
import SearchPageContent from '@/components/lovehotels/SearchPageContent';
import { stores } from '@/data/stores';
import { getHotels, mapDbHotelToHotel } from '@/lib/lovehotelApi';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  };
  searchParams: {
    q?: string;
  };
}

const STORE_LOCATION: Record<string, { prefectureId: string; cityId?: string }> = {
  tokyo: { prefectureId: 'tokyo' },
  osaka: { prefectureId: 'osaka' },
  nagoya: { prefectureId: 'aichi' },
  fukuoka: { prefectureId: 'Fukuoka' },
  yokohama: { prefectureId: 'kanagawa', cityId: 'yokohama' },
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const store = stores[params.slug];
  const query = searchParams.q || '';
  if (!store) return { title: 'Not Found' };

  return {
    title: `「${query}」の検索結果 | ${store.displayName}周辺のおすすめホテル`,
    description: `${store.displayName}周辺での「${query}」の検索結果を表示しています。`,
  };
}

export default async function StoreHotelSearchPage({ params, searchParams }: Props) {
  const store = stores[params.slug];
  const location = STORE_LOCATION[params.slug];

  if (!store || !location) notFound();

  const query = searchParams.q || '';

  // Fetch real hotels from DB based on keyword
  const dbHotels = await getHotels({
    prefectureId: location.prefectureId,
    cityId: location.cityId,
    keyword: query,
  });

  const hotels = dbHotels.map(mapDbHotelToHotel);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Link
            href={`/store/${params.slug}/hotel`}
            className="group mb-6 inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm transition-all hover:border-rose-500 hover:bg-rose-500 hover:text-white active:scale-95"
          >
            ← トップへ戻る
          </Link>

          <section className="mb-8">
            <h1 className="text-4xl font-black text-gray-900">「{query}」の検索結果</h1>
            <p className="mt-2 font-bold text-gray-400">{store.displayName}周辺のホテルから検索</p>
          </section>

          <SearchPageContent initialHotels={hotels} query={query} storeName={store.displayName} />
        </div>
      </div>
    </Layout>
  );
}
