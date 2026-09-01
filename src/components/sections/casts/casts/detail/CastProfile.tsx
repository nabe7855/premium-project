'use client';

import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { Cast } from '@/types/cast';

import { getJstTodayString } from '@/lib/utils/formatSchedule';

interface CastProfileProps {
  cast: Cast;
  storeSlug?: string;
  reviewCount?: number;
  onReviewsClick?: () => void;
}

const CastProfile: React.FC<CastProfileProps> = ({
  cast,
  storeSlug,
  reviewCount: propReviewCount,
  onReviewsClick,
}) => {
  const count = propReviewCount ?? cast.reviewCount ?? 0;
  const today = getJstTodayString();
  const todaySchedules = cast.availability?.[today] ?? [];
  const isAvailableToday = cast.isOnline || todaySchedules.length > 0;

  const storeLabel =
    storeSlug === 'yokohama'
      ? 'ストロベリーボーイズ横浜店'
      : storeSlug === 'fukuoka'
        ? 'ストロベリーボーイズ福岡店'
        : 'ストロベリーボーイズ';

  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="px-4 py-5 sm:px-6 sm:py-8">
        <div className="mb-4">
          {/* 店舗・地域を示す可視ラベル */}
          <p className="mb-1 text-xs font-bold tracking-wider text-[#E8567A] sm:text-sm">
            {storeLabel} セラピスト
          </p>

          {/* 名前 */}
          <h1 className="mb-2 font-serif text-2xl font-bold text-neutral-800 sm:text-3xl">
            {cast.name}
          </h1>

          {/* キャッチコピー */}
          {cast.catchCopy && (
            <p className="mb-4 text-base text-neutral-600 sm:text-lg">{cast.catchCopy}</p>
          )}

          {/* 評価・年齢・出勤 */}
          <div className="mb-6 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* 評価 (クリック可能アンカーバッジ) */}
            {count > 0 ? (
              onReviewsClick ? (
                <button
                  onClick={onReviewsClick}
                  className="shadow-xs group flex items-center rounded-lg border border-amber-200/80 bg-amber-50/80 px-2.5 py-1 text-sm transition-all hover:border-amber-300 hover:bg-amber-100 sm:text-base"
                >
                  <Star className="mr-1 h-4 w-4 fill-current text-amber-400 sm:h-5 sm:w-5" />
                  <span className="font-bold text-neutral-800">
                    {(cast.rating ?? 0).toFixed(1)}
                  </span>
                  <span className="ml-1 text-xs font-medium text-neutral-600 sm:text-sm">
                    🍓評価 ({count}件)
                  </span>
                  <ChevronRight className="ml-0.5 h-3.5 w-3.5 text-neutral-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <div className="flex items-center text-sm sm:text-base">
                  <Star className="mr-1 h-4 w-4 fill-current text-amber-400 sm:h-5 sm:w-5" />
                  <span className="font-semibold text-neutral-800">
                    {(cast.rating ?? 0).toFixed(1)}
                  </span>
                  <span className="ml-1 text-neutral-600">🍓評価 ({count}件)</span>
                </div>
              )
            ) : onReviewsClick ? (
              <button
                onClick={onReviewsClick}
                className="flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500 transition-colors hover:bg-neutral-200 sm:text-sm"
              >
                <span>評価はまだありません (口コミを書く)</span>
                <ChevronRight className="ml-0.5 h-3.5 w-3.5 text-neutral-400" />
              </button>
            ) : (
              <div className="flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-400 sm:text-sm">
                評価はまだありません
              </div>
            )}

            {/* 年齢 */}
            <div className="text-sm text-neutral-600 sm:text-base">
              {cast.age ? `${cast.age}歳` : '秘密❤'}
            </div>

            {/* 出勤 */}
            {isAvailableToday && (
              <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 sm:text-sm">
                本日出勤
              </div>
            )}
          </div>

          {/* タグ (faceType, mbtiType, animalName をカード風に表示) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {/* MBTI */}
            <div className="flex flex-col items-start rounded-xl bg-blue-50 p-3 shadow-sm transition hover:shadow-md">
              <span className="mb-1 text-xs text-pink-500">💡 MBTI</span>
              <span className="text-sm font-semibold text-blue-700 sm:text-base">
                {cast.mbtiType ?? '秘密❤'}
              </span>
            </div>

            {/* 動物占い */}
            <div className="flex flex-col items-start rounded-xl bg-orange-50 p-3 shadow-sm transition hover:shadow-md">
              <span className="mb-1 text-xs text-pink-500">🐾 動物占い</span>
              <span className="text-sm font-semibold text-orange-700 sm:text-base">
                {cast.animalName ?? '秘密❤'}
              </span>
            </div>

            {/* 顔型 */}
            <div className="flex flex-col items-start rounded-xl bg-purple-50 p-3 shadow-sm transition hover:shadow-md">
              <span className="mb-1 text-xs text-pink-500">😍 顔型</span>
              <span className="text-sm font-semibold text-purple-700 sm:text-base">
                {cast.faceType && cast.faceType.length > 0 ? cast.faceType.join(', ') : '秘密❤'}
              </span>
            </div>
          </div>

          {/* 最新のつぶやき (フル表示) */}
          {cast.latestTweet && (
            <div className="relative mt-6 rounded-2xl border border-pink-100 bg-pink-50 p-4 shadow-sm">
              <div className="absolute -top-3 left-4 rounded-full bg-pink-500 px-3 py-1 text-[10px] font-bold text-white shadow-sm sm:left-6">
                💬 今日のつぶやき
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-800 sm:text-base">
                {cast.latestTweet}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CastProfile;
