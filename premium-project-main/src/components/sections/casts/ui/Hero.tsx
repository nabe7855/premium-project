'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { RandomCast } from '@/lib/getRandomTodayCast';

interface HeroProps {
  cast: RandomCast | null;
}

const Hero: React.FC<HeroProps> = ({ cast }) => {
  return (
    <div className="relative w-full">
      {/* 🔥 カードの外・上部に配置するラベル */}
      {cast && (
<motion.div
  initial={{ x: -200, opacity: 0 }} // ← 画面外（左）に配置
  animate={{ x: 0, opacity: 1 }}    // ← 中央までスライドイン
  transition={{ duration: 0.8, ease: 'easeOut' }}
  className="mb-3 ml-2 inline-flex items-center rounded-full border border-gold-400 bg-black/60 px-4 py-2 shadow-md backdrop-blur-md"
>
  <span className="mr-2">🍓</span>
  <span className="text-sm font-semibold tracking-wide text-gold-300">
    本日のおすすめキャスト
  </span>
</motion.div>
      )}

      {/* 🎴 キャストカード本体 */}
      <section className="relative h-[90vh] w-full overflow-hidden rounded-xl border-4 border-gold-400 shadow-[0_0_25px_rgba(255,215,0,0.6)]">
        {/* 背景画像 */}
        {cast?.main_image_url ? (
          <motion.img
            src={cast.main_image_url}
            alt={cast.name}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover rounded-xl"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 text-neutral-600 rounded-xl">
            No Image
          </div>
        )}

        {/* 黒グラデーション */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

{/* 左下寄せ＆スライドイン */}
<div className="relative z-10 flex h-full flex-col items-start justify-end px-6 pb-10 text-left text-white">
  {/* キャスト名 */}
  <motion.h1
    initial={{ x: -200, opacity: 0 }}   // ← 左からスライドイン
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
    className="mb-3 font-serif text-4xl font-extrabold tracking-wide text-gold-200 drop-shadow-xl sm:text-5xl"
  >
    {cast ? cast.name : 'キャスト未定'}
  </motion.h1>

  {/* キャッチコピー */}
  {cast?.catch_copy && (
    <motion.p
      initial={{ x: -200, opacity: 0 }} // ← 同じく左から
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
      className="mb-4 max-w-md text-lg italic text-gold-100 sm:text-xl"
    >
      「{cast.catch_copy}」
    </motion.p>
  )}

  {/* MBTI・タイプ */}
  <motion.div
    initial={{ x: -200, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
    className="mb-6 text-sm text-gold-100 sm:text-base"
  >
    {cast?.mbti_name && <p className="mb-1">MBTI: {cast.mbti_name}</p>}
    {cast?.face_name && <p>タイプ: {cast.face_name}</p>}
  </motion.div>

  {/* CTAボタン */}
  {cast && (
    <motion.button
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(255,215,0,0.8)' }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center rounded-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 px-6 py-2 font-semibold text-black shadow-xl border border-gold-400"
    >
      <Heart className="mr-2 h-5 w-5 text-red-500 fill-current" />
      会いに行く
    </motion.button>
  )}
</div>

        {/* 本日出勤ラベル（右上固定） */}
        {cast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-xl border border-gold-400"
          >
            <Heart className="h-5 w-5 text-gold-400 fill-gold-400" />
            <span className="text-sm font-semibold text-neutral-800">本日出勤</span>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Hero;
