'use client';

import { PREFECTURES } from '@/data/lovehotels';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrefectureExplorer: React.FC = () => {
  const navigate = useNavigate();

  const handlePrefClick = (id: string) => {
    navigate(`/prefecture/${id}`);
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-full bg-rose-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-500">
            Browse By Location
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tighter text-gray-900">
            都道府県からホテルを探す
          </h2>
          <p className="mx-auto max-w-lg font-medium text-gray-400">
            日本全国の主要都市から、あなたにぴったりのブティックホテルを見つけましょう。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {PREFECTURES.map((pref) => (
            <button
              key={pref.id}
              onClick={() => handlePrefClick(pref.id)}
              className="group relative overflow-hidden rounded-[2rem] border-2 border-gray-50 bg-white p-8 text-center transition-all hover:-translate-y-2 hover:border-rose-500 hover:shadow-2xl hover:shadow-rose-100"
            >
              <div className="absolute right-0 top-0 -mr-8 -mt-8 h-16 w-16 rounded-full bg-rose-50 opacity-0 transition-opacity group-hover:opacity-100"></div>
              <div className="relative z-10 mb-1 text-xl font-black text-gray-900 transition-colors group-hover:text-rose-500">
                {pref.name}
              </div>
              <div className="relative z-10 text-[10px] font-black uppercase tracking-widest text-gray-300 transition-colors group-hover:text-rose-300">
                {pref.count} HOTELS
              </div>
              <div className="mt-4 flex translate-y-2 justify-center opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <svg
                  className="h-5 w-5 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PrefectureExplorer;
