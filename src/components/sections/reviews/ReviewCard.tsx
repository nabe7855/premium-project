'use client';
import React, { useState } from 'react';
import { Star, User } from 'lucide-react';
import { Review } from '@/types/review';

interface ReviewCardProps {
  review: Review; // DBから変換済みのフロント用Review型
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedText =
    review.comment.length > 150
      ? review.comment.substring(0, 150) + '...'
      : review.comment;

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* キャスト名・日付 */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 overflow-hidden">
          {review.castImage ? (
            <img
              src={review.castImage}
              alt={review.castName || 'キャスト'}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 text-gray-500" />
          )}
        </div>

        <div>
          <p className="text-sm text-pink-600">キャスト: {review.castName}</p>
          <p className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* レーティング */}
      <div className="mb-3 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < review.rating ? 'fill-current text-pink-500' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">
          {review.rating.toFixed(1)}
        </span>
      </div>

      {/* タグ */}
      <div className="mb-3 flex flex-wrap gap-2">
        {review.tags.map((tag, index) => (
          <span
            key={index}
            className="rounded-full border border-pink-200 bg-pink-50 px-2 py-1 text-xs text-pink-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* コメント */}
      <div className="mb-6">
        <p className="font-serif leading-relaxed text-gray-700">
          {isExpanded ? review.comment : truncatedText}
        </p>
        {review.comment.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            {isExpanded ? '閉じる' : 'もっと読む'}
          </button>
        )}
      </div>

      {/* 投稿者名（右下に配置） */}
      <div className="flex justify-end">
        <p className="text-sm text-gray-500">{review.userName}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
