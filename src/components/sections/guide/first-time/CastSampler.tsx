'use client';

import React, { useEffect, useState } from 'react';

import { CastData, getCastsByStore } from '@/lib/store/castActions';

interface CastSamplerProps {
  storeSlug?: string;
}

export const CastSampler: React.FC<CastSamplerProps> = ({ storeSlug = 'fukuoka' }) => {
  const [casts, setCasts] = useState<CastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCasts = async () => {
      console.log(`[CastSampler] Fetching casts for slug: ${storeSlug}`);
      setIsLoading(true);
      const result = await getCastsByStore(storeSlug, 3);
      console.log('[CastSampler] Result:', result);
      if (result.success && result.casts) {
        setCasts(result.casts);
      }
      setIsLoading(false);
    };

    fetchCasts();
  }, [storeSlug]);

  // ローディング中の表示
  if (isLoading) {
    return (
      <section className="overflow-hidden bg-stone-50 py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black md:text-4xl">
              貴女を待つ、
              <br className="md:hidden" />
              <span className="text-[#FF4B5C]">自慢のセラピストたち</span>
            </h2>
            <p className="font-medium text-gray-500">
              厳選されたキャストが、最高のおもてなしをお約束します。
            </p>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#FF4B5C]"></div>
          </div>
        </div>
      </section>
    );
  }

  // キャストが0件の場合
  if (casts.length === 0) {
    return (
      <section className="overflow-hidden bg-stone-50 py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-black md:text-4xl">
              貴女を待つ、
              <br className="md:hidden" />
              <span className="text-[#FF4B5C]">自慢のセラピストたち</span>
            </h2>
            <p className="font-medium text-gray-500">
              厳選されたキャストが、最高のおもてなしをお約束します。
            </p>
          </div>
          <div className="py-10 text-center">
            <p className="text-gray-400">現在、キャスト情報を準備中です。</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden bg-stone-50 py-20">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-black md:text-4xl">
            貴女を待つ、
            <br className="md:hidden" />
            <span className="text-[#FF4B5C]">自慢のセラピストたち</span>
          </h2>
          <p className="font-medium text-gray-500">
            厳選されたキャストが、最高のおもてなしをお約束します。
          </p>
        </div>

        <div className="mb-12 flex gap-6 overflow-x-auto pb-6 md:grid md:grid-cols-3 md:gap-8 md:pb-0">
          {casts.map((cast) => (
            <div
              key={cast.id}
              className="group relative w-[280px] flex-shrink-0 overflow-hidden rounded-3xl bg-white shadow-xl transition-all hover:-translate-y-2 md:w-full"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={cast.image_url}
                  alt={cast.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-2xl font-black text-gray-800">{cast.name}</span>
                  <span className="text-sm font-bold text-gray-400">{cast.age}歳</span>
                </div>
                {cast.features?.personality && (
                  <div className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#FF4B5C]">
                    {cast.features.personality.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={`/store/${storeSlug}/cast`}
            className="inline-flex items-center gap-2 rounded-full bg-[#FF4B5C] px-10 py-4 font-bold text-white shadow-lg transition-all hover:bg-[#ff3548] hover:shadow-xl active:scale-95"
          >
            すべてのセラピストを見る
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
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
          <p className="mt-4 text-xs font-medium text-gray-300">
            ※写真はイメージです。実際とは異なる場合があります。
          </p>
        </div>
      </div>
    </section>
  );
};
