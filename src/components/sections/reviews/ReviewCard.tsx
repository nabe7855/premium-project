'use client';
import React, { useState } from 'react';
import { Star, User, Clock, ThumbsUp } from 'lucide-react';
import { Review } from '@/types/review';

interface ReviewCardProps {
  review: Review; // DBから変換済みのフロント用Review型
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0); // 👍 DBにlikeCountがないので仮で0から

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const truncatedText =
    review.comment.length > 150
      ? review.comment.substring(0, 150) + '...'
      : review.comment;

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* ユーザー名・キャスト名・日付 */}
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
          <h3 className="font-medium text-gray-800">{review.userName}</h3>
          {/* キャスト名追加 */}
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
      <div className="mb-4">
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
        <div className="mt-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">投稿ID: {review.id}</span>
        </div>
      </div>

      {/* いいね */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            isLiked
              ? 'border border-pink-200 bg-pink-100 text-pink-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm">参考になった ({likes})</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
