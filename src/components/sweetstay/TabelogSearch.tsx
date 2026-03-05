'use client';

import { getPurposes } from '@/lib/lovehotelApi';
import { Purpose } from '@/types/lovehotels';
import {
  ChevronRight,
  Heart,
  ListFilter,
  MapPin,
  Search,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AreaSearchModal from './AreaSearchModal';
import DetailedSearchModal from './DetailedSearchModal';
import PriceSearchModal from './PriceSearchModal';

const POPULAR_TAGS = ['女子会', '露天風呂', '格安', 'サウナ', '駅チカ', 'VOD'];

const TabelogSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [purposes, setPurposes] = useState<Purpose[]>([]);

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'area' | 'purpose' | 'amenity' | 'price' | null>(
    null,
  );

  const [activeFilters, setActiveFilters] = useState<{
    tags: string[];
    areaId: string;
    cityIds: string[];
    priceRange: [number, number];
    dayType: 'weekday' | 'weekend' | 'holiday';
    stayType: 'rest' | 'stay';
    purposeIds: string[];
    amenityIds: string[];
  }>({
    tags: [],
    areaId: '',
    cityIds: [],
    priceRange: [0, 30000],
    dayType: 'weekday',
    stayType: 'rest',
    purposeIds: [],
    amenityIds: [],
  });

  const router = useRouter();

  useEffect(() => {
    getPurposes().then(setPurposes).catch(console.error);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('q', keyword.trim());
    if (activeFilters.areaId) params.append('area', activeFilters.areaId);
    if (activeFilters.cityIds.length > 0) params.append('cities', activeFilters.cityIds.join(','));
    if (activeFilters.purposeIds.length > 0)
      params.append('purposes', activeFilters.purposeIds.join(','));
    if (activeFilters.amenityIds.length > 0)
      params.append('amenities', activeFilters.amenityIds.join(','));
    if (activeFilters.tags.length > 0) params.append('tags', activeFilters.tags.join(','));

    params.append('min_price', activeFilters.priceRange[0].toString());
    params.append('max_price', activeFilters.priceRange[1].toString());
    params.append('day_type', activeFilters.dayType);
    params.append('stay_type', activeFilters.stayType);

    router.push(`/sweetstay/search?${params.toString()}`);
  };

  const toggleTag = (tag: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  const toggleFilterId = (key: 'purposeIds' | 'amenityIds', id: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((i) => i !== id) : [...prev[key], id],
    }));
  };

  return (
    <div className="container relative z-30 mx-auto mb-12 mt-4 px-4 md:px-6">
      <div className="relative rounded-[2rem] border border-rose-50 bg-white p-4 text-slate-800 shadow-2xl shadow-rose-900/10 md:p-8 lg:mx-auto lg:max-w-4xl">
        {/* Top Header Row */}
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="group relative flex-grow">
            <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-gray-400 transition-colors group-focus-within:text-rose-500">
              <Search size={22} />
            </div>
            <input
              type="text"
              placeholder="エリア・キーワードを入力（例：新宿 露天風呂 30代）"
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-4 pl-14 pr-6 text-base font-bold text-gray-800 transition-all placeholder:font-medium placeholder:text-gray-400 hover:border-rose-200 focus:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <button
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className={`flex flex-shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-2xl px-6 py-4 font-black transition-all active:scale-95 ${
              isAccordionOpen
                ? 'bg-[#40C4C9] text-white shadow-lg shadow-cyan-400/30'
                : 'border border-cyan-100 bg-cyan-50 text-[#40C4C9] hover:bg-cyan-100'
            }`}
          >
            <ListFilter size={20} />
            こだわり検索
            <ChevronRight
              size={18}
              className={`transition-transform duration-300 ${isAccordionOpen ? 'rotate-90' : ''}`}
            />
          </button>
        </div>

        {/* Accordion Content */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isAccordionOpen
              ? 'mt-6 max-h-[1000px] space-y-6 opacity-100 md:mt-8 md:space-y-8'
              : 'mt-0 max-h-0 space-y-0 opacity-0'
          }`}
        >
          {/* Quick Tags */}
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 pl-1 text-[11px] font-black uppercase tracking-widest text-gray-500">
              <Zap size={14} className="fill-amber-500 text-amber-500" /> 人気の条件から即検索
            </p>
            <div className="flex gap-2.5 overflow-x-auto px-1 pb-2 scrollbar-hide">
              {POPULAR_TAGS.map((tag, idx) => (
                <button
                  key={idx}
                  className={`flex-shrink-0 rounded-full border px-5 py-2.5 text-xs font-black transition-all active:scale-95 ${
                    activeFilters.tags.includes(tag)
                      ? 'border-[#40C4C9] bg-[#40C4C9] text-white shadow-md shadow-cyan-400/20'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-[#40C4C9] hover:bg-cyan-50'
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Big Buttons */}
          <div className="grid grid-cols-2 gap-3 px-1 md:grid-cols-4 md:gap-4">
            {/* Area */}
            <button
              onClick={() => setActiveModal('area')}
              className="group flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-[#40C4C9] hover:bg-cyan-50/30 active:scale-95 md:p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 shadow-sm transition-transform group-hover:scale-110">
                <MapPin size={26} strokeWidth={2.5} className="text-[#40C4C9]" />
              </div>
              <span className="text-xs font-black tracking-tighter text-gray-700 md:text-sm">
                エリアで探す
              </span>
            </button>

            {/* Purpose */}
            <button
              onClick={() => setActiveModal('purpose')}
              className={`group flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 p-5 shadow-sm transition-all active:scale-95 md:p-6 ${
                activeFilters.purposeIds.length > 0
                  ? 'border-indigo-400 bg-indigo-50/30'
                  : 'border-slate-100 bg-white hover:border-indigo-400 hover:bg-indigo-50/30'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 shadow-sm transition-transform group-hover:scale-110">
                <Heart size={26} strokeWidth={2.5} className="text-indigo-500" />
              </div>
              <span className="text-xs font-black tracking-tighter text-gray-700 md:text-sm">
                目的で探す
              </span>
            </button>

            {/* Price */}
            <button
              onClick={() => setActiveModal('price')}
              className={`group flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 p-5 shadow-sm transition-all active:scale-95 md:p-6 ${
                activeFilters.priceRange[1] < 30000
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-100 bg-white hover:border-emerald-400 hover:bg-emerald-50/30'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 shadow-sm transition-transform group-hover:scale-110">
                <Wallet size={26} strokeWidth={2.5} className="text-emerald-500" />
              </div>
              <span className="text-xs font-black tracking-tighter text-gray-700 md:text-sm">
                金額で探す
              </span>
            </button>

            {/* Amenities */}
            <button
              onClick={() => setActiveModal('amenity')}
              className={`group flex flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 p-5 shadow-sm transition-all active:scale-95 md:p-6 ${
                activeFilters.amenityIds.length > 0
                  ? 'border-rose-400 bg-rose-50/30'
                  : 'border-slate-100 bg-white hover:border-rose-400 hover:bg-rose-50/30'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 shadow-sm transition-transform group-hover:scale-110">
                <Sparkles size={26} strokeWidth={2.5} className="text-rose-500" />
              </div>
              <span className="text-xs font-black tracking-tighter text-gray-700 md:text-sm">
                設備で探す
              </span>
            </button>
          </div>

          {/* Search Button */}
          <div className="pt-2">
            <button
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#4EA2F0] py-4 text-base font-black text-white shadow-xl shadow-blue-300/40 transition-all hover:brightness-105 active:scale-[0.98] md:py-5 md:text-lg"
              onClick={handleSearch}
            >
              <Search size={22} strokeWidth={2.5} />
              この条件で検索する
            </button>
          </div>
        </div>
      </div>

      <AreaSearchModal
        isOpen={activeModal === 'area'}
        onClose={() => setActiveModal(null)}
        onSelect={(pref, cityIds) =>
          setActiveFilters((prev) => ({ ...prev, areaId: pref, cityIds: cityIds }))
        }
      />
      <DetailedSearchModal
        isOpen={activeModal === 'purpose' || activeModal === 'amenity'}
        type={activeModal === 'purpose' ? 'purpose' : 'amenity'}
        onClose={() => setActiveModal(null)}
        selectedItems={
          activeModal === 'purpose' ? activeFilters.purposeIds : activeFilters.amenityIds
        }
        onSelect={(id) =>
          toggleFilterId(activeModal === 'purpose' ? 'purposeIds' : 'amenityIds', id)
        }
      />
      <PriceSearchModal
        isOpen={activeModal === 'price'}
        onClose={() => setActiveModal(null)}
        priceRange={activeFilters.priceRange}
        onPriceChange={(range) => setActiveFilters((prev) => ({ ...prev, priceRange: range }))}
        dayType={activeFilters.dayType}
        onDayTypeChange={(dt) => setActiveFilters((prev) => ({ ...prev, dayType: dt }))}
        stayType={activeFilters.stayType}
        onStayTypeChange={(st) => setActiveFilters((prev) => ({ ...prev, stayType: st }))}
      />
    </div>
  );
};

export default TabelogSearch;
