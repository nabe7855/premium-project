import React, { useState } from 'react';

interface FlowProps {
  heading?: string;
  description?: string;
  steps?: Array<{
    step: string;
    title: string;
    duration: string;
    desc: string;
    color: string;
    numColor: string;
    image: string;
  }>;
  onOpenChat?: () => void;
}

const Flow: React.FC<FlowProps> = ({
  heading = 'デビューまでの<span class="text-rose-500">6ステップ</span>',
  description = 'わかりやすいステップで、未経験の方も安心してスタートできます。',
  steps = [
    {
      step: '01',
      title: 'カウンセリング面談',
      duration: '所要時間：30分',
      desc: 'まずはリラックスして、あなたのご希望やお悩みをお聞かせください。履歴書は不要です。',
      color: 'bg-rose-50 border-rose-100',
      numColor: 'text-rose-200',
      image: '/01カウンセリング面談.png',
    },
    {
      step: '02',
      title: '仮エントリー',
      duration: '即日対応可能',
      desc: '面談を行い、お互いの条件が合えばその場で仮エントリー。必要な書類の手続きを行います。',
      color: 'bg-blue-50 border-blue-100',
      numColor: 'text-blue-200',
      image: '/02仮エントリー.png',
    },
    {
      step: '03',
      title: '安心サポートチェック',
      duration: '所要時間：15分',
      desc: 'お仕事を開始するにあたっての不安解消や、法律・ルールの確認をしっかり行います。',
      color: 'bg-amber-50 border-amber-100',
      numColor: 'text-amber-200',
      image: '/03安心サポートチェック.png',
    },
    {
      step: '04',
      title: '専属育成サポート',
      duration: '期間：1日〜数日',
      desc: '未経験でも安心。専属スタッフが接客の基本から、稼げるコツまで丁寧にレクチャーします。',
      color: 'bg-emerald-50 border-emerald-100',
      numColor: 'text-emerald-200',
      image: '/04専属育成サポート.png',
    },
    {
      step: '05',
      title: 'デビュー前サポート',
      duration: '期間：1日〜',
      desc: '実際の店舗やオンライン環境でリハーサル。自信を持って本番を迎えられるようサポートします。',
      color: 'bg-purple-50 border-purple-100',
      numColor: 'text-purple-200',
      image: '/05デビュー前サポート.png',
    },
    {
      step: '06',
      title: 'デビュー',
      duration: '最短即日！',
      desc: 'いよいよキャストデビュー！デビュー後も継続的なフォローアップで、あなたの活躍を支えます。',
      color: 'bg-pink-50 border-pink-100',
      numColor: 'text-pink-200',
      image: '/06デビュー.png',
    },
  ],
  onOpenChat,
}) => {
  const [openStep, setOpenStep] = useState<number | null>(null);

  const toggleStep = (idx: number) => {
    setOpenStep(openStep === idx ? null : idx);
  };

  return (
    <section className="overflow-hidden bg-slate-50 py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="relative mb-20 text-center">
          <span className="mb-4 inline-block rounded-full bg-rose-100 px-3 py-1 text-sm font-bold text-rose-600">
            FLOW TO DEBUT
          </span>
          <h3
            className="mb-6 font-serif text-3xl font-bold text-slate-900 md:text-5xl"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
          <p className="mx-auto max-w-2xl text-base text-slate-500 md:text-lg">{description}</p>

          <div className="mt-8 inline-block rotate-2 transform animate-bounce rounded-xl border-2 border-yellow-400 bg-yellow-100 px-6 py-3">
            <p className="text-lg font-bold text-yellow-800">※経験者は最短当日デビューも可能！</p>
          </div>
        </div>

        {/* Vertical Flow with Arrows */}
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <button
                onClick={() => toggleStep(i)}
                className="group relative w-full text-left transition-all duration-300"
              >
                {/* Inner Clipped Container */}
                <div
                  className={`relative w-full overflow-hidden rounded-[2.5rem] border-2 bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${s.color} ${openStep === i ? 'shadow-lg' : ''}`}
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
                    className={`absolute -right-2 -top-6 font-serif text-9xl font-black opacity-50 transition-transform duration-500 ${s.numColor} select-none group-hover:scale-110`}
                  >
                    {s.step}
                  </div>

                  <div className="relative z-10 flex flex-col">
                    {/* Header Part (Title + Duration + Absolute Button Reference) */}
                    <div className="relative p-6 md:p-10">
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center">
                          <span className="bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text font-serif text-3xl font-bold text-transparent md:text-5xl">
                            0{i + 1}.
                          </span>
                          <span className="ml-3 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-xl font-bold text-transparent md:ml-4 md:text-3xl">
                            {s.title}
                          </span>
                        </div>
                        {/* Duration Badge (Always Visible) */}
                        <span className="flex items-center gap-1.5 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-bold text-white shadow-sm md:gap-2 md:px-4 md:py-1.5 md:text-sm">
                          <svg
                            className="h-3 w-3 text-yellow-400 md:h-4 md:w-4"
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
                    </div>

                    {/* Expandable Content Wrap */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        openStep === i
                          ? 'mt-6 max-h-[800px] opacity-100 md:mt-8'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div
                        className={`flex flex-col items-center gap-6 border-t border-slate-100 p-8 pt-10 md:flex-row md:p-10 md:pt-14 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                      >
                        {/* Text Column */}
                        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
                          <p className="text-sm font-medium leading-relaxed text-slate-600 md:text-base">
                            {s.desc}
                          </p>
                        </div>

                        {/* Image Column */}
                        <div className="w-full flex-1">
                          <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 shadow-sm md:aspect-square">
                            <img
                              src={s.image}
                              alt={s.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Expand Icon (Absolute Positioned at Bottom Center - Outside clipped container) */}
                <div
                  className={`absolute bottom-0 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full border-2 transition-all duration-500 md:h-12 md:w-12 ${
                    openStep === i
                      ? 'rotate-180 border-amber-500 bg-amber-500 text-white shadow-md'
                      : 'border-slate-200 bg-white text-amber-600 shadow-sm group-hover:border-amber-200 group-hover:bg-amber-50'
                  }`}
                >
                  <span className="text-xs md:text-sm">▼</span>
                </div>
              </button>

              {/* Connector Arrow (Not after last item) */}
              {i < steps.length - 1 && (
                <div className="relative z-20 flex items-center justify-center py-8">
                  <div className="h-0 w-0 border-l-[30px] border-r-[30px] border-t-[40px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-md filter"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-base font-bold text-slate-700">不安な点はいつでもLINEで相談可能です</p>
          <button
            onClick={onOpenChat}
            className="group relative mx-auto mt-6 flex max-w-sm items-center justify-center space-x-3 rounded-full bg-green-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-700 hover:shadow-green-900/40 active:scale-95"
          >
            <span className="text-2xl transition-transform group-hover:scale-110">💬</span>
            <span>LINEで直接質問してみる</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Flow;
