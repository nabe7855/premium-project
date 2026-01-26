'use client';

import { motion } from 'framer-motion';
import React from 'react';

const PopBenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: '👔',
      title: '専属プロデューサー制度',
      desc: 'マンツーマンで成功まで徹底伴走',
    },
    {
      icon: '⚡',
      title: '最短1ヶ月でデビュー',
      desc: '独自プログラムで即戦力へ',
    },
    {
      icon: '📚',
      title: '未経験専用カリキュラム',
      desc: '心理学から接客術まで体系化',
    },
    {
      icon: '💰',
      title: '3ヶ月間の最低保証',
      desc: '生活の不安なく実力を磨ける環境',
    },
    {
      icon: '📸',
      title: '初期費用完全無料',
      desc: '宣材撮影、レッスン費すべて店負担',
    },
    {
      icon: '💎',
      title: 'プロフェッショナル育成',
      desc: '一流のホストとして必要なスキル',
    },
  ];

  return (
    <section className="pop-campaign-container bg-[#f59e0b] px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="title-drop-shadow text-4xl font-black leading-tight text-white md:text-6xl">
            <span className="text-outline-black">オープニング限定特典</span>
          </h2>
          <div className="mt-4 flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-3 w-3 rounded-full bg-black"></div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col items-center rounded-[2rem] border-[4px] border-black bg-white p-8 text-center shadow-[8px_8px_0_#000] transition-colors hover:bg-[#fff9e6]"
            >
              <div className="mb-6 transform text-5xl transition-transform group-hover:scale-110 md:text-6xl">
                {benefit.icon}
              </div>
              <h3 className="mb-3 break-words text-xl font-black text-black md:text-2xl">
                {benefit.title}
              </h3>
              <p className="break-words font-bold text-slate-600">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopBenefitsSection;
