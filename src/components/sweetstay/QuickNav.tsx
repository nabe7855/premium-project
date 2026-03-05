'use client';

import { Map, MapPin, Search, Star, Ticket } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const MENU_ITEMS = [
  { id: 'area', icon: <MapPin size={28} />, label: 'エリア検索', link: '/sweetstay/area' },
  { id: 'map', icon: <Map size={28} />, label: '地図から探す', link: '/sweetstay/map' },
  { id: 'coupon', icon: <Ticket size={28} />, label: 'クーポン', link: '/sweetstay/coupon' },
  { id: 'ranking', icon: <Star size={28} />, label: 'ランキング', link: '/sweetstay/ranking' },
  { id: 'search', icon: <Search size={28} />, label: 'こだわり検索', link: '/sweetstay/search' },
];

const QuickNav: React.FC = () => {
  return (
    <div className="container relative z-20 mx-auto -mt-10 px-4 md:px-6">
      <div className="grid grid-cols-5 gap-2 rounded-[2.5rem] bg-white p-3 shadow-2xl shadow-rose-200/40 md:gap-6 md:p-6 lg:mx-auto lg:max-w-4xl">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="group flex flex-col items-center gap-2 transition-all hover:-translate-y-1 active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white md:h-16 md:w-16">
              {item.icon}
            </div>
            <span className="text-[9px] font-black tracking-tighter text-gray-500 md:text-sm md:font-bold">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickNav;
