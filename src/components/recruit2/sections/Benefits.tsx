import React from 'react';

const Benefits: React.FC = () => {
  const points = [
    {
      title: '無料の徹底研修',
      desc: '業界トップクラスの講師陣による未経験者専用カリキュラムをご用意。接客の基礎からプロの技術まで、あなたが自信を持てるまでマンツーマンで寄り添い、最短距離での成長を保証します。',
    },
    {
      title: '24時間LINEサポート',
      desc: '仕事の悩みから些細な不安まで、専任スタッフが24時間体制であなたを支えます。どんな時でも迅速かつ丁寧に対応し、心の余裕を持って働ける安心のパートナーであり続けます。',
    },
    {
      title: 'お酒・ノルマなし',
      desc: '売上ノルマや競争、お酒の強要は一切ありません。ストレスフリーな環境で、あなたが本来持っている魅力を最大限に発揮できるよう、心身ともに余裕を持てるステージを約束します。',
    },
    {
      title: '顔出し不要の選択肢',
      desc: '本名や素顔を伏せた活動も全面的にバックアップ。独自のブランディング戦略により、プライバシーを厳守しながらあなたの魅力をターゲットへ届け、秘密を守り抜く体制を整えています。',
    },
    {
      title: '身バレ徹底対策',
      desc: '専門チームによるアカウント運用管理で、知人への露出をシステムレベルでブロック。端末設定からSNS運用まで、初心者でも安心の身バレ対策マニュアルとサポート体制を完備しています。',
    },
  ];

  const roadmapData = [
    {
      period: '1ヶ月目',
      phase: '基盤構築期',
      income: 38,
      label: '38万円',
      description:
        '独自の集中研修により、接客の基礎と「選ばれるコツ」を習得。未経験でも確実に初月から収益化。',
      color: 'bg-slate-700',
    },
    {
      period: '3ヶ月目',
      phase: 'パーソナルブランド確立期',
      income: 68,
      label: '68万円',
      description:
        '東京・大阪で実証済みのブランディング術を伝授。ファンが定着し、収入が安定し始めます。',
      color: 'bg-amber-700',
    },
    {
      period: '6ヶ月目〜',
      phase: '永続적プロフェッショナル',
      income: 110,
      label: '110万円超',
      description:
        '「あなただから」と選ばれる唯一無二の存在へ。短期的ブームで終わらない、稼ぎ続ける一生モノの力を構築。',
      color: 'bg-amber-500',
    },
  ];

  return (
    <section className="overflow-hidden bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h3 className="mb-6 font-serif text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              未経験者が安心できる
              <br className="md:hidden" />
              5つの理由
            </h3>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              業界の常識を覆すサポート体制。あなたが「自分を変える」ことに専念できる環境を整えました。
            </p>
          </div>

          <div className="mb-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {points.map((p, i) => (
              <div
                key={i}
                className="group flex flex-col items-center rounded-[2.5rem] border border-slate-100 bg-slate-50 p-8 text-center transition-all hover:border-amber-500/30"
              >
                <div className="mb-6 h-1 w-12 rounded-full bg-amber-500/30 transition-all duration-500 group-hover:w-20 group-hover:bg-amber-500"></div>
                <h4 className="mb-4 text-xl font-bold text-slate-900">{p.title}</h4>
                <p className="text-left text-sm leading-relaxed text-slate-500 opacity-90">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-[3.5rem] bg-slate-900 p-8 text-white shadow-2xl md:p-16">
            <div className="pointer-events-none absolute right-0 top-0 -mr-48 -mt-48 h-[500px] w-[500px] rounded-full bg-amber-600/10 blur-[120px]"></div>

            <div className="relative z-10">
              <div className="mb-12 max-w-3xl">
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-amber-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Growth Strategy
                  </span>
                  <div className="h-px flex-grow bg-slate-800"></div>
                </div>
                <h4 className="mb-6 font-serif text-3xl font-bold md:text-4xl">
                  あなたの成長を資産にする。
                  <br />
                  キャリアアップ・ロードマップ
                </h4>
                <p className="text-sm leading-relaxed text-slate-400 md:text-base">
                  私たちは単なる「職場」ではありません。あなたがプロとして自立し、永続的に価値を発揮し続けるための「育成プラットフォーム」です。
                </p>
              </div>

              <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-3">
                {roadmapData.map((item, idx) => (
                  <div key={idx} className="group relative">
                    <div className="mb-4 flex items-end justify-between px-1">
                      <div>
                        <div className="mb-1 font-mono text-xs font-bold text-amber-500">
                          {item.period}
                        </div>
                        <div className="text-sm font-bold text-white">{item.phase}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-serif text-3xl font-bold text-white transition-colors group-hover:text-amber-500">
                          {item.label}
                        </div>
                      </div>
                    </div>

                    <div className="relative mb-4 h-32 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50">
                      <div
                        className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out delay-${idx * 200} ${item.color}`}
                        style={{ height: `${(item.income / 110) * 100}%` }}
                      >
                        <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-black/30 to-white/10"></div>
                      </div>
                    </div>

                    <p className="px-1 text-[11px] leading-relaxed text-slate-500">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
