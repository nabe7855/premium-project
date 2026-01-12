
import React from 'react';

const Trust: React.FC = () => {
  const stories = [
    { 
      name: 'Kさん (24歳)', 
      before: '手取り18万の倉庫作業員', 
      after: '月収90万円、自己肯定感爆上がり',
      img: 'https://picsum.photos/seed/k/400/400'
    },
    { 
      name: 'Tさん (36歳)', 
      before: '倒産により職を失った元店長', 
      after: '月収120万円、借金完済',
      img: 'https://picsum.photos/seed/t/400/400'
    },
    { 
      name: 'Sさん (29歳)', 
      before: '対人恐怖症気味のフリーター', 
      after: '月収75万円、指名数No.1へ',
      img: 'https://picsum.photos/seed/s/400/400'
    }
  ];

  const growthSteps = [
    {
      title: '盤石な土台',
      subtitle: '創業8年の信頼',
      desc: '刹那的な稼ぎではなく、あなたが「一生モノの自信」を得るための環境を8年かけて磨き上げました。',
      icon: '🛡️'
    },
    {
      title: '能力の開花',
      subtitle: '徹底した教育サポート',
      desc: '未経験からでもプロになれる独自の育成プログラム。あなたの「得意」をプロのスキルへと昇華させます。',
      icon: '💡'
    },
    {
      title: '継続的な成功',
      subtitle: '個人の価値を資産へ',
      desc: '単なる労働ではなく、あなた自身のブランドを確立。どこへ行っても通用する人間力を養います。',
      icon: '💎'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-amber-600 font-bold tracking-widest uppercase text-[10px] sm:text-sm mb-4">Trust & Achievement</h2>
          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 mb-6 px-2">なぜ、私たちは8年も<br className="sm:hidden"/>選ばれ続けるのか</h3>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed">
            東京・大阪・名古屋。激戦区で培った再現性の高いノウハウ。<br className="hidden sm:block"/>
            それは一人の人間としての成長を支援する思想の証です。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-24">
          {stories.map((story, idx) => (
            <div key={idx} className="bg-slate-50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
              <img src={story.img} alt={story.name} className="w-full h-40 sm:h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              <div className="p-6 sm:p-8 flex-grow">
                <div className="text-amber-600 font-bold mb-3">{story.name}</div>
                <div className="space-y-4">
                  <div className="relative pl-6">
                    <span className="absolute left-0 text-slate-300 font-bold text-xs">●</span>
                    <div className="text-slate-400 text-[10px] sm:text-xs uppercase font-bold tracking-wider">Before</div>
                    <div className="text-slate-700 font-medium text-sm sm:text-base">{story.before}</div>
                  </div>
                  <div className="relative pl-6">
                    <span className="absolute left-0 text-amber-500 font-bold">→</span>
                    <div className="text-amber-500 text-[10px] sm:text-xs uppercase font-bold tracking-wider">After</div>
                    <div className="text-slate-900 font-bold text-base sm:text-lg">{story.after}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced 8 YEARS Philosophy Section */}
        <div className="p-8 sm:p-16 bg-slate-900 rounded-[2rem] sm:rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center mb-12">
              <div className="text-4xl sm:text-6xl font-serif font-bold mb-4 text-amber-500 tracking-tighter">8 YEARS</div>
              <h4 className="text-xl sm:text-2xl font-bold mb-6 text-slate-100">
                私たちは「刹那的な稼ぎ」を提供しません。<br className="hidden sm:block"/>
                「一生モノの価値」を共に創るパートナーです。
              </h4>
              <div className="w-16 h-1 bg-amber-500 rounded-full mb-8"></div>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                単に高収入を得るだけの場所なら、他にもあるかもしれません。<br/>
                しかし、私たちが8年間一貫して追求してきたのは、未経験の方がここで得た経験を<br className="hidden sm:block"/>
                その後の人生を支える「確かなスキルと自信」に変えていただくことです。
              </p>
            </div>

            {/* Growth Workflow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-800 z-0"></div>
              
              {growthSteps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-6 border border-slate-700 group-hover:border-amber-500/50 group-hover:bg-slate-700 transition-all shadow-xl">
                    {step.icon}
                  </div>
                  <div className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-1">{step.subtitle}</div>
                  <h5 className="text-lg font-bold text-white mb-3">{step.title}</h5>
                  <p className="text-slate-500 text-xs leading-relaxed px-4">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-slate-800 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-amber-600/10 border border-amber-600/30 rounded-2xl">
                <span className="text-amber-500">✨</span>
                <p className="text-sm font-bold text-slate-200">新人育成実績No.1の自負。未経験のあなたが輝ける土台は、ここにあります。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
