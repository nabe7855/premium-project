'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Cast } from '@/types/cast'; // ← caststypes ではなく cast に統一

interface CastProfileProps {
  cast: Cast;
}

const CastProfile: React.FC<CastProfileProps> = ({ cast }) => {
  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-2 font-serif">
            {cast.name}
          </h1>
          {/* catchCopy に統一 */}
          {cast.catchCopy && (
            <p className="text-base sm:text-lg text-neutral-600 mb-4">
              {cast.catchCopy}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* レビュー */}
            <div className="flex items-center">
              <Star className="w-4 h-4 text-amber-400 fill-current mr-1" />
              <span className="font-semibold text-neutral-800 text-sm">
                {cast.sexinessLevel ?? 0}
              </span>
              <span className="text-neutral-600 ml-1 text-sm">
                🍓評価
              </span>
            </div>

            {/* 年齢 */}
            {cast.age && (
              <div className="text-neutral-600 text-sm">{cast.age}歳</div>
            )}

            {/* 出勤フラグ */}
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                cast.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {cast.isActive ? '本日出勤' : 'お休み'}
            </div>
          </div>

          {/* タグ (faceTypeやmbtiなどをタグっぽく表示する) */}
          <div className="flex flex-wrap gap-2 mb-6">
            {cast.faceType?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-secondary text-primary rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
            {cast.mbtiType && (
              <span className="px-2 py-1 bg-secondary text-primary rounded-full text-xs font-medium">
                {cast.mbtiType}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastProfile;
