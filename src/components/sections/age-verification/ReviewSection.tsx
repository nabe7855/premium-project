import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const ReviewSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'M.K様',
      age: '30代',
      rating: 5,
      title: '心からリフレッシュできました',
      content: '仕事で疲れていた時に利用させていただきました。とても紳士的で優しい方で、話を聞いてもらっているうちに自然と心が軽くなりました。また絶対お願いします。',
      date: '2024年1月'
    },
    {
      id: 2,
      name: 'R.T様',
      age: '40代',
      rating: 5,
      title: 'AI診断が的確でした',
      content: 'AI診断で紹介していただいた方は、まさに私の理想通りでした。会話も弾み、とても楽しい時間を過ごせました。システムの精度の高さに驚いています。',
      date: '2024年2月'
    },
    {
      id: 3,
      name: 'Y.S様',
      age: '20代',
      rating: 5,
      title: '安心して利用できました',
      content: '初めての利用で不安でしたが、スタッフの方の対応が丁寧で安心できました。プライバシーもしっかり守られていて、リラックスして過ごせました。',
      date: '2024年3月'
    },
    {
      id: 4,
      name: 'H.N様',
      age: '50代',
      rating: 5,
      title: '品質の高さに感動',
      content: '他のサービスとは全く違う品質の高さを実感しました。教養のある方で会話も知的で楽しく、まさに大人の女性向けのサービスだと思います。',
      date: '2024年2月'
    },
    {
      id: 5,
      name: 'A.M様',
      age: '30代',
      rating: 5,
      title: '心のケアもしていただけました',
      content: '仕事のストレスで参っていた時に、ただ話を聞いてもらいたくて利用しました。本当に優しく包み込んでくれて、心から癒されました。ありがとうございました。',
      date: '2024年1月'
    },
    {
      id: 6,
      name: 'C.K様',
      age: '40代',
      rating: 5,
      title: 'リピート確定です',
      content: '期待以上のサービスでした。時間があっという間に過ぎてしまい、もっと一緒にいたいと思いました。次回の予約もすでに入れています。',
      date: '2024年3月'
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-rounded font-bold text-gray-800 mb-4">
            お客様の声
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            実際にご利用いただいたお客様からの
            <br />
            <span className="font-rounded font-medium text-strawberry-600">
              リアルなご感想をご紹介します
            </span>
          </p>
          
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} fill="currentColor" className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-2xl font-rounded font-bold text-strawberry-500">4.9</p>
              <p className="text-sm text-gray-600">平均評価</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-rounded font-bold text-strawberry-500 mb-1">98%</p>
              <p className="text-sm text-gray-600">満足度</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-rounded font-bold text-strawberry-500 mb-1">95%</p>
              <p className="text-sm text-gray-600">リピート率</p>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-50 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-8 h-8 text-strawberry-500" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-rounded font-bold text-gray-800">
                    {review.name}
                  </h4>
                  <p className="text-sm text-gray-500">{review.age}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} fill="currentColor" className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Title */}
              <h5 className="font-rounded font-medium text-gray-800 mb-3">
                {review.title}
              </h5>

              {/* Content */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {review.content}
              </p>

              {/* Date */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{review.date}</span>
                <div className="w-2 h-2 bg-strawberry-200 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            あなたも特別な時間を体験してみませんか？
          </p>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-50 to-cream-50 px-6 py-3 rounded-full">
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="text-sm font-rounded text-gray-700">
              10,000名以上のお客様が体験済み
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewSection;