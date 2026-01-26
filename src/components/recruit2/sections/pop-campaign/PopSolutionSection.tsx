'use client';

import { motion } from 'framer-motion';
import React from 'react';

const PopSolutionSection: React.FC = () => {
  const strengths = [
    {
      label: '実績の証明',
      title: '創業8年の圧倒的ノウハウ',
      desc: '数百名の一流セラピストを輩出してきた実績があります。稼ぎの「勝ち筋」を熟知しています。',
    },
    {
      label: '教育の質',
      title: '「プロ」を育てる育成機関',
      desc: 'ただの店じゃない。ここは一流の接客術とマインドを身につけるための養成所です。',
    },
    {
      label: 'マインド',
      title: 'あなたの価値を最大化',
      desc: 'キャスト一人ひとりがお店の「顔」。あなたの個性を活かし、最高のブランドへと昇華させます。',
    },
  ];

  return (
    <section className="pop-campaign-container relative overflow-hidden bg-white px-4 py-24">
      {/* Decorative sunburst behind content */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
        <div className="sunburst-bg h-full w-full"></div>
      </div>

      <div className="container relative z-10 mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="mb-4 block font-black uppercase tracking-widest text-[#f59e0b]">
            Solution
          </span>
          <h2 className="text-outline-black-thin text-3xl font-black leading-tight text-black drop-shadow-sm md:text-5xl">
            私たちが、あなたの「稼ぐ」を
            <br className="md:hidden" />
            徹底的にプロデュースします
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {strengths.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-[40px] border-[4px] border-black bg-[#fef3c7] p-8 shadow-[8px_8px_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border-[3px] border-black bg-[#f59e0b] px-4 py-1 shadow-[4px_4px_0_#000]">
                <span className="text-sm font-black uppercase text-white">{item.label}</span>
              </div>
              <h3 className="mb-4 mt-2 text-center text-xl font-black leading-tight text-black md:text-2xl">
                {item.title}
              </h3>
              <p className="text-center font-bold leading-relaxed text-slate-800">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopSolutionSection;
