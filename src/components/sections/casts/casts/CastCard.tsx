'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Clock, Play, Pause } from 'lucide-react';
import { Cast, ScoredCast } from '@/types/cast';

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
    if (!storeSlug || !cast.slug) {
      console.error('❌ storeSlug または slug が不足:', cast);
      return;
    }
    router.push(`/store/${storeSlug}/cast/${cast.slug}`);
  };

  // 評価セクション
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

  // セクシー度
  const sexinessSection = cast.sexinessStrawberry ? (
    <div className="mb-2 text-sm text-pink-500">
      セクシー度: {cast.sexinessStrawberry}
    </div>
  ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="shadow-soft hover:shadow-luxury group cursor-pointer rounded-xl bg-white transition-all duration-300"
      onClick={handleNavigate}
    >
      <div className="relative aspect-[3/4]">
        <div className="h-full w-full overflow-hidden rounded-t-xl">
          <img
            src={cast.mainImageUrl ?? cast.imageUrl ?? cast.avatar}
            alt={`${cast.name}のプロフィール写真`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>

{/* 🆕 キャスト状態ラベル（付箋風 + スクロール時スライドイン） */}
{cast.statuses?.some((s) => s.isActive && s.status_master) && (
  <div className="absolute top-2 right-0 flex flex-col gap-2 items-end pr-[-8px]">
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
              className="absolute bottom-2 right-2 rounded-full bg-white p-2 shadow-md hover:bg-primary/10 transition-colors duration-200"
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
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 max-w-[95%] pointer-events-none">
            <div className="relative bg-white/90 text-gray-800 text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-lg animate-float">
              {cast.latestTweet}
              {/* 吹き出しの三角 */}
              <div className="absolute left-1/2 top-full -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent border-t-white/90"></div>
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

        {/* MBTI & 顔型 */}
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

        {scoreSection}
        {sexinessSection}

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
