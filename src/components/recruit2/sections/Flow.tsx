import React from 'react';

const Flow: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'カウンセリング面談',
      duration: '所要時間：30分',
      desc: 'まずはリラックスして、あなたのご希望やお悩みをお聞かせください。履歴書は不要です。',
      color: 'bg-rose-50 border-rose-100',
      numColor: 'text-rose-200',
    },
    {
      step: '02',
      title: '仮エントリー',
      duration: '即日対応可能',
      desc: '面談を行い、お互いの条件が合えばその場で仮エントリー。必要な書類の手続きを行います。',
      color: 'bg-blue-50 border-blue-100',
      numColor: 'text-blue-200',
    },
    {
      step: '03',
      title: '安心サポートチェック',
      duration: '所要時間：15分',
      desc: 'お仕事を開始するにあたっての不安解消や、法律・ルールの確認をしっかり行います。',
      color: 'bg-amber-50 border-amber-100',
      numColor: 'text-amber-200',
    },
    {
      step: '04',
      title: '専属育成サポート',
      duration: '期間：1日〜数日',
      desc: '未経験でも安心。専属スタッフが接客の基本から、稼げるコツまで丁寧にレクチャーします。',
      color: 'bg-emerald-50 border-emerald-100',
      numColor: 'text-emerald-200',
    },
    {
      step: '05',
      title: 'デビュー前サポート',
      duration: '期間：1日〜',
      desc: '実際の店舗やオンライン環境でリハーサル。自信を持って本番を迎えられるようサポートします。',
      color: 'bg-purple-50 border-purple-100',
      numColor: 'text-purple-200',
    },
    {
      step: '06',
      title: 'デビュー',
      duration: '最短即日！',
      desc: 'いよいよキャストデビュー！デビュー後も継続的なフォローアップで、あなたの活躍を支えます。',
      color: 'bg-pink-50 border-pink-100',
      numColor: 'text-pink-200',
    },
  ];

  return (
    <section className="overflow-hidden bg-slate-50 py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="relative mb-20 text-center">
          <span className="mb-4 inline-block rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600">
            FLOW TO DEBUT
          </span>
          <h3 className="mb-6 font-serif text-3xl font-bold text-slate-900 md:text-5xl">
            デビューまでの<span className="text-rose-500">6ステップ</span>
          </h3>
          <p className="mx-auto max-w-2xl text-base text-slate-500 md:text-lg">
            わかりやすいステップで、未経験の方も安心してスタートできます。
          </p>

          <div className="mt-8 inline-block rotate-2 transform animate-bounce rounded-xl border-2 border-yellow-400 bg-yellow-100 px-6 py-3">
            <p className="text-lg font-bold text-yellow-800">※経験者は最短当日デビューも可能！</p>
          </div>
        </div>

        {/* Vertical Flow with Arrows */}
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div
                className={`relative rounded-[2.5rem] border-2 p-8 md:p-10 ${s.color} group overflow-hidden bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl`}
              >
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-[0.4]"
                  style={{
                    backgroundImage:
                      'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Large Number */}
                <div
                  className={`absolute -right-2 -top-6 text-9xl font-black ${s.numColor} select-none font-serif opacity-50 transition-transform duration-500 group-hover:scale-110`}
                >
                  {s.step}
                </div>

                <div className="relative z-10 flex flex-col items-center text-center">
                  {/* Step Label */}
                  <div className="mb-4">
                    <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text font-serif text-4xl font-bold text-transparent md:text-5xl">
                      0{i + 1}.
                    </span>
                    <span
                      className={`ml-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-2xl font-bold text-transparent md:text-3xl`}
                    >
                      {s.title}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="mb-6">
                    <span className="mx-auto flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-bold text-white shadow-md md:text-base">
                      <svg
                        className="h-4 w-4 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {s.duration}
                    </span>
                  </div>

                  <p className="max-w-lg text-sm font-medium leading-7 text-slate-600 md:text-base">
                    {s.desc}
                  </p>
                </div>
              </div>

              {/* Connector Arrow (Not after last item) */}
              {i < steps.length - 1 && (
                <div className="relative z-20 flex items-center justify-center py-8">
                  {/* CSS Triangle */}
                  <div className="h-0 w-0 border-l-[30px] border-r-[30px] border-t-[40px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-md filter"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-slate-400">不安な点はいつでもLINEで相談可能です</p>
        </div>
      </div>
    </section>
  );
};

export default Flow;
