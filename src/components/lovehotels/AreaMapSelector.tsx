'use client';

import { FUKUOKA_AREAS, getAreaById } from '@/data/lovehotels/areas';
import { getCitiesByArea, getPopularCities } from '@/data/lovehotels/cities';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  const [step, setStep] = useState<Step>('area');
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [hoveredAreaId, setHoveredAreaId] = useState<string | null>(null);

  const areas = FUKUOKA_AREAS;
  const selectedArea = selectedAreaId ? getAreaById(selectedAreaId) : null;
  const cities = selectedAreaId ? getCitiesByArea(selectedAreaId) : [];
  const popularCities = selectedAreaId ? getPopularCities(selectedAreaId) : [];

  // エリア選択時
  const handleAreaSelect = (areaId: string) => {
    setSelectedAreaId(areaId);
    setStep('city');
  };

  // 戻るボタン
  const handleBack = () => {
    setStep('area');
    setSelectedAreaId(null);
  };

  // SVG地図のエリアクリック
  const handleSvgAreaClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    const areaId = target.getAttribute('data-area-id');
    if (areaId) {
      handleAreaSelect(areaId);
    }
  };

  // ホテル件数を取得
  const getAreaCount = (areaId: string): number => {
    return hotelCounts?.byArea[areaId] || 0;
  };

  const getCityCount = (cityId: string): number => {
    return hotelCounts?.byCity[cityId] || 0;
  };

  // 0件の市をフィルタリング
  const citiesWithHotels = cities.filter((city) => getCityCount(city.id) > 0);
  const popularCitiesWithHotels = popularCities.filter((city) => getCityCount(city.id) > 0);

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* ヘッダー */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full bg-rose-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500">
            {step === 'area' ? 'Select Area' : 'Select City'}
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tighter text-gray-900">
            {step === 'area' ? '福岡店のエリアから探す' : `${selectedArea?.name} のホテルを探す`}
          </h2>
          <p className="mx-auto max-w-lg font-medium text-gray-400">
            {step === 'area'
              ? '地図からエリアを選んでください'
              : '市区を選択してホテル一覧を表示します'}
          </p>
        </div>

        {step === 'area' ? (
          /* ステップ1: エリア選択 */
          <div className="space-y-12">
            {/* SVG地図 */}
            <div className="mx-auto max-w-2xl">
              <div className="overflow-hidden rounded-[2.5rem] border-2 border-gray-100 bg-gray-50 p-8 shadow-xl">
                <svg
                  viewBox="0 0 500 600"
                  className="w-full"
                  onClick={handleSvgAreaClick}
                  onMouseMove={(e) => {
                    const target = e.target as SVGElement;
                    const areaId = target.getAttribute('data-area-id');
                    setHoveredAreaId(areaId);
                  }}
                  onMouseLeave={() => setHoveredAreaId(null)}
                >
                  <style>{`
                    .area-region {
                      fill: #F3F4F6;
                      stroke: #E5E7EB;
                      stroke-width: 2;
                      transition: all 0.2s ease;
                      cursor: pointer;
                    }
                    .area-region:hover {
                      fill: #FEE2E2;
                      stroke: #F43F5E;
                      stroke-width: 3;
                      filter: drop-shadow(0 4px 6px rgba(244, 63, 94, 0.2));
                    }
                    .area-label {
                      font-family: 'Noto Sans JP', sans-serif;
                      font-size: 16px;
                      font-weight: 900;
                      fill: #1F2937;
                      pointer-events: none;
                      user-select: none;
                    }
                    .area-count {
                      font-family: 'Noto Sans JP', sans-serif;
                      font-size: 11px;
                      font-weight: 700;
                      fill: #DC2626;
                      pointer-events: none;
                      user-select: none;
                    }
                  `}</style>

                  {/* 北九州市エリア */}
                  <path
                    className="area-region"
                    data-area-id="kitakyushu"
                    d="M 280,40 L 460,30 L 480,80 L 490,140 L 470,180 L 420,200 L 360,190 L 320,160 L 300,120 L 280,80 Z"
                  />
                  <text className="area-label" x="380" y="120" textAnchor="middle">
                    北九州市
                  </text>
                  <text className="area-count" x="380" y="140" textAnchor="middle">
                    {getAreaCount('kitakyushu')} HOTELS
                  </text>

                  {/* 福岡市エリア */}
                  <path
                    className="area-region"
                    data-area-id="fukuoka-city"
                    d="M 20,200 L 100,180 L 160,190 L 200,220 L 210,280 L 190,340 L 140,360 L 80,350 L 40,320 L 20,270 Z"
                  />
                  <text className="area-label" x="120" y="270" textAnchor="middle">
                    福岡市
                  </text>
                  <text className="area-count" x="120" y="290" textAnchor="middle">
                    {getAreaCount('fukuoka-city')} HOTELS
                  </text>

                  {/* 筑豊エリア */}
                  <path
                    className="area-region"
                    data-area-id="chikuho"
                    d="M 220,200 L 320,180 L 380,210 L 400,260 L 380,310 L 320,330 L 260,320 L 220,290 L 210,240 Z"
                  />
                  <text className="area-label" x="300" y="260" textAnchor="middle">
                    筑豊
                  </text>
                  <text className="area-count" x="300" y="280" textAnchor="middle">
                    {getAreaCount('chikuho')} HOTELS
                  </text>

                  {/* 筑後エリア */}
                  <path
                    className="area-region"
                    data-area-id="chikugo"
                    d="M 100,380 L 200,370 L 260,390 L 280,440 L 270,500 L 220,540 L 150,550 L 90,530 L 70,480 L 80,420 Z"
                  />
                  <text className="area-label" x="180" y="470" textAnchor="middle">
                    筑後
                  </text>
                  <text className="area-count" x="180" y="490" textAnchor="middle">
                    {getAreaCount('chikugo')} HOTELS
                  </text>

                  {/* その他福岡県エリア */}
                  <path
                    className="area-region"
                    data-area-id="fukuoka-other"
                    d="M 210,340 L 280,330 L 340,350 L 380,390 L 400,450 L 380,510 L 320,540 L 280,520 L 260,470 L 250,410 L 230,370 Z"
                  />
                  <text className="area-label" x="310" y="430" textAnchor="middle">
                    その他
                  </text>
                  <text className="area-label" x="310" y="448" textAnchor="middle" fontSize="14">
                    福岡県
                  </text>
                  <text className="area-count" x="310" y="468" textAnchor="middle">
                    {getAreaCount('fukuoka-other')} HOTELS
                  </text>
                </svg>
              </div>

              {/* ホバー時のツールチップ */}
              {hoveredAreaId && (
                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-gray-600">
                    {getAreaById(hoveredAreaId)?.name} をクリックして市区を選択
                  </p>
                </div>
              )}
            </div>

            {/* エリアリスト（地図と連動） */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {areas.map((area) => {
                const count = getAreaCount(area.id);
                if (count === 0) return null; // 0件は非表示

                return (
                  <button
                    key={area.id}
                    onClick={() => handleAreaSelect(area.id)}
                    onMouseEnter={() => setHoveredAreaId(area.id)}
                    onMouseLeave={() => setHoveredAreaId(null)}
                    className={`group rounded-2xl border-2 p-4 text-left transition-all hover:-translate-y-1 hover:shadow-xl ${
                      hoveredAreaId === area.id
                        ? 'border-rose-500 bg-rose-50 shadow-lg shadow-rose-100'
                        : 'border-gray-100 bg-white hover:border-rose-500'
                    }`}
                  >
                    <h3 className="mb-1 text-lg font-black text-gray-900 transition-colors group-hover:text-rose-500">
                      {area.name}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {count} HOTELS
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ステップ2: 市選択 */
          <div className="space-y-8">
            {/* 戻るボタン */}
            <button
              onClick={handleBack}
              className="group inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm transition-all hover:border-rose-500 hover:bg-rose-500 hover:text-white active:scale-95"
            >
              ← エリア選択に戻る
            </button>

            {/* 人気市 */}
            {popularCitiesWithHotels.length > 0 && (
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400">
                  <span className="text-yellow-500">⭐</span> 人気エリア
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {popularCitiesWithHotels.map((city) => (
                    <Link
                      key={city.id}
                      href={`/store/${slug}/hotel/${city.id}`}
                      className="group relative overflow-hidden rounded-2xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white p-6 transition-all hover:-translate-y-2 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-100"
                    >
                      <h4 className="mb-2 text-xl font-black text-gray-900 transition-colors group-hover:text-yellow-600">
                        {city.name}
                      </h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-600">
                        {getCityCount(city.id)} HOTELS
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* すべての市 */}
            <div>
              <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-gray-400">
                📍 すべての市区
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {citiesWithHotels.map((city) => (
                  <Link
                    key={city.id}
                    href={`/store/${slug}/hotel/${city.id}`}
                    className="group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-6 transition-all hover:-translate-y-2 hover:border-rose-500 hover:shadow-2xl hover:shadow-rose-100"
                  >
                    <h4 className="mb-2 text-xl font-black text-gray-900 transition-colors group-hover:text-rose-500">
                      {city.name}
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500">
                      {getCityCount(city.id)} HOTELS
                    </p>
                  </Link>
                ))}
              </div>

              {citiesWithHotels.length === 0 && (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                  <p className="font-bold text-gray-400">
                    このエリアには現在ホテル情報がありません。
                  </p>
                  <button
                    onClick={handleBack}
                    className="mt-4 text-sm font-bold text-rose-500 hover:underline"
                  >
                    他のエリアを見る →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AreaMapSelector;
