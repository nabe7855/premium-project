'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const BANNERS = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600',
    title: '至福のひとときを、',
    subtitle: '選び抜かれた大人の隠れ家。',
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1600',
    title: 'プロが選ぶ安心感。',
    subtitle: '現役セラピスト推奨の極上空間。',
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1544124499-58912cbddadf?auto=format&fit=crop&q=80&w=1600',
    title: '日常を忘れる贅沢。',
    subtitle: '二人の時間をより甘く、スイートに。',
  },
];

const HeroSlider: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % BANNERS.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);

  return (
    <section className="container mx-auto px-4 pb-16 pt-10 md:px-6">
      <div className="flex flex-col gap-6">
        {/* Banner Image Area */}
        <div className="relative aspect-[16/8] w-full overflow-hidden rounded-[2.5rem] bg-rose-50 shadow-xl md:aspect-[21/9]">
          <AnimatePresence mode="wait">
            <motion.div
              key={BANNERS[index].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={BANNERS[index].image}
                alt={BANNERS[index].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Info & Controls Area */}
        <div className="flex items-end justify-between px-2">
          {/* Left: Info */}
          <div className="flex flex-col gap-1">
            <motion.span
              key={`tag-${BANNERS[index].id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-black uppercase tracking-widest text-[#3d7a64]"
            >
              Recommend
            </motion.span>
            <motion.h2
              key={`title-${BANNERS[index].id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-black tracking-tight text-gray-800 md:text-3xl"
            >
              {BANNERS[index].title}
            </motion.h2>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3d7a64] text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3d7a64] text-white shadow-lg transition-all hover:scale-105 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
