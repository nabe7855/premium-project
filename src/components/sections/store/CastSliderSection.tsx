'use client';

import { useState } from 'react';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CastSliderSection() {
  const { store } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCasts, setLikedCasts] = useState<Set<string>>(new Set());

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % store.casts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + store.casts.length) % store.casts.length);
  };

  const toggleLike = (castId: string) => {
    setLikedCasts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(castId)) {
        newSet.delete(castId);
      } else {
        newSet.add(castId);
      }
      return newSet;
    });
  };

  if (store.casts.length === 0) {
    return null;
  }

  const currentCast = store.casts[currentIndex];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            本日出勤のキャスト
          </h2>
          <p className="text-gray-600 text-lg">
            今すぐお会いできる素敵なキャストをご紹介
          </p>
        </div>

        <div className="relative max-w-md mx-auto">
          {/* Tinder-style Card */}
          <div className="relative h-96 md:h-[500px]">
            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="relative h-full">
                <img
                  src={currentCast.image}
                  alt={currentCast.name}
                  className="w-full h-2/3 object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge 
                    className={`${
                      currentCast.isWorking 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gray-500 hover:bg-gray-600'
                    } text-white`}
                  >
                    {currentCast.isWorking ? '出勤中' : '本日休み'}
                  </Badge>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => toggleLike(currentCast.id)}
                  className="absolute top-4 left-4 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`w-6 h-6 ${
                      likedCasts.has(currentCast.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400'
                    }`} 
                  />
                </button>

                {/* Cast Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{currentCast.name}</h3>
                  <p className="text-lg mb-2">{currentCast.age}歳</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{currentCast.specialty}</span>
                  </div>
                  {currentCast.isWorking && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{currentCast.schedule.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={prevSlide}
              className="rounded-full p-3"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="flex gap-2">
              {store.casts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex 
                      ? `bg-gradient-to-r ${store.theme.gradient}` 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={nextSlide}
              className="rounded-full p-3"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              variant="outline"
              className="flex-1 rounded-full py-3"
              onClick={prevSlide}
            >
              パス
            </Button>
            <Button
              className={`flex-1 rounded-full py-3 bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} text-white`}
              onClick={() => toggleLike(currentCast.id)}
            >
              お気に入り
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            className={`bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} text-white px-8 py-3 rounded-full text-lg font-semibold`}
          >
            全キャスト一覧を見る
          </Button>
        </div>
      </div>
    </section>
  );
}