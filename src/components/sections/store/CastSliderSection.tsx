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
    setLikedCasts((prev) => {
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
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">本日出勤のキャスト</h2>
          <p className="text-lg text-gray-600">今すぐお会いできる素敵なキャストをご紹介</p>
        </div>

        <div className="relative mx-auto max-w-md">
          {/* Tinder-style Card */}
          <div className="relative h-96 md:h-[500px]">
            <div className="absolute inset-0 transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="relative h-full">
                <img
                  src={currentCast.image}
                  alt={currentCast.name}
                  className="h-2/3 w-full object-cover"
                />

                {/* Status Badge */}
                <div className="absolute right-4 top-4">
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
                  className="absolute left-4 top-4 rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
                >
                  <Heart
                    className={`h-6 w-6 ${
                      likedCasts.has(currentCast.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>

                {/* Cast Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <h3 className="mb-2 text-2xl font-bold">{currentCast.name}</h3>
                  <p className="mb-2 text-lg">{currentCast.age}歳</p>
                  <div className="mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{currentCast.specialty}</span>
                  </div>
                  {currentCast.isWorking && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{currentCast.schedule.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" size="lg" onClick={prevSlide} className="rounded-full p-3">
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="flex gap-2">
              {store.casts.map((cast, index) => (
                <button
                  key={cast.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? `bg-gradient-to-r ${store.theme.gradient}`
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button variant="outline" size="lg" onClick={nextSlide} className="rounded-full p-3">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <Button variant="outline" className="flex-1 rounded-full py-3" onClick={prevSlide}>
              パス
            </Button>
            <Button
              className={`flex-1 rounded-full bg-gradient-to-r py-3 ${store.theme.gradient} hover:${store.theme.gradientHover} text-white`}
              onClick={() => toggleLike(currentCast.id)}
            >
              お気に入り
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button
            className={`bg-gradient-to-r ${store.theme.gradient} hover:${store.theme.gradientHover} rounded-full px-8 py-3 text-lg font-semibold text-white`}
          >
            全キャスト一覧を見る
          </Button>
        </div>
      </div>
    </section>
  );
}
