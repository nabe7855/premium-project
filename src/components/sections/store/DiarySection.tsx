'use client';

import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight } from 'lucide-react';

export default function DiarySection() {
  const { store } = useStore();

  if (store.diaries.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">写メ日記</h2>
          <p className="text-lg text-gray-600">キャストたちの日常をちょっとのぞき見</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {store.diaries.slice(0, 3).map((diary) => (
            <div
              key={diary.id}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative">
                <img src={diary.image} alt={diary.title} className="h-48 w-full object-cover" />
                <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
                  {diary.castName}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{diary.date}</span>
                </div>

                <h3 className="mb-3 line-clamp-2 text-lg font-bold">{diary.title}</h3>

                <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">{diary.excerpt}</p>

                <Button
                  variant="ghost"
                  className={`w-full justify-between text-${store.theme.primary} hover:bg-${store.theme.primaryLight}/20`}
                >
                  続きを読む
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            className={`bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} rounded-full px-8 py-3 text-lg font-semibold text-white`}
          >
            写メ日記をもっと見る
          </Button>
        </div>
      </div>
    </section>
  );
}
