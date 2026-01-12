
import React from 'react';

const Benefits: React.FC = () => {
  const points = [
    { title: '無料の徹底研修', desc: 'プロの講師陣が基礎から応用まで、あなたが自信を持てるまで丁寧に指導します。', icon: '🎓' },
    { title: '24時間LINEサポート', desc: '悩みや不安、当日のトラブルまで。どんな時でもスタッフがあなたを支えます。', icon: '💬' },
    { title: 'お酒・ノルマなし', desc: '健康的なライフスタイルを維持しながら、ストレスフリーで働ける環境です。', icon: '🚫' },
    { title: '顔出し不要の選択肢', desc: 'プライバシーを最優先。本名や素顔を伏せた活動も全面的にバックアップします。', icon: '🔒' },
    { title: '身バレ徹底対策', desc: '独自のアカウント運用とプライバシー管理で、知人への露出を極限まで抑えます。', icon: '👤' },
  ];

  const roadmapData = [
    { 
      period: '1ヶ月目', 
      phase: '基盤構築期', 
      income: 38, 
      label: '38万円',
      description: '独自の集中研修により、接客の基礎と「選ばれるコツ」を習得。未経験でも確実に初月から収益化。',
      color: 'bg-slate-700'
    },
    { 
      period: '3ヶ月目', 
      phase: 'パーソナルブランド確立期', 
      income: 68, 
      label: '68万円',
      description: '東京・大阪で実証済みのブランディング術を伝授。ファンが定着し、収入が安定し始めます。',
      color: 'bg-amber-700'
    },
    { 
      period: '6ヶ月目〜', 
      phase: '永続적プロフェッショナル', 
      income: 110, 
      label: '110万円超',
      description: '「あなただから」と選ばれる唯一無二の存在へ。短期的ブームで終わらない、稼ぎ続ける一生モノの力を構築。',
      color: 'bg-amber-500'
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
              未経験者が安心できる<br className="md:hidden"/>5つの理由
            </h3>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              業界の常識を覆すサポート体制。あなたが「自分を変える」ことに専念できる環境を整えました。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {points.map((p, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-amber-500/30 transition-all group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{p.icon}</div>
                <h4 className="font-bold text-slate-900 text-xl mb-3">{p.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-[3.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="max-w-3xl mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-amber-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">Growth Strategy</span>
                  <div className="h-px flex-grow bg-slate-800"></div>
                </div>
                <h4 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                  あなたの成長を資産にする。<br/>
                  キャリアアップ・ロードマップ
                </h4>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                  私たちは単なる「職場」ではありません。あなたがプロとして自立し、永続的に価値を発揮し続けるための「育成プラットフォーム」です。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                {roadmapData.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="flex justify-between items-end mb-4 px-1">
                      <div>
                        <div className="text-amber-500 font-mono font-bold text-xs mb-1">{item.period}</div>
                        <div className="text-white font-bold text-sm">{item.phase}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-serif font-bold text-white group-hover:text-amber-500 transition-colors">
                          {item.label}
                        </div>
                      </div>
                    </div>

                    <div className="h-32 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden relative mb-4">
                      <div 
                        className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out delay-${idx * 200} ${item.color}`}
                        style={{ height: `${(item.income / 110) * 100}%` }}
                      >
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-white/10"></div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed px-1">
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
