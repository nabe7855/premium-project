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
        </div>
      </div>
    </section>
  );
};

export default Benefits;
