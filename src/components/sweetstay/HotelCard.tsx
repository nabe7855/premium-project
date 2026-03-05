'use client';

import { Hotel } from '@/types/lovehotels';
import Link from 'next/link';
import React from 'react';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-gray-50 bg-white transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-100">
      <Link
        href={`/sweetstay/hotel/${hotel.id}`}
        className="absolute inset-0 z-10"
        aria-label={`${hotel.name}を詳しく見る`}
      />

      {/* Image Container */}
      <div className="aspect-[4/3] overflow-hidden">
        {hotel.imageUrl ? (
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            No Image
          </div>
        )}

        {/* Therapist Recommendation Badge */}
        <div className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md">
          <span className="text-xs text-rose-400">★</span> Cast Recommended
        </div>
      </div>

      <div className="p-8">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <span>{hotel.city || 'エリア'}</span>
            <span className="h-1 w-1 rounded-full bg-gray-200"></span>
            <span>{hotel.area || '詳細エリア'}</span>
          </div>
          {hotel.rating > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold text-rose-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {hotel.rating.toFixed(1)}
            </div>
          )}
        </div>

        <h3 className="mb-4 line-clamp-1 text-xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-rose-600">
          {hotel.name}
        </h3>

        <div className="mb-6 flex h-6 flex-wrap gap-2 overflow-hidden">
          {/* Display Purposes as primary tags */}
          {hotel.purposes?.slice(0, 2).map((purpose) => (
            <span
              key={purpose}
              className="inline-block rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[8px] font-bold text-rose-500"
            >
              {purpose}
            </span>
          ))}
          {/* Fallback to amenities if no purposes */}
          {(!hotel.purposes || hotel.purposes.length === 0) &&
            hotel.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="inline-block rounded-full border border-gray-100 bg-gray-50 px-3 py-1 text-[8px] font-bold text-gray-400"
              >
                {amenity}
              </span>
            ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <div>
            <div className="text-[8px] font-black uppercase tracking-widest text-gray-300">
              Minimum Stay
            </div>
            <div className="text-sm font-black text-gray-900">
              {hotel.minPriceStay ? `¥${hotel.minPriceStay.toLocaleString()}〜` : '価格未設定'}
            </div>
          </div>
          <div className="flex h-10 w-10 transform items-center justify-center rounded-full bg-rose-50 text-rose-500 transition-all group-hover:translate-x-1 group-hover:bg-rose-500 group-hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
