'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Play, Pause } from 'lucide-react';
import { Cast, ScoredCast } from '@/types/cast';

interface CastCardProps {
  cast: Cast | ScoredCast;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCastSelect: () => void;
  audioSampleUrl?: string;
  sortBy: string;
}

const CastCard: React.FC<CastCardProps> = ({
  cast,
  index,
  onCastSelect,
  audioSampleUrl,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todaySchedules = cast.availability?.[today] ?? [];
  const isAvailableToday = cast.isOnline || todaySchedules.length > 0;

  // 相性スコアを持っているかどうか
  const hasCompatibilityScore = 'compatibilityScore' in cast;

  // 音声再生管理
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!audioRef.current || !audioSampleUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      void audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  // ⭐ 評価 or 💘 相性スコア
  const scoreSection = hasCompatibilityScore ? (
    <div className="mb-2 text-pink-600 font-bold">
      💘 相性スコア: {Math.round((cast as ScoredCast).compatibilityScore)}%
    </div>
  ) : (
    <div className="mb-2 flex items-center">
      <Star className="h-3 w-3 fill-current text-amber-400 sm:h-4 sm:w-4" />
      <span className="ml-1 text-xs font-medium text-neutral-700 sm:text-sm">
        {cast.rating}
      </span>
      <span className="ml-1 text-xs text-neutral-500">({cast.reviewCount})</span>
    </div>
  );

  // 🍓 セクシー度
  const sexinessSection = cast.sexinessStrawberry ? (
    <div className="mb-2 text-sm text-pink-500">セクシー度: {cast.sexinessStrawberry}</div>
  ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="shadow-soft hover:shadow-luxury group cursor-pointer rounded-xl bg-white transition-all duration-300"
      onClick={onCastSelect}
    >
      {/* ===================== */}
      {/* 📸 画像部分 */}
      {/* ===================== */}
      <div className="relative aspect-[3/4]">
        <div className="h-full w-full overflow-hidden rounded-t-xl">
          <img
            src={cast.mainImageUrl ?? cast.imageUrl ?? cast.avatar}
            alt={`${cast.name}のプロフィール写真`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* 🟢 出勤バッジ */}
        {isAvailableToday && (
          <div className="absolute left-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
            本日出勤
          </div>
        )}

        {/* 🏷️ ステータスラベル（右上リボン風） */}
        {cast.statuses && cast.statuses.length > 0 && (
          <div className="absolute right-0 top-2 flex flex-col gap-2 items-end pr-2 overflow-visible">
            {cast.statuses.map((s) => {
              const master = s.status_master;
              return (
                <span
                  key={s.id}
                  className="relative inline-block px-4 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: master?.label_color || '#374151',
                    color: master?.text_color || '#ffffff',
                    borderRadius: '4px 0 0 4px',
                    boxShadow: '2px 2px 6px rgba(0,0,0,0.25)',
                    position: 'relative',
                    right: '-8px',
                  }}
                >
                  {master?.name}
                  <span
                    className="absolute right-[-10px] top-0 h-0 w-0"
                    style={{
                      borderTop: '16px solid transparent',
                      borderBottom: '16px solid transparent',
                      borderLeft: `10px solid ${master?.label_color || '#374151'}`,
                    }}
                  />
                </span>
              );
            })}
          </div>
        )}

        {/* ❤️ お気に入り */}


        {/* ▶️ 音声再生ボタン */}
        <button
          onClick={handleAudioToggle}
          className="absolute bottom-2 right-2 rounded-full bg-white p-2 shadow-md hover:bg-primary/10 transition-colors duration-200"
          aria-label="音声サンプルを再生"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-primary" />
          ) : (
            <Play className="h-5 w-5 text-primary" />
          )}
        </button>
        <audio ref={audioRef} src={audioSampleUrl || ''} preload="none" />
      </div>

      {/* ===================== */}
      {/* 📄 コンテンツ部分 */}
      {/* ===================== */}
      <div className="p-3 sm:p-4">
        {/* 名前 & 年齢 */}
        <div className="mb-2 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-neutral-800 sm:text-base">
              {cast.name}
            </h3>
            {/* ✅ キャッチコピー */}
            {cast.catchCopy && (
              <p className="mt-1 text-xs italic text-pink-600 sm:text-sm">
                「{cast.catchCopy}」
              </p>
            )}
          </div>
          <div className="ml-2 flex-shrink-0 text-right">
            <div className="text-xs text-neutral-500 sm:text-sm">{cast.age}歳</div>
          </div>
        </div>

{/* ✅ MBTI & 顔型 */}
<div className="mb-2 flex flex-wrap gap-2">
  {cast.mbtiType && (
    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
      MBTI: {cast.mbtiType}
    </span>
  )}
  {cast.faceType && cast.faceType.length > 0 && (
    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
      顔型: {cast.faceType.join(', ')}
    </span>
  )}
</div>

        {/* ⭐ 評価 */}
        {scoreSection}

        {/* 🍓 セクシー度 */}
        {sexinessSection}

        {/* 🏷️ タグ */}
        <div className="mb-3 flex flex-wrap gap-1">
          {cast.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-secondary text-primary rounded-full px-2 py-1 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
          {cast.tags && cast.tags.length > 2 && (
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
              +{cast.tags.length - 2}
            </span>
          )}
        </div>

        {/* ⏰ 出勤時間 */}
        {isAvailableToday && todaySchedules.length > 0 && (
          <div className="flex items-center text-xs text-green-600">
            <Clock className="mr-1 h-3 w-3" />
            <span>
              {todaySchedules.slice(0, 2).join('・')}
              {todaySchedules.length > 2 && '...'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CastCard;
