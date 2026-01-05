
import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=2070" 
          alt="Fukuoka Luxury Night View" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-block px-4 py-1 mb-6 border border-amber-500/50 bg-amber-500/10 rounded-full">
            <span className="text-amber-500 text-sm md:text-base font-bold tracking-widest">
              FUKUOKA PREMIUM - 究極のホスピタリティを体現するセラピスト募集
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-serif leading-tight mb-6">
            その魅力、<br />
            <span className="text-amber-500 italic">価値ある才能</span>へと昇華させる。
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed max-w-3xl">
            単なる施術を超え、女性の心身に深い安らぎと輝きをもたらす「エモーショナル・セラピスト」。
            知性と品格を兼ね備えたあなたに、福岡最高峰のステージをご用意しました。
            ブランクがある方や、自身の市場価値を再定義したい方を歓迎します。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a 
              href="#apply" 
              className="group bg-amber-500 hover:bg-amber-600 text-white px-10 py-5 rounded-full text-xl font-bold transition-all shadow-xl shadow-amber-500/30 flex items-center justify-center active:scale-95"
            >
              選考へエントリーする
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="flex items-center space-x-6 px-4 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-4">
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-2xl tracking-tighter">Gold</span>
                <span className="text-slate-500 text-[10px] uppercase tracking-widest">Rank System</span>
              </div>
              <div className="w-px h-8 bg-slate-700"></div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-2xl tracking-tighter">Full</span>
                <span className="text-slate-500 text-[10px] uppercase tracking-widest">Support</span>
              </div>
              <div className="w-px h-8 bg-slate-700"></div>
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-2xl tracking-tighter">#1</span>
                <span className="text-slate-500 text-[10px] uppercase tracking-widest">Quality</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
            <div className="flex items-center text-slate-300 font-light">
              <CheckCircle2 className="text-amber-500 w-4 h-4 mr-3 shrink-0" />
              <span>プロフェッショナルとしてのセカンドキャリアを支援</span>
            </div>
            <div className="flex items-center text-slate-300 font-light">
              <CheckCircle2 className="text-amber-500 w-4 h-4 mr-3 shrink-0" />
              <span>ライフスタイルに合わせたテーラーメイドなシフト管理</span>
            </div>
            <div className="flex items-center text-slate-300 font-light">
              <CheckCircle2 className="text-amber-500 w-4 h-4 mr-3 shrink-0" />
              <span>30代〜50代の「大人の魅力」を持つ方を高く評価</span>
            </div>
            <div className="flex items-center text-slate-300 font-light">
              <CheckCircle2 className="text-amber-500 w-4 h-4 mr-3 shrink-0" />
              <span>専属マナー講師によるエグゼクティブ研修完備</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
