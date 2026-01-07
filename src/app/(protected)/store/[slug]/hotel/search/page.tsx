import FilterSidebar from '@/components/lovehotels/FilterSidebar';
import HotelCard from '@/components/lovehotels/HotelCard';
import Layout from '@/components/lovehotels/Layout';
import { MOCK_HOTELS } from '@/data/lovehotels';
import { stores } from '@/data/stores';
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

const SLUG_TO_PREF: Record<string, string> = {
  tokyo: '東京都',
  osaka: '大阪府',
  nagoya: '愛知県',
  fukuoka: '福岡県',
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

export default function StoreHotelSearchPage({ params, searchParams }: Props) {
  const store = stores[params.slug];
  const prefName = SLUG_TO_PREF[params.slug];

  if (!store || !prefName) notFound();

  const query = searchParams.q || '';

  const hotels = MOCK_HOTELS.filter((h) => {
    const isTargetPref = h.prefecture === prefName;
    const searchString =
      `${h.name} ${h.prefecture} ${h.city} ${h.area} ${h.description}`.toLowerCase();
    return isTargetPref && searchString.includes(query.toLowerCase());
  });

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

          <FilterSidebar onFilterChange={() => {}} />

          <div className="mb-8 mt-8 flex flex-col items-start justify-between gap-4 rounded-[2rem] border border-gray-100 bg-white px-8 py-5 shadow-sm md:flex-row md:items-center">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
              <span className="mr-2 font-black text-gray-900">{hotels.length} 件</span>
              のホテルが見つかりました
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
            {hotels.length === 0 && (
              <div className="col-span-full rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
                <p className="font-bold italic text-gray-400">
                  一致するホテルが見つかりませんでした。別のキーワードでお試しください。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
