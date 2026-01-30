import React from 'react';

export const DayFlow: React.FC = () => {
  const steps = [
    {
      title: 'セラピストと合流',
      desc: '駅改札前やUNIQLO前など、事前に伝えた貴女の服装を元にセラピストからお声がけします。スムーズに合流できない場合はお店が仲介するのでご安心を！',
    },
    {
      title: 'ホテルへ移動',
      desc: 'セラピストがいくつかピックアップしてご提案。デート気分でエスコートされます。入室後、ご利用料金を現金でセラピストにお渡しください。',
    },
    {
      title: 'カウンセリング',
      desc: '10〜15分程度。カウンセリングシートを使い、要望や重点的にしてほしい項目、NG項目を確認します。「寄り添う事」がテーマの特別な時間です。',
    },
    {
      title: 'シャワー',
      desc: 'リラックスしていただくためにお客様から先にシャワー。洗体オプション（+2,000円）で一緒に入浴して、お身体を丁寧に洗うプランも人気です♡',
    },
    {
      title: 'カウント開始',
      desc: 'お客様がシャワーを出たタイミングでコース時間スタート！ここまでの時間は完全無料です。心地よい非日常のひとときを存分にお楽しみください。',
    },
  ];

  return (
    <section className="bg-[#FFF0F3]/50 py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-3xl font-black">ご予約当日の流れ</h2>
        <p className="mb-16 text-center font-medium text-gray-500">
          ※シャワー後のカウント開始までのお時間は全て【無料】です
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex h-full w-full flex-col items-center rounded-2xl border border-white bg-white p-6 text-center shadow-md transition-all hover:border-[#FF4B5C]/20">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF4B5C] font-bold text-white shadow-lg">
                  {i + 1}
                </div>
                <h3 className="mb-4 text-base font-bold leading-tight text-gray-800">
                  ステップ {i + 1}
                  <br />
                  {s.title}
                </h3>
                <p className="text-left text-xs leading-relaxed text-gray-500">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="py-4 text-2xl font-bold text-[#FF4B5C] md:hidden">↓</div>
              )}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl rounded-3xl border-2 border-[#FF4B5C]/20 bg-white p-8 text-center shadow-xl">
          <p className="text-sm leading-relaxed text-gray-600 md:text-base">
            当日までご不安な方は、
            <span className="font-bold text-[#FF4B5C]">担当セラピストとの事前カウンセリング</span>
            を推奨しております。
            <br />
            LINEやDMで事前に相談しておくことで、当日の楽しみが倍増します♡
          </p>
        </div>
      </div>
    </section>
  );
};
