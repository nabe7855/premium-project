import React from 'react';

const FukuokaReason: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
      {/* Background Decor - mimicking IdealCandidate's style if needed or just kept simple */}
      {/* We can add a subtle background effect if desired, but for now I'll stick to the core content provided in the image/code */}

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          {/* Fukuoka Vision Part - Extracted from IdealCandidate.tsx */}
          {/* Removed: <h2 className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-6">Fukuoka Expansion</h2> */}

          <h3 className="mb-10 font-serif text-3xl font-bold leading-tight md:text-5xl">
            なぜ、いま福岡なのか。
          </h3>
          <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-slate-400">
            <p>
              数ある都市の中で、私たちが福岡を選んだのは、この街に「自分を変えたい」と強く願う熱量を感じたからです。
            </p>
            <p>
              私たちは、あなたのための場所を創るためにここに来ました。
              <br />
              東京で磨き上げたクオリティと、福岡の情熱を掛け合わせ、新しい時代の働き方を定義します。
            </p>
            <p className="pt-4 font-serif text-2xl font-bold italic text-amber-500">
              "あなたの挑戦を、私たちは全力で肯定します。"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FukuokaReason;
