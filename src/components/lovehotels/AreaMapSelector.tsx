'use client';

import { getAreaById } from '@/data/lovehotels/areas';
import { getCitiesByArea } from '@/data/lovehotels/cities';
import { FUKUOKA_AREA_PATHS } from '@/data/lovehotels/mapData';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface AreaMapSelectorProps {
  prefectureId: string;
  hotelCounts?: {
    byArea: Record<string, number>;
    byCity: Record<string, number>;
  };
}

type Step = 'area' | 'city';

const AreaMapSelector: React.FC<AreaMapSelectorProps> = ({ prefectureId, hotelCounts }) => {
  const { slug } = useParams();
  const router = useRouter();
  const [step, setStep] = useState<Step>('area');
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [hoveredAreaId, setHoveredAreaId] = useState<string | null>(null);

  const selectedArea = selectedAreaId ? getAreaById(selectedAreaId) : null;
  const cities = selectedAreaId ? getCitiesByArea(selectedAreaId) : [];

  // エリアIDの名寄せ (fukuoka-city/fukuoka-other -> fukuoka)
  const normalizeAreaId = (id: string | null): string => {
    if (!id) return '';
    if (id === 'fukuoka-city' || id === 'fukuoka-other') return 'fukuoka';
    return id;
  };

  // エリア選択時
  const handleAreaSelect = (areaId: string) => {
    // 内部的なエリアID(areas.ts)にマッピング
    const targetAreaId = normalizeAreaId(areaId) === 'fukuoka' ? 'fukuoka-city' : areaId;
    setSelectedAreaId(targetAreaId);
    setStep('city');
    setHoveredAreaId(null);
  };

  // 戻るボタン
  const handleBack = () => {
    setStep('area');
    setSelectedAreaId(null);
  };

  // ホテル件数を取得
  const getDisplayAreaCount = (areaId: string): number => {
    const id = normalizeAreaId(areaId);
    if (id === 'fukuoka') {
      return (
        (hotelCounts?.byArea['fukuoka-city'] || 0) + (hotelCounts?.byArea['fukuoka-other'] || 0)
      );
    }
    return hotelCounts?.byArea[id] || 0;
  };

  const getCityCount = (cityId: string): number => {
    return hotelCounts?.byCity[cityId] || 0;
  };

  // 0件の市をフィルタリング
  const citiesWithHotels = cities.filter((city) => getCityCount(city.id) > 0);

  return (
    <section className="overflow-hidden bg-white py-20">
      <div className="container mx-auto px-4">
        {/* ヘッダー */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full bg-rose-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500">
            {step === 'area' ? 'Step 01: Select Region' : 'Step 02: Select City'}
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tighter text-gray-900 md:text-4xl">
            {step === 'area'
              ? '福岡県のエリアから探す'
              : `${selectedArea?.name} の詳細エリアを選ぶ`}
          </h2>
          <p className="mx-auto max-w-lg font-medium text-gray-400">
            {step === 'area'
              ? 'お探しの地域を地図から選択してください。'
              : 'さらに具体的な市区町村を選択して、ホテル一覧を表示します。'}
          </p>
        </div>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
          {/* 左側: SVG地図 */}
          <div className="flex-1">
            <div className="relative mx-auto max-w-xl rounded-[3rem] border-2 border-gray-100 bg-gray-50/30 p-4 shadow-2xl shadow-rose-100/20 backdrop-blur-sm md:p-8">
              <svg viewBox="0 0 498 526" className="h-auto w-full drop-shadow-xl">
                <style>{`
                  .region-path {
                    stroke: #FFFFFF;
                    stroke-width: 1.5;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    cursor: pointer;
                    opacity: 0.9;
                  }
                  .region-path:hover {
                    opacity: 1;
                    stroke-width: 3;
                    filter: drop-shadow(0 8px 12px rgba(0, 0, 0, 0.15));
                  }
                  .region-label {
                    font-family: 'Noto Sans JP', sans-serif;
                    font-size: 16px;
                    font-weight: 900;
                    fill: #1F2937;
                    pointer-events: none;
                    user-select: none;
                    text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
                  }
                `}</style>

                {FUKUOKA_AREA_PATHS.map((area) => {
                  const isHovered = hoveredAreaId === area.id;
                  const isSelected = normalizeAreaId(selectedAreaId) === area.id;

                  return (
                    <g
                      key={area.id}
                      onMouseEnter={() => setHoveredAreaId(area.id)}
                      onMouseLeave={() => setHoveredAreaId(null)}
                      onClick={() => handleAreaSelect(area.id)}
                      className="group"
                    >
                      <path
                        d={area.d}
                        fill={
                          isHovered || (step === 'city' && isSelected)
                            ? area.hoverColor
                            : area.color
                        }
                        className="region-path"
                      />
                      <text
                        x={area.labelX}
                        y={area.labelY}
                        textAnchor="middle"
                        className="region-label"
                      >
                        {area.name}
                      </text>
                      {(isHovered || (step === 'city' && isSelected)) && (
                        <text
                          x={area.labelX}
                          y={area.labelY + 20}
                          textAnchor="middle"
                          fill="#E11D48"
                          fontSize="12"
                          fontWeight="900"
                        >
                          {getDisplayAreaCount(area.id)} Hotels
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* 右側: リスト表示 */}
          <div className="w-full lg:w-80 xl:w-96">
            {step === 'area' ? (
              <div className="grid grid-cols-1 gap-4">
                {FUKUOKA_AREA_PATHS.map((area) => {
                  const count = getDisplayAreaCount(area.id);

                  return (
                    <button
                      key={area.id}
                      onClick={() => handleAreaSelect(area.id)}
                      onMouseEnter={() => setHoveredAreaId(area.id)}
                      onMouseLeave={() => setHoveredAreaId(null)}
                      className={`group flex items-center justify-between rounded-3xl border-2 p-6 transition-all hover:-translate-x-2 ${
                        hoveredAreaId === area.id
                          ? 'border-rose-500 shadow-xl shadow-rose-100'
                          : 'border-white bg-white hover:border-gray-50'
                      }`}
                      style={{
                        backgroundColor: hoveredAreaId === area.id ? area.color : '#fff',
                      }}
                    >
                      <div className="text-left">
                        <h3 className="text-xl font-black text-gray-900 transition-colors group-hover:text-rose-600">
                          {area.name}
                        </h3>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                          {area.id === 'kitakyushu'
                            ? 'North'
                            : area.id === 'fukuoka'
                              ? 'West'
                              : area.id === 'chikuho'
                                ? 'Central'
                                : 'South'}{' '}
                          Fukuoka
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-rose-500">{count}</div>
                        <div className="text-[10px] font-black uppercase text-rose-300">Hotels</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6 duration-500 animate-in slide-in-from-right-4">
                <button
                  onClick={handleBack}
                  className="group flex w-full items-center gap-3 rounded-2xl bg-gray-900 p-4 text-sm font-black text-white transition-all hover:bg-rose-600 hover:shadow-xl active:scale-95"
                >
                  <span className="text-xl transition-transform group-hover:-translate-x-1">←</span>
                  <span>地域を選び直す</span>
                </button>

                <div className="rounded-[2.5rem] border border-gray-100 bg-gray-50/50 p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400">
                    📍 {selectedArea?.name || 'Fukuoka'}内
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5">
                    {citiesWithHotels.length > 0 ? (
                      citiesWithHotels.map((city) => (
                        <Link
                          key={city.id}
                          href={`/store/${slug}/hotel/${city.id}`}
                          className="group flex items-center justify-between rounded-2xl border-2 border-white bg-white/80 p-4 transition-all hover:border-rose-500 hover:bg-white hover:shadow-lg"
                        >
                          <span className="font-bold text-gray-700 group-hover:text-rose-600">
                            {city.name}
                          </span>
                          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-500">
                            {getCityCount(city.id)}
                          </span>
                        </Link>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-sm font-bold text-gray-400">
                          現在ホテル情報がありません
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AreaMapSelector;
