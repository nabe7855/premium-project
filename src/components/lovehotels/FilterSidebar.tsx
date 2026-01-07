'use client';

import { AMENITIES, SERVICES } from '@/data/lovehotels';
import React, { useState } from 'react';

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stayType, setStayType] = useState<'rest' | 'lodging'>('lodging');
  const [budget, setBudget] = useState(10000);

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBudget(parseInt(e.target.value));
  };

  return (
    <div className="mb-8 w-full overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-xl shadow-gray-200/50 transition-all duration-500">
      {/* 折りたたみ時のヘッダー部分 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between px-8 py-5 transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-4">
          <div
            className={`rounded-2xl p-3 transition-all duration-500 ${isOpen ? 'rotate-90 bg-rose-500 text-white' : 'bg-rose-50 text-rose-500'}`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">
              絞り込み検索
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
              予算・設備・サービスを指定して探す
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isOpen && (
            <div className="hidden gap-2 md:flex">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase text-gray-500">
                ¥{budget.toLocaleString()}以下
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase text-gray-500">
                {stayType === 'lodging' ? '宿泊' : '休憩'}
              </span>
            </div>
          )}
          <div className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
            <svg
              className="h-6 w-6 text-gray-300 group-hover:text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* 展開時のコンテンツ部分 */}
      <div
        className={`transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[2000px] border-t border-gray-50 opacity-100' : 'invisible max-h-0 overflow-hidden opacity-0'}`}
      >
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* 予算設定 */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 rounded-full bg-rose-500"></div>
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">
                  予算と利用形態
                </h4>
              </div>
              <div className="flex rounded-2xl bg-gray-50 p-1">
                <button
                  onClick={() => setStayType('rest')}
                  className={`flex-1 rounded-xl py-3 text-xs font-black transition-all ${stayType === 'rest' ? 'bg-white text-rose-500 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  休憩
                </button>
                <button
                  onClick={() => setStayType('lodging')}
                  className={`flex-1 rounded-xl py-3 text-xs font-black transition-all ${stayType === 'lodging' ? 'bg-white text-rose-500 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  宿泊
                </button>
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex items-end justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    最大予算
                  </span>
                  <span className="text-xl font-black tracking-tighter text-rose-500">
                    ¥{budget.toLocaleString()} <span className="text-xs text-gray-400">以下</span>
                  </span>
                </div>
                <input
                  type="range"
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-100 accent-rose-500"
                  min={stayType === 'rest' ? '2000' : '5000'}
                  max={stayType === 'rest' ? '15000' : '30000'}
                  step="500"
                  value={budget}
                  onChange={handleBudgetChange}
                />
              </div>
            </div>

            {/* サービス */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 rounded-full bg-rose-500"></div>
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">
                  サービス
                </h4>
              </div>
              <div className="custom-scrollbar grid max-h-48 grid-cols-1 gap-2 overflow-y-auto pr-4">
                {SERVICES.map((item, idx) => (
                  <label key={idx} className="group flex cursor-pointer items-center gap-3 py-1.5">
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer rounded-lg border-gray-200 text-rose-500 transition-all focus:ring-rose-500"
                    />
                    <span className="text-xs font-bold text-gray-500 transition-colors group-hover:text-rose-500">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 人気の設備 */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 rounded-full bg-rose-500"></div>
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">
                  設備こだわり
                </h4>
              </div>
              <div className="custom-scrollbar grid max-h-48 grid-cols-1 gap-2 overflow-y-auto pr-4">
                {AMENITIES.map((item, idx) => (
                  <label key={idx} className="group flex cursor-pointer items-center gap-3 py-1.5">
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer rounded-lg border-gray-200 text-rose-500 transition-all focus:ring-rose-500"
                    />
                    <span className="text-xs font-bold text-gray-500 transition-colors group-hover:text-rose-500">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* レビュー評価 */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1.5 rounded-full bg-rose-500"></div>
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">
                  評価・こだわり
                </h4>
              </div>
              <div className="space-y-3">
                {[4, 3, 2].map((stars) => (
                  <label
                    key={stars}
                    className="group flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-gray-50 p-3 transition-all hover:border-rose-100 hover:bg-rose-50"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="rating"
                        className="h-5 w-5 cursor-pointer border-gray-200 text-rose-500 focus:ring-rose-500"
                      />
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-yellow-400">★</span>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-600">
                          {stars}以上
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-50 pt-8 md:flex-row">
            <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-rose-500">
              条件をリセットする
            </button>
            <button
              onClick={() => {
                onFilterChange({ stayType, budget });
                setIsOpen(false);
              }}
              className="w-full rounded-2xl bg-rose-500 px-12 py-5 text-xs font-black uppercase tracking-widest text-white shadow-2xl shadow-rose-200 transition-all hover:-translate-y-1 hover:bg-rose-600 active:scale-95 md:w-auto"
            >
              この条件で検索を適用する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
