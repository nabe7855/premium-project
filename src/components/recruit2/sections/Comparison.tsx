import React from 'react';

const Comparison: React.FC = () => {
  const features = [
    {
      label: '登録料',
      us: '完全無料\n0円',
      otherA: '登録料あり\n1~3万円',
      otherB: '高額なレッスン料\n必要',
    },
    {
      label: '報酬システム',
      us: '業界最高水準\n60%〜80%\n(規定により追加ボーナスあり)',
      otherA: '一般的\n40%〜50%',
      otherB: '低水準\n30%〜40%',
    },
    {
      label: '支払いサイト',
      us: '全額日払い\n完全手渡しOK',
      otherA: '月払い / 週払い\n振込のみ',
      otherB: '月払い\n(末締め翌末払い)',
    },
    {
      label: '集客力',
      us: '自社メディア保有\n専属マーケター在籍',
      otherA: 'ポータルサイト頼み\n(競合と埋もれる)',
      otherB: '看板・チラシのみ\n(集客力弱い)',
    },
    {
      label: '未経験研修',
      us: 'プロ講師による\nマンツーマン指導',
      otherA: 'マニュアル渡しのみ\n(動画視聴など)',
      otherB: '「見て覚える」\n指導なし',
    },
    {
      label: '待機環境',
      us: '完全個室待機\nWi-Fi・充電完備',
      otherA: '雑多な相部屋\n(プライバシーなし)',
      otherB: '自宅待機のみ\n(カフェ代自己負担)',
    },
    {
      label: 'ペナルティ',
      us: '罰金・ノルマ\n一切なし',
      otherA: '遅刻・欠勤罰金あり\n売上ノルマあり',
      otherB: '退店時違約金あり\n理不尽な天引き',
    },
  ];

  return (
    <section className="overflow-hidden bg-white pb-20 pt-8 sm:pb-28 sm:pt-12">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-16 text-center">
          <h3 className="mb-6 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            他社との<span className="text-blue-600">比較</span>
          </h3>
          <p className="mx-auto max-w-2xl text-sm text-slate-500 sm:text-base">
            報酬、環境、サポート体制。すべてにおいて「キャストファースト」を追求しています。
            <br className="hidden sm:block" />
            他店と比較しても、その差は歴然です。
          </p>
        </div>

        {/* Desktop Table Layout (Optimized for all screens) */}
        <div className="-mx-4 px-4 pb-8 sm:mx-0 sm:px-0">
          <div className="grid grid-cols-[70px_1fr_1fr_1fr] items-stretch gap-1 text-center sm:grid-cols-[120px_1fr_1fr_1fr] sm:gap-4">
            {/* Header Row */}
            <div className="col-span-1 flex items-center justify-center bg-transparent text-xs font-bold text-slate-400 sm:text-sm">
              {/* Empty corner */}
            </div>

            {/* Our Store Header */}
            <div className="relative col-span-1">
              <div className="absolute -left-1 -right-1 -top-2 bottom-0 z-0 origin-bottom scale-y-105 transform rounded-t-xl bg-blue-600 shadow-lg sm:-left-2 sm:-right-2 sm:-top-4 sm:scale-y-110 sm:rounded-t-2xl sm:shadow-xl"></div>
              <div className="relative z-10 px-1 py-3 text-white sm:px-4 sm:py-6">
                <h4 className="mb-0 text-base font-bold sm:mb-1 sm:text-2xl">当店</h4>
                <p className="text-[8px] font-bold text-blue-100 sm:text-xs">PREMIUM</p>
              </div>
            </div>

            {/* Company A Header */}
            <div className="col-span-1 flex flex-col justify-center rounded-t-lg bg-slate-200 px-1 py-3 text-slate-600 sm:rounded-t-xl sm:px-4 sm:py-6">
              <h4 className="text-xs font-bold sm:text-lg">A店</h4>
              <p className="hidden text-[8px] opacity-70 sm:block sm:text-xs">一般的な店舗</p>
            </div>

            {/* Company B Header */}
            <div className="col-span-1 flex flex-col justify-center rounded-t-lg bg-slate-100 px-1 py-3 text-slate-500 sm:rounded-t-xl sm:px-4 sm:py-6">
              <h4 className="text-xs font-bold sm:text-lg">B店</h4>
              <p className="hidden text-[8px] opacity-70 sm:block sm:text-xs">旧来型店舗</p>
            </div>

            {/* Rows */}
            {features.map((item, idx) => (
              <React.Fragment key={idx}>
                {/* Label */}
                <div className="col-span-1 flex items-center justify-center rounded-lg bg-slate-50 p-2 text-[10px] font-bold text-slate-700 sm:p-4 sm:text-sm">
                  {item.label}
                </div>

                {/* Our Store Cell */}
                <div
                  className={`relative col-span-1 flex items-center justify-center p-2 sm:p-6 ${idx === features.length - 1 ? 'rounded-b-xl sm:rounded-b-2xl' : ''}`}
                >
                  {/* Continuous Blue Background Column Effect */}
                  <div className="absolute inset-x-[-4px] inset-y-0 z-0 border-x border-blue-100 bg-white shadow-md sm:inset-x-[-8px] sm:border-x-2 sm:shadow-lg"></div>
                  {/* Highlight Content */}
                  <p className="relative z-10 whitespace-pre-wrap text-[10px] font-bold leading-tight text-blue-600 sm:text-lg">
                    {item.us}
                  </p>
                  {/* Circle Check Badge */}
                  <div className="absolute right-0 top-1 z-20 -translate-y-1/2 translate-x-1/2 transform sm:top-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 shadow-sm sm:h-8 sm:w-8">
                      <svg
                        className="h-3 w-3 text-white sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={4}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Company A Cell */}
                <div className="col-span-1 flex items-center justify-center whitespace-pre-wrap rounded-lg bg-slate-50 p-2 text-[10px] font-medium leading-tight text-slate-500 sm:p-4 sm:text-sm sm:leading-relaxed">
                  {item.otherA}
                </div>

                {/* Company B Cell */}
                <div className="col-span-1 flex items-center justify-center whitespace-pre-wrap rounded-lg border border-slate-100 bg-white p-2 text-[10px] leading-tight text-slate-400 sm:p-4 sm:text-sm sm:leading-relaxed">
                  {item.otherB}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-xs text-slate-500 sm:text-sm">
            ※自社調べ（2025年1月現在）。活動環境や報酬体系には自信があります。
          </p>
        </div>
      </div>
    </section>
  );
};

export default Comparison;
