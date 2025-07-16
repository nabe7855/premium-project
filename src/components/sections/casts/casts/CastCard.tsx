'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Clock, Play, Pause } from 'lucide-react';
import { Cast } from '@/types/caststypes';

interface CastCardProps {
  cast: Cast;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCastSelect: () => void;
  audioSampleUrl?: string; // 今はなくてもOK
  sortBy: string;
}

const CastCard: React.FC<CastCardProps> = ({
  cast,
  index,
  isFavorite,
  onToggleFavorite,
  onCastSelect,
  audioSampleUrl,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const isAvailableToday = cast.isOnline || cast.availability[today]?.length > 0;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleAudioToggle = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();

    if (audioRef.current && audioSampleUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        void audioRef.current.play();
        setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="shadow-soft hover:shadow-luxury group cursor-pointer overflow-hidden rounded-xl bg-white transition-all duration-300"
      onClick={onCastSelect}
    >
      {/* 画像部分 */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={cast.avatar}
          alt={`${cast.name}のプロフィール写真`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* オンライン状態 */}
        {isAvailableToday && (
          <div className="absolute left-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
            本日出勤
          </div>
        )}

        {/* お気に入りボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute right-2 top-2 rounded-full bg-white/80 p-2 backdrop-blur-sm transition-colors duration-200 hover:bg-white"
          aria-label="お気に入り"
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`}
          />
        </button>

        {/* 🎤 音声バッジ（常時表示） */}
        <div className="absolute left-2 bottom-2 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-primary shadow-sm backdrop-blur-sm">
          🎤 声あり
        </div>

        {/* ▶️ 再生ボタン（常時表示） */}
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
        {/* audio 要素（URLなしでも配置） */}
        <audio ref={audioRef} src={audioSampleUrl || ''} preload="none" />
      </div>

      {/* コンテンツ部分 */}
      <div className="p-3 sm:p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-neutral-800 sm:text-base">
              {cast.name}
            </h3>
            <p className="line-clamp-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
              {cast.catchphrase}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0 text-right">
            <div className="text-xs text-neutral-500 sm:text-sm">{cast.age}歳</div>
          </div>
        </div>

        {/* 評価 */}
        <div className="mb-3 flex items-center">
          <Star className="h-3 w-3 fill-current text-amber-400 sm:h-4 sm:w-4" />
          <span className="ml-1 text-xs font-medium text-neutral-700 sm:text-sm">
            {cast.rating}
          </span>
          <span className="ml-1 text-xs text-neutral-500">({cast.reviewCount})</span>
        </div>

        {/* タグ */}
        <div className="mb-3 flex flex-wrap gap-1">
          {cast.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-secondary text-primary rounded-full px-2 py-1 text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
          {cast.tags.length > 2 && (
            <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
              +{cast.tags.length - 2}
            </span>
          )}
        </div>

        {/* スケジュール */}
        {isAvailableToday && cast.availability[today]?.length > 0 && (
          <div className="flex items-center text-xs text-green-600">
            <Clock className="mr-1 h-3 w-3" />
            <span>
              {cast.availability[today].slice(0, 2).join('・')}
              {cast.availability[today].length > 2 && '...'}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CastCard;
