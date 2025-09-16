'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Cast の型を定義
export interface TodayCast {
  id: string;
  name: string;
  age?: number;
  catch_copy?: string;
  main_image_url?: string;
  image_url?: string;
  mbti_name?: string | null;
  face_name?: string | null;
  start_datetime?: string;
  end_datetime?: string;
}

interface CastSliderSectionProps {
  casts: TodayCast[];
}

export default function CastSliderSection({ casts }: CastSliderSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCasts, setLikedCasts] = useState<Set<string>>(new Set());

  // ✅ デバッグログ
  useEffect(() => {
    console.log("🎯 CastSliderSection props.casts:", casts);
  }, [casts]);

  if (!casts || casts.length === 0) {
    console.log("⚠️ 本日出勤キャストなし");
    return (
      <section className="px-4 py-16 text-center text-gray-500">
        本日出勤のキャストはいません
      </section>
    );
  }

  const currentCast = casts[currentIndex];

  // ✅ デバッグログ
  useEffect(() => {
    console.log("👉 currentIndex:", currentIndex, "currentCast:", currentCast);
  }, [currentIndex, currentCast]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % casts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + casts.length) % casts.length);
  };

  const toggleLike = (castId: string) => {
    setLikedCasts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(castId)) {
        newSet.delete(castId);
        console.log("💔 お気に入り解除:", castId);
      } else {
        newSet.add(castId);
        console.log("❤️ お気に入り追加:", castId);
      }
      return newSet;
    });
  };

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">本日出勤のキャスト</h2>
          <p className="text-lg text-gray-600">今すぐお会いできる素敵なキャストをご紹介</p>
        </div>

        <div className="relative mx-auto max-w-md">
          <div className="relative h-96 md:h-[500px]">
            <div className="absolute inset-0 transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="relative h-full">
                <img
                  src={currentCast.main_image_url || currentCast.image_url || '/no-image.png'}
                  alt={currentCast.name}
                  className="h-2/3 w-full object-cover"
                />

                {/* Status Badge */}
                <div className="absolute right-4 top-4">
                  <Badge className="bg-green-500 text-white">出勤中</Badge>
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
                  {currentCast.age && <p className="mb-2 text-lg">{currentCast.age}歳</p>}
                  {currentCast.catch_copy && (
                    <p className="mb-2 text-sm italic">「{currentCast.catch_copy}」</p>
                  )}
                  <div className="mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{currentCast.mbti_name || currentCast.face_name}</span>
                  </div>
                  {currentCast.start_datetime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {new Date(currentCast.start_datetime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        〜{' '}
                        {currentCast.end_datetime &&
                          new Date(currentCast.end_datetime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="outline" size="lg" onClick={prevSlide} className="rounded-full p-3">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button variant="outline" size="lg" onClick={nextSlide} className="rounded-full p-3">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
