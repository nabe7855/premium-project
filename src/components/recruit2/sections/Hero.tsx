
import React, { useState, useEffect } from 'react';

interface HeroProps {
  onOpenChat: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenChat }) => {
  const [timeLeft, setTimeLeft] = useState(24 * 3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
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
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000" 
          alt="Premium Lounge" 
          className="w-full h-full object-cover opacity-30 sm:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
      </div>

      <div className="container mx-auto z-10 text-center text-white py-12">
        <div className="inline-block px-3 py-1 bg-amber-600/20 border border-amber-600/50 rounded-full text-amber-500 font-bold text-[10px] sm:text-xs mb-6 animate-pulse tracking-widest">
          FUKUOKA OPENING SPECIAL
        </div>
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-[1.2] sm:leading-tight">
          ここは、<span className="text-amber-500">「稼ぐ場所」</span>ではなく<br className="hidden sm:block"/>
          <span className="italic underline decoration-amber-500">“必要とされる自分”</span>に<br className="sm:hidden"/>なれる場所。
        </h1>
        
        <p className="text-base sm:text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed px-2">
          今日からでも、人生は変えられる。<br className="hidden sm:block"/>
          数多くの未経験者をプロに導いた、創業8年の信頼と実績。
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10">
          {[
            { label: '未経験月収', val: '60万円〜' },
            { label: '勤務時間', val: '3h/日〜' },
            { label: 'お酒/ノルマ', val: '一切なし' },
            { label: '全額日払い', val: '当日OK' },
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-3 sm:p-4 rounded-xl">
              <div className="text-slate-400 text-[10px] sm:text-xs mb-1">{item.label}</div>
              <div className="text-amber-500 font-bold text-base sm:text-lg md:text-xl whitespace-nowrap">{item.val}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 max-w-md sm:max-w-none mx-auto">
          <button 
            onClick={onOpenChat}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-lg sm:text-xl shadow-[0_0_30px_rgba(217,119,6,0.3)] transition-all transform hover:scale-105 active:scale-95"
          >
            今すぐ人生を変える応募
          </button>
          <a 
            href="#qa"
            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-2xl font-bold text-lg sm:text-xl transition-all active:scale-95"
          >
            Q&Aを先に見る
          </a>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-slate-400 text-xs sm:text-sm mb-2">
            残り <span className="text-white font-bold">4</span> 名で募集終了
          </div>
          <div className="text-[10px] sm:text-sm font-mono text-amber-500/80 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            タイムリミット: {formatTime(timeLeft)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
