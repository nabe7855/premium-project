'use client';

import { getPrefectureDetails } from '@/lib/lovehotelApi';
import { ChevronRight, MapPin, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import JapanMap, { Prefecture, Region, REGIONS_DATA } from './JapanMap';

interface AreaSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AreaSearchModal({ isOpen, onClose }: AreaSearchModalProps) {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedPrefecture, setSelectedPrefecture] = useState<Prefecture | null>(null);

  // City Selection Stage
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch cities when prefecture is selected
  useEffect(() => {
    if (selectedPrefecture) {
      setLoading(true);
      // getPrefectureDetails takes the name (e.g. "東京都")
      getPrefectureDetails(selectedPrefecture.name)
        .then((data) => {
          setCities(data.cities || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setCities([]);
        });
    } else {
      setCities([]);
      setSearchTerm('');
    }
  }, [selectedPrefecture]);

  // Reset internal state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSelectedRegion(null);
        setSelectedPrefecture(null);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCitySelect = (city: any) => {
    // Navigate to sweetstay area page or search page
    // Since we are adding it to SweetStay search form, we can just navigate to the search page with parameters
    // or navigate to `/sweetstay/area/${city.name}` if such route exists.
    // Let's use search query for now.
    const params = new URLSearchParams();
    params.append('cityId', city.id);
    onClose();
    router.push(`/sweetstay/search?${params.toString()}`);
  };

  const filteredCities = cities.filter((c) => c.name.includes(searchTerm));

  const isCitySelection = !!selectedPrefecture;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white duration-200 animate-in fade-in zoom-in-95">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-rose-50 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md">
        <button
          onClick={() => {
            if (isCitySelection) {
              setSelectedPrefecture(null);
            } else if (selectedRegion) {
              setSelectedRegion(null);
            } else {
              onClose();
            }
          }}
          className="-ml-2 rounded-full p-2 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
        >
          <ChevronRight className="rotate-180" size={24} />
        </button>

        <h2 className="flex items-center gap-2 text-lg font-black text-gray-800">
          <MapPin size={20} className="text-rose-500" />
          {selectedPrefecture ? selectedPrefecture.name : 'エリア検索'}
        </h2>

        <button
          onClick={onClose}
          className="-mr-2 rounded-full p-2 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/20 scrollbar-hide">
        {!isCitySelection ? (
          <div className="mx-auto flex h-full max-w-2xl flex-col p-4 md:p-8">
            <h3 className="mb-6 text-center text-sm font-bold tracking-widest text-gray-500">
              {selectedRegion
                ? `${selectedRegion.name}の都道府県を選択`
                : '探したい地方を選択してください'}
            </h3>

            <JapanMap
              selectedRegion={selectedRegion}
              onRegionSelect={setSelectedRegion}
              onPrefectureSelect={setSelectedPrefecture}
              className="flex-shrink-0"
            />

            {!selectedRegion && (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {REGIONS_DATA.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className="rounded-xl border border-rose-100 bg-white px-2 py-3 text-center text-sm font-bold text-gray-700 shadow-sm transition hover:border-rose-300 hover:shadow-md"
                  >
                    {region.name}
                  </button>
                ))}
              </div>
            )}

            {selectedRegion && (
              <div className="mt-8 transition-all animate-in slide-in-from-bottom-5">
                <h4 className="mb-3 text-xs font-black uppercase tracking-widest text-rose-400">
                  Prefectures
                </h4>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {selectedRegion.prefectures.map((pref) => (
                    <button
                      key={pref.id}
                      onClick={() => setSelectedPrefecture(pref)}
                      className="rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white px-2 py-3 text-center text-sm font-black text-rose-700 transition hover:shadow-md active:scale-95"
                    >
                      {pref.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative flex h-full flex-col bg-white">
            <div className="sticky top-0 z-10 border-b border-rose-100 bg-rose-50/50 p-4 shadow-sm">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300"
                  size={18}
                />
                <input
                  type="text"
                  placeholder={`${selectedPrefecture.name}の市区町村を検索...`}
                  className="w-full rounded-xl border border-rose-200 bg-white py-3 pl-10 pr-4 font-bold text-gray-700 placeholder-gray-400 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="mx-auto w-full max-w-2xl p-4 pb-20">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-rose-400"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="pl-2 text-xs font-black uppercase tracking-widest text-rose-400">
                    City Selection
                  </h3>

                  <div className="space-y-2">
                    {filteredCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city)}
                        className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm transition hover:bg-rose-50 active:bg-rose-100"
                      >
                        <span className="truncate pr-4 text-base font-bold text-gray-700 transition group-hover:text-rose-600 md:text-lg">
                          {city.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-400">
                            {city.count || 0}件
                          </span>
                          <ChevronRight
                            size={18}
                            className="transform text-rose-300 transition group-hover:translate-x-1 group-hover:text-rose-500"
                          />
                        </div>
                      </button>
                    ))}
                    {filteredCities.length === 0 && (
                      <div className="flex flex-col items-center gap-3 py-12 text-center">
                        <MapPin size={32} className="text-gray-300" />
                        <span className="font-bold text-gray-400">該当するエリアがありません</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
