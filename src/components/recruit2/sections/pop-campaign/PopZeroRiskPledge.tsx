'use client';

import { motion } from 'framer-motion';
import React from 'react';

const PopZeroRiskPledge: React.FC = () => {
  const points = ['初期費用 0円', '登録料 0円', 'レッスン料 0円'];

  return (
    <section className="pop-campaign-container relative overflow-hidden bg-white px-4 py-24">
      {/* Background Decorative "0"s */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="select-none text-[30rem] font-black leading-none text-[#f59e0b]/5">0</span>
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-6 inline-block rounded-full bg-black px-8 py-2 text-lg font-black text-white shadow-xl md:text-xl">
            元手ゼロ・リスクゼロの誓い
          </div>
          <h2 className="text-3xl font-black leading-tight text-black md:text-6xl">
            必要なのは、
            <br className="md:hidden" />
            あなたの「やる気」と「意欲」。
            <br />
            <span className="text-outline-black-thin text-[#f59e0b] underline decoration-amber-200 decoration-[10px] underline-offset-4 drop-shadow-sm">
              それだけです。
            </span>
          </h2>
        </motion.div>

        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {points.map((text, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -10 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="flex flex-col items-center justify-center rounded-3xl border-[4px] border-black bg-[#f59e0b] p-6 shadow-[6px_6px_0_#000]"
            >
              <p className="text-2xl font-black text-white md:text-3xl">{text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-[3rem] border-[3px] border-black bg-[#f8fafc] p-8 shadow-[12px_12px_0_#000] md:p-12"
        >
          <div className="space-y-6 text-slate-800">
            <p className="text-lg font-black leading-relaxed md:text-2xl">
              新しいことを始めるのに、お金の心配はしないでください。頭金や不透明な費用は一切不要。私たちが求めているのは、あなたの財布の中身ではなく、未来を変えたいという情熱です。
            </p>
            <div className="h-2 w-20 rounded-full bg-[#f59e0b]"></div>
            <p className="text-lg font-black leading-relaxed md:text-2xl">
              なぜここまでやるのか？
              それは、私たちの教育ノウハウで、あなたを確実に稼がせる自信があるからです。あなたが輝くことが、お店の成功に直結する。だからこそ、リスクはすべて私たちが背負います。
            </p>
          </div>

          {/* Badge effect */}
          <div className="mt-12 flex justify-center md:justify-end">
            <div className="group relative cursor-pointer">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="flex h-32 w-32 transform items-center justify-center rounded-full border-[4px] border-black bg-yellow-400 shadow-xl transition-transform group-hover:scale-105 md:h-40 md:w-40"
              >
                <div className="text-center">
                  <p className="text-lg font-black leading-none text-black md:text-xl">ALL</p>
                  <p className="text-4xl font-black leading-none text-black md:text-5xl">0</p>
                  <p className="text-lg font-black leading-none text-black md:text-xl">YEN</p>
                </div>
              </motion.div>
              <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full bg-black text-2xl text-white">
                ✨
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PopZeroRiskPledge;
