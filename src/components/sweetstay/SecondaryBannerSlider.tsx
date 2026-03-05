'use client';

import Link from 'next/link';
import React, { useState } from 'react';

const SNS_ITEMS = [
  {
    id: 1,
    title: 'SNSコレクション',
    image:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    bgColor: 'bg-gradient-to-br from-[#E29587] via-[#D66D75] to-[#7D4E68]',
    overlayText: '公式SNSで最新情報をチェック',
  },
  {
    id: 2,
    title: '360°パノラマビュー',
    image:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800',
    overlayText: 'お部屋を360°見まわせるホテル',
    hasBadge: '360°',
  },
  {
    id: 3,
    title: 'HOTEL AWARD 2026',
    image:
      'https://images.unsplash.com/photo-1549463599-3d9730d68922?auto=format&fit=crop&q=80&w=800',
    overlayText: '投票受付中！ポイントプレゼント',
    label: 'VOTING NOW',
  },
];

const SecondaryBannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="container mx-auto mb-12 px-4 md:px-6">
      <div className="mb-4 flex w-fit items-center gap-2 border-b-2 border-[#D66D75] pb-2 pr-8">
        <span className="text-xs text-[#D66D75]">◀</span>
        <h2 className="text-sm font-black tracking-tight text-gray-800">
          Sweet Stay SNSコレクション
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex snap-x gap-4 overflow-x-auto pb-6 scrollbar-hide">
          {SNS_ITEMS.map((item, idx) => (
            <div key={item.id} className="w-[280px] flex-shrink-0 snap-start md:w-[320px]">
              <Link href="#" className="group block">
                <div
                  className={`relative aspect-[16/9] overflow-hidden rounded-2xl shadow-sm transition-all group-hover:shadow-md ${item.bgColor || 'bg-gray-100'}`}
                >
                  {item.bgColor ? (
                    <div
                      className={`absolute inset-0 ${item.bgColor} flex items-center justify-center p-6`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="mb-1 text-[10px] font-black tracking-widest text-white opacity-80">
                          公式
                        </span>
                        <span className="text-xl font-black italic tracking-tighter text-white">
                          SNS COLLECTION
                        </span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}

                  {/* Overlay for all */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-[11px] font-bold leading-tight text-white">
                      {item.overlayText}
                    </p>
                  </div>

                  {item.hasBadge && (
                    <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-md">
                      <span className="text-xs font-black text-white">{item.hasBadge}</span>
                    </div>
                  )}

                  {item.label && (
                    <div className="absolute right-3 top-3 rounded bg-red-600 px-2 py-0.5 text-[8px] font-black text-white">
                      {item.label}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="mt-2 flex justify-center gap-2">
          {SNS_ITEMS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-all ${i === 0 ? 'w-3 bg-gray-800' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecondaryBannerSlider;
