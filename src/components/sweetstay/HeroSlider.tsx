'use client';

import { AnimatePresence, motion } from 'framer-motion';
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

  return (
    <div className="relative h-[60vh] w-full overflow-hidden md:h-[70vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={BANNERS[index].id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={BANNERS[index].image}
            alt={BANNERS[index].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white" />
        </motion.div>
      </AnimatePresence>

      <div className="container relative z-10 flex h-full flex-col justify-center px-4 md:px-6">
        <motion.div
          key={`text-${BANNERS[index].id}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-2xl"
        >
          <h2 className="mb-4 font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
            {BANNERS[index].title}
          </h2>
          <p className="text-lg font-medium tracking-widest text-white/90 md:text-2xl">
            {BANNERS[index].subtitle}
          </p>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-3">
        {BANNERS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
