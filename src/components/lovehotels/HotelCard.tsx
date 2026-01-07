'use client';

import { PREFECTURES } from '@/data/lovehotels';
import { Hotel } from '@/types/lovehotels';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const { slug } = useParams();
  // エリア名（または市区町村ID）を取得
  const city = PREFECTURES.find((p) => p.name === hotel.prefecture)?.cities.find(
    (c) => c.name === hotel.city,
  );
  const areaId = city?.id || 'area';

  return (
    <Link
      href={`/store/${slug}/hotel/${areaId}/${hotel.id}`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-md">
          {hotel.area}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
          ★ {hotel.rating}
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-1 truncate font-bold text-gray-900 transition-colors group-hover:text-rose-600">
          {hotel.name}
        </h3>
        <p className="mb-3 flex items-center gap-1 text-xs text-gray-500">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
          </svg>
          {hotel.distanceFromStation}
        </p>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-gray-50 p-2">
            <div className="text-[10px] font-medium text-gray-400">休憩最低料金</div>
            <div className="text-sm font-bold text-gray-800">
              ¥{hotel.minPriceRest.toLocaleString()}〜
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <div className="text-[10px] font-medium text-gray-400">宿泊最低料金</div>
            <div className="text-sm font-bold text-rose-600">
              ¥{hotel.minPriceStay.toLocaleString()}〜
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {hotel.amenities.slice(0, 3).map((item, idx) => (
            <span key={idx} className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] text-rose-500">
              {item}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] text-gray-400">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
