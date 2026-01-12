
import React, { useRef } from 'react';

const ComicSlider: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const steps = [
    { title: '勇気の一歩', text: 'スマホ一つで簡単応募。', img: 'https://picsum.photos/seed/c1/600/400' },
    { title: 'リラックス面談', text: 'カフェ感覚の20分雑談。', img: 'https://picsum.photos/seed/c2/600/400' },
    { title: '徹底研修', text: 'プロの技を基礎から。', img: 'https://picsum.photos/seed/c3/600/400' },
    { title: 'デビュー当日', text: '安心のサポート体制。', img: 'https://picsum.photos/seed/c4/600/400' },
    { title: '初のお客様', text: '必要とされる実感を体験。', img: 'https://picsum.photos/seed/c5/600/400' },
    { title: '「ありがとう」', text: '仕事が喜びに変わる。', img: 'https://picsum.photos/seed/c6/600/400' },
    { title: '成長のループ', text: '自信が確信に変わる。', img: 'https://picsum.photos/seed/c7/600/400' },
    { title: '人生激変', text: '欲しかった未来が今ここに。', img: 'https://picsum.photos/seed/c8/600/400' },
  ];

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 300 : 400;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-4">マンガでわかる仕事の流れ</h3>
          <p className="text-slate-500 text-sm sm:text-base">未経験からデビュー、そして人生が変わるまでの物語</p>
        </div>

        <div className="relative group">
          <button 
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 shadow-lg rounded-full items-center justify-center hover:bg-white transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Scroll left"
          >
            ←
          </button>
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 pb-6 snap-x snap-mandatory no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {steps.map((step, idx) => (
              <div key={idx} className="flex-shrink-0 w-[280px] sm:w-[350px] snap-center sm:snap-start">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 h-full hover:shadow-md transition-shadow">
                  <img src={step.img} alt={step.title} className="w-full aspect-video object-cover border-b border-slate-100" />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900">{step.title}</h4>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 shadow-lg rounded-full items-center justify-center hover:bg-white transition-opacity opacity-0 group-hover:opacity-100"
            aria-label="Scroll right"
          >
            →
          </button>
          
          {/* Mobile indicator hints */}
          <div className="flex sm:hidden justify-center mt-4 gap-1">
            {steps.map((_, i) => (
               <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComicSlider;
