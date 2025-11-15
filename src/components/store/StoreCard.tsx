'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StoreData } from '@/app/backup'; // UI用型をimport
import LoadingAnimation from '@/components/sections/age-verification/LoadingAnimation';

interface StoreCardProps {
  store: StoreData;
}

export default function StoreCard({ store }: StoreCardProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      router.push(store.link);
    }, 2000);
  };

  return (
    <div ref={cardRef} className="relative space-y-4">
      {isLoading && (
        <div className="fixed inset-0 z-[9999]">
          <LoadingAnimation />
        </div>
      )}

      {/* バナー画像 + グラデーションオーバーレイ */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg">
        <img
          src={store.bannerImage}
          alt={`${store.name}バナー`}
          loading="lazy"
          className={`h-auto w-full rounded-3xl object-cover transition-opacity duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-3xl p-6 text-center">
          <h2 className="mb-2 text-xl sm:text-2xl font-extrabold text-white drop-shadow-lg">
            【ストロベリーボーイズ {store.name}】
          </h2>
          <p className="text-sm sm:text-base text-white/90 drop-shadow">
            {store.description}
          </p>
        </div>
      </div>

      {/* 詳細カード（テーマカラー反映） */}
      <div
        role="button"
        onClick={handleCardClick}
        aria-label={`${store.name}の詳細ページへ`}
        className={`cursor-pointer rounded-3xl px-6 py-6 text-center text-white shadow-2xl transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
        style={{
          backgroundImage: store.gradient, // ← CSS値を直接適用
        }}
      >
        <div className="backdrop-blur-md bg-white/20 rounded-2xl p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {store.hashtags?.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-white/90 px-3 py-1 text-xs sm:text-sm text-pink-600 font-medium shadow-md"
              >
                #{tag}
              </span>
            ))}
          </div>
          <button className="rounded-full bg-gradient-to-r from-white to-gray-200 px-8 py-3 text-sm sm:text-base font-bold text-pink-600 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300">
            招待状を開く ✨
          </button>
        </div>
      </div>
    </div>
  );
}
