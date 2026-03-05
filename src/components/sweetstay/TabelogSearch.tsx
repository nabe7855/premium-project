'use client';

import { getPurposes } from '@/lib/lovehotelApi';
import { Purpose } from '@/types/lovehotels';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const TabelogSearch: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [purposeId, setPurposeId] = useState('');
  const [purposes, setPurposes] = useState<Purpose[]>([]);
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
    <div className="container relative z-30 mx-auto mt-2 px-4 md:px-6">
      <div className="relative z-30 rounded-[2.5rem] bg-white p-4 shadow-2xl shadow-rose-200/40 md:p-6 lg:mx-auto lg:max-w-4xl">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Where: Area / Station / Hotel Name */}
          <div className="flex flex-[1.5] items-center gap-3 rounded-2xl bg-gray-50 px-5 py-2 ring-1 ring-gray-100 transition-all focus-within:ring-rose-200">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF8BA7]">
              Where
            </span>
            <input
              type="text"
              placeholder="駅名・地域名・ホテル名"
              className="w-full bg-transparent text-sm font-bold text-gray-800 placeholder-gray-300 outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          {/* What: Purpose */}
          <div className="flex flex-1 items-center gap-3 rounded-2xl bg-gray-50 px-5 py-2 ring-1 ring-gray-100 transition-all focus-within:ring-rose-200">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF8BA7]">
              Purpose
            </span>
            <select
              className="w-full bg-transparent text-sm font-bold text-gray-800 outline-none"
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
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="group flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#FF8BA7] px-8 text-white shadow-lg shadow-rose-200/50 transition-all hover:scale-105 hover:bg-rose-400 active:scale-95"
          >
            <Search size={22} className="stroke-[3px]" />
            <span className="text-sm font-black uppercase tracking-widest">Search</span>
          </button>
        </div>

        {/* Popular Tags / Quick Filter */}
        <div className="mt-4 flex flex-wrap gap-2 px-2">
          {['女子会', '露天風呂', '格安', 'サウナ'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setKeyword(tag);
                // Trigger search immediately if needed, or just set keyword
              }}
              className="text-[10px] font-bold text-gray-400 transition-colors hover:text-rose-500"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabelogSearch;
