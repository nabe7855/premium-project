
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BrandingSupport: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: '戦略的SNSマネジメント',
      desc: '単なる投稿代行ではなく、データに基づいたインプレッション向上とファン化を専門チームがバックアップ。あなたの魅力を最大化します。',
      icon: '📱'
    },
    {
      title: '永続的な集客エンジン',
      desc: 'SNSの流行に左右されない、創業8年で築いた盤石な顧客基盤。一過性のブームではなく、安定した高収益を長期的に維持できます。',
      icon: '📈'
    },
    {
      title: 'パーソナルブランディング',
      desc: 'ここでの活動をキャリアの「資産」へ。メディア露出やモデル案件の優先案内、将来の独立支援など、あなたのブランド価値を高めます。',
      icon: '💎'
    },
    {
      title: '鉄壁のバックアップ体制',
      desc: 'プライバシー管理はもちろん、リーガルサポートやセキュリティ対策も万全。プロフェッショナルが安心して表現に集中できる環境です。',
      icon: '🛡️'
    }
  ];

  return (
    <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-800/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7">

              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                あなたの「影響力」を、<br/>
                永続的な<span className="text-amber-500 italic">「資産」</span>へ。
              </h2>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12">
                個人としての活動は限界があります。私たちは、あなたのビジネスパートナーとして、SNS運用からブランディング、収益の最大化までをトータルでプロデュース。エンターテインメントとビジネスが融合する、新しいステージを提供します。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((f, i) => (
                  <div key={i} className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-amber-500/50 transition-all group">
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                    <h4 className="text-lg font-bold text-white mb-2">{f.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/form-full')}
                  className="px-10 py-5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-amber-900/40 transition-all active:scale-95"
                >
                  優遇条件を詳しく確認する
                </button>
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 rounded-2xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Expert Fast Track Active</span>
                </div>
              </div>
            </div>

            {/* Right Visuals */}
            <div className="lg:col-span-5 relative">
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl border border-slate-800">
                    <img src="/キャストモデル１.png" className="w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all duration-700" alt="Professional 1" />
                  </div>
                  <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl border border-slate-800">
                    <img src="/キャストモデル２.png" className="w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all duration-700" alt="Professional 2" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl border border-slate-800">
                    <img src="/キャストモデル３.png" className="w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all duration-700" alt="Professional 3" />
                  </div>
                  <div className="rounded-3xl overflow-hidden aspect-[3/4] shadow-2xl border border-slate-800">
                    <img src="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all duration-700" alt="Professional 4" />
                  </div>
                </div>
              </div>
              
              {/* Floating metrics badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-amber-600 text-white p-6 rounded-3xl shadow-2xl border-4 border-slate-950 animate-bounce-slow">
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Fan Retention Rate</div>
                <div className="text-3xl font-serif font-bold">94.2%</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, -55%); }
          50% { transform: translate(-50%, -45%); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default BrandingSupport;
