import { RandomCast } from '@/lib/getRandomTodayCast';
import { motion } from 'framer-motion';
import { Menu, Star } from 'lucide-react';
import React from 'react';

interface HeroProps {
  cast: RandomCast | null;
}

const Hero: React.FC<HeroProps> = ({ cast }) => {
  // カルーセルのアイテム用背景色
  const bgColors = ['bg-[#FF7EB3]', 'bg-[#7EEDFF]', 'bg-[#FFD93D]', 'bg-[#B088F9]'];
  const cardBg = bgColors[0]; // 単一キャストの場合はピンクをデフォルトに

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
      <div className="mt-12 px-0">
        <div
          className="flex gap-6 overflow-x-auto px-10 pb-12 scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {/* Card Item */}
          <div
            className="relative w-[320px] flex-shrink-0 scroll-snap-align-center"
            style={{ scrollSnapAlign: 'center' }}
          >
            <div
              className={`relative h-[480px] w-full overflow-hidden rounded-[40px] border-[6px] border-black shadow-[12px_12px_0px_#000] ${cardBg}`}
            >
              {/* Dot Pattern Background Overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(#000 2px, transparent 2px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Amoeba Ornament 1 */}
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
              {/* Amoeba Ornament 2 */}
              <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-[#FFD93D]/40 blur-3xl shadow-inner" />

              {/* Top Pick Badge (Gizagiza Star) */}
              <div className="absolute left-1/2 top-14 z-20 flex -translate-x-1/2 flex-col items-center">
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute h-full w-full animate-[spin_10s_linear_infinite] fill-[#FFD93D] drop-shadow-[2px_2px_0px_#000]"
                  >
                    <path d="M50 0 L58.8 35.4 L95.1 25 L75 50 L95.1 75 L58.8 64.6 L50 100 L41.2 64.6 L4.9 75 L25 50 L4.9 25 L41.2 35.4 Z" />
                  </svg>
                  <span className="relative z-10 text-center text-[10px] font-black leading-tight text-slate-900">
                    TOP<br />PICK
                  </span>
                </div>
              </div>

              {/* Main Image Area with Clip Path */}
              <div className="relative mt-36 flex justify-center px-6">
                <div
                  className="group relative h-64 w-64 border-4 border-black bg-white shadow-[8px_8px_0px_#000]"
                  style={{
                    clipPath:
                      'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
                  }}
                >
                  {cast?.main_image_url ? (
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
              <div className="mt-6 px-8 text-center">
                <h2 className="text-2xl font-black tracking-tighter text-slate-900 drop-shadow-sm">
                  {cast ? cast.name : 'キャスト未定'}
                </h2>
                {cast?.catch_copy && (
                  <p className="mt-1 line-clamp-1 text-xs font-bold text-slate-800">
                    {cast.catch_copy}
                  </p>
                )}
                
                {/* Visual Accent */}
                <div className="mt-4 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#FFD93D] text-black" strokeWidth={2.5} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dummy Slide for Carousel Feel if only 1 cast */}
          <div className="w-1 flex-shrink-0" />
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
