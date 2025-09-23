'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/sections/reviews/Header';
import EmotionFilter from '@/components/sections/reviews/EmotionFilter';
import ReviewCard from '@/components/sections/reviews/ReviewCard';
import PickupReviews from '@/components/sections/reviews/PickupReviews';
import FAQ from '@/components/sections/reviews/FAQ';
import { Review } from '@/types/review';
import { getReviewsByStore } from '@/lib/getReviewsByStore';

export default function StoreReviewsPage({ params }: { params: { slug: string } }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Hydration error 対策: ランダム閲覧人数はクライアントでセット
  const [viewers, setViewers] = useState<number | null>(null);
  useEffect(() => {
    setViewers(Math.floor(Math.random() * 20) + 10);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      console.log('🔎 storeSlug (URLパラメータ):', params.slug);
      const data = await getReviewsByStore(params.slug);
      console.log('📄 フロントで受け取った reviews:', data);
      setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, [params.slug]);

  const filteredReviews = useMemo(() => {
    if (!selectedEmotion) return reviews;
    return reviews.filter((review) => review.tags.includes(selectedEmotion));
  }, [reviews, selectedEmotion]);

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion === selectedEmotion ? '' : emotion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <EmotionFilter
          onEmotionSelect={handleEmotionSelect}
          selectedEmotion={selectedEmotion}
        />

        <PickupReviews />

        <section className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              口コミ一覧
              {selectedEmotion && (
                <span className="ml-2 text-lg font-normal text-gray-600">
                  ({filteredReviews.length}件)
                </span>
              )}
            </h2>
            <div className="text-sm text-gray-600">
              現在 {viewers ?? '-'} 人が閲覧中
            </div>
          </div>

          {/* ローディング */}
          {loading && <p className="text-center text-gray-500 py-12">読み込み中...</p>}

          {/* レビュー一覧 */}
          {!loading && filteredReviews.length > 0 && (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {/* 該当なし */}
          {!loading && filteredReviews.length === 0 && (
            <div className="py-12 text-center">
              <p className="mb-4 text-gray-600">
                選択した条件に該当する口コミが見つかりませんでした。
              </p>
              <button
                onClick={() => setSelectedEmotion('')}
                className="rounded-lg bg-pink-500 px-6 py-2 text-white transition-colors hover:bg-pink-600"
              >
                すべての口コミを表示
              </button>
            </div>
          )}
        </section>

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
