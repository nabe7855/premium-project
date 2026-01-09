'use client';

import { Hotel } from '@/types/lovehotels';
import { useState } from 'react';
import FilterSidebar from './FilterSidebar';
import HotelCard from './HotelCard';

interface SearchPageContentProps {
  initialHotels: Hotel[];
  query: string;
  storeName: string;
}

export default function SearchPageContent({ initialHotels }: SearchPageContentProps) {
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>(initialHotels);

  const handleFilterChange = (filters: any) => {
    const results = initialHotels.filter((hotel) => {
      let matches = true;
      if (filters.budget) {
        const minPrice = hotel.minPriceRest || hotel.minPriceStay || 0;
        if (minPrice > filters.budget) matches = false;
      }
      return matches;
    });
    setFilteredHotels(results);
  };

  return (
    <>
      <FilterSidebar onFilterChange={handleFilterChange} />

      <div className="mb-8 mt-8 flex flex-col items-start justify-between gap-4 rounded-[2rem] border border-gray-100 bg-white px-8 py-5 shadow-sm md:flex-row md:items-center">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
          <span className="mr-2 font-black text-gray-900">{filteredHotels.length} 件</span>
          のホテルが見つかりました
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
        {filteredHotels.length === 0 && (
          <div className="col-span-full rounded-3xl border-2 border-dashed border-gray-200 bg-white py-20 text-center">
            <p className="font-bold italic text-gray-400">
              一致するホテルが見つかりませんでした。別のキーワードでお試しください。
            </p>
          </div>
        )}
      </div>
    </>
  );
}
