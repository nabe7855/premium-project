'use client';

import { Cast, ScoredCast } from '@/types/cast';
import { motion } from 'framer-motion';
import { Clock, Pause, Play, Star } from 'lucide-react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

interface CastCardProps {
  cast: Cast | ScoredCast;
  index: number;
  storeSlug: string;
  isFavorite: boolean;
  onCastSelect: () => void;
  onToggleFavorite: () => void;
  audioSampleUrl?: string;
  sortBy: string;
  currentlyPlayingId: string | null;
  setCurrentlyPlayingId: React.Dispatch<React.SetStateAction<string | null>>;
}

const CastCard: React.FC<CastCardProps> = ({
  cast,
  index,
  audioSampleUrl,
  currentlyPlayingId,
  setCurrentlyPlayingId,
  storeSlug,
}) => {
  const router = useRouter();
  const today = new Date().toISOString().split('T')[0];
  const todaySchedules = cast.availability?.[today] ?? [];
  const isAvailableToday = cast.isOnline || todaySchedules.length > 0;

  const hasCompatibilityScore = 'compatibilityScore' in cast;

  // 音声再生管理
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const handleAudioToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!audioRef.current || !audioSampleUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    } else {
      setCurrentlyPlayingId(cast.id);
      void audioRef.current.play().catch((err) => {
        console.error('❌ Audio再生エラー:', err);
        setAudioError(true);
      });
      setIsPlaying(true);

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentlyPlayingId(null);
      };
    }
  };

  // 他カードが再生されたら自分を止める
  useEffect(() => {
    if (currentlyPlayingId !== cast.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [currentlyPlayingId, cast.id, isPlaying]);

  // ✅ 詳細ページへ遷移
  const handleNavigate = () => {
    if (!storeSlug) {
      console.error('❌ storeSlug が不足:', cast);
      return;
    }
    const identifier = cast.slug || cast.id;
    if (!identifier) {
      console.error('❌ slug または id が不足:', cast);
      return;
    }
    router.push(`/store/${storeSlug}/cast/${identifier}`);
  };

  // 評価セクション
  const scoreSection = hasCompatibilityScore ? (
    <div className="mb-2 font-bold text-pink-600">
      💘 相性スコア: {Math.round((cast as ScoredCast).compatibilityScore)}%
    </div>
  ) : (
    <div className="mb-2 flex items-center">
      <Star className="h-3 w-3 fill-current text-amber-400 sm:h-4 sm:w-4" />
      <span className="ml-1 text-xs font-medium text-neutral-700 sm:text-sm">
        {(cast.rating ?? 0).toFixed(1)}
      </span>
      <span className="ml-1 text-xs text-neutral-500">({cast.reviewCount ?? 0})</span>
    </div>
  );


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group cursor-pointer rounded-xl bg-white shadow-soft transition-all duration-300 hover:shadow-luxury"
      onClick={handleNavigate}
    >
      <div className="relative aspect-[3/4]">
        <div className="relative h-full w-full overflow-hidden rounded-t-xl">
          <NextImage
            src={cast.mainImageUrl ?? cast.imageUrl ?? cast.avatar ?? '/no-image.png'}
            alt={`${cast.name}のプロフィール写真`}
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 300px"
            loading="lazy"
            onError={(e) => {
              console.error(`❌ CastCard Image Error [${cast.name}]:`, (e.target as any).src);
            }}
          />
        </div>

        {/* 🆕 キャスト状態ラベル（付箋風 + スクロール時スライドイン） */}
        {cast.statuses?.some((s) => s.isActive && s.status_master) && (
          <div className="absolute right-0 top-2 flex flex-col items-end gap-2 overflow-hidden pr-0">
            {cast.statuses
              ?.filter((s) => s.isActive && s.status_master)
              .map((status, i) => (
                <motion.div
                  key={status.id}
                  initial={{ opacity: 0, x: 60 }} // カードの外側右から
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="rounded-l-full px-3 py-1 text-xs font-bold shadow-md"
                  style={{
                    backgroundColor: status.status_master?.label_color ?? '#fce7f3',
                    color: status.status_master?.text_color ?? '#be185d',
                    // 右端から付箋っぽく飛び出す
                    marginRight: '-12px',
                  }}
                >
                  {status.status_master?.name}
                </motion.div>
              ))}
          </div>
        )}

        {/* 🟢 出勤バッジ */}
        {isAvailableToday && (
          <div className="absolute left-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
            本日出勤
          </div>
        )}

        {/* ▶️ 音声再生ボタン or 音声なし */}
        {audioSampleUrl && !audioError ? (
          <>
            <button
              onClick={handleAudioToggle}
              className="absolute bottom-2 right-2 rounded-full bg-white p-2 shadow-md transition-colors duration-200 hover:bg-primary/10"
              aria-label="音声サンプルを再生"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-primary" />
              ) : (
                <Play className="h-5 w-5 text-primary" />
              )}
            </button>

            <audio
              ref={audioRef}
              src={audioSampleUrl}
              preload="none"
              onError={() => {
                console.error('❌ Audioロード失敗:', audioSampleUrl);
                setAudioError(true);
              }}
            />
          </>
        ) : (
          <div className="absolute bottom-2 right-2 rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600 shadow-md">
            🎤 音声なし
          </div>
        )}

        {/* 💬 最新つぶやき吹き出し */}
        {cast.latestTweet && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 max-w-[95%] -translate-x-1/2">
            <div className="animate-float relative rounded-2xl bg-white/90 px-4 py-2 text-xs text-gray-800 shadow-lg sm:text-sm">
              {cast.latestTweet}
              {/* 吹き出しの三角 */}
              <div className="border-l-6 border-r-6 absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-t-8 border-l-transparent border-r-transparent border-t-white/90"></div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== */}
      {/* 📄 コンテンツ部分 */}
      {/* ===================== */}
      <div className="p-3 sm:p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-neutral-800 sm:text-base">
              {cast.name}
            </h3>
            {/* キャッチコピーの高さ固定 */}
            <div className="mt-1 h-4 sm:h-5">
              {cast.catchCopy && (
                <p className="truncate text-[10px] italic text-pink-600 sm:text-xs">
                  「{cast.catchCopy}」
                </p>
              )}
            </div>
          </div>
          <div className="ml-2 flex-shrink-0 text-right">
            <div className="text-xs text-neutral-500 sm:text-sm">
              {cast.age ? `${cast.age}歳` : '歳'}
            </div>
          </div>
        </div>

        {/* MBTI & 顔型 - 常に表示して高さを固定 */}
        <div className="mb-1 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-700 sm:text-xs">
            MBTI: {cast.mbtiType || 'ヒミツ🍓'}
          </span>
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] text-purple-700 sm:text-xs">
            顔タイプ: {cast.faceType && cast.faceType.length > 0 ? cast.faceType.join(', ') : 'ヒミツ🍓'}
          </span>
        </div>

        {/* 身長 & 体重 - 横並び表示 */}
        <div className="mb-2 flex items-center gap-3 text-[10px] text-neutral-600 sm:text-xs">
          <span className="flex items-center gap-1">
            <span className="font-bold text-neutral-400">身長:</span>
            <span>{cast.height ? `${cast.height}cm` : 'ヒミツ🍓'}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="font-bold text-neutral-400">体重:</span>
            <span>{cast.weight ? `${cast.weight}kg` : 'ヒミツ🍓'}</span>
          </span>
        </div>

        {scoreSection}
        {/* エロス係数 (Redesigned Style) */}
        <div className="mb-2 flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-rose-500/80">
            エロス係数 <span className="ml-1 text-[11px] font-bold text-rose-600">{cast.sexinessLevel ?? 100}%</span>
          </span>
          <div className="flex flex-col gap-[1px]">
            <div className="flex items-end gap-[1px] h-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((bar) => {
                const level = Math.ceil((cast.sexinessLevel ?? 0) / 10); // 0-150 -> 1-15
                const isActive = bar <= level;
                
                const getColor = () => {
                  if (bar <= 4) return 'bg-emerald-400';
                  if (bar <= 7) return 'bg-lime-400';
                  if (bar <= 10) return 'bg-yellow-400';
                  if (bar <= 13) return 'bg-orange-400';
                  return 'bg-rose-500';
                };
                
                return (
                  <div
                    key={bar}
                    className={`w-[4px] rounded-sm transition-all duration-500 ${
                      isActive ? getColor() : 'bg-neutral-100'
                    }`}
                    style={{
                      height: `${Math.min(100, (bar / 15) * 100 + 10)}%`, // Ascending height capped at 100%
                    }}
                  />
                );
              })}
            </div>
            {/* Base Horizontal Bar */}
            <div className="h-[2px] w-full rounded-full bg-neutral-200 overflow-hidden">
               <div 
                 className={`h-full transition-all duration-700 ${
                   (cast.sexinessLevel ?? 0) > 130 ? 'bg-rose-500' :
                   (cast.sexinessLevel ?? 0) > 100 ? 'bg-orange-400' :
                   (cast.sexinessLevel ?? 0) > 70 ? 'bg-yellow-400' :
                   (cast.sexinessLevel ?? 0) > 40 ? 'bg-lime-400' :
                   'bg-emerald-400'
                 }`}
                 style={{ width: `${Math.min(100, ((cast.sexinessLevel ?? 100) / 150) * 100)}%` }}
               />
            </div>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-1">
          {cast.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-primary"
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
