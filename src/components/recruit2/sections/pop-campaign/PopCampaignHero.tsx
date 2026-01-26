'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import PopMascot from './PopMascot';
import PopSpeechBubble from './PopSpeechBubble';
import './pop-campaign.css';

const PopCampaignHero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    // Target date: February 1st
    const now = new Date();
    const currentYear = now.getFullYear();
    const targetDate = new Date(currentYear, 1, 1);
    if (now > targetDate) targetDate.setFullYear(currentYear + 1);

    const updateTimer = () => {
      const diff = targetDate.getTime() - new Date().getTime();
      setTimeLeft(Math.max(0, Math.floor(diff / 1000)));
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}日 ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pop-campaign-container relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f59e0b]">
      {/* Add Google Font Link */}
      <link
        href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Background Layer */}
      <motion.div
        className="sunburst-bg pointer-events-none absolute z-0 h-[300vmax] w-[300vmax]"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <div className="glow-overlay pointer-events-none absolute inset-0 z-0" />

      {/* Main Content Area */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col items-center justify-between px-4 py-8 md:max-w-4xl md:py-12">
        {/* Top Section: Bubbles and Mascot */}
        <div className="relative flex h-1/4 w-full items-center justify-center">
          <AnimatePresence>
            {isLoaded && (
              <>
                <PopSpeechBubble
                  text="かつてない\n衝撃！"
                  className="absolute left-[-5%] top-0 rotate-[-5deg] scale-90 md:left-[5%] md:scale-100"
                  delay={0.2}
                  isRect
                />
                <PopSpeechBubble
                  text="超・グランド\nオープン！"
                  className="absolute left-[35%] top-[-20px] rotate-[2deg] scale-90 md:left-[30%] md:scale-110"
                  delay={0.4}
                />
                <div className="absolute right-[-5%] top-10 scale-75 md:right-[15%] md:scale-110">
                  <PopMascot />
                </div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Center Section: Main Title and Subcopy */}
        <div className="flex flex-grow flex-col items-center justify-center py-4">
          {/* Main Title */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isLoaded ? { scale: [0.5, 1.1, 1], opacity: 1 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="title-drop-shadow mb-6 flex flex-col items-center"
          >
            <div className="relative">
              <span className="text-outline-black-thin absolute inset-0 translate-y-[2px] text-3xl font-black italic text-white md:text-5xl">
                OPENING RECRUIT
              </span>
              <span className="relative text-3xl font-black italic text-white md:text-5xl">
                OPENING RECRUIT
              </span>
            </div>
            <div className="relative mt-[-5px] flex w-full flex-col items-center md:mt-[-10px]">
              <span className="text-outline-black absolute inset-0 block w-full translate-y-[4px] text-center text-5xl font-black leading-tight text-white md:text-8xl">
                超・グランドオープン
                <br />
                キャンペーン実施中！
              </span>
              <span className="relative block w-full text-center text-5xl font-black leading-tight text-white md:text-8xl">
                超・グランドオープン
                <br />
                キャンペーン実施中！
              </span>
            </div>
          </motion.div>

          {/* Subcopy & Timer Box */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="space-y-4 text-center"
          >
            <div className="inline-block rounded-2xl border-[4px] border-black bg-white px-8 py-4 shadow-[8px_8px_0_#000]">
              <p className="mb-2 text-xl font-black text-black md:text-2xl">
                2月1日 OPEN までの残り時間
              </p>
              <p className="font-mono text-3xl font-black tabular-nums tracking-tighter text-[#f59e0b] md:text-6xl">
                {formatTime(timeLeft)}
              </p>
            </div>

            <div className="mt-4 inline-block animate-bounce rounded-full bg-black px-6 py-2 text-white shadow-xl">
              <p className="text-lg font-bold md:text-xl">
                今だけの「超・優待枠」残り{' '}
                <span className="px-2 text-2xl text-yellow-400 md:text-4xl">4</span> 名
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Decorative elements or smaller CTA cues */}
        <div className="relative flex w-full flex-col items-center gap-6">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-sm font-black uppercase tracking-widest text-black opacity-60">
              Scroll for detail
            </p>
            <div className="h-12 w-1 rounded-full bg-black opacity-60"></div>
          </motion.div>
        </div>
      </div>

      {/* Floating Sparkles in Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.8],
              x: [0, i % 2 === 0 ? 20 : -20],
              y: [0, -30],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeInOut',
            }}
            style={{
              top: `${15 + i * 15}%`,
              left: `${10 + ((i * 17) % 80)}%`,
            }}
          >
            <Sparkle size={24 + (i % 3) * 8} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Sparkle = ({ size = 32, color = 'white' }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-sm"
  >
    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill={color} />
  </svg>
);

export default PopCampaignHero;
