import React, { useEffect, useState } from 'react';

interface HeroCollageProps {
  onOpenChat: () => void;
}

const HeroCollage: React.FC<HeroCollageProps> = ({ onOpenChat }) => {
  const [timeLeft, setTimeLeft] = useState(24 * 3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Placeholder images - using stylish/cool portraits
  const images = [
    'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=800&auto=format&fit=crop', // Model 1
    'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=800&auto=format&fit=crop', // Club vibes
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop', // Model 2
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop', // Model 3
  ];

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-950 font-sans">
      {/* Background/Collage Area - Top 60% */}
      <div className="relative h-[65vh] w-full overflow-hidden">
        {/* Dynamic angled collage */}
        <div className="absolute inset-0 flex -rotate-3 scale-110 transform items-center justify-center">
          <div className="-ml-[10%] grid w-[120%] grid-cols-4 gap-2 opacity-80 sm:gap-4">
            {/* Column 1 */}
            <div className="mt-12 flex flex-col gap-4">
              <img
                src={images[0]}
                alt="Cast 1"
                className="h-64 w-full rounded-xl object-cover shadow-2xl brightness-75 transition-all duration-700 hover:brightness-100"
              />
              <img
                src={images[1]}
                alt="Interior"
                className="h-48 w-full rounded-xl object-cover shadow-2xl brightness-50 transition-all duration-700 hover:brightness-100"
              />
            </div>

            {/* Column 2 - Main Focus */}
            <div className="-mt-8 flex flex-col gap-4">
              <img
                src={images[2]}
                alt="Cast 2"
                className="h-80 w-full rounded-xl border border-slate-700 object-cover shadow-2xl brightness-90 transition-all duration-700 hover:brightness-110"
              />
              <img
                src={images[3]}
                alt="Cast 3"
                className="h-56 w-full rounded-xl object-cover shadow-2xl brightness-50 transition-all duration-700 hover:brightness-100"
              />
            </div>

            {/* Column 3 */}
            <div className="mt-20 flex flex-col gap-4">
              <img
                src={images[1]}
                alt="Cast 4"
                className="h-56 w-full rounded-xl object-cover shadow-2xl brightness-75 transition-all duration-700 hover:brightness-100"
              />
              <img
                src={images[0]}
                alt="Cast 5"
                className="h-72 w-full rounded-xl object-cover shadow-2xl brightness-50 transition-all duration-700 hover:brightness-100"
              />
            </div>

            {/* Column 4 */}
            <div className="-mt-4 flex hidden flex-col gap-4 sm:flex">
              <img
                src={images[3]}
                alt="Cast 6"
                className="h-64 w-full rounded-xl object-cover shadow-2xl brightness-50 transition-all duration-700 hover:brightness-100"
              />
              <img
                src={images[2]}
                alt="Cast 7"
                className="h-64 w-full rounded-xl object-cover shadow-2xl brightness-50 transition-all duration-700 hover:brightness-100"
              />
            </div>
          </div>
        </div>

        {/* Gradient Overlay for smooth transition to text area */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950"></div>
      </div>

      {/* Text Content Area - Bottom 35-40% */}
      <div className="relative z-10 -mt-20 flex flex-1 flex-col items-center justify-start px-4 pb-12 sm:-mt-32">
        {/* Gold Banner */}
        <div className="animate-fade-in-up relative mb-6">
          <div className="absolute -inset-1 rounded-full bg-amber-600/20 blur-sm"></div>
          <div className="relative inline-block rounded-full border border-amber-600/50 bg-amber-600/20 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-500 sm:text-xs">
            FUKUOKA OPENING SPECIAL
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="animate-fade-in-up mb-6 text-center font-serif text-3xl font-bold leading-[1.2] tracking-tight text-white drop-shadow-2xl delay-100 sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl">
          ここは、<span className="text-amber-500">「稼ぐ場所」</span>ではなく
          <br className="hidden sm:block" />
          <span className="italic text-white underline decoration-amber-500 decoration-2 underline-offset-4">
            “必要とされる自分”
          </span>
          に
          <br className="sm:hidden" />
          なれる場所。
        </h1>

        {/* Subtext */}
        <p className="animate-fade-in-up mx-auto mb-10 max-w-3xl px-2 text-center text-base leading-relaxed text-slate-300 delay-200 sm:text-xl md:text-2xl">
          今日からでも、人生は変えられる。
          <br className="hidden sm:block" />
          数多くの未経験者をプロに導いた、創業8年の信頼と実績。
        </p>

        {/* Stats Grid */}
        <div className="animate-fade-in-up mx-auto mb-10 grid max-w-4xl grid-cols-2 gap-3 delay-200 sm:gap-4 md:grid-cols-4">
          {[
            { label: '未経験月収', val: '60万円〜' },
            { label: '勤務時間', val: '3h/日〜' },
            { label: 'お酒/ノルマ', val: '一切なし' },
            { label: '全額日払い', val: '当日OK' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-3 backdrop-blur-md sm:p-4"
            >
              <div className="mb-1 text-[10px] text-slate-400 sm:text-xs">{item.label}</div>
              <div className="whitespace-nowrap text-base font-bold text-amber-500 sm:text-lg md:text-xl">
                {item.val}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up flex flex-col items-center justify-center gap-4 delay-300 sm:flex-row">
          <button
            onClick={onOpenChat}
            className="group relative w-full overflow-hidden rounded-2xl bg-amber-600 px-8 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(217,119,6,0.3)] transition-all hover:scale-105 active:scale-95 sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
          >
            <span className="relative z-10">今すぐ人生を変える応募</span>
            <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent via-white/20 to-transparent duration-1000 ease-in-out group-hover:translate-x-full"></div>
          </button>
          <a
            href="#qa"
            className="w-full rounded-2xl bg-slate-800/80 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-slate-700 active:scale-95 sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
          >
            Q&Aを先に見る
          </a>
        </div>

        {/* Countdown */}
        <div className="animate-fade-in-up mt-8 flex flex-col items-center delay-300">
          <div className="mb-2 text-xs text-slate-400 sm:text-sm">
            残り <span className="font-bold text-white">4</span> 名で募集終了
          </div>
          <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 font-mono text-[10px] text-amber-500/80 sm:text-sm">
            タイムリミット: {formatTime(timeLeft)}
          </div>
        </div>

        {/* Bottom Brand */}
        <div className="mt-12 opacity-60">
          <p className="font-serif text-xl italic tracking-widest text-amber-600/50 sm:text-2xl">
            Un moment pour toi
          </p>
          <p className="mt-1 text-center text-[10px] text-slate-600">アン モモン プートア</p>
        </div>
      </div>
    </section>
  );
};

export default HeroCollage;
