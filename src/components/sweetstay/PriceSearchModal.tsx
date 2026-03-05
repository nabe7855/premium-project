'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Wallet, X } from 'lucide-react';
import React, { Fragment } from 'react';

interface PriceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  dayType: 'weekday' | 'weekend' | 'holiday';
  onDayTypeChange: (day: 'weekday' | 'weekend' | 'holiday') => void;
  stayType: 'rest' | 'stay';
  onStayTypeChange: (type: 'rest' | 'stay') => void;
}

const PriceSearchModal: React.FC<PriceSearchModalProps> = ({
  isOpen,
  onClose,
  priceRange,
  onPriceChange,
  dayType,
  onDayTypeChange,
  stayType,
  onStayTypeChange,
}) => {
  const [min, max] = priceRange;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[110]" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-2xl transition-all md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-emerald-500">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                      <Wallet size={24} />
                    </div>
                    <h3 className="text-xl font-black tracking-tighter text-slate-800">
                      金額で探す
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Grid for Filters */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Day Type Selection */}
                    <div className="space-y-3">
                      <p className="pl-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        曜日
                      </p>
                      <div className="flex flex-col gap-1 overflow-hidden rounded-2xl bg-slate-100/50 p-1">
                        {(['weekday', 'weekend', 'holiday'] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => onDayTypeChange(type)}
                            className={`flex-1 rounded-xl py-2 text-[11px] font-black transition-all ${
                              dayType === type
                                ? 'bg-white text-emerald-500 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {type === 'weekday'
                              ? '平日'
                              : type === 'weekend'
                                ? '休日'
                                : '連休・祝日'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stay Type Selection */}
                    <div className="space-y-3">
                      <p className="pl-1 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        利用プラン
                      </p>
                      <div className="flex flex-col gap-1 overflow-hidden rounded-2xl bg-slate-100/50 p-1">
                        {(['rest', 'stay'] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => onStayTypeChange(type)}
                            className={`flex-1 rounded-xl py-2.5 text-xs font-black transition-all ${
                              stayType === type
                                ? 'bg-white text-indigo-500 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {type === 'rest' ? 'ショート/休憩' : '宿泊'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pl-1">
                      <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                        金額の上限と下限
                      </p>
                      <div className="flex gap-2">
                        <span className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-600">
                          ¥{min.toLocaleString()}
                        </span>
                        <span className="text-sm font-bold text-slate-400">〜</span>
                        <span className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-600">
                          ¥{max === 30000 ? '無制限' : max.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 px-2">
                      {/* Min Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>最小: ¥{min.toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30000"
                          step="1000"
                          value={min}
                          onChange={(e) =>
                            onPriceChange([
                              Number(e.target.value),
                              Math.max(Number(e.target.value), max),
                            ])
                          }
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-emerald-500"
                        />
                      </div>
                      {/* Max Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>最大: {max === 30000 ? '無制限' : `¥${max.toLocaleString()}`}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="30000"
                          step="1000"
                          value={max}
                          onChange={(e) =>
                            onPriceChange([
                              Math.min(min, Number(e.target.value)),
                              Number(e.target.value),
                            ])
                          }
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {[5000, 8000, 10000, 15000].map((val) => (
                        <button
                          key={val}
                          onClick={() => onPriceChange([0, val])}
                          className="flex-shrink-0 rounded-full border border-slate-100 bg-white px-4 py-2 text-[10px] font-black text-slate-500 hover:border-emerald-300 hover:text-emerald-500"
                        >
                          ¥{val.toLocaleString()}以下
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <button
                    onClick={onClose}
                    className="flex w-full items-center justify-center rounded-2xl bg-emerald-500 py-4 text-base font-black text-white shadow-xl shadow-emerald-200/50 transition-all hover:brightness-105 active:scale-[0.98]"
                  >
                    選択を確定する
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

export default PriceSearchModal;
