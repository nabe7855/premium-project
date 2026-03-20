'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Brain } from 'lucide-react';
import Link from 'next/link';

interface MatchingBannerProps {
  storeSlug: string;
}

const MatchingBanner: React.FC<MatchingBannerProps> = ({ storeSlug }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FFF5F7] via-white to-[#F0F7FF] p-8 shadow-xl border-2 border-pink-100 md:p-12"
    >
      {/* Background Decorations */}
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pink-100/50 blur-3xl" />
      <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-pink-500">
          <Sparkles size={14} className="animate-pulse" />
          Compatibility Diagnosis
        </div>

        <h3 className="mb-4 font-title text-2xl font-black text-slate-800 md:text-4xl">
          相性診断でぴったりのキャストを
          <br className="md:hidden" />
          見つけよう
        </h3>
        
        <p className="mb-10 max-w-lg text-sm leading-relaxed text-slate-500 md:text-base">
          3つの質問に答えるだけで、あなたと相性抜群のキャストをご提案。
          <br className="hidden md:block" />
          運命の出会いを、最新のアルゴリズムでサポートします。
        </p>

        {/* Icons Grid */}
        <div className="mb-12 grid grid-cols-3 gap-8 md:gap-16">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-pink-100">
              <Brain size={28} className="text-pink-400" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">MBTI</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-blue-100">
              <Heart size={28} className="text-blue-400" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Animal</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-purple-100">
              <Sparkles size={28} className="text-purple-400" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Situation</span>
          </div>
        </div>

        <Link href={`/store/${storeSlug}/matching`} className="group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 rounded-full bg-slate-900 px-10 py-4 font-black text-white shadow-xl transition-all hover:bg-pink-500 hover:shadow-pink-200"
          >
            相性診断を始める
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </motion.div>
        </Link>
        
        <p className="mt-6 text-[10px] font-bold tracking-widest text-slate-300 uppercase">
          Free Diagnosis | Approx 2 mins
        </p>
      </div>
    </motion.div>
  );
};

export default MatchingBanner;
