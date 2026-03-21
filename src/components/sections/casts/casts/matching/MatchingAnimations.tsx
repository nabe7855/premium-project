'use client';

import React, { useMemo } from 'react';

/* Strawberry Overlay */
export const StrawberryOverlay: React.FC<{ fadingOut: boolean }> = ({ fadingOut }) => {
  const strawberryCount = 30;
  const strawberries = useMemo(() => {
    return Array.from({ length: strawberryCount }).map((_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 160 - 35}vw`,
        top: `${Math.random() * 140 - 20}vh`,
        animationDuration: `3s`,
        animationDelay: `${Math.random() * 2}s`,
        fontSize: `${Math.random() * 720 + 225}px`,
        filter: 'drop-shadow(3px 3px 5px rgba(0,0,0,0.3))',
      },
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden">
      {strawberries.map((s) => (
        <div
          key={s.id}
          className={fadingOut ? 'animate-strawberry-exit-up' : 'animate-strawberry-fill'}
          style={s.style}
        >
          🍓
        </div>
      ))}
    </div>
  );
};

/* Sparkles (Heart symbols) */
export const SparkleEffect: React.FC = () => {
  const sparkleCount = 100;
  const sparkles = useMemo(() => {
    return Array.from({ length: sparkleCount }).map((_, i) => {
      const isPink = Math.random() > 0.4;
      return {
        id: i,
        className: `sparkle-heart ${isPink ? 'sparkle-heart-pink' : 'sparkle-heart-white'}`,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          fontSize: `${Math.random() * 50 + 30}px`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${1.5 + Math.random()}s`,
        },
      };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
      {sparkles.map((s) => (
        <div key={s.id} className={s.className} style={s.style}>
          ♡
        </div>
      ))}
    </div>
  );
};

/* Card Fall Scene (Trump card themed) */
export const CardFallScene: React.FC = () => {
  const cards = [
    { id: 1, delay: 0.2, animationClass: 'animate-card-tumble-in-left' },
    { id: 2, delay: 0, animationClass: 'animate-card-tumble-in-center' },
    { id: 3, delay: 0.2, animationClass: 'animate-card-tumble-in-right' },
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-transparent [perspective:1000px]">
      <SparkleEffect />
      <div className="relative flex h-full w-full items-center justify-center">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`trump-card-style absolute flex h-72 w-48 items-center justify-center rounded-xl shadow-2xl ${card.animationClass}`}
            style={{ animationDelay: `${card.delay}s` }}
          >
            <div
              className="animate-symbol-glow text-5xl"
              style={{ textShadow: '0 0 10px #ff007f' }}
            >
              🍓
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Whiteout Scene (Fade to Results) */
export const WhiteoutScene: React.FC = () => (
  <div className="animate-fade-in fixed inset-0 z-[10000] bg-white transition-opacity duration-500"></div>
);
