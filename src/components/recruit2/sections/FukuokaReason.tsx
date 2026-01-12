
import React from 'react';

const FukuokaReason: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-slate-50 rounded-[3rem] p-10 md:p-20 relative overflow-hidden">
          {/* Decorative Strawberry icon (Fukuoka theme) */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C10 2 8 3.5 8 5.5C8 6.1 8.2 6.6 8.5 7.1C6.2 8.3 4 10.9 4 14C4 18.4 7.6 22 12 22C16.4 22 20 18.4 20 14C20 10.9 17.8 8.3 15.5 7.1C15.8 6.6 16 6.1 16 5.5C16 3.5 14 2 12 2Z" />
            </svg>
          </div>

          <h3 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-10 text-center">
            なぜ、いま福岡なのか。
          </h3>
          
          <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
            <p>
              数ある都市の中で、なぜ私たちが福岡を選んだのか。
            </p>
            <p>
              それは、この街に「自分を変えたい」と強く願う人が一番多いと感じたからです。<br/>
              活気あふれるこの街で、まだ自分の可能性に気づいていない原石に出会いたい。
            </p>
            <p>
              私たちは、あなたのための場所を創るためにここに来ました。<br/>
              東京のクオリティを、福岡の情熱と掛け合わせる。<br/>
              それが私たちの新しい挑戦です。
            </p>
            <p className="pt-6 font-serif text-2xl text-slate-900 font-bold italic">
              "あなたのためのステージは、もう用意されています。"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FukuokaReason;
