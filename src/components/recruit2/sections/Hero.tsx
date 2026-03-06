import React, { useEffect, useState } from 'react';

interface HeroProps {
  onOpenChat: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenChat }) => {
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

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-slate-950 px-4 sm:min-h-[90vh]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000"
          alt="Premium Lounge"
          className="h-full w-full object-cover opacity-30 sm:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
      </div>

      <div className="container z-10 mx-auto py-12 text-center text-white">
        <div className="mb-6 inline-block animate-pulse rounded-full border border-amber-600/50 bg-amber-600/20 px-3 py-1 text-[10px] font-bold tracking-widest text-amber-500 sm:text-xs">
          FUKUOKA OPENING SPECIAL
        </div>

        <h1 className="mb-6 font-serif text-3xl font-bold leading-[1.2] sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl">
          ここは、<span className="text-amber-500">「稼ぐ場所」</span>ではなく
          <br className="hidden sm:block" />
          <span className="italic underline decoration-amber-500">“必要とされる自分”</span>に
          <br className="sm:hidden" />
          なれる場所。
        </h1>

        <p className="mx-auto mb-10 max-w-3xl px-2 text-base leading-relaxed text-slate-300 sm:text-xl md:text-2xl">
          今日からでも、人生は変えられる。
          <br className="hidden sm:block" />
          数多くの未経験者をプロに導いた、創業8年の信頼と実績。
        </p>

        <div className="mx-auto mb-10 grid max-w-4xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
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

        <div className="mx-auto mb-8 flex max-w-md flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row">
          <button
            onClick={onOpenChat}
            className="w-full transform rounded-2xl bg-amber-600 px-8 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(217,119,6,0.3)] transition-all hover:scale-105 hover:bg-amber-700 active:scale-95 sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
          >
            今すぐ人生を変える応募
          </button>
          <a
            href="#qa"
            className="w-full rounded-2xl border border-gray-200 bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:bg-gray-100 active:scale-95 sm:w-auto sm:px-10 sm:py-5 sm:text-xl"
          >
            Q&Aを先に見る
          </a>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-2 text-xs text-slate-400 sm:text-sm">
            残り <span className="font-bold text-white">4</span> 名で募集終了
          </div>
          <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 font-mono text-[10px] text-amber-500/80 sm:text-sm">
            タイムリミット: {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
