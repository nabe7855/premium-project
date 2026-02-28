'use client';

import { CastMember, Store } from '@/types/store';
import { ChevronLeft, ChevronRight, Eye, Star } from 'lucide-react';
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
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-rose-50 bg-white shadow-soft">
              <Link href={`/store/${store.id}/cast/${currentCast.slug || currentCast.id}`}>
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={currentCast.image}
                    alt={currentCast.name}
                    className="h-full w-full object-cover transition-transform duration-700"
                  />
                  {/* Status Badge */}
                  <div className="absolute left-3 top-3">
                    <span className="flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black text-white shadow-lg">
                      本日出勤
                    </span>
                  </div>
                </div>
              </Link>
              <div className="p-5">
                <div className="mb-2 flex items-end justify-between">
                  <h3 className="text-xl font-black tracking-tight text-slate-800">
                    {currentCast.name}
                  </h3>
                  <span className="mb-0.5 text-sm font-bold text-slate-400">
                    {currentCast.age || 25}歳
                  </span>
                </div>

                {/* Rating */}
                <div className="mb-3 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-black text-slate-700">
                    {(currentCast.rating || 5.0).toFixed(1)}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    ({currentCast.reviewCount || 10})
                  </span>
                </div>

                {/* MBTI & Sexiness */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex gap-1.5">
                    {currentCast.mbtiType && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-600">
                        {currentCast.mbtiType}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-black uppercase text-rose-400">
                      SEXINESS:
                    </span>
                    <span className="text-xs">🍓🍓🍓</span>
                  </div>
                </div>

                <Link
                  href={`/store/${store.id}/cast/${currentCast.slug || currentCast.id}`}
                  className={`mt-4 block w-full rounded-xl bg-rose-500 py-3 text-center text-xs font-black text-white shadow-lg shadow-rose-200 transition-all hover:scale-[1.02] active:scale-95`}
                >
                  VIEW PROFILE
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
                className="group flex flex-col overflow-hidden rounded-2xl border border-rose-50 bg-white shadow-soft transition-all duration-300 hover:scale-[1.02] hover:shadow-luxury"
              >
                <Link href={`/store/${store.id}/cast/${cast.slug || cast.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={cast.image}
                      alt={cast.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Status Badge */}
                    <div className="absolute left-3 top-3">
                      <span className="flex items-center gap-1 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-black text-white shadow-lg">
                        本日出勤
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="flex flex-col p-5">
                  <div className="mb-2 flex items-end justify-between">
                    <h3 className="text-lg font-black tracking-tight text-slate-800">
                      {cast.name}
                    </h3>
                    <span className="mb-0.5 text-xs font-bold text-slate-400">
                      {cast.age || 25}歳
                    </span>
                  </div>

                  {/* MBTI & Face */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {cast.mbtiType && (
                      <span className="rounded-full border border-blue-100/50 bg-blue-50 px-2.5 py-0.5 text-[9px] font-bold text-blue-600">
                        {cast.mbtiType}
                      </span>
                    )}
                    {cast.faceType && cast.faceType.length > 0 && (
                      <span className="rounded-full border border-purple-100/50 bg-purple-50 px-2.5 py-0.5 text-[9px] font-bold text-purple-600">
                        {cast.faceType[0]}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mb-4 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-slate-700">
                      {(cast.rating || 5.0).toFixed(1)}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      ({cast.reviewCount || 10})
                    </span>
                  </div>

                  {/* Sexiness & Button */}
                  <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-black uppercase tracking-tighter text-rose-400">
                        SEXINESS:
                      </span>
                      <span className="text-xs">🍓🍓🍓</span>
                    </div>
                    <Link
                      href={`/store/${store.id}/cast/${cast.slug || cast.id}`}
                      className="rounded-full bg-rose-500 p-2 text-white shadow-md shadow-rose-200 transition-transform active:scale-90"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
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
