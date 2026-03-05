'use client';

import { getHotelsCount, getPrefectureDetails } from '@/lib/lovehotelApi';
import { City } from '@/types/lovehotels';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronLeft, Info, MapPin, X } from 'lucide-react';
import React, { Fragment, useState } from 'react';
import JapanMap, { Prefecture, Region } from './JapanMap';

interface AreaSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (prefName: string, cityIds: string[]) => void;
}

const AreaSearchModal: React.FC<AreaSearchModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedPref, setSelectedPref] = useState<Prefecture | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [cityCounts, setCityCounts] = useState<Record<string, number>>({});

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region);
  };

  const handlePrefSelect = (pref: Prefecture) => {
    setSelectedPref(pref);
    setLoadingCities(true);
    getPrefectureDetails(pref.name)
      .then((data) => {
        setCities(data.cities || []);
        // Fetch counts for cities if possible
        const cityNames = (data.cities || []).map((c) => c.name);
        if (cityNames.length > 0) {
          getHotelsCount({ prefecture: pref.name, cities: cityNames })
            .then((counts) => {
              setCityCounts(counts);
            })
            .catch(() => {});
        }
      })
      .finally(() => setLoadingCities(false));
  };

  const handleBack = () => {
    if (selectedPref) {
      setSelectedPref(null);
      setCities([]);
      setSelectedCityIds([]);
    } else if (selectedRegion) {
      setSelectedRegion(null);
    }
  };

  const toggleCity = (cityId: string) => {
    setSelectedCityIds((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId],
    );
  };

  const handleAllSelect = () => {
    if (selectedCityIds.length === cities.length) {
      setSelectedCityIds([]);
    } else {
      setSelectedCityIds(cities.map((c) => c.id));
    }
  };

  const handleConfirm = () => {
    if (selectedPref) {
      onSelect(selectedPref.name, selectedCityIds);
    }
    onClose();
  };

  const isCitySelection = !!selectedPref;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-2xl transition-all md:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {selectedRegion && (
                      <button
                        onClick={handleBack}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                      >
                        <ChevronLeft size={24} />
                      </button>
                    )}
                    <h3 className="text-xl font-black tracking-tighter text-slate-800">
                      エリアで探す
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div
                  className={`flex flex-col gap-6 lg:flex-row ${isCitySelection ? 'lg:h-[500px]' : ''}`}
                >
                  {/* Left: Map */}
                  <div className={`${isCitySelection ? 'lg:w-2/5' : 'w-full'}`}>
                    <div className="relative overflow-hidden rounded-3xl border border-rose-50 bg-rose-50/20 shadow-inner">
                      <JapanMap
                        selectedRegion={selectedRegion}
                        onRegionSelect={handleRegionSelect}
                        onPrefectureSelect={handlePrefSelect}
                        className={
                          isCitySelection ? 'aspect-[4/5] h-full' : 'max-h-[50vh] md:max-h-[60vh]'
                        }
                      />

                      {!isCitySelection && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                          <div className="flex items-center gap-2 rounded-full border border-rose-100 bg-white/90 px-4 py-2 text-[10px] font-bold text-rose-500 shadow-sm backdrop-blur-md">
                            <Info size={14} />
                            地図上の地域をクリックして都道府県を選択してください
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Selection Context or City List */}
                  {isCitySelection && (
                    <div className="flex flex-col lg:w-3/5">
                      <div className="flex h-full flex-col rounded-3xl border border-slate-100/50 bg-slate-50/50 p-5">
                        {/* City Header */}
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-indigo-500">
                            <MapPin size={20} strokeWidth={2.5} />
                            <h4 className="text-lg font-black tracking-tight text-slate-800">
                              {selectedPref?.name}のエリア
                            </h4>
                          </div>
                          <button
                            onClick={handleAllSelect}
                            className="rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-black text-cyan-500 hover:text-cyan-600"
                          >
                            {selectedCityIds.length === cities.length ? '全解除' : 'すべて選択'}
                          </button>
                        </div>
                        <p className="mb-5 text-[11px] font-bold text-slate-400">
                          市区町村を選択してください
                        </p>

                        {/* City Grid */}
                        <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 scrollbar-hide">
                          {loadingCities ? (
                            <div className="col-span-2 flex h-40 items-center justify-center">
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                            </div>
                          ) : (
                            cities.map((city) => (
                              <button
                                key={city.id}
                                onClick={() => toggleCity(city.id)}
                                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all active:scale-95 ${
                                  selectedCityIds.includes(city.id)
                                    ? 'border-cyan-400 bg-cyan-50 text-cyan-600 shadow-sm'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                                }`}
                              >
                                <span className="text-[13px] font-black">{city.name}</span>
                                <span className="text-[10px] font-bold text-slate-400">
                                  {cityCounts[city.name] || 0}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Button */}
                <div className="mt-8">
                  <button
                    onClick={handleConfirm}
                    disabled={selectedCityIds.length === 0 && isCitySelection}
                    className={`flex w-full items-center justify-center rounded-2xl py-4 text-base font-black shadow-xl transition-all active:scale-[0.98] ${
                      isCitySelection
                        ? 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800'
                        : 'cursor-not-allowed bg-slate-100 text-slate-300'
                    }`}
                  >
                    選択した条件を確定する
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AreaSearchModal;
