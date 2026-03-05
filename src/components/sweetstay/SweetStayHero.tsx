'use client';

import { motion } from 'framer-motion';
import { Calendar, Info, MapPin, Search, ShieldCheck, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface SweetStayHeroProps {
  backgroundImage?: string;
}

const SweetStayHero: React.FC<SweetStayHeroProps> = ({ backgroundImage }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-gray-900">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt="Hero Background"
            fill
            className="object-cover opacity-60"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-gray-900 to-black opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-gray-900/40" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-6 py-2 text-xs font-black uppercase tracking-[0.2em] text-rose-400 backdrop-blur-md"
          >
            <ShieldCheck size={14} />
            Official Adults Only Selection
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 text-5xl font-black leading-tight tracking-tighter text-white md:text-8xl lg:text-9xl"
          >
            Stay <span className="italic text-rose-500">Sweet</span>,<br />
            Live{' '}
            <span className="bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
              Premium.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 max-w-2xl text-lg font-medium leading-relaxed text-gray-300 md:text-xl"
          >
            現役セラピストが「プロの視点」で選んだ、
            <br className="hidden md:block" />
            本当に使いやすく心地よいホテルのまとめメディア。
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-4xl"
          >
            <div className="group relative flex flex-col items-stretch gap-2 rounded-[2rem] border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-2xl transition-all hover:bg-white/10 md:flex-row md:items-center">
              <div className="flex flex-grow items-center gap-4 px-6 py-4">
                <Search className="text-rose-500" size={20} strokeWidth={3} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="エリア、ホテル名、駅名..."
                  className="w-full bg-transparent text-lg font-bold text-white outline-none placeholder:text-gray-500"
                />
              </div>

              <div className="hidden h-10 w-px bg-white/10 md:block"></div>

              <div className="flex items-center gap-4 px-6 py-4 md:w-auto">
                <MapPin className="text-rose-500" size={18} />
                <select className="cursor-pointer bg-transparent text-sm font-black uppercase tracking-widest text-white outline-none">
                  <option className="bg-gray-900">横浜</option>
                  <option className="bg-gray-900">福岡</option>
                  <option className="bg-gray-900">東京</option>
                </select>
              </div>

              <div className="hidden h-10 w-px bg-white/10 md:block"></div>

              <div className="flex items-center gap-4 px-6 py-4 md:w-auto">
                <Calendar className="text-rose-500" size={18} />
                <select className="cursor-pointer bg-transparent text-sm font-black uppercase tracking-widest text-white outline-none">
                  <option className="bg-gray-900">宿泊</option>
                  <option className="bg-gray-900">休憩</option>
                </select>
              </div>

              <button className="h-16 w-full rounded-[1.5rem] bg-rose-500 text-sm font-black tracking-widest text-white shadow-xl shadow-rose-600/20 transition-all hover:scale-[1.02] hover:bg-rose-400 active:scale-95 md:w-48">
                SEARCH
              </button>
            </div>
          </motion.div>

          {/* Sub CTA & Trust Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-12 flex flex-col items-center gap-8"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/sweetstay/coupon"
                className="group flex items-center gap-3 rounded-2xl bg-white/5 px-8 py-4 text-xs font-black uppercase tracking-[0.1em] text-white transition-all hover:bg-rose-500 active:scale-95"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500 group-hover:bg-white group-hover:text-rose-500">
                  <UserPlus size={14} />
                </div>
                限定クーポンを取得
              </Link>
              <Link
                href="/sweetstay/guide"
                className="flex items-center gap-3 rounded-2xl border border-white/10 px-8 py-4 text-xs font-black uppercase tracking-[0.1em] text-gray-400 transition-all hover:border-rose-500 hover:text-white"
              >
                <Info size={14} />
                ご利用案内
              </Link>
            </div>

            {/* Legal / Trust */}
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
              <div className="flex items-center gap-2 border-r border-gray-800 pr-6">
                <span className="rounded border border-gray-700 px-1.5 py-0.5 text-rose-500">
                  18+
                </span>
                大人専用・18歳未満不可
              </div>
              <div className="hidden sm:block">Trusted by Professional Therapists</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="h-10 w-0.5 bg-gradient-to-t from-rose-500 to-transparent" />
      </motion.div>
    </section>
  );
};

export default SweetStayHero;
