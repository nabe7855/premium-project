'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Cast } from '@/types/cast';

interface CastProfileProps {
  cast: Cast;
}

const CastProfile: React.FC<CastProfileProps> = ({ cast }) => {
  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="px-4 py-5 sm:px-6 sm:py-8">
        <div className="mb-4">
          {/* 名前 */}
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-2 font-serif">
            {cast.name}
          </h1>

          {/* キャッチコピー */}
          {cast.catchCopy && (
            <p className="text-base sm:text-lg text-neutral-600 mb-4">
              {cast.catchCopy}
            </p>
          )}

          {/* 評価・年齢・出勤 */}
          <div className="flex flex-wrap items-center gap-3 mb-6 sm:gap-4">
            {/* 評価 */}
            <div className="flex items-center text-sm sm:text-base">
              <Star className="w-4 h-4 text-amber-400 fill-current mr-1 sm:w-5 sm:h-5" />
              <span className="font-semibold text-neutral-800">
                {cast.sexinessLevel ?? 0}
              </span>
              <span className="text-neutral-600 ml-1">🍓評価</span>
            </div>

            {/* 年齢 */}
            <div className="text-neutral-600 text-sm sm:text-base">
              {cast.age ? `${cast.age}歳` : '秘密❤'}
            </div>

            {/* 出勤 */}
            {cast.isActive && (
              <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold sm:text-sm">
                本日出勤
              </div>
            )}
          </div>

          {/* タグ (faceType, mbtiType, animalName をカード風に表示) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {/* MBTI */}
            <div className="flex flex-col items-start bg-blue-50 rounded-xl shadow-sm p-3 hover:shadow-md transition">
              <span className="text-xs text-pink-500 mb-1">💡 MBTI</span>
              <span className="text-blue-700 font-semibold text-sm sm:text-base">
                {cast.mbtiType ?? '秘密❤'}
              </span>
            </div>

            {/* 動物占い */}
            <div className="flex flex-col items-start bg-orange-50 rounded-xl shadow-sm p-3 hover:shadow-md transition">
              <span className="text-xs text-pink-500 mb-1">🐾 動物占い</span>
              <span className="text-orange-700 font-semibold text-sm sm:text-base">
                {cast.animalName ?? '秘密❤'}
              </span>
            </div>

            {/* 顔型 */}
            <div className="flex flex-col items-start bg-purple-50 rounded-xl shadow-sm p-3 hover:shadow-md transition">
              <span className="text-xs text-pink-500 mb-1">😍 顔型</span>
              <span className="text-purple-700 font-semibold text-sm sm:text-base">
                {cast.faceType && cast.faceType.length > 0
                  ? cast.faceType.join(', ')
                  : '秘密❤'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastProfile;
