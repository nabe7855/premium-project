'use client';
import React from 'react';
import { Shield, Clock, Heart, Phone, UserCheck, Headphones } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: <Shield className="h-8 w-8 text-pink-500" />,
      title: '身バレ対策万全',
      description: '身バレ対策を徹底するので気持ちよく働けます。',
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: '24時間相談ホットライン',
      description: '困ったことがあればいつでも相談できる24時間体制のサポートライン。',
    },

    {
      icon: <Phone className="h-8 w-8 text-orange-500" />,
      title: 'SNSを駆使したプロデュース',
      description: 'SNSを通して有名になれるように徹底サポートします。',
    },

    {
      icon: <UserCheck className="h-8 w-8 text-green-500" />,
      title: '専任スタッフによるカウンセリング',
      description: '定期的な面談で悩みや不安を解消。専門のカウンセラーがあなたをサポートします。',
    },
    {
      icon: <Headphones className="h-8 w-8 text-purple-500" />,
      title: 'メンタルヘルスサポート',
      description: '心の健康を大切にする専門的なメンタルヘルスサポート体制を整えています。',
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: '高待遇・高収入',
      description: '業界トップクラスの時給と充実した福利厚生。あなたの努力をしっかりと評価します。',
    },
  ];

  return (
    <section id="why-choose" className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-rounded text-3xl font-bold text-gray-800 md:text-4xl">
            なぜ、多くの女性が
            <br />
            ストロベリーボーイズを選ぶのか
          </h2>
          <p className="font-serif text-xl text-gray-600">安心して働ける環境づくりへの取り組み</p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 rounded-lg bg-gray-50 p-3">{reason.icon}</div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">{reason.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{reason.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 p-8">
          <div className="text-center">
            <h3 className="mb-4 font-rounded text-2xl font-bold text-gray-800">
              安心・安全への取り組み
            </h3>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-white p-4">
                <h4 className="mb-2 font-semibold text-gray-800">プライバシー保護</h4>
                <p className="text-sm text-gray-600">
                  顔出しNG、個人情報の厳重管理、退職時のデータ完全削除保証
                </p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <h4 className="mb-2 font-semibold text-gray-800">安全対策</h4>
                <p className="text-sm text-gray-600">
                  セキュリティシステム、緊急時対応、定期的な健康チェック
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
