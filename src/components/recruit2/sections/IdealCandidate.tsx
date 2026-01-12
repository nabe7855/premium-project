
import React from 'react';

const IdealCandidate: React.FC = () => {
  const profiles = [
    { id: '01', title: '未経験者大歓迎', icon: '📖' },
    { id: '02', title: '20〜40歳', icon: '👥' },
    { id: '03', title: '連絡の返信が早い方', icon: '✉️' },
    { id: '04', title: '学ぼうとする意欲がある方', icon: '📚' },
    { id: '05', title: '親しみやすい雰囲気の方', icon: '🤝' },
    { id: '06', title: 'メンタルが強い方', icon: '💪' },
    { id: '07', title: '相手の気持ちを汲みとる事ができる方', icon: '🤲' },
    { id: '08', title: '常に清潔感に配慮できる方', icon: '✨' },
    { id: '09', title: '自分のプライドを折れる方', icon: '🙇' },
    { id: '10', title: '約束を守れる方', icon: '🤙' },
  ];

  return (
    <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[150px] -mr-64 -mt-64 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Fukuoka Vision Part */}
          <div className="mb-24 text-center">
            <h2 className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-6">Fukuoka Expansion</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold mb-10 leading-tight">
              なぜ、いま福岡なのか。
            </h3>
            <div className="max-w-3xl mx-auto space-y-6 text-slate-400 text-lg leading-relaxed">
              <p>
                数ある都市の中で、私たちが福岡を選んだのは、この街に「自分を変えたい」と強く願う熱量を感じたからです。
              </p>
              <p>
                私たちは、あなたのための場所を創るためにここに来ました。<br/>
                東京で磨き上げたクオリティと、福岡の情熱を掛け合わせ、新しい時代の働き方を定義します。
              </p>
              <p className="pt-4 font-serif text-2xl text-amber-500 font-bold italic">
                "あなたの挑戦を、私たちは全力で肯定します。"
              </p>
            </div>
          </div>

          {/* Profile Section */}
          <div className="text-center mb-16">
            <div className="text-amber-500/80 font-serif text-sm italic tracking-widest mb-2">Profile</div>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tighter">求める人物像</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-6 md:gap-x-8">
            {profiles.map((profile) => (
              <div key={profile.id} className="flex flex-col items-center group">
                <div className="relative mb-6">
                  {/* Number label */}
                  <div className="absolute -top-4 left-0 text-amber-500/60 font-serif">
                    <div className="text-[10px] uppercase tracking-tighter mb-0">Profile</div>
                    <div className="text-xl font-bold leading-none">{profile.id}</div>
                  </div>
                  
                  {/* Circle container */}
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-slate-700 bg-slate-900/40 flex items-center justify-center transition-all duration-500 group-hover:border-amber-500/50 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] group-hover:scale-105">
                    {/* SVG/Emoji Icon container */}
                    <div className="text-3xl md:text-4xl filter drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                      {profile.icon}
                    </div>
                  </div>
                </div>
                
                <div className="text-center px-2">
                  <p className="text-xs md:text-sm font-bold text-slate-200 leading-relaxed min-h-[3em] flex items-center justify-center">
                    {profile.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-4 p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
              <span className="text-2xl">✨</span>
              <p className="text-sm text-slate-400 leading-relaxed text-left">
                「今の自分」が完璧である必要はありません。<br className="hidden md:block"/>
                誠実に自分と向き合い、約束を守れる方であれば、私たちが全力で育て上げます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdealCandidate;
