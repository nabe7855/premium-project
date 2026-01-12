
import React from 'react';

const Flow: React.FC = () => {
  const steps = [
    { title: '面接 (20~30分)', desc: '履歴書不要。まずはリラックスしてあなたの希望をお聞かせください。' },
    { title: 'キャスト登録', desc: '適正が合えばその場で登録。必要な書類の確認などを行います。' },
    { title: '提携医院での検査', desc: '安心・安全のために定期的なメディカルチェックを実施。' },
    { title: 'プロ講習', desc: '独自のメソッドに基づき、接客の基本から技術まで伝授。' },
    { title: 'モニター接客', desc: '実際の現場感覚を掴むための練習。スタッフが並走します。' },
    { title: 'プロデビュー', desc: 'いよいよ本番。今日からあなたの新しい人生がスタート。' },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12 sm:mb-16">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-6">デビューまでの6ステップ</h3>
          <p className="text-slate-500 text-sm sm:text-base">不透明なプロセスはありません。着実に進んでいきましょう。</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {steps.map((s, i) => (
            <div key={i} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 relative group overflow-hidden flex flex-col h-full">
              <div className="absolute -right-4 -top-6 text-7xl sm:text-8xl font-serif font-black text-slate-50 group-hover:text-amber-500/10 transition-colors pointer-events-none">
                {i + 1}
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-900 text-white flex items-center justify-center rounded-full font-bold text-sm mb-4 sm:mb-6 shrink-0">
                  {i + 1}
                </div>
                <h4 className="font-bold text-slate-900 text-lg sm:text-xl mb-3">{s.title}</h4>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed flex-grow">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Flow;
