'use client';

import React, { useState } from 'react';

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

  // Shift the array so the currentIndex is first
  const visibleItems = [...SNS_ITEMS.slice(currentIndex), ...SNS_ITEMS.slice(0, currentIndex)];

  const activeItem = visibleItems[0];
  const restItems = visibleItems.slice(1);

  const renderSlideContent = (item: (typeof SNS_ITEMS)[0]) => {
    if (item.isSnsCollection) {
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#8C83E5] via-[#A993E5] to-[#EEA1C7] p-3 md:p-4 lg:p-6">
          <div className="relative z-10 flex h-[60%] w-[95%] flex-col items-center justify-center rounded-[1px] bg-black ring-2 ring-[#FF8BA7] ring-offset-[-6px]">
            <div className="mb-1 flex items-center gap-1">
              <span className="text-sm font-black text-[#FF8BA7] md:text-base">❀ カップルズ</span>
            </div>
            <span className="text-2xl font-black italic tracking-tighter text-white md:text-3xl lg:text-4xl">
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
            <p className="whitespace-pre-line text-[11px] font-bold leading-tight text-white md:text-sm">
              {item.overlayText}
            </p>
          </div>
          <div className="absolute left-1/2 top-1/2 flex h-16 w-24 -translate-x-1/2 -translate-y-[60%] items-center justify-center rounded-full border-[5px] border-black bg-white shadow-lg md:h-20 md:w-[120px]">
            <span className="mr-1 text-2xl font-black italic tracking-tighter text-black md:text-4xl">
              360°
            </span>
          </div>
        </div>
      );
    }
    if (item.awardText) {
      return (
        <div className="relative flex h-full w-full flex-col">
          {/* top graphic */}
          <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF5C3] via-[#FFE259] to-[#FFA751] p-2">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 to-transparent opacity-40 mix-blend-overlay" />
            <p className="z-10 mb-[-2px] text-[10px] font-bold tracking-widest text-black md:text-xs">
              COUPLES
            </p>
            <p className="z-10 mb-[-4px] text-sm font-black tracking-wider text-black md:text-base">
              HOTEL AWARD
            </p>
            <p className="z-10 text-2xl font-black tracking-widest text-black md:text-3xl lg:text-4xl">
              2026
            </p>
            <div className="relative z-10 mt-1 rounded-sm bg-gradient-to-r from-[#8e0e00] to-[#1f1c18] px-6 py-1 text-xs font-bold text-white shadow-md md:py-1.5 md:text-sm">
              投票受付中
            </div>
          </div>
          {/* bottom bar */}
          <div className="relative z-10 flex h-10 w-full shrink-0 items-center justify-center gap-1.5 bg-black px-2 text-white md:h-12">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FFE259] text-[10px] font-black text-black md:h-6 md:w-6">
              P
            </div>
            <span className="flex items-baseline gap-0.5 text-xl font-black italic text-[#FFE259] md:text-2xl">
              1,000<span className="text-[10px] font-bold not-italic">円分</span>
            </span>
            <span className="text-left text-[9px] font-bold leading-[1.2] text-white md:text-[10px]">
              カップルズポイント
              <br />
              プレゼント!!
            </span>
          </div>
        </div>
      );
    }

    // default for other items
    return (
      <div className="relative h-full w-full bg-gray-900">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover opacity-80" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2 pb-2 pt-8 text-center">
          <p className="whitespace-pre-line text-[11px] font-bold leading-tight text-white md:text-sm">
            {item.overlayText}
          </p>
        </div>
      </div>
    );
  };

  return (
    <section className="container mx-auto mb-16 px-4 md:px-6">
      <div className="-mx-4 flex snap-x flex-row items-end gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide md:mx-0 md:gap-5 md:px-0">
        {/* Left: Active Item (Main) */}
        <div className="w-[82vw] flex-shrink-0 snap-start md:w-[40%] lg:w-[36%]">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-gray-200 shadow-sm transition-all duration-300">
            {renderSlideContent(activeItem)}
          </div>
        </div>

        {/* Right: Info & Other Items */}
        <div className="flex flex-shrink-0 flex-col justify-end">
          {/* Header / Title */}
          <div className="mb-3 flex w-full flex-shrink-0 items-center gap-2 border-b-[3px] border-[#EB4E5A] pb-1.5 md:mb-4 md:pb-2">
            <span className="text-xs text-[#EB4E5A]">◀</span>
            <h2 className="shrink-0 whitespace-nowrap text-base font-bold tracking-tight text-gray-800 md:text-xl">
              {activeItem.title}
            </h2>
          </div>

          {/* Rest of the items */}
          <div className="flex flex-shrink-0 items-start gap-2 md:gap-3">
            {restItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => setCurrentIndex(SNS_ITEMS.findIndex((i) => i.id === item.id))}
                className="w-[50vw] flex-shrink-0 cursor-pointer snap-start transition-transform hover:opacity-90 active:scale-95 sm:w-[180px] md:w-[230px] lg:w-[270px]"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[2px] border border-gray-200 shadow-sm">
                  {renderSlideContent(item)}
                </div>
              </div>
            ))}
            {/* Added spacer for mobile scroll to end */}
            <div className="w-4 flex-shrink-0 md:hidden" />
          </div>
        </div>
      </div>

      {/* Dots (Pagination) */}
      <div className="mt-2 flex justify-center gap-3 md:mt-4">
        {SNS_ITEMS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-3 w-3 rounded-full transition-all ${
              currentIndex === i ? 'w-4 bg-gray-800' : 'bg-gray-400 hover:bg-gray-500'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default SecondaryBannerSlider;
