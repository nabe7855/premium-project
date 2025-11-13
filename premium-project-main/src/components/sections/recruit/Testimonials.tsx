'use client';
import React from 'react';
import { Quote, Star, Heart } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Aさん（26歳）",
      period: "勤務歴：1年2ヶ月",
      beforeTitle: "応募前の不安",
      before: "未経験で何もわからない状態でした。本当に女性が安心して働ける環境なのか、プライバシーは守られるのか心配でした。",
      afterTitle: "現在の状況",
      after: "今では月収45万円を安定して稼げるようになりました。女性スタッフの方々が本当に親身になってサポートしてくれるので、安心して働けています。",
      rating: 5
    },
    {
      name: "Bさん（23歳）",
      period: "勤務歴：8ヶ月",
      beforeTitle: "応募前の悩み",
      before: "副業として始めたかったのですが、本業との両立ができるか不安でした。また、周りにバレないか心配でした。",
      afterTitle: "現在の充実感",
      after: "週末だけの勤務で月収25万円を稼げています。完全個室制度のおかげで、プライバシーも守られていて安心です。",
      rating: 5
    },
    {
      name: "Cさん（29歳）",
      period: "勤務歴：2年",
      beforeTitle: "転職への不安",
      before: "他店から転職してきました。前の職場は労働環境が悪く、女性への配慮が足りませんでした。",
      afterTitle: "新しい環境での成長",
      after: "ストロベリーボーイズに来てから、人生が本当に変わりました。自分に自信が持てるようになり、将来の目標も明確になりました。",
      rating: 5
    },
    {
      name: "Dさん（24歳）",
      period: "勤務歴：6ヶ月",
      beforeTitle: "経済的な不安",
      before: "学費や生活費で経済的に困っていました。でも、怪しい仕事はしたくないし、安全な環境で働きたいと思っていました。",
      afterTitle: "経済的な安定",
      after: "しっかりとした研修を受けて、今では月収30万円を稼げています。スタッフの方々が家族のように支えてくれます。",
      rating: 5
    }
  ];

  return (
    <section id="voices" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-rounded">
            Voice of Strawberry
          </h2>
          <p className="text-xl text-gray-600 font-serif">
            先輩セラピストの声
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-pink-100 rounded-full p-3">
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.period}</div>
                </div>
                <div className="ml-auto flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Quote className="h-4 w-4 text-red-500" />
                    <h4 className="font-semibold text-red-700">{testimonial.beforeTitle}</h4>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-serif">
                    {testimonial.before}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Quote className="h-4 w-4 text-green-500" />
                    <h4 className="font-semibold text-green-700">{testimonial.afterTitle}</h4>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-serif">
                    {testimonial.after}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm mb-4">
            ※掲載されている体験談は、個人の感想です。プライバシー保護のため、詳細は変更されています。
          </p>
          <button className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 transition-colors">
            もっと先輩の声を見る
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;