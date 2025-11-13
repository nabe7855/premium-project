'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Check, Star, Clock, CreditCard } from 'lucide-react';
import type { Plan } from '@/types/store';

export default function PlanSection() {
  const { store } = useStore();

  if (store.plans.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">プラン紹介</h2>
          <p className="text-lg text-gray-600">あなたのご希望に合わせたプランをお選びください</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {store.plans.map((plan: Plan) => (
            <div
              key={plan.id}
              className={`relative overflow-hidden rounded-3xl bg-white shadow-xl ${
                plan.popular ? 'ring-gradient-to-r scale-105 transform ring-4 ring-opacity-60' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute left-0 right-0 top-0">
                  <div
                    className={`bg-gradient-to-r ${store.theme.gradient} py-2 text-center font-semibold text-white`}
                  >
                    <Star className="mr-1 inline h-4 w-4" />
                    人気No.1
                  </div>
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                <div className="mb-8 text-center">
                  <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                  <div className="mb-2 text-4xl font-bold">{plan.price}</div>
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{plan.duration}</span>
                  </div>
                </div>

                <p className="mb-6 text-center leading-relaxed text-gray-600">{plan.description}</p>

                <div className="mb-8 space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`rounded-full bg-gradient-to-r p-1 ${store.theme.gradient}`}>
                        <Check className="h-3 w-3 text-white" />
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
                  } rounded-full py-3 text-lg font-semibold`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  このプランを選ぶ
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600">
            ご不明な点やカスタムプランについてはお気軽にお問い合わせください
          </p>
          <Button variant="outline" className="rounded-full px-8 py-3 text-lg font-semibold">
            詳しいプラン内容を見る
          </Button>
        </div>
      </div>
    </section>
  );
}
