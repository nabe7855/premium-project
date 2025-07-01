'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Coffee, Heart, Star, Sparkles } from 'lucide-react';
import { useAgeVerification } from '@/hooks/useAgeVerification';
import AgeVerificationModal from '@/components/ui/AgeVerificationModal';

const plans = [
  {
    id: "reward",
    title: "自分へのご褒美プラン",
    duration: "2時間",
    price: "¥15,000",
    originalPrice: "¥18,000",
    description: "お疲れ様でした。今日頑張ったあなたへの特別なご褒美時間です。",
    features: [
      "お好きなカフェでゆったりと",
      "お話を聞かせていただきます",
      "手作りスイーツのお土産付き",
      "次回使える1,000円クーポン"
    ],
    popular: false,
    emotion: "😌",
    bgColor: "from-pink-50 to-rose-50",
    buttonColor: "bg-rose-600 hover:bg-rose-700"
  },
  {
    id: "listening",
    title: "癒しの傾聴プラン",
    duration: "3時間",
    price: "¥22,000",
    originalPrice: "¥27,000",
    description: "ただ話を聞いてほしい夜に。あなたのペースで、心のままにお話しください。",
    features: [
      "静かな個室空間をご用意",
      "プロの傾聴スキルでサポート",
      "ハーブティーでリラックス",
      "アロマキャンドルの演出"
    ],
    popular: true,
    emotion: "🤗",
    bgColor: "from-purple-50 to-pink-50",
    buttonColor: "bg-purple-600 hover:bg-purple-700"
  },
  {
    id: "date",
    title: "特別な一日プラン",
    duration: "6時間",
    price: "¥38,000",
    originalPrice: "¥45,000",
    description: "記念日や特別な日に。あなただけのプライベートな時間を演出いたします。",
    features: [
      "お好きな場所へのエスコート",
      "記念撮影のお手伝い",
      "サプライズ演出のご相談",
      "翌日のアフターフォロー"
    ],
    popular: false,
    emotion: "✨",
    bgColor: "from-amber-50 to-orange-50",
    buttonColor: "bg-amber-600 hover:bg-amber-700"
  }
];

export default function PlanSection() {
  const { isModalOpen, requireAgeVerification, handleConfirm, handleClose } = useAgeVerification();

  const handlePlanClick = (planId: string) => {
    requireAgeVerification(() => {
      // ここに実際のアクション（プラン詳細ページへの遷移など）を実装
      console.log(`プラン選択: ${planId}`);
    });
  };

  return (
    <>
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              あなたの気持ちに寄り添う
              <br />
              <span className="text-rose-600">3つのプラン</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              それぞれの想いやシーンに合わせて、最適なプランをお選びいただけます
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-rose-400 shadow-lg' : ''
              }`}>
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-rose-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      人気No.1
                    </Badge>
                  </div>
                )}

                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.bgColor} opacity-30`} />

                <div className="relative p-6">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-3">{plan.emotion}</div>
                    <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {plan.description}
                    </p>
                    
                    {/* Pricing */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-sm text-gray-500 line-through">{plan.originalPrice}</span>
                    </div>
                    
                    <div className="flex items-center justify-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{plan.duration}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-rose-600" />
                        </div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    onClick={() => handlePlanClick(plan.id)}
                    className={`w-full ${plan.buttonColor} text-white font-medium rounded-full py-3 transition-all duration-300`}
                  >
                    {plan.popular ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        このプランを選ぶ
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 mr-2" />
                        詳細を見る
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <Coffee className="w-12 h-12 text-rose-600 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
                初回限定特典
              </h3>
              <p className="text-gray-600 mb-4">
                初めてご利用のお客様は、全プラン20%オフでご利用いただけます。
                <br />
                また、専任コンシェルジュが丁寧にサポートいたします。
              </p>
              <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                初回限定 20% OFF
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}