'use client';

import { RandomCast } from '@/lib/getRandomTodayCast';
import { motion } from 'framer-motion';
import { Menu, Star } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface HeroProps {
  casts: RandomCast[];
}

const Hero: React.FC<HeroProps> = ({ casts }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // カルーセルのアイテム用背景色
  const bgColors = ['bg-[#FF7EB3]', 'bg-[#7EEDFF]', 'bg-[#FFD93D]', 'bg-[#B088F9]'];

  // 3秒ごとにスライド
  useEffect(() => {
    if (casts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % casts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [casts.length]);

  // インデックスが変わったら水平方向にのみスクロール
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const target = container.children[currentIndex] as HTMLElement;
    if (target) {
      // ターゲットをコンテナの中央に配置するための位置計算
      const scrollLeft = target.offsetLeft - (container.offsetWidth - target.offsetWidth) / 2;
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  return (
    <div className="relative w-full overflow-hidden bg-[#FFEB3B] pb-10 pt-4">
      {/* 2. Main Carousel Area */}
      <div className="mt-4">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 pb-12 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {casts.length > 0 ? (
            casts.map((cast, idx) => (
              <div
                key={cast.id}
                className="relative w-[300px] flex-shrink-0 pt-10"
                style={{ scrollSnapAlign: 'center' }}
              >
                {/* 🏷️ Cast Info Tag (Overlapping the card at the top) */}
                <div className="absolute left-1/2 top-4 z-40 w-[80%] -translate-x-1/2">
                  <div className="relative bg-[#7EEDFF] border-[3px] border-black px-3 py-2 text-center shadow-[4px_4px_0px_#000]">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-black tracking-tight text-black">
                        {cast.name}
                      </span>
                      {cast.catch_copy && (
                        <span className="mt-0.5 line-clamp-1 text-[8px] font-bold text-gray-800">
                          {cast.catch_copy}
                        </span>
                      )}
                    </div>
                    {/* Bottom Point of the Tag */}
                    <div className="absolute -bottom-[9px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-[3px] border-r-[3px] border-black bg-[#7EEDFF]" />
                  </div>
                </div>

                <div
                  className={`relative h-[440px] w-full overflow-hidden rounded-[40px] border-[5px] border-black shadow-[10px_10px_0px_#000] ${
                    bgColors[idx % bgColors.length]
                  }`}
                >
                  {/* Dot Pattern Background Overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Amoeba Ornaments */}
                  <div className="absolute -left-10 top-1/2 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
                  <div className="absolute bottom-4 right-4 h-6 w-6 rounded-full bg-pink-300 border-2 border-black" />
                  <div className="absolute top-20 left-4 h-4 w-4 rounded-full bg-yellow-300 border-2 border-black" />

                  {/* Spacer for the top tag */}
                  <div className="h-20" />

                  {/* Main Image Area with Flower/Amoeba Clip Path */}
                  <div className="relative flex justify-center px-4 pt-4">
                    <div
                      className="group relative h-64 w-64 border-4 border-black bg-white shadow-[6px_6px_0px_#000]"
                      style={{
                        clipPath: 'url(#flowerPath)',
                      }}
                    >
                      {/* SVG definition for the flower path to use as clipPath */}
                      <svg width="0" height="0">
                        <defs>
                          <clipPath id="flowerPath" clipPathUnits="objectBoundingBox">
                            <path d="M0.5,0 C0.65,0 0.75,0.1 0.75,0.25 C0.9,0.25 1,0.35 1,0.5 C1,0.65 0.9,0.75 0.75,0.75 C0.75,0.9 0.65,1 0.5,1 C0.35,1 0.25,0.9 0.25,0.75 C0.1,0.75 0,0.65 0,0.5 C0,0.35 0.1,0.25 0.25,0.25 C0.25,0.1 0.35,0 0.5,0 Z" />
                          </clipPath>
                        </defs>
                      </svg>
                      {cast.main_image_url ? (
                        <img
                          src={cast.main_image_url}
                          alt={cast.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-bold text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Decoration stars/etc */}
                  <div className="mt-8 flex justify-center gap-4 px-6 opacity-30">
                    <Star size={24} className="text-black" />
                    <Star size={32} className="text-black fill-white" />
                    <Star size={24} className="text-black" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-40 w-full items-center justify-center font-bold text-slate-400">
              キャスト未定
            </div>
          )}
        </div>
      </div>

      {/* Background Graphic Decoration */}
      <div className="absolute bottom-4 left-4 h-12 w-12 opacity-40">
        <svg viewBox="0 0 100 100" className="fill-purple-400">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
