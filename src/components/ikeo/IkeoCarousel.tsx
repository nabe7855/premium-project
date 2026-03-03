'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

const SLIDES = [
  {
    id: 1,
    label: 'FEATURED',
    title: '「モテる男」の全てが\nここに集まる。',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1600',
    link: '/ikeo?tag=ファッション・美容',
    accent: 'bg-blue-600',
  },
  {
    id: 2,
    label: 'SELF CARE',
    title: '清潔感は才能じゃない。\n鍛えるものだ。',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1600',
    link: '/ikeo?tag=健康・ボディ',
    accent: 'bg-indigo-600',
  },
  {
    id: 3,
    label: 'ROMANCE',
    title: '選ばれる男になる。\n恋愛を科学する。',
    image: 'https://images.unsplash.com/photo-1529661197280-63b52efb72a6?q=80&w=1600',
    link: '/ikeo?tag=恋愛・デート',
    accent: 'bg-slate-700',
  },
];

export default function IkeoCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full overflow-hidden bg-slate-950">
      {/* Embla viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className="relative min-w-0 flex-[0_0_100%] md:flex-[0_0_100%]">
              <Link href={slide.link} className="group block">
                {/* 画像 */}
                <div className="relative aspect-[4/3] w-full md:aspect-[21/9]">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover brightness-50 transition-transform duration-700 group-hover:scale-105"
                    priority={index === 0}
                  />
                  {/* グラデーションオーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

                  {/* テキストコンテンツ */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:justify-center md:p-12 lg:p-20">
                    <span
                      className={`mb-3 inline-block w-fit rounded-sm px-3 py-1 text-[10px] font-black tracking-[0.25em] text-white ${slide.accent}`}
                    >
                      {slide.label}
                    </span>
                    <h2 className="mb-4 whitespace-pre-wrap font-serif text-2xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                      {slide.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/70 transition-colors group-hover:text-white">
                      記事を読む <ChevronRightIcon size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* 前後ボタン */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 md:h-12 md:w-12"
        aria-label="前へ"
      >
        <ChevronLeftIcon size={20} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 md:h-12 md:w-12"
        aria-label="次へ"
      >
        <ChevronRightIcon size={20} />
      </button>

      {/* ドットインジケーター */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              selectedIndex === i ? 'w-8 bg-blue-400' : 'w-2 bg-white/30'
            }`}
            aria-label={`スライド ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
