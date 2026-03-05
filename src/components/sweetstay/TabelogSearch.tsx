'use client';

import { getPurposes } from '@/lib/lovehotelApi';
import { Purpose } from '@/types/lovehotels';
import { Map, MapPin, Search, Star, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AreaSearchModal from './AreaSearchModal';

const TabelogSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [purposeId, setPurposeId] = useState('');
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getPurposes().then(setPurposes).catch(console.error);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('q', keyword.trim());
    if (purposeId) params.append('purpose', purposeId);

    router.push(`/sweetstay/search?${params.toString()}`);
  };

  return (
    <div className="container relative z-30 mx-auto mb-12 px-4 md:px-6">
      {/* Main Search Form Container */}
      <div className="relative z-30 flex flex-col gap-4 rounded-[2.5rem] bg-white px-6 pb-2 pt-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] md:mx-auto lg:max-w-3xl">
        {/* WHERE Input */}
        <div className="flex w-full items-center gap-4 rounded-[1.5rem] border-2 border-slate-50 bg-slate-50/50 px-6 py-3.5 transition-all focus-within:border-rose-100 focus-within:bg-white">
          <span className="w-20 flex-shrink-0 text-xs font-black uppercase tracking-widest text-[#F18EA4]">
            WHERE
          </span>
          <input
            type="text"
            placeholder="駅名・地域名・ホテル名"
            className="w-full bg-transparent text-sm font-bold text-gray-700 placeholder-gray-300 outline-none"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* PURPOSE Select */}
        <div className="relative flex w-full items-center gap-4 rounded-[1.5rem] border-2 border-slate-50 bg-slate-50/50 px-6 py-3.5 transition-all focus-within:border-rose-100 focus-within:bg-white">
          <span className="w-20 flex-shrink-0 text-xs font-black uppercase tracking-widest text-[#F18EA4]">
            PURPOSE
          </span>
          <select
            className="w-full appearance-none bg-transparent text-sm font-bold text-gray-700 outline-none"
            value={purposeId}
            onChange={(e) => setPurposeId(e.target.value)}
          >
            <option value="">すべての目的</option>
            {purposes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {/* Custom Chevron for select */}
          <div className="pointer-events-none absolute right-6 text-gray-400">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* SEARCH Button */}
        <button
          onClick={handleSearch}
          className="group flex w-full items-center justify-center gap-2 rounded-[1.5rem] bg-[#F18EA4] py-4 text-white shadow-md shadow-rose-200/50 transition-all hover:brightness-105 active:scale-[0.98]"
        >
          <Search size={20} strokeWidth={3} />
          <span className="text-base font-black uppercase tracking-widest">SEARCH</span>
        </button>

        {/* Popular Tags */}
        <div className="mb-2 mt-1 flex flex-wrap gap-x-4 gap-y-2">
          {['女子会', '露天風呂', '格安', 'サウナ'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setKeyword(tag);
              }}
              className="text-[11px] font-bold text-gray-400 transition-colors hover:text-[#F18EA4]"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Bottom Buttons Group */}
      <div className="relative -z-10 mx-auto -mt-10 flex items-start justify-between rounded-[2.5rem] bg-[#FFF8F9] px-4 pb-6 pt-16 shadow-sm md:justify-center md:gap-14 lg:max-w-3xl">
        {/* Area Search */}
        <button
          onClick={() => setIsAreaModalOpen(true)}
          className="group flex flex-col items-center gap-2"
        >
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#FFEAEF] text-[#E65C7B] shadow-sm transition-transform group-hover:scale-105">
            <MapPin size={26} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-black tracking-tighter text-gray-600">エリア検索</span>
        </button>

        {/* Map Search */}
        <button className="group flex flex-col items-center gap-2">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[1.2rem] bg-[#FFEAEF] text-[#E65C7B] shadow-sm transition-transform group-hover:scale-105">
            <Map size={26} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-black tracking-tighter text-gray-600">
            地図から探す
          </span>
        </button>

        {/* Coupon */}
        <button className="group flex flex-col items-center gap-2">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-[1.2rem] bg-[#FFEAEF] text-[#E65C7B] shadow-sm transition-transform group-hover:scale-105">
            <Ticket size={26} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-black tracking-tighter text-gray-600">クーポン</span>
        </button>

        {/* Ranking */}
        <button className="group flex flex-col items-center gap-2">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#FFEAEF] text-[#E65C7B] shadow-sm transition-transform group-hover:scale-105">
            <Star size={26} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-black tracking-tighter text-gray-600">ランキング</span>
        </button>

        {/* Detailed Search */}
        <button className="group flex flex-col items-center gap-2">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#FFEAEF] text-[#E65C7B] shadow-sm transition-transform group-hover:scale-105">
            <Search size={26} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-black tracking-tighter text-gray-600">
            こだわり検索
          </span>
        </button>
      </div>

      <AreaSearchModal isOpen={isAreaModalOpen} onClose={() => setIsAreaModalOpen(false)} />
    </div>
  );
};

export default TabelogSearch;
