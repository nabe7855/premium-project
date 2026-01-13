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

const Achievements: React.FC = () => {
  return (
    <section className="overflow-x-hidden bg-white pb-32 pt-24 md:pb-32 md:pt-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="mb-12 px-6 text-center md:mb-20"
        >
          <h2 className="mb-2 font-serif text-5xl italic text-amber-600 md:mb-4 md:text-6xl">
            Achievement Showcase
          </h2>
          <h1 className="mb-8 font-serif text-3xl font-bold leading-tight tracking-[0.15em] text-slate-800 md:text-6xl md:tracking-[0.2em]">
            理想を形にする、
            <br className="md:hidden" />
            実績のカタチ。
          </h1>
          <p className="mx-auto max-w-2xl text-[10px] uppercase tracking-widest text-slate-500 md:text-sm">
            A collection of real-world success stories from our top performers.
            <br />
            Experience the potential of a premium workstyle.
          </p>
          <div className="mt-8 flex justify-center md:mt-12">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              transition={{ delay: 0.8, duration: 1 }}
              viewport={{ once: true }}
              className="h-px bg-amber-500"
            ></motion.div>
          </div>
        </motion.div>

        {/* Case Studies Gallery */}
        <div className="mx-auto mt-10 max-w-6xl space-y-24 px-4 md:mt-20 md:space-y-48 md:px-6">
          {CASE_STUDIES.map((study, index) => (
            <CaseStudyCard key={study.id} caseStudy={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
