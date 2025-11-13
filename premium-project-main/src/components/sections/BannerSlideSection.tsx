'use client';
import React from 'react';
import { Camera, Megaphone, Sparkles } from 'lucide-react';
import { BannerSlide } from '@/components/sections/store/BannerSlide';

const sampleBanners = [
  {
    id: '1',
    title: '新機能リリース！',
    message: '待望の新機能が利用できるようになりました。今すぐお試しください。',
    type: 'info' as const,
    icon: <Sparkles className="h-5 w-5" />,
    image:
      'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: '新機能のイメージ',
    ctaText: '詳細を見る',
    ctaAction: () => console.log('CTA clicked'),
  },
  {
    id: '2',
    title: '新機能リリース！',
    message: '待望の新機能が利用できるようになりました。今すぐお試しください。',
    type: 'info' as const,
    icon: <Sparkles className="h-5 w-5" />,
    image:
      'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: '誕生日セール',
    ctaText: '詳細を見る',
    ctaAction: () => console.log('CTA clicked'),
  },
  {
    id: '3',
    title: '新機能リリース！',
    message: '待望の新機能が利用できるようになりました。今すぐお試しください。',
    type: 'info' as const,
    icon: <Sparkles className="h-5 w-5" />,
    image:
      'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: '新機能のイメージ',
    ctaText: '詳細を見る',
    ctaAction: () => console.log('CTA clicked'),
  },
  {
    id: '4',
    title: '重要なお知らせ',
    message: '利用規約が更新されました。必ずご確認ください。',
    type: 'warning' as const,
    icon: <Megaphone className="h-5 w-5" />,
    image:
      'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=800',
    imageAlt: '重要なお知らせ',
    ctaText: '確認する',
    ctaAction: () => console.log('Terms clicked'),
  },
];

export const BannerSlideSection = () => {
  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          <Camera className="h-6 w-6 text-blue-600" />
          お知らせ
        </h2>
      </div>

      <BannerSlide
        banners={sampleBanners}
        autoSlide={true}
        slideInterval={4000}
        showControls={true}
        className="mx-auto max-w-4xl"
      />
    </section>
  );
};
