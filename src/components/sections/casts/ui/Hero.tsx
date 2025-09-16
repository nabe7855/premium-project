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
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* 背景画像 */}
      {cast?.main_image_url ? (
        <motion.img
          src={cast.main_image_url}
          alt={cast.name}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 text-neutral-600">
          No Image
        </div>
      )}

      {/* オーバーレイ（光のグラデーション） */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 via-transparent to-yellow-200/20 mix-blend-overlay" />

      {/* コンテンツ */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        {/* ラベル */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-6 inline-flex items-center rounded-full bg-white/30 px-5 py-2 shadow-lg backdrop-blur-md"
        >
          <span className="mr-2">🍓</span>
          <span className="text-sm font-semibold tracking-wide">
            本日のおすすめキャスト
          </span>
        </motion.div>

        {/* キャスト名 */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-3 font-serif text-5xl font-extrabold tracking-wide text-pink-100 drop-shadow-lg sm:text-6xl"
        >
          {cast ? cast.name : 'キャスト未定'}
        </motion.h1>

        {/* キャッチコピー */}
        {cast?.catch_copy && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-6 max-w-md text-lg italic text-pink-200 sm:text-xl"
          >
            「{cast.catch_copy}」
          </motion.p>
        )}

        {/* MBTI・タイプ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-8 text-sm text-pink-100 sm:text-base"
        >
          {cast?.mbti_name && <p className="mb-1">MBTI: {cast.mbti_name}</p>}
          {cast?.face_name && <p>タイプ: {cast.face_name}</p>}
        </motion.div>

        {/* CTAボタン */}
        {cast && (
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(255,192,203,0.8)' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center rounded-full bg-gradient-to-r from-pink-500 via-red-400 to-yellow-300 px-8 py-3 font-semibold text-white shadow-xl"
          >
            <Heart className="mr-2 h-5 w-5 fill-current" />
            会いに行く
          </motion.button>
        )}
      </div>

      {/* 漂うハートエフェクト */}
      {cast && (
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute right-6 top-6 rounded-full bg-white/80 p-3 shadow-xl"
        >
          <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
        </motion.div>
      )}
    </section>
  );
};

export default Hero;
