import React, { useMemo } from 'react';

const SPARKLE_COUNT = 30;

interface Sparkle {
  id: number;
  style: React.CSSProperties;
}

const Sparkle: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
  return (
    <div
      className="absolute rounded-full bg-pink-400 animate-sparkle-twinkle"
      style={style}
    ></div>
  );
};

const SparkleContainer: React.FC = () => {
  const sparkles = useMemo<Sparkle[]>(() => {
    return Array.from({ length: SPARKLE_COUNT }).map((_, i) => {
      const size = Math.random() * 3 + 1;
      const angle = Math.random() * 360;
      const radius = Math.random() * 250 + 100; // Spread sparkles around the cards
      const x = Math.cos(angle * (Math.PI / 180)) * radius;
      const y = Math.sin(angle * (Math.PI / 180)) * radius;

      return {
        id: i,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          top: `calc(50% + ${y}px)`,
          left: `calc(50% + ${x}px)`,
          animationDelay: `${Math.random() * 1.5}s`,
          boxShadow: '0 0 5px 1px #ec4899',
        },
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      {sparkles.map((sparkle) => (
        <Sparkle key={sparkle.id} style={sparkle.style} />
      ))}
    </div>
  );
};

export default SparkleContainer;
