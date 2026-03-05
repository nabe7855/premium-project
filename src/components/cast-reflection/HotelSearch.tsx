'use client';

import { getHotels } from '@/lib/lovehotelApi';
import { Building2, ChevronRight, Loader2, MapPin, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface HotelSearchProps {
  onSelect: (hotelId: string, hotelName: string) => void;
  selectedId?: string;
}

export const HotelSearch: React.FC<HotelSearchProps> = ({ onSelect, selectedId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await getHotels({ keyword: query, take: 5 });
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Hotel search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-slate-700">利用したホテル</label>

      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ホテル名、エリアなどで検索..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-sm shadow-sm outline-none transition-all focus:ring-2 focus:ring-rose-200"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === '') setShowResults(false);
            }}
            onFocus={() => query.length >= 2 && setShowResults(true)}
          />
          {isLoading && (
            <Loader2
              className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-rose-500"
              size={18}
            />
          )}
        </div>

        {showResults && results.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
            {results.map((hotel) => (
              <button
                key={hotel.id}
                type="button"
                onClick={() => {
                  onSelect(hotel.id, hotel.name);
                  setSelectedName(hotel.name);
                  setQuery(hotel.name);
                  setShowResults(false);
                }}
                className="flex w-full items-center justify-between gap-4 rounded-xl p-3 text-left transition-colors hover:bg-rose-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-500">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{hotel.name}</p>
                    <p className="flex items-center gap-1 text-[10px] text-slate-400">
                      <MapPin size={10} />
                      {hotel.address || '住所未設定'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </button>
            ))}
          </div>
        )}

        {showResults && query.length >= 2 && results.length === 0 && !isLoading && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-2xl">
            <p className="text-sm italic text-slate-400">該当するホテルが見つかりませんでした</p>
          </div>
        )}
      </div>

      {selectedId && !showResults && selectedName && (
        <div className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/50 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white">
              <Building2 size={12} />
            </div>
            <span className="text-sm font-bold text-rose-700">{selectedName}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onSelect('', '');
              setSelectedName(null);
              setQuery('');
            }}
            className="text-[10px] font-bold text-slate-400 hover:text-rose-500"
          >
            変更する
          </button>
        </div>
      )}
    </div>
  );
};
