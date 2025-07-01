'use client';

import { useEffect, useState } from 'react';

export default function LoadingAnimation() {
  const [currentFrame, setCurrentFrame] = useState(0);
  
  const frames = ['🍓', '😋', '🍓', '😊'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 500);

    return () => clearInterval(interval);
  }, [frames.length]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Character */}
        <div className="text-8xl mb-4 animate-bounce">
          {frames[currentFrame]}
        </div>
        
        {/* Loading Text */}
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          ストロベリーボーイ
        </h2>
        <p className="text-gray-600 mb-8">
          甘い時間をご用意しています...
        </p>

        {/* Loading Bars */}
        <div className="flex justify-center space-x-1">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="w-2 h-8 bg-rose-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}