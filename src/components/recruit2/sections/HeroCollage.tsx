'use client';

import { motion, Variants } from 'framer-motion';
import NextImage from 'next/image';
import React from 'react';

interface HeroCollageProps {
  onOpenChat: () => void;
  mainHeading?: string;
  subHeading?: string;
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  heroImage?: string;
  stats?: { label: string; val: string }[];
  hasHeader?: boolean;
}

const HeroCollage: React.FC<HeroCollageProps> = ({
  onOpenChat,
  mainHeading = 'ただ「稼ぐ場所」ではなく\n“価値ある男”としてゼロから稼げる場所。',
  subHeading = '今日からでも、人生は変えられる。\n数多くの未経験者をプロに導いた、創業8年の信頼と実績。',
  isEditing = false,
  onUpdate,
  heroImage,
  stats,
  hasHeader = true,
}) => {
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);

  // ContentEditable handling helper
  const handleInput = (
    key: string,
    e: React.FormEvent<HTMLHeadingElement | HTMLParagraphElement>,
  ) => {
    if (onUpdate) {
      onUpdate(key, e.currentTarget.innerText);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdate) {
      // Set local preview immediately for better UX
      const previewUrl = URL.createObjectURL(file);
      setLocalPreview(previewUrl);
      onUpdate('heroImage', file);
    }
  };

  // Use local preview if available, otherwise prop, otherwise default
  // fixed default path from '/福岡募集バナー.png' to '/ファーストビュー.png' which actually exists
  const imageUrl = localPreview || heroImage || '/ファーストビュー.png';

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.8, // Image finishes distinct part of anim first
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section
      className={`flex w-full flex-col bg-slate-950 font-sans ${hasHeader ? 'pt-16' : 'pt-0'}`}
    >
      {/* 
        1. Image Section: 
           Cinematic Zoom-out Entrance
      */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          className={`relative ${isEditing ? 'min-h-[300px] bg-slate-900' : ''}`}
        >
          {/* Main Hero Image */}
          <NextImage
            src={imageUrl}
            alt="Main Hero"
            width={0}
            height={0}
            sizes="100vw"
            priority
            className="block h-auto w-full object-contain"
            onError={() => {
              console.error('Hero image failed to load:', imageUrl);
            }}
          />

          {/* Subtle sheen overlay effect */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: 0.3 }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{ mixBlendMode: 'overlay' }}
          />
        </motion.div>

        {/* Edit Button Overlay (only if editing) */}
        {isEditing && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 opacity-100 transition-opacity hover:bg-black/40">
            <label className="group/btn cursor-pointer rounded-full bg-white/20 px-8 py-4 text-white shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:bg-white/30 active:scale-95">
              <span className="flex items-center gap-3 text-sm font-bold sm:text-base">
                <span className="text-2xl transition-transform group-hover/btn:rotate-12">🖼️</span>
                背景画像を変更
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleBackgroundUpload}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
          </div>
        )}
      </div>

      {/* 
        2. Text Content Area:
           Staggered "Grand" Entrance
      */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="relative z-10 flex w-full flex-col items-center justify-start bg-slate-950 px-4 py-12"
      >
        {/* Cinematic Backdrop Glow - Added pointer-events-none to prevent blocking clicks */}
        <div className="pointer-events-none absolute top-0 h-[500px] w-full max-w-4xl -translate-y-1/2 rounded-full bg-amber-600/10 blur-[100px]" />

        {/* Main Heading */}
        <motion.div variants={itemVariants} className="relative z-20 w-full text-center">
          {isEditing ? (
            <h1
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleInput('mainHeading', e)}
              className="mb-6 cursor-text text-balance rounded font-serif text-3xl font-bold leading-[1.2] tracking-tight text-white outline-none drop-shadow-md hover:bg-white/10 sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl"
              style={{ whiteSpace: 'pre-line' }}
            >
              {mainHeading}
            </h1>
          ) : mainHeading === 'ただ「稼ぐ場所」ではなく\n“価値ある男”としてゼロから稼げる場所。' ? (
            <h1 className="mb-6 font-serif text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl">
              ただ<span className="text-amber-500">「稼ぐ場所」</span>ではなく
              <br className="hidden sm:block" />
              <span className="italic text-white underline decoration-amber-500 decoration-2 underline-offset-4">
                “価値ある男”
              </span>
              に
              <br className="sm:hidden" />
              としてゼロから稼げる場所。
            </h1>
          ) : (
            <h1
              className="mb-6 text-balance font-serif text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl"
              style={{ whiteSpace: 'pre-line' }}
            >
              {mainHeading}
            </h1>
          )}
        </motion.div>

        {/* Subtext */}
        <motion.div variants={itemVariants} className="relative z-20 w-full text-center">
          {isEditing ? (
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleInput('subHeading', e)}
              className="mx-auto mb-10 max-w-3xl cursor-text rounded px-2 text-base leading-relaxed text-slate-300 outline-none hover:bg-white/10 sm:text-xl md:text-2xl"
              style={{ whiteSpace: 'pre-line' }}
            >
              {subHeading}
            </p>
          ) : subHeading ===
            '今日からでも、人生は変えられる。\n数多くの未経験者をプロに導いた、創業8年の信頼と実績。' ? (
            <p className="mx-auto mb-10 max-w-3xl px-2 text-base leading-relaxed text-slate-300 sm:text-xl md:text-2xl">
              今日からでも、人生は変えられる。
              <br className="hidden sm:block" />
              数多くの未経験者をプロに導いた、創業8年の信頼と実績。
            </p>
          ) : (
            <p
              className="mx-auto mb-10 max-w-3xl px-2 text-base leading-relaxed text-slate-300 sm:text-xl md:text-2xl"
              style={{ whiteSpace: 'pre-line' }}
            >
              {subHeading}
            </p>
          )}
        </motion.div>

        {/* Stats Grid - "Cards flip in" or slide up */}
        <motion.div
          variants={itemVariants}
          className="mx-auto mb-10 grid w-full max-w-5xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3"
        >
          {(
            stats || [
              { label: '割引', val: '全て店舗負担' },
              { label: '勤務時間', val: '自由出勤' },
              { label: 'お酒/ノルマ', val: '一切なし' },
              { label: '全額日払い', val: '当日OK' },
              { label: '副業・兼業', val: '大歓迎' },
              { label: '移籍・掛け持ちOK', val: '経験者優遇' },
            ]
          ).map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 backdrop-blur-md transition-all hover:border-amber-500/50 sm:p-6"
            >
              <div className="relative z-10">
                <div
                  className="mb-2 text-xs text-slate-400 outline-none sm:text-sm"
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => {
                    if (!onUpdate || !stats) return;
                    const newStats = [...stats];
                    newStats[idx] = { ...newStats[idx], label: e.currentTarget.innerText };
                    onUpdate('stats', newStats);
                  }}
                >
                  {item.label}
                </div>
                <div
                  className="whitespace-nowrap text-xl font-bold text-amber-500 outline-none sm:text-2xl md:text-3xl"
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => {
                    if (!onUpdate || !stats) return;
                    const newStats = [...stats];
                    newStats[idx] = { ...newStats[idx], val: e.currentTarget.innerText };
                    onUpdate('stats', newStats);
                  }}
                >
                  {item.val}
                </div>
              </div>
              {/* Card Hover Effect */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={onOpenChat}
            className="group relative w-full overflow-hidden rounded-2xl bg-yellow-400 px-8 py-4 text-lg font-bold text-black shadow-[0_0_30px_rgba(250,204,21,0.3)] transition-all hover:scale-105 active:scale-95 sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
          >
            <span className="relative z-10">今すぐ簡単応募してみる</span>
            <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/40 to-transparent duration-1000 ease-in-out group-hover:translate-x-full"></div>
            {/* Ping effect */}
            <span className="absolute right-0 top-0 -mr-1 -mt-1 h-3 w-3 animate-ping rounded-full bg-white opacity-75"></span>
            <span className="absolute right-0 top-0 -mr-1 -mt-1 h-3 w-3 rounded-full bg-white opacity-50"></span>
          </button>
          <a
            href="#faq"
            className="w-full rounded-2xl border border-gray-200 bg-white px-8 py-4 text-center text-lg font-bold text-black transition-all hover:bg-gray-100 active:scale-95 sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
          >
            Q&Aを先に見る
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroCollage;
