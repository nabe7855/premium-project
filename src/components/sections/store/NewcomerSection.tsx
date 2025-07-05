'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Sparkles } from 'lucide-react';

export default function NewcomerSection() {
  const { store } = useStore();

  if (store.newcomers.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className={`h-8 w-8 text-${store.theme.primary}`} />
            <h2 className="text-3xl font-bold md:text-4xl">新人キャスト紹介</h2>
            <Sparkles className={`h-8 w-8 text-${store.theme.primary}`} />
          </div>
          <p className="text-lg text-gray-600">フレッシュな魅力あふれる新人キャストをご紹介</p>
        </div>

        <div className="grid gap-8 md:gap-12">
          {store.newcomers.map((newcomer) => (
            <div
              key={newcomer.id}
              className="transform overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="md:flex">
                <div className="relative md:w-1/2">
                  <img
                    src={newcomer.image}
                    alt={newcomer.name}
                    className="h-64 w-full object-cover md:h-full"
                  />
                  <div className="absolute left-4 top-4">
                    <Badge className={`bg-gradient-to-r ${store.theme.gradient} text-white`}>
                      NEW
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col justify-center p-8 md:w-1/2">
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 text-3xl font-bold">{newcomer.name}</h3>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{newcomer.age}歳</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>入店: {newcomer.startDate}</span>
                        </div>
                      </div>
                    </div>

                    <p className="leading-relaxed text-gray-700">{newcomer.introduction}</p>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        className={`bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} rounded-full px-6 py-3 font-semibold text-white`}
                      >
                        詳細プロフィール
                      </Button>
                      <Button variant="outline" className="rounded-full px-6 py-3 font-semibold">
                        予約する
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
