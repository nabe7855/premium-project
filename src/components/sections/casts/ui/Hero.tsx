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

  // インデックスが変わったらスクロール
  useEffect(() => {
    if (!scrollRef.current) return;
    const target = scrollRef.current.children[currentIndex] as HTMLElement;
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex]);

  return (
    <div className="relative w-full overflow-hidden bg-[#FFEB3B] pb-10">
      {/* 1. Header Area (nicopi style) */}
      <div className="sticky top-0 z-30 h-20 bg-[#FFEB3B] px-4 shadow-sm">
        <div className="flex h-full items-center justify-between">
          <div className="flex flex-col items-start pt-2">
            <span className="text-[10px] font-bold tracking-tighter text-slate-800">
              にこの生き物グッズ屋さん
            </span>
            <span className="font-title text-3xl font-black italic tracking-tighter text-slate-900">
              nicopi
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[4px_4px_0px_#000]">
              <Menu size={24} className="text-slate-900" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">menu</span>
          </div>
        </div>

        {/* Wavy Border Bottom */}
        <div className="absolute -bottom-[29px] left-0 w-full overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block h-[30px] w-full fill-[#FFEB3B]"
          >
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
          </svg>
        </div>
      </div>

      {/* 2. Main Carousel Area */}
      <div className="mt-12">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 pb-12 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {casts.length > 0 ? (
            casts.map((cast, idx) => (
              <div
                key={cast.id}
                className="relative w-[280px] flex-shrink-0"
                style={{ scrollSnapAlign: 'center' }}
              >
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

                  {/* Amoeba Ornament 1 */}
                  <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
                  {/* Amoeba Ornament 2 */}
                  <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-[#FFD93D]/40 blur-3xl shadow-inner" />

                  {/* Top Pick Badge (Gizagiza Star) */}
                  <div className="absolute left-1/2 top-10 z-20 flex -translate-x-1/2 flex-col items-center">
                    <div className="relative flex h-20 w-20 items-center justify-center">
                      <svg
                        viewBox="0 0 100 100"
                        className="absolute h-full w-full animate-[spin_10s_linear_infinite] fill-[#FFD93D] drop-shadow-[2px_2px_0px_#000]"
                      >
                        <path d="M50 0 L58.8 35.4 L95.1 25 L75 50 L95.1 75 L58.8 64.6 L50 100 L41.2 64.6 L4.9 75 L25 50 L4.9 25 L41.2 35.4 Z" />
                      </svg>
                      <span className="relative z-10 text-center text-[10px] font-black leading-tight text-slate-900">
                        TOP
                        <br />
                        PICK
                      </span>
                    </div>
                  </div>

                  {/* Main Image Area with Clip Path */}
                  <div className="relative mt-28 flex justify-center px-4">
                    <div
                      className="group relative h-56 w-56 border-4 border-black bg-white shadow-[6px_6px_0px_#000]"
                      style={{
                        clipPath:
                          'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                      }}
                    >
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

                  {/* Content Info */}
                  <div className="mt-4 px-6 text-center">
                    <h2 className="text-xl font-black tracking-tighter text-slate-900 drop-shadow-sm">
                      {cast.name}
                    </h2>
                    {cast.catch_copy && (
                      <p className="mt-1 line-clamp-1 text-[10px] font-bold text-slate-800">
                        {cast.catch_copy}
                      </p>
                    )}

                    {/* Visual Accent */}
                    <div className="mt-2 flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="fill-[#FFD93D] text-black"
                          strokeWidth={2.5}
                        />
                      ))}
                    </div>
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
      <div className="absolute right-10 top-40 h-8 w-8 opacity-40">
        <svg viewBox="0 0 100 100" className="fill-pink-400">
          <rect x="10" y="10" width="80" height="80" rx="20" transform="rotate(20)" />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
