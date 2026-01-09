'use client';

import { Hotel } from '@/types/lovehotels';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const { slug } = useParams();
  const areaId = hotel.cityId || 'area';

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
            <div className="text-[10px] font-medium text-gray-400">休憩</div>
            <div className="text-sm font-bold text-gray-800">
              {hotel.restPriceMinWeekday ? (
                <>
                  <span className="mr-1 text-[10px] text-gray-500">平日</span>¥
                  {hotel.restPriceMinWeekday.toLocaleString()}~
                </>
              ) : (
                `¥${hotel.minPriceRest?.toLocaleString() ?? 0}〜`
              )}
            </div>
            {hotel.restPriceMinWeekend && (
              <div className="mt-1 border-t border-gray-200 pt-1 text-xs font-bold text-gray-600">
                <span className="mr-1 text-[10px] text-gray-400">休日</span>¥
                {hotel.restPriceMinWeekend.toLocaleString()}~
              </div>
            )}
          </div>
          <div className="rounded-lg bg-gray-50 p-2">
            <div className="text-[10px] font-medium text-gray-400">宿泊</div>
            <div className="text-sm font-bold text-rose-600">
              {hotel.stayPriceMinWeekday ? (
                <>
                  <span className="mr-1 text-[10px] text-rose-400">平日</span>¥
                  {hotel.stayPriceMinWeekday.toLocaleString()}~
                </>
              ) : (
                `¥${hotel.minPriceStay?.toLocaleString() ?? 0}〜`
              )}
            </div>
            {hotel.stayPriceMinWeekend && (
              <div className="mt-1 border-t border-rose-100 pt-1 text-xs font-bold text-rose-500">
                <span className="mr-1 text-[10px] text-rose-300">休日</span>¥
                {hotel.stayPriceMinWeekend.toLocaleString()}~
              </div>
            )}
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
