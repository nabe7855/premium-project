'use client';

import React, { useState } from 'react';

const SearchHero: React.FC = () => {
  const [keyword, setKeyword] = useState('');

  return (
    <div className="relative overflow-hidden bg-rose-600">
      <div className="absolute inset-0">
        <img
          src="https://picsum.photos/seed/hero/1600/600"
          alt="Background"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 to-transparent"></div>
      </div>

      <div className="container relative mx-auto px-4 py-16 text-center md:py-24">
        <h1 className="mb-6 text-3xl font-bold text-white drop-shadow-lg md:text-5xl">
          今夜の、一番いい場所。
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-rose-100 md:text-xl">
          エリア、予算、こだわり設備から全国のラブホテルを簡単検索。
          あなたの特別な時間をサポートします。
        </p>

        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-2 shadow-2xl md:p-3">
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="駅名、地名、ホテル名で検索"
                className="h-14 w-full rounded-xl border-none bg-gray-50 pl-12 pr-4 text-gray-800 outline-none focus:ring-2 focus:ring-rose-500"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <svg
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button className="h-14 rounded-xl bg-rose-500 px-8 font-bold text-white shadow-lg transition-colors hover:bg-rose-600 md:px-12">
              検索
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/20">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            現在地から探す
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchHero;
