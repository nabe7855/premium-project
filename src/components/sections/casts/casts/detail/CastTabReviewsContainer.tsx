'use client';

import { useEffect, useState } from 'react';
import { getCastReviews } from '@/lib/reviews';
import { Review } from '@/types/review';
import CastTabReviews from './CastTabReviews';
import ReviewModal from '@/components/sections/casts/modals/ReviewModal';

export default function CastTabReviewsContainer({
  castId,
  castName,
}: {
  castId: string;
  castName: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ レビュー取得
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await getCastReviews(castId);
      setReviews(data);
    } catch (err) {
      console.error('❌ レビュー取得エラー', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [castId]);

  return (
    <>
      <CastTabReviews
        castReviews={reviews}
        isLoadingReviews={isLoading}
        onReviewOpen={() => setIsModalOpen(true)}
      />

      <ReviewModal
        isOpen={isModalOpen}
        castId={castId}
        castName={castName}
        onClose={() => {
          setIsModalOpen(false);
          fetchReviews(); // ✅ 投稿後に一覧をリロード
        }}
      />
    </>
  );
}
