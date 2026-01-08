'use client';

import { Mail, MessageCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { StrawberryChan } from './Common';

const HeroSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, mins: 45, secs: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="overflow-hidden bg-stone-900 py-2 text-center text-xs font-bold tracking-wider text-white md:text-sm">
        <div className="flex animate-pulse items-center justify-center gap-2">
          <span className="bg-strawberry rounded px-2 py-0.5">NEW</span>
          【福岡OPEN記念】オープニング特別報酬UPキャンペーン実施中！
        </div>
      </div>

      <div className="relative h-[85vh] bg-stone-800 md:h-[90vh]">
        <img
          src="https://picsum.photos/seed/hero-man/1920/1080"
          alt="Male Model"
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/40"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-6">
            <span className="text-gold mb-4 inline-block border px-4 py-1 text-sm font-bold tracking-widest border-gold">
              SINCE 2016
            </span>
            <h1 className="mb-4 text-4xl font-black leading-tight tracking-tighter text-white drop-shadow-lg md:text-7xl">
              創業8年目の信頼 × <br />
              <span className="text-gold">福岡待望のNEW OPEN</span>
            </h1>
            <p className="text-lg font-medium tracking-wide text-stone-200 md:text-2xl">
              君の新しい物語が、ここから始まる。
            </p>
          </div>

          <div className="flex w-full max-w-lg flex-col gap-4 md:flex-row">
            <div className="flex-1 rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
              <p className="mb-1 text-xs font-bold text-stone-300">
                オープニングキャンペーン終了まで
              </p>
              <div className="flex justify-center gap-2 font-mono text-2xl font-black text-white">
                <div>
                  {timeLeft.days}
                  <span className="ml-0.5 text-[10px]">D</span>
                </div>
                :
                <div>
                  {timeLeft.hours}
                  <span className="ml-0.5 text-[10px]">H</span>
                </div>
                :
                <div>
                  {timeLeft.mins}
                  <span className="ml-0.5 text-[10px]">M</span>
                </div>
                :
                <div className="text-strawberry">
                  {timeLeft.secs}
                  <span className="ml-0.5 text-[10px]">S</span>
                </div>
              </div>
            </div>
            <div className="bg-strawberry flex flex-1 flex-col items-center justify-center rounded-xl p-4 text-white shadow-xl">
              <span className="mb-1 rounded bg-white/20 px-2 text-xs font-bold italic">
                LIMIT 10 ONLY
              </span>
              <p className="text-sm font-bold">
                オープニングメンバー残り<span className="text-gold mx-1 text-2xl">3</span>名
              </p>
            </div>
          </div>

          <StrawberryChan
            text="福岡での新しい一歩、私が全力でサポートするね！まずは気軽にお話聞かせて♪"
            className="mt-8 max-w-md"
          />
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 gap-2 px-4">
        <a
          href="https://line.me"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#06C755] py-4 text-lg font-black text-white shadow-2xl transition-transform hover:scale-105"
        >
          <MessageCircle size={24} /> LINEで応募
        </a>
        <a
          href="#entry-form"
          className="bg-strawberry flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-lg font-black text-white shadow-2xl transition-transform hover:scale-105"
        >
          <Mail size={24} /> Webで応募
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
