'use client';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "M.S様",
    age: "30代",
    rating: 5,
    date: "2024年1月",
    title: "心から癒されました",
    content: "仕事でとても疲れていた時にお願いしました。優しく話を聞いていただき、自然と気持ちが楽になりました。また利用させていただきたいです。",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 2,
    name: "A.K様",
    age: "20代",
    rating: 5,
    date: "2024年1月",
    title: "期待以上のサービス",
    content: "初めての利用で緊張していましたが、とても親切に対応していただきました。時間があっという間に過ぎて、とても充実した時間でした。",
    avatar: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 3,
    name: "Y.T様",
    age: "40代",
    rating: 5,
    date: "2023年12月",
    title: "プロフェッショナルな対応",
    content: "さすがプロという感じで、細やかな気遣いに感動しました。日頃の疲れが一気に吹き飛びました。信頼できるサービスだと思います。",
    avatar: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 4,
    name: "R.N様",
    age: "30代",
    rating: 5,
    date: "2023年12月",
    title: "安心して利用できました",
    content: "最初は不安でしたが、事前の説明も丁寧で、当日も終始安心して過ごすことができました。また辛い時にはお願いしたいと思います。",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 5,
    name: "S.H様",
    age: "20代",
    rating: 5,
    date: "2023年11月",
    title: "最高の癒し時間",
    content: "AIマッチングで紹介された方がまさに理想的でした。話も合うし、とても楽しい時間を過ごせました。マッチング精度の高さに驚きです。",
    avatar: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100"
  },
  {
    id: 6,
    name: "M.I様",
    age: "40代",
    rating: 5,
    date: "2023年11月",
    title: "丁寧なサポートに感謝",
    content: "初回でわからないことが多かったのですが、コンシェルジュの方が親身になってサポートしてくれました。おかげで安心して利用できました。",
    avatar: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100"
  }
];

export default function ReviewSection() {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            お客様の声
            <br />
            <span className="text-rose-600">本当の満足をお届け</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            実際にご利用いただいたお客様からの喜びの声をご紹介します
          </p>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <div className="flex items-center">
              {renderStars(5)}
              <span className="ml-2 text-2xl font-bold text-gray-900">4.9</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">1,247件</span>のレビュー
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow duration-300 bg-white">
              {/* Review Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.age} • {review.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-rose-600 mb-2">4.9/5.0</div>
                <p className="text-sm text-gray-600">総合満足度</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-600 mb-2">98.5%</div>
                <p className="text-sm text-gray-600">再利用希望率</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-600 mb-2">1,247</div>
                <p className="text-sm text-gray-600">レビュー総数</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-rose-600 mb-2">87%</div>
                <p className="text-sm text-gray-600">リピート率</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}