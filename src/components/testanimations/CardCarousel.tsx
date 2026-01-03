'use client';

import { useMemo, useState } from 'react';

const castData = [
  {
    id: 1,
    name: 'Hana',
    match: 95,
    image: 'https://picsum.photos/seed/picsum1/400/600',
    description: '明るく元気なひまわりのような女の子。一緒にいると自然と笑顔になれる。',
  },
  {
    id: 2,
    name: 'Yuki',
    match: 88,
    image: 'https://picsum.photos/seed/picsum2/400/600',
    description: 'クールでミステリウスな雰囲気。でも、心の中はとても温かい。',
  },
  {
    id: 3,
    name: 'Sora',
    match: 76,
    image: 'https://picsum.photos/seed/picsum3/400/600',
    description: '優しくておっとりした性格。彼女の癒やしのオーラに包まれたい。',
  },
];

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

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

interface CardCarouselProps {
  onRestart: () => void;
}

export default function CardCarousel({ onRestart }: CardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % castData.length);
  };

  const prevCard = () => {
    setActiveIndex((prev) => (prev - 1 + castData.length) % castData.length);
  };

  const getCardStyle = (index: number) => {
    const offset = index - activeIndex;
    let transform = '';
    let zIndex = castData.length - Math.abs(offset);
    let opacity = 0;

    if (offset === 0) {
      transform = 'translateX(0) translateZ(0) rotateY(0deg) scale(1)';
      opacity = 1;
    } else if (offset === 1 || offset === -(castData.length - 1)) {
      transform = 'translateX(60%) translateZ(-250px) rotateY(-55deg) scale(0.8)';
      opacity = 0.5;
    } else if (offset === -1 || offset === castData.length - 1) {
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
    <div className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-transparent p-4">
      <FloatingParticles />
      <div className="relative z-10 mb-2 text-center">
        <h2
          className="font-lora text-2xl text-gray-800 md:text-3xl"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
        >
          あなたにぴったりのキャストはこちら！
        </h2>
      </div>
      <div className="relative flex h-[65vh] w-full max-w-4xl items-center justify-center [perspective:1200px] md:h-[70vh]">
        {castData.map((cast, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={cast.id}
              className="absolute w-64 [transform-style:preserve-3d] md:w-80"
              style={getCardStyle(index)}
            >
              <div
                className={`relative flex h-full w-full transform-gpu flex-col items-center rounded-2xl border-4 border-white bg-white p-4 text-center transition-all duration-300 ${isActive ? 'animate-card-glow' : 'shadow-xl'}`}
              >
                <img
                  src={cast.image}
                  alt={cast.name}
                  className="mb-4 h-48 w-full rounded-xl object-cover md:h-64"
                />
                <h3 className="text-2xl font-bold text-gray-800">{cast.name}</h3>
                <p className="mb-2 text-sm text-gray-500">{cast.description}</p>
                <div className="mt-auto w-full">
                  <p className="text-lg font-semibold text-rose-500">相性</p>
                  <p className="text-6xl font-bold text-red-500">
                    {cast.match}
                    <span className="text-3xl">%</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative z-50 mt-4 flex space-x-12">
        <button
          onClick={prevCard}
          className="rounded-full bg-white p-3 text-pink-500 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <ChevronLeftIcon />
        </button>
        <button
          onClick={nextCard}
          className="rounded-full bg-white p-3 text-pink-500 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          <ChevronRightIcon />
        </button>
      </div>
      <div className="relative z-50 mt-8">
        <button
          onClick={onRestart}
          className="animate-button-pulse transform rounded-full bg-pink-500 px-8 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          もう一度相性診断をする
        </button>
      </div>
    </div>
  );
}
