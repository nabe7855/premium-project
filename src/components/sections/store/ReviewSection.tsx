'use client';

import { useStore } from '@/contexts/StoreContext';
import type { Review } from '@/types/store'; // または '@/types/store'
import { Calendar, Star, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReviewSectionProps {
  storeSlug?: string;
}

export default function ReviewSection({ storeSlug }: ReviewSectionProps) {
  const { store } = useStore();
  const slug = storeSlug || store?.slug || 'fukuoka';

  const [reviews, setReviews] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<string>('0.0');
  const [currentReview, setCurrentReview] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const theme = store?.theme || { gradient: 'from-blue-500 to-indigo-600' };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { getReviewsByStore } = await import('@/lib/getReviewsByStore');
        const res = await getReviewsByStore(slug, { limit: 10, offset: 0 });
        setReviews(res.reviews || []);
        setTotalCount(res.totalCount || 0);
        setAverageRating(res.averageRating || '0.0');
      } catch (err) {
        console.error('ReviewSection fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [slug]);

  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  if (isLoading || reviews.length === 0) {
    return null;
  }

  // 🚀 実データ全件からの動的計算（店舗の総件数が20件以上の場合のみ表示）
  // 丸めルール: 小数第1位で四捨五入（例: 福岡店 153/32=4.78125 -> 4.8、横浜店 1532/310=4.9419 -> 4.9）
  const showStats = totalCount >= 20;
  const avgRating = showStats ? averageRating : null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">お客様の声</h2>
          <p className="text-lg text-gray-600">実際にご利用いただいたお客様からの嬉しいお声</p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="flex min-h-[300px] flex-col justify-center rounded-3xl bg-white p-8 shadow-xl md:p-12">
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                {renderStars(reviews[currentReview].rating)}
              </div>
              <blockquote className="mb-6 text-xl italic leading-relaxed text-gray-800 md:text-2xl">
                "{reviews[currentReview].comment}"
              </blockquote>
              <div className="flex items-center justify-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{reviews[currentReview].userName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(reviews[currentReview].createdAt).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}</span>
                </div>
              </div>
              {reviews[currentReview].service && (
                <div className="mt-2 text-sm text-gray-500">
                  ご利用プラン: {reviews[currentReview].service}
                </div>
              )}
            </div>
          </div>

          {/* Review Navigation Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {reviews.map((_: Review, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                aria-label={`${index + 1}番目のレビューを表示`}
                className={`h-3 w-3 rounded-full transition-colors ${
                  index === currentReview ? `bg-gradient-to-r ${theme.gradient}` : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 🚀 動的統計表示（20件以上の場合のみ実数をDOM出力し、20件未満は完全非表示） */}
        {showStats && (
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-2 max-w-xl mx-auto">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">{avgRating}</div>
              <div className="text-gray-600">平均評価</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-gray-800 md:text-4xl">{totalCount}件</div>
              <div className="text-gray-600">レビュー数</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
