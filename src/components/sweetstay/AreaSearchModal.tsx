'use client';

import { getHotelsCount, getPrefectureDetails } from '@/lib/lovehotelApi';
import { City } from '@/types/lovehotels';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronLeft, MapPin, X } from 'lucide-react';
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
    setSelectedPref(null);
    setCities([]);
    setSelectedCityIds([]);
  };

  const handlePrefSelect = (pref: Prefecture) => {
    setSelectedPref(pref);
    setLoadingCities(true);
    getPrefectureDetails(pref.id)
      .then((data) => {
        setCities(data.cities || []);
        const cityNames = (data.cities || []).map((c: { name: string }) => c.name);
        if (cityNames.length > 0) {
          getHotelsCount({ prefecture: pref.name, cities: cityNames })
            .then((counts) => {
              setCityCounts(counts);
            })
            .catch(() => {});
        }
      })
      .catch(() => setCities([]))
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
    } else if (selectedRegion) {
      onSelect(selectedRegion.name, selectedCityIds);
    }
    onClose();
  };

  const canConfirm =
    selectedPref !== null || (selectedRegion !== null && selectedCityIds.length > 0);
  const isCityView = !!selectedPref;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        {/* Backdrop */}
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h3 className="text-xl font-black tracking-tight text-slate-800">エリアで探す</h3>
                  <button
                    onClick={onClose}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Body: map left + city list right */}
                <div className="flex flex-col md:flex-row" style={{ minHeight: '520px' }}>
                  {/* ── Left: Map panel ── */}
                  <div className="relative flex flex-col bg-slate-50/60 md:w-[48%]">
                    {/* Prefecture badge + back button row */}
                    {selectedRegion && (
                      <div className="flex items-center gap-2 px-4 pb-2 pt-4">
                        {selectedPref && (
                          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-slate-700 shadow-sm">
                            {selectedPref.name.replace(/[都道府県]$/, '')}
                          </span>
                        )}
                        <button
                          onClick={handleBack}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
                        >
                          <ChevronLeft size={18} />
                        </button>
                      </div>
                    )}

                    {/* Map */}
                    <div className="flex-1 p-3 pt-1">
                      <JapanMap
                        selectedRegion={selectedRegion}
                        onRegionSelect={handleRegionSelect}
                        onPrefectureSelect={handlePrefSelect}
                        className="h-full min-h-[280px] w-full md:min-h-0"
                      />
                    </div>

                    {/* Hint */}
                    {!selectedRegion && (
                      <p className="pb-3 text-center text-[11px] font-bold text-slate-400">
                        地方をタップして選択
                      </p>
                    )}
                  </div>

                  {/* ── Right: City selection panel ── */}
                  <div className="flex flex-1 flex-col border-t border-slate-100 md:border-l md:border-t-0">
                    {isCityView ? (
                      <>
                        {/* City list header */}
                        <div className="flex items-start justify-between px-5 pb-3 pt-5">
                          <div>
                            <div className="mb-0.5 flex items-center gap-1.5 text-indigo-600">
                              <MapPin size={16} strokeWidth={2.5} />
                              <span className="text-base font-black tracking-tight text-slate-800">
                                {selectedPref?.name.replace(/[都道府県]$/, '')}のエリア
                              </span>
                            </div>
                            <p className="text-[11px] font-bold text-slate-400">
                              市区町村を選択してください
                            </p>
                          </div>
                          <button
                            onClick={handleAllSelect}
                            className="mt-0.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-black text-indigo-500 transition hover:bg-indigo-100"
                          >
                            {selectedCityIds.length === cities.length && cities.length > 0
                              ? '全解除'
                              : 'すべて選択'}
                          </button>
                        </div>

                        {/* City checkbox grid */}
                        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
                          {loadingCities ? (
                            <div className="flex h-40 items-center justify-center">
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                            </div>
                          ) : cities.length === 0 ? (
                            <div className="flex h-40 items-center justify-center text-sm font-bold text-slate-400">
                              データがありません
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2.5">
                              {cities.map((city) => {
                                const isChecked = selectedCityIds.includes(city.id);
                                return (
                                  <button
                                    key={city.id}
                                    onClick={() => toggleCity(city.id)}
                                    className="flex items-center gap-2.5 rounded-xl border bg-white p-3.5 text-left transition hover:border-indigo-200 active:scale-95"
                                    style={{
                                      borderColor: isChecked ? '#6366f1' : '#e2e8f0',
                                      background: isChecked ? '#eef2ff' : '#ffffff',
                                    }}
                                  >
                                    {/* Checkbox */}
                                    <span
                                      className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition"
                                      style={{
                                        borderColor: isChecked ? '#6366f1' : '#cbd5e1',
                                        background: isChecked ? '#6366f1' : 'transparent',
                                      }}
                                    >
                                      {isChecked && (
                                        <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-white">
                                          <path
                                            d="M1 4l2.5 2.5L9 1"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      )}
                                    </span>
                                    <div className="min-w-0">
                                      <p
                                        className="text-[13px] font-black leading-tight"
                                        style={{ color: isChecked ? '#4338ca' : '#334155' }}
                                      >
                                        {city.name}
                                      </p>
                                      {cityCounts[city.name] !== undefined && (
                                        <p className="text-[10px] font-bold text-slate-400">
                                          {cityCounts[city.name]}件
                                        </p>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      // Placeholder when no pref selected
                      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                          <MapPin size={24} className="text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">
                          {selectedRegion
                            ? '地図上の県をタップしてください'
                            : '左の地図から地方を選択してください'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 px-5 py-4">
                  <button
                    onClick={handleConfirm}
                    disabled={!canConfirm}
                    className="flex w-full items-center justify-center rounded-2xl py-4 text-base font-black transition-all active:scale-[0.98]"
                    style={{
                      background: canConfirm ? '#0f172a' : '#94a3b8',
                      color: '#ffffff',
                      cursor: canConfirm ? 'pointer' : 'not-allowed',
                    }}
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
