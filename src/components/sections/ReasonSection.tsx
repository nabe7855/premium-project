'use client';

import { Card } from '@/components/ui/card';
import { Award, Clock, Heart, Shield, Trophy, Users } from 'lucide-react';

const reasons = [
  {
    icon: Trophy,
    title: '創業7年の実績',
    description: '延べ12,000名のお客様にご利用いただき、業界トップクラスの実績を誇ります。',
    stats: '満足度 98.5%',
  },
  {
    icon: Shield,
    title: '徹底した安全管理',
    description: '厳格な身元確認と定期的な健康管理により、安心してご利用いただけます。',
    stats: '事故・トラブル 0件',
  },
  {
    icon: Users,
    title: '厳選されたキャスト',
    description: '採用率わずか3%の厳しい選考を通過した、上質なキャストのみが在籍しています。',
    stats: '採用率 3%',
  },
  {
    icon: Clock,
    title: '24時間サポート',
    description: '専任コンシェルジュが24時間体制でサポート。いつでも安心してご相談ください。',
    stats: '平均対応時間 5分',
  },
  {
    icon: Award,
    title: '独自の研修システム',
    description: '接客マナーから心理学まで、独自の研修プログラムで質の高いサービスを提供。',
    stats: '研修時間 120時間',
  },
  {
    icon: Heart,
    title: 'リピート率87%',
    description: '多くのお客様にリピートいただいている、信頼と満足の証です。',
    stats: 'リピート率 87%',
  },
];

export default function ReasonSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-gray-900 sm:text-4xl">
            ストロベリーボーイズが
            <br />
            <span className="text-rose-600">選ばれ続ける理由</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            創業から7年、お客様の信頼に応え続けてきた6つの理由をご紹介します
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <Card
                key={index}
                className="group p-6 transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  {/* Icon with SB Character Style */}
                  <div className="rounded-full bg-rose-100 p-3 transition-colors duration-300 group-hover:bg-rose-600">
                    <IconComponent className="h-6 w-6 text-rose-600 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{reason.title}</h3>
                    <p className="mb-3 text-sm leading-relaxed text-gray-600">
                      {reason.description}
                    </p>
                    <div className="inline-block rounded-full bg-rose-50 px-3 py-1">
                      <span className="text-xs font-medium text-rose-700">{reason.stats}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 p-8">
            <h3 className="mb-6 font-serif text-2xl font-bold text-gray-900">
              安心・安全への取り組み
            </h3>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                  <Shield className="h-8 w-8 text-rose-600" />
                </div>
                <h4 className="mb-1 font-semibold text-gray-900">身元確認</h4>
                <p className="text-sm text-gray-600">公的証明書による厳格な本人確認</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                  <Award className="h-8 w-8 text-rose-600" />
                </div>
                <h4 className="mb-1 font-semibold text-gray-900">品質管理</h4>
                <p className="text-sm text-gray-600">定期的な研修とサービス品質の向上</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
                  <Users className="h-8 w-8 text-rose-600" />
                </div>
                <h4 className="mb-1 font-semibold text-gray-900">サポート</h4>
                <p className="text-sm text-gray-600">専任スタッフによる充実のアフターケア</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
