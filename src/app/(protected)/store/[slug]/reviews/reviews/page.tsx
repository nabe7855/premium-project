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

        <div className="py-8 text-center">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              あなたの体験も、誰かの勇気になります
            </h3>
            <p className="mb-6 font-serif text-gray-600">
              素敵な時間を過ごされた後は、ぜひ口コミをお聞かせください。
            </p>
            <button className="rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 px-8 py-3 text-white shadow-md transition-all hover:from-pink-600 hover:to-pink-700">
              口コミを投稿する
            </button>
          </div>
        </div>
      </main>

      <footer className="mt-12 bg-gray-800 py-8 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="mb-2">© 2024 ストロベリーボーイズ</p>
          <p className="text-sm text-gray-400">プライバシーポリシー | 利用規約 | お問い合わせ</p>
        </div>
      </footer>
    </div>
  );
}
