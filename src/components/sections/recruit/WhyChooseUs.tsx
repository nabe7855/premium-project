'use client';
import React from 'react';
import { Shield, Clock, Heart, Phone, UserCheck, Headphones } from 'lucide-react';

const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      icon: <Shield className="h-8 w-8 text-pink-500" />,
      title: "完全個室待機",
      description: "プライバシーを重視した完全個室制度。他の人の目を気にすることなく、リラックスして過ごせます。"
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "24時間相談ホットライン",
      description: "困ったことがあればいつでも相談できる24時間体制のサポートライン。女性スタッフが対応します。"
    },
    {
      icon: <UserCheck className="h-8 w-8 text-green-500" />,
      title: "女性カウンセラー",
      description: "定期的な面談で悩みや不安を解消。専門のカウンセラーがあなたをサポートします。"
    },
    {
      icon: <Headphones className="h-8 w-8 text-purple-500" />,
      title: "メンタルヘルスサポート",
      description: "心の健康を大切にする専門的なメンタルヘルスサポート体制を整えています。"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "高待遇・高収入",
      description: "業界トップクラスの時給と充実した福利厚生。あなたの努力をしっかりと評価します。"
    },
    {
      icon: <Phone className="h-8 w-8 text-orange-500" />,
      title: "女性スタッフ常駐",
      description: "女性だからこそ分かる悩みや相談に、女性スタッフが親身に対応します。"
    }
  ];

  return (
    <section id="why-choose" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-rounded">
            なぜ、多くの女性が<br />
            ストロベリーボーイズを選ぶのか
          </h2>
          <p className="text-xl text-gray-600 font-serif">
            安心して働ける環境づくりへの取り組み
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
                  {reason.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 font-rounded">
              安心・安全への取り組み
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">プライバシー保護</h4>
                <p className="text-gray-600 text-sm">
                  顔出しNG、個人情報の厳重管理、退職時のデータ完全削除保証
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">安全対策</h4>
                <p className="text-gray-600 text-sm">
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