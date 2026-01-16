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
    <section className="overflow-hidden bg-white py-20 sm:py-28">
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

        {/* Scroll Hint for Mobile */}
        <div className="mb-4 flex items-center justify-end text-xs font-medium text-slate-400 sm:hidden">
          <span>← 横スクロールできます</span>
          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>

        {/* Desktop Table Layout (Usually visible on larger screens, strictly following grid style) */}
        <div className="-mx-4 overflow-x-auto px-4 pb-8">
          {/* ↓ 左端（項目名）の列の横幅を変更したい場合は、下記の 'grid-cols-4' を 
              'grid-cols-[200px_1fr_1fr_1fr]' (200pxに固定) 
              や 'grid-cols-[1.5fr_1fr_1fr_1fr]' (比率で指定) 
              のように書き換えてください */}
          <div className="grid min-w-[800px] grid-cols-[120px_1fr_1fr_1fr] items-stretch gap-4 text-center">
            {/* Header Row */}
            <div className="col-span-1 flex items-center justify-center bg-transparent text-sm font-bold text-slate-400">
              {/* Empty corner */}
            </div>

            {/* Our Store Header */}
            <div className="relative col-span-1">
              <div className="absolute -left-2 -right-2 -top-4 bottom-0 z-0 origin-bottom scale-y-110 transform rounded-t-2xl bg-blue-600 shadow-xl"></div>
              <div className="relative z-10 px-4 py-6 text-white">
                <h4 className="mb-1 text-2xl font-bold">当店</h4>
                <p className="text-xs font-bold text-blue-100">PREMIUM</p>
              </div>
            </div>

            {/* Company A Header */}
            <div className="col-span-1 flex flex-col justify-center rounded-t-xl bg-slate-200 px-4 py-6 text-slate-600">
              <h4 className="text-lg font-bold">A店</h4>
              <p className="text-xs opacity-70">一般的な店舗</p>
            </div>

            {/* Company B Header */}
            <div className="col-span-1 flex flex-col justify-center rounded-t-xl bg-slate-100 px-4 py-6 text-slate-500">
              <h4 className="text-lg font-bold">B店</h4>
              <p className="text-xs opacity-70">旧来型店舗</p>
            </div>

            {/* Rows */}
            {features.map((item, idx) => (
              <React.Fragment key={idx}>
                {/* Label */}
                <div className="col-span-1 flex items-center justify-center rounded-lg bg-slate-50 p-4 font-bold text-slate-700">
                  {item.label}
                </div>

                {/* Our Store Cell */}
                <div
                  className={`relative col-span-1 flex items-center justify-center p-6 ${idx === features.length - 1 ? 'rounded-b-2xl' : ''}`}
                >
                  {/* Continuous Blue Background Column Effect */}
                  <div className="absolute inset-x-[-8px] inset-y-0 z-0 border-x-2 border-blue-100 bg-white shadow-lg"></div>
                  {/* Highlight Content */}
                  <p className="relative z-10 whitespace-pre-wrap text-lg font-bold leading-tight text-blue-600">
                    {item.us}
                  </p>
                  {/* Circle Check Badge */}
                  <div className="absolute right-0 top-2 z-20 -translate-y-1/2 translate-x-1/2 transform">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 shadow-sm">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Company A Cell */}
                <div className="col-span-1 flex items-center justify-center whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm font-medium leading-relaxed text-slate-500">
                  {item.otherA}
                </div>

                {/* Company B Cell */}
                <div className="col-span-1 flex items-center justify-center whitespace-pre-wrap rounded-lg border border-slate-100 bg-white p-4 text-sm leading-relaxed text-slate-400">
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
