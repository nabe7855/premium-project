'use client';

import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface BannerData {
  id: string;
  image_url: string;
  title: string;
  subtitle?: string | null;
  link_url?: string | null;
}

interface MagazineBannerSliderProps {
  banners?: BannerData[];
}

const DEFAULT_BANNERS = [
  {
    id: 'default-1',
    title: '漫画でわかる。\nはじめてのルミエール',
    subtitle: 'PICK UP',
    image_url: 'https://images.unsplash.com/photo-1516589174163-475354e00fb4?q=80&w=1600',
    link_url: '/amolab?tag=はじめての方へ',
  },
  {
    id: 'default-2',
    title: '新人モニター大募集\n施術料が最大無料！',
    subtitle: 'CAMPAIGN',
    image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1600',
    link_url: '/career',
  },
  {
    id: 'default-3',
    title: '公式YouTubeチャンネル\n動画で癒やし体験',
    subtitle: 'CHANNEL',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600',
    link_url: 'https://youtube.com',
  },
];

export default function MagazineBannerSlider({ banners }: MagazineBannerSliderProps) {
  const currentBanners = banners && banners.length > 0 ? banners : DEFAULT_BANNERS;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      skipSnaps: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

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
    <div className="relative w-full overflow-hidden py-8 md:py-12">
      {/* カルーセルコンテナ */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container flex items-center">
          {currentBanners.map((item, index) => {
            const isActive = selectedIndex === index;

            // ループを考慮した隣接判定
            const snapCount = currentBanners.length;
            const diff = (index - selectedIndex + snapCount) % snapCount;
            const isPrev = diff === snapCount - 1;
            const isNext = diff === 1;

            return (
              <div
                key={item.id}
                className="embla__slide relative min-w-0 flex-[0_0_72%] md:flex-[0_0_50%] lg:flex-[0_0_40%]"
                style={{
                  perspective: '1200px',
                  zIndex: isActive ? 20 : 10,
                }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.05 : 0.8,
                    opacity: isActive ? 1 : 0.35,
                    rotateY: isPrev ? 15 : isNext ? -15 : 0,
                    // 重なりを持たせるために左右のバナーを中央方向にずらす
                    x: isPrev ? '15%' : isNext ? '-15%' : '0%',
                    z: isActive ? 0 : -100,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 25,
                  }}
                  className={`relative aspect-square w-full overflow-hidden rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.2)] md:rounded-[4rem] ${
                    isActive ? 'cursor-pointer' : 'pointer-events-none'
                  }`}
                >
                  <Link href={item.link_url || '#'}>
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    <AnimatePresence mode="wait">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute inset-x-0 bottom-0 p-8 text-white md:p-12 lg:p-16"
                        >
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-4 inline-block rounded-full bg-pink-500 px-5 py-2 text-[10px] font-bold tracking-widest text-white shadow-xl md:text-xs"
                          >
                            {item.subtitle}
                          </motion.span>
                          <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-6 whitespace-pre-wrap font-serif text-2xl font-bold leading-tight md:text-4xl lg:text-5xl"
                          >
                            {item.title}
                          </motion.h2>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 border-b border-white pb-1 text-xs font-bold md:text-sm"
                          >
                            詳しく見る <ChevronRightIcon size={16} />
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ナビゲーションアロー */}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-between px-4 md:px-10 lg:px-20">
        <button
          onClick={scrollPrev}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-pink-400 shadow-2xl transition-all hover:bg-pink-500 hover:text-white md:h-20 md:w-20"
          aria-label="前へ"
        >
          <ChevronLeftIcon className="h-8 w-8 md:h-10 md:w-10" />
        </button>
        <button
          onClick={scrollNext}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-pink-400 shadow-2xl transition-all hover:bg-pink-500 hover:text-white md:h-20 md:w-20"
          aria-label="次へ"
        >
          <ChevronRightIcon className="h-8 w-8 md:h-10 md:w-10" />
        </button>
      </div>

      {/* ドットインジケーター */}
      <div className="mt-8 flex justify-center gap-3 md:mt-16">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              selectedIndex === index
                ? 'w-16 bg-pink-400 shadow-lg shadow-pink-200'
                : 'w-4 bg-pink-100'
            }`}
            aria-label={`スライド ${index + 1} へ`}
          />
        ))}
      </div>
    </div>
  );
}
