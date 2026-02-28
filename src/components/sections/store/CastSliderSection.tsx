'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import Link from 'next/link'; // ✅ 追加
import { useState } from 'react';

// Cast の型を定義
export interface TodayCast {
  id: string;
  name: string;
  slug: string | null; // ✅ 追加
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
  storeSlug: string; // ✅ 追加
}

export default function CastSliderSection({ casts, storeSlug }: CastSliderSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedCasts, setLikedCasts] = useState<Set<string>>(new Set());

  if (!casts || casts.length === 0) {
    return (
      <section className="px-4 py-16 text-center text-gray-500">
        本日出勤のキャストはいません
      </section>
    );
  }

  const currentCast = casts[currentIndex];

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
      } else {
        newSet.add(castId);
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
            <Link
              href={`/store/${storeSlug}/cast/${currentCast.slug || currentCast.id}`}
              className="absolute inset-0 block"
            >
              <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-rose-50 bg-white shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                {/* Image Area */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={currentCast.main_image_url || currentCast.image_url || '/no-image.png'}
                    alt={currentCast.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Status Badge */}
                  <div className="absolute left-4 top-4 flex flex-col gap-2">
                    <span className="flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1 text-[10px] font-black text-white shadow-lg">
                      本日出勤
                    </span>
                  </div>
                  {/* Play Button Icon */}
                  <div className="absolute bottom-4 right-4 rounded-full bg-white/90 p-3 shadow-xl backdrop-blur-sm">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-rose-400">
                      <div className="ml-0.5 h-0 w-0 border-b-[5px] border-l-[8px] border-t-[5px] border-b-transparent border-l-rose-400 border-t-transparent" />
                    </div>
                  </div>
                  {/* Like Button */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(currentCast.id);
                      }}
                      className="rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          likedCasts.has(currentCast.id)
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-slate-400'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col p-6">
                  <div className="mb-3 flex items-end justify-between">
                    <h3 className="text-2xl font-black tracking-tight text-slate-800">
                      {currentCast.name}
                    </h3>
                    <span className="mb-0.5 text-lg font-bold text-slate-400">
                      {currentCast.age}歳
                    </span>
                  </div>

                  {/* MBTI & Face */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {currentCast.mbti_name && (
                      <span className="rounded-full border border-blue-100/50 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600">
                        MBTI: {currentCast.mbti_name}
                      </span>
                    )}
                    {currentCast.face_name && (
                      <span className="rounded-full border border-purple-100/50 bg-purple-50 px-3 py-1 text-[11px] font-bold text-purple-600">
                        顔型: {currentCast.face_name}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mb-5 flex items-center gap-1.5">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-black text-slate-700">5.0</span>
                    <span className="text-sm font-bold text-slate-400">(10)</span>
                  </div>

                  {/* Sexiness */}
                  <div className="mt-auto flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                      セクシー度:
                    </span>
                    <span className="text-base tracking-widest">🍓🍓🍓</span>
                  </div>
                </div>
              </div>
            </Link>
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
