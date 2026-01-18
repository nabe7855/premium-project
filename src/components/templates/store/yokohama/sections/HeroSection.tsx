'use client';
import React, { useEffect, useState } from 'react';

import { HeroConfig } from '@/lib/store/storeTopConfig';

interface HeroSectionProps {
  config?: HeroConfig;
}

const heroImages = [
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1920',
];

const HeroSection: React.FC<HeroSectionProps> = ({ config }) => {
  const images = config?.images?.length ? config.images : heroImages;
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const nextSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section
      id="home"
      className="relative h-[100dvh] min-h-[500px] w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 bg-neutral-100">
        {images.map((img, index) => (
          <div
            key={index}
            className={`duration-1500 absolute inset-0 transition-opacity ease-in-out ${
              index === currentHeroSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={img} alt="" className="h-full w-full scale-105 transform object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 z-10 hidden bg-gradient-to-r from-white/95 via-white/40 to-transparent md:block"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-white/90 via-white/10 to-transparent md:hidden"></div>
      </div>

      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 pt-16 text-center md:items-start md:text-left">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 duration-700 animate-in fade-in slide-in-from-bottom-4">
            <span className="bg-primary-400 h-[1px] w-8"></span>
            <span className="text-primary-500 text-[10px] font-bold uppercase tracking-[0.3em] md:text-xs">
              {config?.badgeText || 'Premium Relaxation Fukuoka'}
            </span>
          </div>
          <h1 className="mb-6 font-serif text-3xl leading-tight text-slate-800 delay-100 duration-700 animate-in fade-in slide-in-from-bottom-4 md:text-6xl">
            {config?.mainHeading || '日常を忘れる、'}
            <br />
            <span className="text-primary-500 italic">
              {config?.subHeading || '至福のひととき。'}
            </span>
          </h1>
          <p className="mb-8 max-w-md whitespace-pre-line text-xs leading-relaxed text-slate-600 delay-200 duration-700 animate-in fade-in slide-in-from-bottom-4 md:text-lg">
            {config?.description ||
              '福岡で愛される女性専用リラクゼーション。\n厳選されたセラピストが、心を込めてお迎えします。'}
          </p>
          <div className="flex w-full flex-col gap-4 delay-300 duration-700 animate-in fade-in slide-in-from-bottom-4 sm:w-auto sm:flex-row">
            <a
              href={config?.primaryButtonLink || '#cast'}
              className="from-primary-400 to-primary-500 rounded-full bg-gradient-to-r px-8 py-4 text-center text-sm font-bold tracking-widest text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              {config?.primaryButtonText || 'セラピストを探す'}
            </a>
            <a
              href={config?.secondaryButtonLink || '#flow'}
              className="border-primary-200 hover:bg-primary-50 rounded-full border bg-white/80 px-8 py-4 text-center text-sm font-bold tracking-widest text-slate-700 backdrop-blur-sm transition-colors"
            >
              {config?.secondaryButtonText || '初めての方へ'}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 transform space-x-3 md:left-20 md:translate-x-0">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentHeroSlide(index)}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentHeroSlide
                ? 'bg-primary-500 w-10'
                : 'hover:bg-primary-300 w-4 bg-slate-300/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
