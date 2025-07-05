'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function DiarySection() {
  const { store } = useStore();

  if (store.diaries.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            写メ日記
          </h2>
          <p className="text-gray-600 text-lg">
            キャストたちの日常をちょっとのぞき見
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.diaries.slice(0, 3).map((diary) => (
            <div key={diary.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img
                  src={diary.image}
                  alt={diary.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  {diary.castName}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{diary.date}</span>
                </div>
                
                <h3 className="text-lg font-bold mb-3 line-clamp-2">{diary.title}</h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {diary.excerpt}
                </p>
                
                <Button
                  variant="ghost"
                  className={`w-full justify-between text-${store.theme.primary} hover:bg-${store.theme.primaryLight}/20`}
                >
                  続きを読む
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            className={`bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} text-white px-8 py-3 rounded-full text-lg font-semibold`}
          >
            写メ日記をもっと見る
          </Button>
        </div>
      </div>
    </section>
  );
}