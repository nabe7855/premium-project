'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { StoreData } from '@/data/storeData';
import LoadingAnimation from '@/components/sections/age-verification/LoadingAnimation';

interface StoreCardProps {
  store: StoreData;
}

export default function StoreCard({ store }: StoreCardProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ← ← 追加
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
    setIsLoading(true); // ← ← 表示フラグON

    setTimeout(() => {
      router.push(store.link);
    }, 2000); // ← アニメーション2秒間再生後に遷移
  };

  return (
    <div ref={cardRef} className="relative space-y-4">
      {isLoading && (
        <div className="fixed inset-0 z-[9999]">
          <LoadingAnimation />
        </div>
      )}

      <div className="transform overflow-hidden rounded-3xl shadow-md transition-all duration-1000 ease-out">
        <Image
          src={store.bannerImage}
          alt={`${store.name}バナー`}
          width={800}
          height={400}
          loading="lazy"
          className={`h-auto w-full rounded-3xl object-cover transition-opacity duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        />
      </div>

      <div
        role="button"
        onClick={handleCardClick}
        aria-label={`${store.name}の詳細ページへ`}
        className={`transform cursor-pointer rounded-3xl bg-gradient-to-br px-6 py-5 text-center text-white shadow-xl transition-all duration-1000 ease-out ${store.gradient} ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <h2 className="mb-2 text-lg font-bold">【ストロベリーボーイズ {store.name}】</h2>
        <p className="mb-3 text-sm text-white/90">{store.description}</p>

        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {store.hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/90 px-3 py-1 text-xs text-pink-600 shadow-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-pink-500 shadow hover:bg-pink-100">
          招待状を開く
        </button>
      </div>
    </div>
  );
}
