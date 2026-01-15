'use client';

import { motion } from 'framer-motion';
import React from 'react';

const Philosophy: React.FC = () => {
  return (
    <section className="bg-slate-50 py-12 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-12 shadow-2xl sm:p-16"
        >
          {/* Decorative Elements */}
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-32 translate-x-32 rounded-full bg-amber-500/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-32 translate-y-32 rounded-full bg-indigo-500/10 blur-3xl"></div>

          <div className="relative z-10">
            <div className="mb-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="mb-6 font-serif text-5xl font-bold text-amber-400 sm:text-7xl"
              >
                8 YEARS
              </motion.div>
              <h4 className="mb-6 font-serif text-xl font-bold leading-tight text-slate-100 sm:text-2xl">
                私たちは「刹那的な稼ぎ」を提供しません。
                <br className="hidden sm:block" />
                「一生モノの価値」を共に創るパートナーです。
              </h4>
              <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
              <p className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-400 sm:text-base">
                単に高収入を得るだけの場所なら、他にもあるかもしれません。
                しかし、私たちが8年間一貫して追求してきたのは、未経験の方がここで得た経験を
                その後の人生を支える「確かなスキルと自信」に変えていただくことです。
              </p>
            </div>

            {/* Growth Steps */}
            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="absolute left-0 top-12 z-0 hidden h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent md:block"></div>

              {[
                {
                  icon: '🛡️',
                  title: '盤石な土台',
                  subtitle: '創業8年の信頼',
                  desc: '刹那的な稼ぎではなく、一生モノの自信を得るための環境を8年かけて磨き上げました。',
                },
                {
                  icon: '💡',
                  title: '能力の開花',
                  subtitle: '徹底した教育サポート',
                  desc: '未経験からでもプロになれる独自の育成プログラム。あなたの得意をプロのスキルへ。',
                },
                {
                  icon: '💎',
                  title: '継続的な成功',
                  subtitle: '個人の価値を資産へ',
                  desc: '単なる労働ではなく、あなた自身のブランドを確立。どこへ行っても通用する人間力を養います。',
                },
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="group relative z-10 flex flex-col items-center text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/50 text-4xl backdrop-blur-sm transition-all group-hover:border-amber-500/50 group-hover:bg-slate-700/50">
                    {step.icon}
                  </div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                    {step.subtitle}
                  </div>
                  <h5 className="mb-3 font-serif text-lg font-bold text-white">{step.title}</h5>
                  <p className="px-4 text-xs leading-relaxed text-slate-400">{step.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 border-t border-slate-800 pt-8 text-center"
            >
              <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-600/30 bg-amber-600/10 px-6 py-3 backdrop-blur-sm">
                <span className="text-amber-400">✨</span>
                <p className="text-sm font-medium text-slate-200">
                  新人育成実績No.1の自負。未経験のあなたが輝ける土台は、ここにあります。
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Philosophy;
