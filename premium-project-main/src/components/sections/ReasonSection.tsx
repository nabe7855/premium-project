'use client';

import { Card } from '@/components/ui/card';
import { Shield, Trophy, Users, Clock, Award, Heart } from 'lucide-react';

const reasons = [
  {
    icon: Trophy,
    title: "創業7年の実績",
    description: "延べ12,000名のお客様にご利用いただき、業界トップクラスの実績を誇ります。",
    stats: "満足度 98.5%"
  },
  {
    icon: Shield,
    title: "徹底した安全管理",
    description: "厳格な身元確認と定期的な健康管理により、安心してご利用いただけます。",
    stats: "事故・トラブル 0件"
  },
  {
    icon: Users,
    title: "厳選されたキャスト",
    description: "採用率わずか3%の厳しい選考を通過した、上質なキャストのみが在籍しています。",
    stats: "採用率 3%"
  },
  {
    icon: Clock,
    title: "24時間サポート",
    description: "専任コンシェルジュが24時間体制でサポート。いつでも安心してご相談ください。",
    stats: "平均対応時間 5分"
  },
  {
    icon: Award,
    title: "独自の研修システム",
    description: "接客マナーから心理学まで、独自の研修プログラムで質の高いサービスを提供。",
    stats: "研修時間 120時間"
  },
  {
    icon: Heart,
    title: "リピート率87%",
    description: "多くのお客様にリピートいただいている、信頼と満足の証です。",
    stats: "リピート率 87%"
  }
];

export default function ReasonSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ストロベリーボーイが
            <br />
            <span className="text-rose-600">選ばれ続ける理由</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            創業から7年、お客様の信頼に応え続けてきた6つの理由をご紹介します
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 group">
                <div className="flex items-start space-x-4">
                  {/* Icon with SB Character Style */}
                  <div className="bg-rose-100 rounded-full p-3 group-hover:bg-rose-600 transition-colors duration-300">
                    <IconComponent className="w-6 h-6 text-rose-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                      {reason.description}
                    </p>
                    <div className="bg-rose-50 rounded-full px-3 py-1 inline-block">
                      <span className="text-rose-700 font-medium text-xs">
                        {reason.stats}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8">
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">
              安心・安全への取り組み
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Shield className="w-8 h-8 text-rose-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">身元確認</h4>
                <p className="text-sm text-gray-600">公的証明書による厳格な本人確認</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Award className="w-8 h-8 text-rose-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">品質管理</h4>
                <p className="text-sm text-gray-600">定期的な研修とサービス品質の向上</p>
              </div>
              
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Users className="w-8 h-8 text-rose-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">サポート</h4>
                <p className="text-sm text-gray-600">専任スタッフによる充実のアフターケア</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}