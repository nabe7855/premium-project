'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';

const SNS_ITEMS = [
  {
    id: 1,
    title: 'カップルズSNSコレクション',
    isSnsCollection: true,
  },
  {
    id: 2,
    title: '360°見まわせるホテル',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    overlayText: 'お部屋を360°見まわせる\nラブホテル',
    hasBadge: '360°',
  },
  {
    id: 3,
    title: 'COUPLES HOTEL AWARD 2026',
    awardText: true,
  },
  {
    id: 4,
    title: '女子会にオススメのホテル特集',
    image:
      'https://images.unsplash.com/photo-1522228115018-d838bcce5c3a?auto=format&fit=crop&q=80&w=800',
    overlayText: '女子会にオススメの\nホテル特集',
  },
  {
    id: 5,
    title: '露天風呂があるプレミアムホテル',
    image:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
    overlayText: '露天風呂がある\nプレミアムホテル',
  },
];

const SecondaryBannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SNS_ITEMS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const visibleItems = [...SNS_ITEMS.slice(currentIndex), ...SNS_ITEMS.slice(0, currentIndex)];
  const activeItem = visibleItems[0];
  const restItems = visibleItems.slice(1);

  const renderSlideContent = (item: (typeof SNS_ITEMS)[0], isMain = false) => {
    if (item.isSnsCollection) {
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#8C83E5] via-[#A993E5] to-[#EEA1C7] p-3 md:p-6">
          <div className="relative z-10 flex h-[60%] w-[90%] flex-col items-center justify-center rounded-[1px] bg-black ring-2 ring-[#FF8BA7] ring-offset-[-6px]">
            <div className="mb-1 flex items-center gap-1">
              <span className="text-[10px] font-black text-[#FF8BA7] md:text-sm">❀ カップルズ</span>
            </div>
            <span className="text-xl font-black italic tracking-tighter text-white md:text-3xl lg:text-4xl">
              SNSコレクション
            </span>
          </div>
        </div>
      );
    }
    if (item.hasBadge) {
      return (
        <div className="relative h-full w-full bg-gray-900">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-2 pb-2 pt-8 text-center">
            <p className="whitespace-pre-line text-[10px] font-bold leading-tight text-white md:text-xs">
              {item.overlayText}
            </p>
          </div>
          <div className="absolute left-1/2 top-1/2 flex h-14 w-20 -translate-x-1/2 -translate-y-[60%] items-center justify-center rounded-full border-[4px] border-black bg-white shadow-lg md:h-20 md:w-[120px]">
            <span className="text-xl font-black italic tracking-tighter text-black md:text-4xl">
              360°
            </span>
          </div>
        </div>
      );
    }
    if (item.awardText) {
      return (
        <div className="relative flex h-full w-full flex-col">
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF5C3] via-[#FFE259] to-[#FFA751] p-2">
            <p className="z-10 text-[8px] font-bold tracking-widest text-black md:text-[10px]">
              COUPLES
            </p>
            <p className="z-10 text-[10px] font-black tracking-wider text-black md:text-xs">
              HOTEL AWARD
            </p>
            <p className="z-10 text-xl font-black text-black md:text-3xl">2026</p>
            <div className="mt-1 rounded-sm bg-black px-4 py-0.5 text-[8px] font-bold text-white md:px-6 md:py-1 md:text-xs">
              投票受付中
            </div>
          </div>
          <div className="flex h-8 w-full items-center justify-center gap-1 bg-black text-white md:h-12">
            <span className="text-[12px] font-black italic text-[#FFE259] md:text-2xl">
              1,000円分
            </span>
          </div>
        </div>
      );
    }
    return (
      <div className="relative h-full w-full bg-gray-900">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover opacity-80" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2 pb-2 pt-6 text-center">
          <p className="whitespace-pre-line text-[10px] font-bold leading-tight text-white md:text-xs">
            {item.overlayText}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section className="container mx-auto mb-16 overflow-hidden px-4 md:px-6">
      <div className="-mx-4 flex flex-row items-end gap-3 px-4 pb-4 md:mx-0 md:gap-8 md:px-0">
        {/* Left: Active Item (Main) */}
        <div className="relative w-[35vw] flex-shrink-0 overflow-visible md:w-[38%] lg:w-[32%]">
          <div className="relative aspect-[4/3] w-full">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 1.1, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -30 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 z-10 overflow-hidden rounded-[8px] border border-gray-100 shadow-xl"
              >
                {renderSlideContent(activeItem, true)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Info & Other Items */}
        <div className="flex min-w-0 flex-1 flex-col justify-end">
          <div className="mb-2 flex items-center gap-1.5 overflow-hidden border-b-[1.5px] border-[#EB4E5A] pb-1 md:mb-4 md:border-b-[3px] md:pb-2">
            <span className="animate-pulse text-[8px] text-[#EB4E5A] md:text-xs">◀</span>
            <AnimatePresence mode="wait">
              <motion.h2
                key={activeItem.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="truncate text-[10px] font-bold tracking-tight text-gray-800 md:text-xl"
              >
                {activeItem.title}
              </motion.h2>
            </AnimatePresence>
          </div>

          <div className="flex items-start gap-1.5 overflow-x-auto pb-2 scrollbar-hide md:gap-4">
            {restItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                onClick={() => setCurrentIndex(SNS_ITEMS.findIndex((i) => i.id === item.id))}
                className="w-[20vw] flex-shrink-0 cursor-pointer transition-all hover:opacity-90 active:scale-95 sm:w-[150px] md:w-[180px] lg:w-[220px]"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[4px] border border-gray-100 bg-gray-50 shadow-sm">
                  {renderSlideContent(item)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2.5">
        {SNS_ITEMS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              currentIndex === i ? 'w-8 bg-[#EB4E5A]' : 'w-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default SecondaryBannerSlider;
