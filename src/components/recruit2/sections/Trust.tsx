'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface CaseStudy {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  image: string;
  workPattern: {
    frequency: string;
    hours: string;
    rate: string;
  };
  totalEarnings: number;
  label: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    name: 'Kさん',
    title: '副業でのパターン',
    subtitle: 'Mainly Weekends',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    workPattern: {
      frequency: '月に5回',
      hours: '19:00〜26:00迄の勤務',
      rate: '日当27,000円×5日',
    },
    totalEarnings: 135000,
    label: 'Salary',
  },
  {
    id: '2',
    name: 'Tさん',
    title: 'フルタイム並行パターン',
    subtitle: 'Evenings Only',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    workPattern: {
      frequency: '月に12回',
      hours: '20:00〜24:00迄の勤務',
      rate: '時給5,000円×4時間×12日',
    },
    totalEarnings: 240000,
    label: 'Earnings',
  },
  {
    id: '3',
    name: 'Sさん',
    title: '週末集中パターン',
    subtitle: 'Weekend Warrior',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    workPattern: {
      frequency: '月に8回',
      hours: '15:00〜23:00迄の勤務',
      rate: '日当45,000円×8日',
    },
    totalEarnings: 360000,
    label: 'Income',
  },
];

const CaseStudyCard: React.FC<{ caseStudy: CaseStudy; index: number }> = ({ caseStudy, index }) => {
  const isEven = index % 2 === 0;

  return (
    <div
      className={`relative flex flex-col gap-0 md:flex-row md:items-center md:gap-12 ${
        isEven ? 'items-start md:flex-row' : 'items-end md:flex-row-reverse'
      }`}
    >
      {/* Background Script Decoration */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -100 : 100 }}
        whileInView={{ opacity: 0.1, x: isEven ? -20 : 20 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        viewport={{ once: true }}
        className="pointer-events-none absolute -top-12 left-0 z-0 hidden w-full select-none overflow-hidden opacity-10 md:block"
      >
        <span className="whitespace-nowrap font-serif text-[12rem] italic">
          {caseStudy.label} story
        </span>
      </motion.div>

      {/* Image Container */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-100px' }}
        className={`group relative z-10 aspect-[4/5] w-[85%] overflow-hidden rounded-sm shadow-xl md:w-1/2 ${isEven ? 'mr-[15%] md:mr-0' : 'ml-[15%] md:ml-0'}`}
      >
        <img
          src={caseStudy.image}
          alt={caseStudy.name}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-slate-900/10 transition-colors duration-500 group-hover:bg-transparent"></div>
      </motion.div>

      {/* Data Card Overlay Container */}
      <div
        className={`z-20 -mt-24 flex w-[92%] flex-col items-center md:mt-0 md:w-1/2 md:items-start ${isEven ? 'self-end md:-ml-24 md:self-auto' : 'self-start md:-mr-24 md:self-auto'}`}
      >
        {/* Decorative Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className={`z-30 mb-[-1.5rem] font-serif text-6xl italic text-amber-600/60 drop-shadow-md md:mb-[-2rem] md:text-7xl ${isEven ? 'ml-4 mr-auto md:ml-4 md:mr-0' : 'ml-auto mr-4 md:ml-4 md:mr-0'}`}
        >
          {caseStudy.label}
        </motion.div>

        {/* The Result Card */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="w-full overflow-hidden border border-slate-100 bg-white shadow-xl"
        >
          <div className="flex items-center bg-gradient-to-r from-amber-50 to-amber-100/50 px-6 py-3 md:px-8 md:py-4">
            <h3 className="font-serif text-lg font-bold tracking-wider text-slate-800 md:text-xl">
              {caseStudy.title}
            </h3>
          </div>

          <div className="p-6 md:p-10">
            <div className="mb-4 inline-block border border-slate-400 px-3 py-1 text-xs text-slate-600 md:mb-6 md:px-4 md:text-sm">
              {caseStudy.workPattern.frequency}
            </div>

            <div className="space-y-2 font-serif text-slate-700 md:space-y-4">
              <p className="text-base leading-snug tracking-tight md:text-xl">
                {caseStudy.workPattern.hours}
              </p>
              <p className="text-base leading-snug tracking-tight md:text-xl">
                {caseStudy.workPattern.rate}
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between border-t border-slate-100 pt-4 md:mt-10 md:pt-6">
              <span className="whitespace-nowrap font-serif text-sm italic text-slate-400 md:text-lg">
                =月給手取り
              </span>
              <div className="flex items-baseline gap-1">
                <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text font-serif text-4xl font-bold leading-none text-transparent md:text-6xl">
                  {caseStudy.totalEarnings.toLocaleString()}
                </span>
                <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text font-serif text-lg font-bold text-transparent md:text-2xl">
                  円
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Trust: React.FC = () => {
  return (
    <section className="overflow-x-hidden bg-slate-50 pb-16 pt-16 sm:pb-24 sm:pt-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-4 inline-block rounded-full border border-amber-400/30 bg-amber-50 px-4 py-1">
            <span className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-xs font-bold uppercase tracking-widest text-transparent sm:text-sm">
              Trust & Achievement
            </span>
          </div>
          <h2 className="mb-6 px-2 font-serif text-2xl font-bold text-slate-900 sm:text-4xl">
            なぜ、私たちは8年も
            <br className="sm:hidden" />
            選ばれ続けるのか
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-lg">
            東京・大阪・名古屋。激戦区で培った再現性の高いノウハウ。
            <br className="hidden sm:block" />
            それは一人の人間としての成長を支援する思想の証です。
          </p>
        </div>

        {/* Case Studies Gallery */}
        <div className="mx-auto mt-10 max-w-6xl space-y-24 px-4 md:mt-20 md:space-y-48 md:px-6">
          {CASE_STUDIES.map((study, index) => (
            <CaseStudyCard key={study.id} caseStudy={study} index={index} />
          ))}
        </div>

        {/* Philosophy Section */}
        <div className="relative mt-16 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-indigo-950/90 to-slate-900 p-8 shadow-2xl sm:mt-24 sm:rounded-[3.5rem] sm:p-16">
          <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-amber-500/10 blur-[100px]"></div>

          <div className="relative z-10">
            <div className="mb-12 flex flex-col items-center text-center">
              <div className="mb-4 font-serif text-4xl font-bold tracking-tighter text-amber-400 sm:text-6xl">
                8 YEARS
              </div>
              <h4 className="mb-6 text-xl font-bold text-slate-100 sm:text-2xl">
                私たちは「刹那的な稼ぎ」を提供しません。
                <br className="hidden sm:block" />
                「一生モノの価値」を共に創るパートナーです。
              </h4>
              <div className="mb-8 h-1 w-16 rounded-full bg-amber-400"></div>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                単に高収入を得るだけの場所なら、他にもあるかもしれません。
                <br />
                しかし、私たちが8年間一貫して追求してきたのは、未経験の方がここで得た経験を
                <br className="hidden sm:block" />
                その後の人生を支える「確かなスキルと自信」に変えていただくことです。
              </p>
            </div>

            {/* Growth Steps */}
            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="absolute left-0 top-12 z-0 hidden h-0.5 w-full bg-slate-800 md:block"></div>

              {[
                {
                  icon: '🛡️',
                  subtitle: '創業8年の信頼',
                  title: '盤石な土台',
                  desc: '刹那的な稼ぎではなく、あなたが「一生モノの自信」を得るための環境を8年かけて磨き上げました。',
                },
                {
                  icon: '💡',
                  subtitle: '徹底した教育サポート',
                  title: '能力の開花',
                  desc: '未経験からでもプロになれる独自の育成プログラム。あなたの「得意」をプロのスキルへと昇華させます。',
                },
                {
                  icon: '💎',
                  subtitle: '個人の価値を資産へ',
                  title: '継続的な成功',
                  desc: '単なる労働ではなく、あなた自身のブランドを確立。どこへ行っても通用する人間力を養います。',
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="group relative z-10 flex flex-col items-center text-center"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800 text-3xl shadow-xl transition-all group-hover:border-amber-500/50 group-hover:bg-slate-700">
                    {step.icon}
                  </div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-400">
                    {step.subtitle}
                  </div>
                  <h5 className="mb-3 text-lg font-bold text-white">{step.title}</h5>
                  <p className="px-4 text-xs leading-relaxed text-slate-500">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 border-t border-slate-800 pt-8 text-center">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-600/30 bg-amber-600/10 px-6 py-3">
                <span className="text-amber-400">✨</span>
                <p className="text-sm font-bold text-slate-200">
                  新人育成実績No.1の自負。未経験のあなたが輝ける土台は、ここにあります。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
