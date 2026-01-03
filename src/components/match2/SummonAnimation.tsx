'use client';

import { useEffect, useState } from 'react';
import type { Character } from '@/types/match';
import { CHARACTERS } from '@/data/constants';
import Card from '@/components/match2/Card';

interface SummonAnimationProps {
  onComplete?: () => void; // ✅ アニメ終了通知
}

const SummonAnimation: React.FC<SummonAnimationProps> = ({ onComplete }) => {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    // 3枚ランダム選択
    const shuffled = [...CHARACTERS].sort(() => Math.random() - 0.5);
    setCharacters(shuffled.slice(0, 3));

    // ✅ アニメ終了を親に通知（カード降下4s + 浮遊2s = 6s）
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center gap-6"
      style={{ perspective: '1500px' }}
    >
      {characters.map((char, index) => (
        <Card
          key={char.id}
          character={char}
          animationStep="descending"
          delay={index * 300}
        />
      ))}
    </div>
  );
};

export default SummonAnimation;
