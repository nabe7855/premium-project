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
    <section className="py-16 px-4 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className={`w-8 h-8 text-${store.theme.primary}`} />
            <h2 className="text-3xl md:text-4xl font-bold">新人キャスト紹介</h2>
            <Sparkles className={`w-8 h-8 text-${store.theme.primary}`} />
          </div>
          <p className="text-gray-600 text-lg">
            フレッシュな魅力あふれる新人キャストをご紹介
          </p>
        </div>

        <div className="grid gap-8 md:gap-12">
          {store.newcomers.map((newcomer) => (
            <div key={newcomer.id} className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="md:flex">
                <div className="md:w-1/2 relative">
                  <img
                    src={newcomer.image}
                    alt={newcomer.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`bg-gradient-to-r ${store.theme.gradient} text-white`}>
                      NEW
                    </Badge>
                  </div>
                </div>
                
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{newcomer.name}</h3>
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{newcomer.age}歳</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>入店: {newcomer.startDate}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {newcomer.introduction}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className={`bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} text-white rounded-full px-6 py-3 font-semibold`}
                      >
                        詳細プロフィール
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full px-6 py-3 font-semibold"
                      >
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