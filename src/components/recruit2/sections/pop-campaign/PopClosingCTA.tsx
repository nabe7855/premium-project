'use client';

import { motion } from 'framer-motion';
import React from 'react';

const PopClosingCTA: React.FC = () => {
  return (
    <section className="pop-campaign-container bg-white px-4 py-24">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[4rem] border-[6px] border-black bg-[#0a192f] p-10 text-center shadow-[15px_15px_0_#f59e0b] md:p-20"
        >
          {/* Decorative bits */}
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-yellow-400/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-blue-400/10 blur-3xl"></div>

          <h2 className="relative z-10 mb-8 text-2xl font-black leading-tight text-white md:text-4xl">
            いきなり働く必要はありません。
            <br />
            まずは
            <span className="text-yellow-400 underline decoration-yellow-400/30 underline-offset-8">
              「話だけ」
            </span>
            聞いてみませんか？
          </h2>

          <div className="relative z-10 mx-auto flex max-w-md flex-col gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-4 rounded-[2rem] border-[4px] border-black bg-[#06c755] px-8 py-6 shadow-[8px_8px_0_#000]"
            >
              <span className="text-3xl">💬</span>
              <span className="text-xl font-black text-white md:text-2xl">
                LINEで気軽に相談してみる
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-4 rounded-[2rem] border-[4px] border-black bg-white px-8 py-6 shadow-[8px_8px_0_#000]"
            >
              <span className="text-3xl">ℹ️</span>
              <span className="text-xl font-black text-black md:text-2xl">
                詳しいシステムを聞いてみる
              </span>
            </motion.button>
          </div>

          <p className="mt-12 text-sm font-bold text-slate-400 md:text-base">
            ※強引な勧誘等は一切ありませんのでご安心ください。
            <br />
            あなたに最適なプランを一緒に考えましょう。
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PopClosingCTA;
