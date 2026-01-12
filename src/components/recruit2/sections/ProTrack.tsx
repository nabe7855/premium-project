
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProTrack: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24 bg-slate-950 text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="w-full lg:w-1/2 order-2 lg:order-1 text-center lg:text-left">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 sm:mb-8 leading-tight">
              あなたの価値を、<br/>
              <span className="text-amber-500 italic">最高額</span>で評価します。
            </h3>
            <p className="text-slate-400 text-sm sm:text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              前店の集客力に不満はありませんか？<br/>
              あなたの知名度や経験を正当に評価し、メディア露出や特別バック率で応えます。<br/>
              俳優・モデル・インフルエンサーの方、専用の露出ポリシーで活動を支援します。
            </p>
            <div className="space-y-4 mb-10 inline-block text-left">
              {[
                '経験者優遇バック率 (業界最高水準)',
                '独自のメディア・撮影案件優先案内',
                '完全個室・秘密厳守の特別面談'
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 rounded-full bg-amber-600/20 text-amber-500 flex items-center justify-center text-[10px] border border-amber-600/30">✓</div>
                  <span className="text-xs sm:text-sm text-slate-200">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => navigate('/form-full')}
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95 text-base sm:text-lg"
              >
                経験者専用フォームへ
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-2xl">
                  <img src="https://picsum.photos/seed/p1/400/500" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Pro cast 1" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square shadow-2xl">
                  <img src="https://picsum.photos/seed/p2/400/300" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Pro cast 2" />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-square shadow-2xl">
                  <img src="https://picsum.photos/seed/p3/400/300" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Pro cast 3" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-2xl">
                  <img src="https://picsum.photos/seed/p4/400/500" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Pro cast 4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProTrack;
