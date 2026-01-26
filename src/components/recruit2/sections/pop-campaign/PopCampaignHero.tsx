'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import PopMascot from './PopMascot';
import PopSpeechBubble from './PopSpeechBubble';
import './pop-campaign.css';

const PopCampaignHero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
                  text="大満足！"
                  className="absolute left-[-5%] top-0 rotate-[-5deg] scale-90 md:left-[5%] md:scale-100"
                  delay={0.2}
                  isRect
                />
                <PopSpeechBubble
                  text="ちゃんと\nつながる！"
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
              <span className="text-outline-black-thin absolute inset-0 translate-y-[2px] text-4xl font-black italic text-white md:text-6xl">
                LINEMO
              </span>
              <span className="relative text-4xl font-black italic text-white md:text-6xl">
                LINEMO
              </span>
            </div>
            <div className="relative mt-[-10px] md:mt-[-15px]">
              <span className="text-outline-black absolute inset-0 translate-y-[4px] text-7xl font-black leading-none text-white md:text-[10rem]">
                いいかも！
              </span>
              <span className="relative text-7xl font-black leading-none text-white md:text-[10rem]">
                いいかも！
              </span>
            </div>
          </motion.div>

          {/* Subcopy */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="space-y-2 text-center"
          >
            <p className="text-xl font-bold text-black md:text-2xl">をツイートして</p>
            <div className="inline-block rounded-2xl border-2 border-[#fbbf24]/50 bg-[#fef3c7] px-6 py-2 shadow-sm">
              <p className="text-2xl font-black text-black md:text-4xl">"PayPayポイント"を</p>
            </div>
            <p className="text-xl font-bold text-black md:text-2xl">当てよう！</p>
          </motion.div>
        </div>

        {/* Bottom Section: Banner and Bubbles */}
        <div className="relative flex w-full flex-col items-center gap-6">
          {/* Bottom Banner */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={isLoaded ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="relative w-full max-w-md rounded-full border-[5px] border-black bg-gradient-to-b from-[#fde68a] to-[#fcd34d] px-10 py-4 shadow-[0_8px_0_#000]"
          >
            {/* Stitches / X marks */}
            <div className="absolute left-4 top-1/2 flex -translate-y-1/2 flex-col items-center">
              <div className="h-1.5 w-8 rotate-45 rounded-full bg-black"></div>
              <div className="-mt-1.5 h-1.5 w-8 -rotate-45 rounded-full bg-black"></div>
            </div>
            <div className="absolute right-4 top-1/2 flex -translate-y-1/2 flex-col items-center">
              <div className="h-1.5 w-8 rotate-45 rounded-full bg-black"></div>
              <div className="-mt-1.5 h-1.5 w-8 -rotate-45 rounded-full bg-black"></div>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-black md:text-xl">ご契約者も 他社ご利用者も</p>
              <p className="text-2xl font-black tracking-widest text-black md:text-3xl">
                当選のチャンス
              </p>
            </div>

            {/* Top left star on banner */}
            <div className="absolute left-[15%] top-[-15px] rotate-[-15deg]">
              <Sparkle size={30} color="white" />
            </div>
          </motion.div>

          {/* Lower Bubbles */}
          <div className="flex w-full items-end justify-between px-2 md:px-0">
            <AnimatePresence>
              {isLoaded && (
                <>
                  <PopSpeechBubble
                    text="キャンペーンが\nたくさん♪"
                    className="rotate-[-5deg] scale-90 md:scale-100"
                    delay={1.2}
                    variant="cloud"
                  />
                  <PopSpeechBubble
                    text="はやくて\n感動"
                    className="rotate-[5deg] scale-90 md:scale-100"
                    delay={1.4}
                    isRect
                    hasMascotIcon
                  />
                </>
              )}
            </AnimatePresence>
          </div>
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
