'use client';
import React from 'react';
import { Quote, Star, Heart } from 'lucide-react';

const Testimonials: React.FC = () => {
  const modelCases = [
    {
      type: "週5・専業レギュラーの場合",
      conditions: "週5日出勤 / 1日8時間稼働",
      workingStyleTitle: "働き方の特徴",
      workingStyle: "本業としてしっかり稼ぎたい方向けのモデルケースです。安定したシフトに入ることで、リピーター様もつきやすくなります。",
      incomeTitle: "月収例（目安）",
      income: "月収45万円〜（※指名数・出勤状況により変動します）",
      rating: 5
    },
    {
      type: "週2・バランス型の場合",
      conditions: "週2日出勤 / 1日6時間稼働",
      workingStyleTitle: "働き方の特徴",
      workingStyle: "趣味やプライベートと両立したい方向け。無理のないペースで働きながら、確かな収入を得ることができます。",
      incomeTitle: "月収例（目安）",
      income: "月収25万円〜（※指名数・出勤状況により変動します）",
      rating: 5
    },
    {
      type: "週末のみ・副業ペースの場合",
      conditions: "土日のみ週2日出勤 / 1日5時間稼働",
      workingStyleTitle: "働き方の特徴",
      workingStyle: "平日は本業がある方のための副業モデル。週末の空き時間を使って、効率よく収入をプラスできます。",
      incomeTitle: "月収例（目安）",
      income: "月収20万円〜（※指名数・出勤状況により変動します）",
      rating: 5
    },
    {
      type: "週3・目標達成型の場合",
      conditions: "週3日出勤 / 1日7時間稼働",
      workingStyleTitle: "働き方の特徴",
      workingStyle: "学費や生活費など、明確な目標額がある方向け。充実した研修制度により、未経験からでも早期に安定した収入を目指せます。",
      incomeTitle: "月収例（目安）",
      income: "月収30万円〜（※指名数・出勤状況により変動します）",
      rating: 5
    }
  ];

  return (
    <section id="voices" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-rounded">
            Model Cases
          </h2>
          <p className="text-xl text-gray-600 font-serif">
            働き方別モデルケース
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {modelCases.map((model, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-pink-100 rounded-full p-3">
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{model.type}</div>
                  <div className="text-sm text-gray-500">{model.conditions}</div>
                </div>
                <div className="ml-auto flex items-center space-x-1">
                  {[...Array(model.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Quote className="h-4 w-4 text-red-500" />
                    <h4 className="font-semibold text-red-700">{model.workingStyleTitle}</h4>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-serif">
                    {model.workingStyle}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Quote className="h-4 w-4 text-green-500" />
                    <h4 className="font-semibold text-green-700">{model.incomeTitle}</h4>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-serif">
                    {model.income}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm mb-4">
            ※実際の収入例ではなく、勤務条件から算出したモデルケースです。収入は指名数・出勤状況により変動します。
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;