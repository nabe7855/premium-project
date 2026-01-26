'use client';

import { motion } from 'framer-motion';
import React from 'react';

const PopProblemSection: React.FC = () => {
  const problems = [
    '入店したのに放置。稼がせる気、ありますか？',
    '高額な登録料だけ取られて、予約はゼロ。',
    'マネジメント不在。自分一人でどうしろと？',
  ];

  return (
    <section className="relative overflow-hidden bg-[#0a192f] px-4 py-24">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-10">
        <div className="absolute left-[-10%] top-[-10%] h-1/2 w-1/2 rounded-full bg-blue-500 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] h-1/2 w-1/2 rounded-full bg-indigo-500 blur-[120px]"></div>
      </div>

      <div className="container relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-4 block font-bold uppercase tracking-widest text-blue-400">
            Problem
          </span>
          <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
            業界の「当たり前」に
            <br className="md:hidden" />
            疑問を感じていませんか？
          </h2>
        </motion.div>

        <div className="grid gap-6">
          {problems.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-500/20 md:h-16 md:w-16">
                <span className="text-2xl md:text-3xl">🚫</span>
              </div>
              <p className="text-lg font-bold leading-relaxed text-slate-200 md:text-2xl">{text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-600 opacity-20 blur-2xl"></div>
            <p className="relative text-2xl font-black text-white md:text-4xl">
              そんな業界の「当たり前」に、
              <br />
              私たちは
              <span className="text-red-500 underline decoration-4 underline-offset-8">NO</span>
              を突きつけます。
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PopProblemSection;
