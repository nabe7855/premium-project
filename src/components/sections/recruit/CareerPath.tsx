'use client';
import React from 'react';
import { TrendingUp, Award, Star, DollarSign } from 'lucide-react';

const CareerPath: React.FC = () => {
  const stages = [
    {
      period: "入社後3ヶ月",
      title: "基礎習得期",
      income: "月収 20-30万円",
      description: "基本的な技術とマナーを習得。先輩セラピストがマンツーマンでサポート。",
      features: ["基礎研修完了", "メンター制度", "定期面談"]
    },
    {
      period: "入社後6ヶ月",
      title: "スキルアップ期",
      income: "月収 30-40万円",
      description: "専門技術の向上と自信の構築。お客様からの評価も安定してきます。",
      features: ["専門研修受講", "リピーター獲得", "スキル認定"]
    },
    {
      period: "入社後1年",
      title: "プロフェッショナル期",
      income: "月収 40-50万円+",
      description: "高い技術力と接客力を持つプロセラピストとして活躍。",
      features: ["指名率向上", "後輩指導", "キャリアアップ支援"]
    }
  ];

  return (
    <section id="career" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-rounded">
            Growth Journey
          </h2>
          <p className="text-xl text-gray-600 font-serif">
            あなたの成長ストーリー
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stages.map((stage, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-b from-pink-50 to-purple-50 rounded-2xl p-6 h-full">
                  <div className="text-center mb-4">
                    <div className="bg-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                      {index + 1}
                    </div>
                    <div className="text-sm text-pink-600 font-semibold">
                      {stage.period}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 text-center mb-4 font-rounded">
                    {stage.title}
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <span className="text-lg font-semibold text-green-600">
                        {stage.income}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {stage.description}
                  </p>
                  
                  <div className="space-y-2">
                    {stage.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-pink-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {index < stages.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <TrendingUp className="h-8 w-8 text-pink-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-rounded">
                キャリア支援制度
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white p-6 rounded-lg">
                  <Award className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    スキルアップ研修
                  </h4>
                  <p className="text-gray-600 text-sm">
                    定期的な技術研修、接客マナー講座、メンタルヘルスセミナー
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    キャリアカウンセリング
                  </h4>
                  <p className="text-gray-600 text-sm">
                    個別のキャリアプランニング、将来設計のサポート
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPath;