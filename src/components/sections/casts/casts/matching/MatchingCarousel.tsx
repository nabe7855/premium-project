'use client';

import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MatchingResult } from './matchingUtils';

interface MatchingCarouselProps {
  results: MatchingResult[];
  onRestart: () => void;
}

const FloatingParticles = () => {
  const particleCount = 30;
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => {
      const size = Math.random() * 8 + 4; // 4px to 12px
      const isPink = Math.random() > 0.5;
      return {
        id: i,
        style: {
          left: `${Math.random() * 100}vw`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: isPink ? 'rgba(255, 182, 193, 0.6)' : 'rgba(255, 255, 255, 0.7)',
          boxShadow: `0 0 8px ${isPink ? 'rgba(255, 182, 193, 0.8)' : 'rgba(255, 255, 255, 0.9)'}`,
          animationDuration: `${Math.random() * 20 + 15}s`, // 15s to 35s
          animationDelay: `${Math.random() * 15}s`,
        },
      };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
      {particles.map((p) => (
        <div key={p.id} className="floating-particle" style={p.style} />
      ))}
    </div>
  );
};

export default function MatchingCarousel({ results, onRestart }: MatchingCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const params = useParams();
  const storeSlug = params.slug as string;

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % results.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
  };

  const getCardStyle = (index: number) => {
    const offset = index - activeIndex;
    let transform = '';
    let zIndex = results.length - Math.abs(offset);
    let opacity = 0;

    // Carousel logic
    if (offset === 0) {
      transform = 'translateX(0) translateZ(0) rotateY(0deg) scale(1)';
      opacity = 1;
    } else if (offset === 1 || offset === -(results.length - 1)) {
      transform = 'translateX(60%) translateZ(-250px) rotateY(-55deg) scale(0.8)';
      opacity = 0.5;
    } else if (offset === -1 || offset === results.length - 1) {
      transform = 'translateX(-60%) translateZ(-250px) rotateY(55deg) scale(0.8)';
      opacity = 0.5;
    } else {
      transform = `translateX(${Math.sign(offset) * 110}%) translateZ(-500px) rotateY(${Math.sign(offset) * 70}deg) scale(0.7)`;
      opacity = 0;
    }

    return {
      transform,
      zIndex,
      transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
      opacity,
    };
  };

  return (
    <div className="animate-gradient-pan fixed inset-0 z-[10001] flex flex-col items-center justify-center overflow-hidden p-4">
      <FloatingParticles />
      <div className="relative z-10 mb-2 text-center">
        <h2
          className="font-lora text-2xl font-bold text-neutral-800 md:text-3xl"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
        >
          あなたにぴったりのキャストはこちら！
        </h2>
      </div>

      <div className="relative flex h-[60vh] w-full max-w-4xl items-center justify-center [perspective:1200px] md:h-[65vh]">
        {results.slice(0, 5).map((cast, index) => {
          // トップ5件を表示
          const isActive = index === activeIndex;
          const castImageUrl =
            cast.mainImageUrl ||
            cast.imageUrl ||
            'https://images.unsplash.com/photo-1516280440614-37939bbddcd2?q=80&w=800&auto=format&fit=crop';

          return (
            <div
              key={cast.id}
              className={`absolute w-64 [transform-style:preserve-3d] md:w-80 ${isActive ? 'cursor-pointer' : ''}`}
              style={getCardStyle(index)}
              onClick={() => {
                if (isActive) {
                  router.push(`/store/${storeSlug}/cast/${cast.slug || cast.id}`);
                }
              }}
            >
              <div
                className={`relative flex h-full w-full transform-gpu flex-col items-center rounded-2xl border-4 border-white bg-white p-4 text-center transition-all duration-300 ${isActive ? 'animate-card-glow hover:scale-[1.02]' : 'shadow-xl'}`}
              >
                <img
                  src={castImageUrl}
                  alt={cast.name}
                  className="mb-4 h-48 w-full rounded-xl object-cover md:h-64"
                />
                <h3 className="text-2xl font-bold text-neutral-800">{cast.name}</h3>
                <p className="mb-2 line-clamp-2 text-sm text-neutral-500">
                  {cast.catchCopy || 'あなただけの特別な時間をお届けします...'}
                </p>
                <div className="mt-auto w-full">
                  <p className="text-lg font-semibold text-rose-500">相性</p>
                  <p className="text-5xl font-bold text-red-500">
                    {cast.matchScore}
                    <span className="text-3xl">%</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-[10002] mt-4 flex space-x-12">
        <button
          onClick={prevCard}
          className="rounded-full bg-white p-3 text-pink-500 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-pink-100 focus:outline-none"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <button
          onClick={nextCard}
          className="rounded-full bg-white p-3 text-pink-500 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-pink-100 focus:outline-none"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      <div className="relative z-[10002] mt-8">
        <button
          onClick={onRestart}
          className="animate-button-pulse group flex transform items-center gap-2 rounded-full bg-pink-500 px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:bg-pink-600 focus:outline-none active:scale-95"
        >
          <RotateCcw className="h-5 w-5" />
          診断ページに戻る
        </button>
      </div>
    </div>
  );
}
