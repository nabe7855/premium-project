'use client';

import { BookOpen, Map, MapPin, MessageSquare, Search, Star, Ticket } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const MENU_ITEMS = [
  { id: 'area', icon: <MapPin size={22} />, label: 'エリア検索', link: '/sweetstay/area' },
  { id: 'map', icon: <Map size={22} />, label: '地図', link: '/sweetstay/map' },
  { id: 'review', icon: <MessageSquare size={22} />, label: '口コミ', link: '/sweetstay/reviews' },
  { id: 'guide', icon: <BookOpen size={22} />, label: '攻略ガイド', link: '/sweetstay/guide' },
  { id: 'coupon', icon: <Ticket size={22} />, label: 'クーポン', link: '/sweetstay/coupon' },
  { id: 'ranking', icon: <Star size={22} />, label: 'ランキング', link: '/sweetstay/ranking' },
  { id: 'search', icon: <Search size={22} />, label: 'こだわり', link: '/sweetstay/search' },
];

const QuickNav: React.FC = () => {
  return (
    <div className="container relative z-20 mx-auto -mt-10 px-4 md:px-6">
      <div className="grid grid-cols-4 gap-2 rounded-[2.5rem] bg-white p-3 shadow-2xl shadow-rose-200/40 md:grid-cols-7 md:gap-4 md:p-6 lg:mx-auto lg:max-w-6xl">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="group flex flex-col items-center gap-2 transition-all hover:-translate-y-1 active:scale-95"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 transition-colors group-hover:bg-rose-500 group-hover:text-white md:h-14 md:w-14">
              {item.icon}
            </div>
            <span className="text-[9px] font-black tracking-tighter text-gray-500 md:text-[11px] md:font-bold">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickNav;
