'use client';

import React, { useState, useMemo } from 'react';
import EmotionFilter from '@/components/sections/reviews/EmotionFilter';
import ReviewCard from '@/components/sections/reviews/ReviewCard';
import { Review } from '@/types/review';

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, loading }) => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('');

  const filteredReviews = useMemo(() => {
    if (!selectedEmotion) return reviews;
    return reviews.filter((review) => review.tags.includes(selectedEmotion));
  }, [reviews, selectedEmotion]);

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion === selectedEmotion ? '' : emotion);
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-12">読み込み中...</p>;
  }

  return (
    <section className="mb-8">
      <EmotionFilter
        onEmotionSelect={handleEmotionSelect}
        selectedEmotion={selectedEmotion}
        onSortChange={(sort) => console.log("ソート:", sort)}   // とりあえず console.log
        onTagChange={(tag) => console.log("タグ:", tag)}       // とりあえず console.log
        tags={[]} 
      />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          口コミ一覧
          {selectedEmotion && (
            <span className="ml-2 text-lg font-normal text-gray-600">
              ({filteredReviews.length}件)
            </span>
          )}
        </h2>
      </div>

      {/* レビュー一覧 */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
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
  );
};

export default ReviewList;
