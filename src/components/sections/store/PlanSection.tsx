'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Clock, CreditCard } from 'lucide-react';

export default function PlanSection() {
  const { store } = useStore();

  if (store.plans.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            プラン紹介
          </h2>
          <p className="text-gray-600 text-lg">
            あなたのご希望に合わせたプランをお選びください
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {store.plans.map((plan) => (
            <div key={plan.id} className={`relative bg-white rounded-3xl shadow-xl overflow-hidden ${
              plan.popular ? 'ring-4 ring-gradient-to-r ring-opacity-60 transform scale-105' : ''
            }`}>
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className={`bg-gradient-to-r ${store.theme.gradient} text-white text-center py-2 font-semibold`}>
                    <Star className="w-4 h-4 inline mr-1" />
                    人気No.1
                  </div>
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-2">{plan.price}</div>
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{plan.duration}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  {plan.description}
                </p>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`rounded-full p-1 bg-gradient-to-r ${store.theme.gradient}`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    plan.popular 
                      ? `bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} text-white` 
                      : 'border-2 border-gray-200 hover:border-gray-300'
                  } rounded-full py-3 font-semibold text-lg`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  このプランを選ぶ
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            ご不明な点やカスタムプランについてはお気軽にお問い合わせください
          </p>
          <Button
            variant="outline"
            className="px-8 py-3 rounded-full text-lg font-semibold"
          >
            詳しいプラン内容を見る
          </Button>
        </div>
      </div>
    </section>
  );
}