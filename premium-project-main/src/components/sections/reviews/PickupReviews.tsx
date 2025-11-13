'use client';
import React from 'react';
import { Star, Sparkles } from 'lucide-react';

const PickupReviews: React.FC = () => {
  const pickupReviews = [
    {
      id: 'pickup1',
      userName: 'みさきさん',
      ageGroup: '30代前半',
      castName: '健太',
      rating: 5.0,
      reviewText:
        '初めての利用でしたが、とても丁寧で優しい対応をしていただきました。緊張していた私にも気を遣ってくださり、本当に癒されました。',
      highlight: true,
    },
    {
      id: 'pickup2',
      userName: 'ゆりさん',
      ageGroup: '40代',
      castName: '翔太',
      rating: 5.0,
      reviewText:
        '仕事で疲れきっていましたが、心から癒されました。話もよく聞いてくださり、明日からまた頑張ろうと思えました。',
      highlight: true,
    },
    {
      id: 'pickup3',
      userName: 'あやかさん',
      ageGroup: '20代後半',
      castName: '大輝',
      rating: 5.0,
      reviewText:
        '想像以上の素敵な時間を過ごすことができました。とても紳士的で、女性として大切に扱ってもらえました。',
      highlight: true,
    },
  ];

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-pink-500" />
        <h2 className="text-2xl font-bold text-gray-800">今週のとろけ口コミ</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pickupReviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50 to-white p-6 shadow-lg transition-shadow hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">{review.userName}</h3>
                <span className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700">
                  {review.ageGroup}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-pink-500" />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                {review.castName}
              </span>
            </div>

            <p className="font-serif text-sm leading-relaxed text-gray-700">{review.reviewText}</p>

            <div className="mt-4 border-t border-pink-200 pt-4">
              <span className="text-xs font-medium text-pink-600">✨ 特選レビュー</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickupReviews;
