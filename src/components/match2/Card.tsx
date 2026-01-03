'use client';
import React from 'react';
import type { Character, AnimationStep } from '@/types/match';
import { RARITY_STYLES } from '@/data/constants';

interface CardProps {
  character: Character;
  animationStep: AnimationStep;
  delay: number;
}

const Card: React.FC<CardProps> = ({ character, animationStep, delay }) => {
  const isDescending = animationStep === 'descending';
  const isRevealed =
    animationStep === 'revealed' || animationStep === 'flashing_and_flipping';

  const rarityStyle = RARITY_STYLES[character.rarity];

  return (
    <div
      className={`relative 
        w-[120px] h-[180px]       /* 📱 mobile */
        sm:w-[140px] sm:h-[210px] /* 📱+ */
        md:w-[180px] md:h-[270px] /* 💻 */
        lg:w-[200px] lg:h-[300px] /* 🖥️ */
        transition-transform duration-500
        ${isRevealed ? 'scale-105' : ''}`}
      style={{
        transform: 'translateY(-300px) rotateY(0deg) scale(0.8)',
        opacity: 0,
        animationDelay: `${delay}ms`,
        transformStyle: 'preserve-3d',
        animationFillMode: 'forwards',

        ...(isDescending && { animationName: 'descend-rotate' }),
        ...(animationStep === 'flashing_and_flipping' && {
          animationName: 'descend-rotate, flip-reveal',
        }),
        ...(animationStep === 'revealed' && { transform: 'rotateY(1080deg)' }),

        animationDuration: isDescending && !isRevealed ? '4s' : '4s, 1s',
        animationTimingFunction:
          isDescending && !isRevealed
            ? 'ease-out'
            : 'ease-out, ease-in-out',
      }}
    >
      {/* === 裏面 (Back) === */}
      <div
        className="absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl p-2"
        style={{
          backfaceVisibility: 'hidden',
          backgroundImage: `url(${character.backImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'rotateY(0deg)',
        }}
      >
        <div
          className="w-full h-full border-2 sm:border-4 border-pink-300/50 rounded-lg animate-card-glow"
          style={{ animationDelay: `${delay}ms` }}
        />
      </div>

      {/* === 表面 (Front) === */}
      <div
        className={`absolute w-full h-full rounded-2xl overflow-hidden ${rarityStyle.border} border-2 sm:border-4 bg-gray-800 ${rarityStyle.shadow} shadow-2xl`}
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        <div className="relative w-full h-full">
          {/* キャラ画像 (表面) */}
          <img
            src={character.imageUrl}
            alt={character.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* シャイン演出 */}
          {isRevealed && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-effect"
                style={{ animationDelay: `${delay + 500}ms` }}
              />
            </div>
          )}

          {/* キャラ名・レアリティ */}
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 text-center">
            <h3
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white tracking-wider"
              style={{ textShadow: '0 1px 5px black' }}
            >
              {character.name}
            </h3>
            <p
              className={`text-sm sm:text-base md:text-lg font-semibold ${rarityStyle.text}`}
            >
              {character.rarity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
