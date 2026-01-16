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
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
      {/* Background Decor */}
      <div className="pointer-events-none absolute right-0 top-0 -mr-64 -mt-64 h-[600px] w-[600px] rounded-full bg-amber-600/5 blur-[150px]"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Fukuoka Vision Part */}

          {/* Profile Section */}
          <div className="mb-16 text-center">
            <div className="mb-2 font-serif text-sm italic tracking-widest text-amber-500/80">
              Profile
            </div>
            <h3 className="font-serif text-3xl font-bold tracking-tighter text-white md:text-5xl">
              求める人物像
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-5 md:gap-x-8">
            {profiles.map((profile) => (
              <div key={profile.id} className="group flex flex-col items-center">
                <div className="relative mb-6">
                  {/* Number label */}
                  <div className="absolute -top-4 left-0 font-serif text-amber-500/60">
                    <div className="mb-0 text-[10px] uppercase tracking-tighter">Profile</div>
                    <div className="text-xl font-bold leading-none">{profile.id}</div>
                  </div>

                  {/* Circle container */}
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-slate-700 bg-slate-900/40 transition-all duration-500 group-hover:scale-105 group-hover:border-amber-500/50 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] md:h-28 md:w-28">
                    {/* SVG/Emoji Icon container */}
                    <div className="text-3xl drop-shadow-[0_0_10px_rgba(245,158,11,0.3)] filter md:text-4xl">
                      {profile.icon}
                    </div>
                  </div>
                </div>

                <div className="px-2 text-center">
                  <p className="flex min-h-[3em] items-center justify-center text-xs font-bold leading-relaxed text-slate-200 md:text-sm">
                    {profile.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
              <span className="text-2xl">✨</span>
              <p className="text-left text-sm leading-relaxed text-slate-400">
                「今の自分」が完璧である必要はありません。
                <br className="hidden md:block" />
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
