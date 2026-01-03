'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CHARACTERS, RARITY_STYLES } from '@/data/constants';
import type { Character } from '@/types/match';

const InitialCardAnimation: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  // === 内部 Card コンポーネント（降下 → 浮遊のみ） ===
  const Card: React.FC<{
    character: Character;
    delay?: number;
  }> = ({ character, delay = 0 }) => {
    const rarityStyle = RARITY_STYLES[character.rarity];

    return (
      <div
        className="relative 
          w-[120px] h-[180px] 
          sm:w-[150px] sm:h-[225px] 
          md:w-[180px] md:h-[270px] 
          lg:w-[200px] lg:h-[300px]
          rounded-2xl overflow-hidden shadow-2xl"
        style={{
          transform: 'translateY(-300px) rotateY(0deg) scale(0.8)',
          opacity: 0,
          animation: `descend-rotate 4s ease-out ${delay}ms forwards,
                      hover-float 3s ease-in-out ${4000 + delay}ms infinite`,
        }}
      >
        {/* 裏面 (Back) */}
        <div
          className="absolute w-full h-full p-2 bg-slate-800 rounded-2xl"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="w-full h-full border-2 sm:border-4 border-pink-300/50 rounded-lg animate-card-glow" />
        </div>

        {/* 表面 (Front) */}
        <div
          className={`absolute w-full h-full ${rarityStyle.border} border-2 sm:border-4 bg-gray-800 ${rarityStyle.shadow} shadow-2xl rounded-2xl`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="relative w-full h-full">
            <img
              src={character.imageUrl}
              alt={character.name}
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-2xl" />
            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 text-center">
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white tracking-wider">
                {character.name}
              </h3>
              <p
                className={`text-xs sm:text-sm md:text-base font-semibold ${rarityStyle.text}`}
              >
                {character.rarity}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // === マウント時にランダムで3枚選ぶ ===
  useEffect(() => {
    const shuffled = [...CHARACTERS].sort(() => Math.random() - 0.5);
    setCharacters(shuffled.slice(0, 3));
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex justify-center items-center gap-4 sm:gap-6"
      style={{ perspective: '1000px' }}
    >
      {characters.map((char, index) => (
        <Card key={char.id} character={char} delay={index * 200} />
      ))}
    </motion.div>
  );
};

export default InitialCardAnimation;
