'use client';

import { CastMember, Store } from '@/types/store';
import { ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react';
import Link from 'next/link'; // ✅ 追加
import React, { useState } from 'react';

interface TodaysCastProps {
  store: Store;
  castMembers: CastMember[];
}

const TodaysCast: React.FC<TodaysCastProps> = ({ store, castMembers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const workingCast = castMembers.filter((cast) => cast.isWorking);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % workingCast.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + workingCast.length) % workingCast.length);
  };

  if (workingCast.length === 0) {
    return (
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-noto mb-12 text-center text-3xl font-bold md:text-4xl">
            Today's <span className={`text-${store.colors.primary}`}>Strawberry</span>
          </h2>
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">本日出勤予定のキャストはおりません</p>
          </div>
        </div>
      </section>
    );
  }

  const currentCast = workingCast[currentIndex];

  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-noto mb-12 text-center text-3xl font-bold md:text-4xl">
          Today's <span className={`text-${store.colors.primary}`}>Strawberry</span>
        </h2>

        <div className="relative">
          {/* Mobile carousel */}
          <div className="md:hidden">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
              <Link href={`/store/${store.id}/cast/${currentCast.slug || currentCast.id}`}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={currentCast.image}
                    alt={currentCast.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
              <div className="p-6">
                <Link href={`/store/${store.id}/cast/${currentCast.slug || currentCast.id}`}>
                  <h3 className="font-noto mb-2 text-2xl font-bold">{currentCast.name}</h3>
                </Link>
                {currentCast.schedule && (
                  <div className="mb-4 flex items-center text-gray-600">
                    <Clock className="mr-2 h-4 w-4" />
                    <span className="text-sm">{currentCast.schedule}</span>
                  </div>
                )}
                <Link
                  href={`/store/${store.id}/cast/${currentCast.slug || currentCast.id}`}
                  className={`block w-full py-3 bg-${store.colors.primary} rounded-xl text-center font-medium text-white transition-opacity hover:opacity-90`}
                >
                  詳細を見る
                </Link>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={prevSlide}
                className={`rounded-full p-3 bg-${store.colors.primary} text-white transition-opacity hover:opacity-90`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex space-x-2">
                {workingCast.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-3 w-3 rounded-full transition-colors ${
                      index === currentIndex ? `bg-${store.colors.primary}` : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className={`rounded-full p-3 bg-${store.colors.primary} text-white transition-opacity hover:opacity-90`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {workingCast.map((cast) => (
              <div
                key={cast.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl"
              >
                <Link href={`/store/${store.id}/cast/${cast.slug || cast.id}`}>
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={cast.image}
                      alt={cast.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* グラスモーフィズムオーバーレイ */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pb-4 pt-12 backdrop-blur-[1px]">
                      <div className="px-6 text-center text-white">
                        <Eye className="mx-auto mb-2 h-6 w-6 opacity-0 drop-shadow-md transition-all duration-300 group-hover:scale-110 group-hover:opacity-100" />
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="p-6">
                  <Link href={`/store/${store.id}/cast/${cast.slug || cast.id}`}>
                    <h3 className="font-noto mb-2 text-xl font-bold">{cast.name}</h3>
                  </Link>
                  {cast.schedule && (
                    <div className="mb-4 flex items-center text-gray-600">
                      <Clock className="mr-2 h-4 w-4" />
                      <span className="text-sm">{cast.schedule}</span>
                    </div>
                  )}
                  <Link
                    href={`/store/${store.id}/cast/${cast.slug || cast.id}`}
                    className={`block w-full py-2 bg-${store.colors.primary} rounded-lg text-center font-medium text-white transition-opacity hover:opacity-90`}
                  >
                    詳細を見る
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href={`/store/${store.id}/cast`}
            className={`inline-block border-2 px-8 py-3 border-${store.colors.primary} text-${store.colors.primary} rounded-full font-medium hover:bg-${store.colors.primary} transition-colors hover:text-white`}
          >
            一覧を見る
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TodaysCast;
