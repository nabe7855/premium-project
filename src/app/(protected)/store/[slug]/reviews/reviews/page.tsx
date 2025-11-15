'use client';

import React from 'react';
import Header from '@/components/sections/reviews/Header';
import ReviewList from '@/components/sections/reviews/ReviewList';
import FAQ from '@/components/sections/reviews/FAQ';

export default function StoreReviewsPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* ✅ storeSlug を渡して ReviewList に任せる */}
        <ReviewList storeSlug={params.slug} />

        <FAQ />
      </main>

      <footer className="mt-12 bg-gray-800 py-8 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="mb-2">© 2024 ストロベリーボーイズ</p>
          <p className="text-sm text-gray-400">
            プライバシーポリシー | 利用規約 | お問い合わせ
          </p>
        </div>
      </footer>
    </div>
  );
}
