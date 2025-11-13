'use client';

import { motion } from 'framer-motion';

const BrandHero = () => {
  return (
    <section className="relative flex h-[90vh] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-pink-100 via-white to-neutral-50">
      {/* 動的な光の粒子 */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute h-72 w-72 rounded-full bg-pink-200 opacity-40 blur-3xl"
          animate={{ x: [0, 200, -200, 0], y: [0, 150, -150, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute right-0 h-96 w-96 rounded-full bg-rose-300 opacity-30 blur-3xl"
          animate={{ x: [0, -200, 200, 0], y: [0, -100, 100, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 px-6 text-center sm:px-8">
        {/* ラベル */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center rounded-full bg-white/80 px-5 py-2 shadow-lg backdrop-blur"
        >
          <span className="mr-2">🍓</span>
          <span className="text-sm font-semibold text-primary">Premium Experience</span>
        </motion.div>

        {/* 見出し */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mb-6 font-serif text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl"
        >
          心とろける{' '}
          <span className="bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">
            極上のひととき
          </span>{' '}
          を
        </motion.h1>

        {/* 説明 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mx-auto mb-8 max-w-xl text-base text-neutral-600 sm:text-lg"
        >
          東京の上質なラグジュアリーサービス。経験豊富なキャストが、
          あなただけの特別な時間をお届けします。
        </motion.p>

        {/* CTA ボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <a
            href="#diagnosis"
            className="rounded-full bg-primary px-6 py-3 text-center text-white shadow-lg transition hover:scale-105 hover:bg-primary/90"
          >
            相性診断で探す →
          </a>
          <a
            href="#casts"
            className="rounded-full border border-neutral-200 bg-white px-6 py-3 text-center text-neutral-800 shadow-md transition hover:scale-105 hover:bg-neutral-50"
          >
            ♡ キャスト一覧
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandHero;
