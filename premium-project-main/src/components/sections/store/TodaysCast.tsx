'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Eye } from 'lucide-react';
import { CastMember } from '@/types/store';
import { Store } from '@/types/store';

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
          <h2 className="mb-12 text-center font-noto text-3xl font-bold md:text-4xl">
            Today's <span className={`text-${store.colors.primary}`}>Strawberry</span>
          </h2>
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">本日出勤予定のキャストはおりません</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center font-noto text-3xl font-bold md:text-4xl">
          Today's <span className={`text-${store.colors.primary}`}>Strawberry</span>
        </h2>

        <div className="relative">
          {/* Mobile carousel */}
          <div className="md:hidden">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg">
              <div className="aspect-square overflow-hidden">
                <img
                  src={workingCast[currentIndex].image}
                  alt={workingCast[currentIndex].name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-noto text-2xl font-bold">
                  {workingCast[currentIndex].name}
                </h3>
                {workingCast[currentIndex].schedule && (
                  <div className="mb-4 flex items-center text-gray-600">
                    <Clock className="mr-2 h-4 w-4" />
                    <span className="text-sm">{workingCast[currentIndex].schedule}</span>
                  </div>
                )}
                <button
                  className={`w-full py-3 bg-${store.colors.primary} rounded-xl font-medium text-white transition-opacity hover:opacity-90`}
                >
                  詳細を見る
                </button>
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
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={cast.image}
                    alt={cast.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
                    <Eye className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-noto text-xl font-bold">{cast.name}</h3>
                  {cast.schedule && (
                    <div className="mb-4 flex items-center text-gray-600">
                      <Clock className="mr-2 h-4 w-4" />
                      <span className="text-sm">{cast.schedule}</span>
                    </div>
                  )}
                  <button
                    className={`w-full py-2 bg-${store.colors.primary} rounded-lg font-medium text-white transition-opacity hover:opacity-90`}
                  >
                    詳細を見る
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            className={`border-2 px-8 py-3 border-${store.colors.primary} text-${store.colors.primary} rounded-full font-medium hover:bg-${store.colors.primary} transition-colors hover:text-white`}
          >
            一覧を見る
          </button>
        </div>
      </div>
    </section>
  );
};

export default TodaysCast;
