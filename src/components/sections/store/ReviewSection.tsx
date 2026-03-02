'use client';

import { useStore } from '@/contexts/StoreContext';
import type { Review } from '@/types/store'; // または '@/types/store'
import { Calendar, Star, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ReviewSection() {
  const { store } = useStore();
  const [currentReview, setCurrentReview] = useState<number>(0);

  // 安全のためにデフォルト値を確保
  const reviews = store.reviews || [];
  const theme = store.theme || { gradient: 'from-blue-500 to-indigo-600' };

  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  if (reviews.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">お客様の声</h2>
          <p className="text-lg text-gray-600">実際にご利用いただいたお客様からの嬉しいお声</p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="flex min-h-[300px] flex-col justify-center rounded-3xl bg-white p-8 shadow-xl md:p-12">
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                {renderStars(reviews[currentReview].rating)}
              </div>
              <blockquote className="mb-6 text-xl italic leading-relaxed text-gray-800 md:text-2xl">
                "{reviews[currentReview].content}"
              </blockquote>
              <div className="flex items-center justify-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{reviews[currentReview].author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{reviews[currentReview].date}</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                ご利用プラン: {reviews[currentReview].service}
              </div>
            </div>
          </div>

          {/* Review Navigation Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {reviews.map((_: Review, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  index === currentReview ? `bg-gradient-to-r ${theme.gradient}` : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">4.8</div>
            <div className="text-gray-600">平均評価</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">247+</div>
            <div className="text-gray-600">レビュー数</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">98%</div>
            <div className="text-gray-600">満足度</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">89%</div>
            <div className="text-gray-600">リピート率</div>
          </div>
        </div>
      </div>
    </section>
  );
}
