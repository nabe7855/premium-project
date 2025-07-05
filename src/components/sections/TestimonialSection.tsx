'use client';
import React from 'react';
import { Heart } from 'lucide-react';
import { TestimonialCarousel } from '@/components/sections/store/TestimonialCarousel';

const sampleTestimonials = [
  {
    id: '1',

    content:
      'このサービスを使い始めてから、作業効率が格段に向上しました。チーム全体の生産性が30%もアップしています。',
    rating: 5,
  },
  {
    id: '2',

    content:
      '直感的なインターフェースで、学習コストが非常に低いです。新しいメンバーもすぐに使いこなせています。',
    rating: 5,
  },
  {
    id: '3',

    content:
      'デザインが美しく、機能性も抜群です。クライアントからの評価も上がり、仕事の幅が広がりました。',
    rating: 5,
  },
];

export const TestimonialSection = () => {
  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          <Heart className="h-6 w-6 text-pink-600" />
          お客様の声
        </h2>
        <p className="text-gray-600">たくさんのご好評いただいています。</p>
      </div>

      <TestimonialCarousel
        testimonials={sampleTestimonials}
        displayDuration={5000}
        fadeTransition={500}
        className="mx-auto max-w-4xl"
      />
    </section>
  );
};
