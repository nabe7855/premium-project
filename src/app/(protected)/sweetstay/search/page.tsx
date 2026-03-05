'use client';

import HotelCard from '@/components/sweetstay/HotelCard';
import TabelogSearch from '@/components/sweetstay/TabelogSearch';
import { getHotels, mapDbHotelToHotel } from '@/lib/lovehotelApi';
import { Hotel } from '@/types/lovehotels';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SweetStaySearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const purpose = searchParams.get('purpose') || '';

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const dbHotels = await getHotels({
          keyword: query,
          // TODO: Support purpose filter in getHotels
        });

        // Manual filter for purpose names for now if getHotels doesn't support it yet
        let mapped = dbHotels.map(mapDbHotelToHotel);
        if (purpose) {
          // If purpose is an ID, we might need a different approach,
          // but mapDbHotelToHotel returns purpose names.
          // For now, let's assume purpose is a name or we add proper filtering to getHotels.
        }

        setHotels(mapped);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query, purpose]);

  return (
    <div className="min-h-screen bg-[#FFF8F6] pb-24 pt-12">
      {/* Re-search Bar */}
      <div className="mb-12">
        <TabelogSearch />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-5xl">
              {query || purpose ? (
                <>
                  {query && <span className="text-[#FF8BA7]">「{query}」</span>}
                  {purpose && <span className="ml-2 text-rose-300">#{purpose}</span>}
                  <span className="ml-4">の検索結果</span>
                </>
              ) : (
                'すべてのホテル'
              )}
            </h1>
            <p className="mt-4 text-xs font-black uppercase tracking-widest text-gray-400">
              {hotels.length} Hotels FOUND in our Selection
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar / Filters */}
          <aside className="w-full lg:w-72">
            <div className="sticky top-28 space-y-8">
              <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-rose-100/20">
                <h2 className="mb-6 text-xs font-black uppercase tracking-widest text-[#FF8BA7]">
                  Quick Filters
                </h2>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                      Rating
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[4, 3, 0].map((r) => (
                        <button
                          key={r}
                          className="rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold text-gray-400 hover:bg-rose-50 hover:text-rose-500"
                        >
                          {r > 0 ? `★ ${r}.0+` : 'All'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] italic text-gray-300">
                    More filters (Price, Area) are being indexed...
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {[1, 2, 4].map((i) => (
                  <div key={i} className="h-[400px] animate-pulse rounded-[2rem] bg-gray-100"></div>
                ))}
              </div>
            ) : hotels.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-400">条件に一致するホテルが見つかりませんでした。</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SweetStaySearchPage;
