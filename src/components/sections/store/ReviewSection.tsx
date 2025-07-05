'use client';

import { useStore } from '@/contexts/StoreContext';
import { useState, useEffect } from 'react';
import { Star, User, Calendar } from 'lucide-react';

export default function ReviewSection() {
  const { store } = useStore();
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    if (store.reviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % store.reviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [store.reviews.length]);

  if (store.reviews.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            お客様の声
          </h2>
          <p className="text-gray-600 text-lg">
            実際にご利用いただいたお客様からの嬉しいお声
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 min-h-[300px] flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {renderStars(store.reviews[currentReview].rating)}
              </div>
              <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-6 italic">
                "{store.reviews[currentReview].content}"
              </blockquote>
              <div className="flex items-center justify-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{store.reviews[currentReview].author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{store.reviews[currentReview].date}</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                ご利用プラン: {store.reviews[currentReview].service}
              </div>
            </div>
          </div>

          {/* Review Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {store.reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentReview 
                    ? `bg-gradient-to-r ${store.theme.gradient}` 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">4.8</div>
            <div className="text-gray-600">平均評価</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">247+</div>
            <div className="text-gray-600">レビュー数</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">98%</div>
            <div className="text-gray-600">満足度</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">89%</div>
            <div className="text-gray-600">リピート率</div>
          </div>
        </div>
      </div>
    </section>
  );
}