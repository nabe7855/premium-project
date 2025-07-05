'use client';
import React, { useState } from 'react';
import { Clock, ThumbsUp, User, MapPin, Star } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  ageGroup: string;
  castName: string;
  shopLocation: string;
  rating: number;
  purposeTags: string[];
  reviewText: string;
  postDate: string;
  likeCount: number;
  isVerified: boolean;
  visitCount: string;
  readTime: string;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(review.likeCount);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const truncatedText =
    review.reviewText.length > 150
      ? review.reviewText.substring(0, 150) + '...'
      : review.reviewText;

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-pink-600">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-800">{review.userName}</h3>
              <span className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700">
                {review.ageGroup}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{review.shopLocation}</span>
              <span>•</span>
              <span>{review.postDate}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-1 flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating ? 'fill-current text-pink-500' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-1 text-sm font-medium text-gray-700">
              {review.rating.toFixed(1)}
            </span>
          </div>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
            {review.visitCount}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">キャスト:</span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {review.castName}
          </span>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {review.purposeTags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full border border-pink-200 bg-pink-50 px-2 py-1 text-xs text-pink-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="font-serif leading-relaxed text-gray-700">
          {isExpanded ? review.reviewText : truncatedText}
        </p>
        {review.reviewText.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-medium text-pink-600 hover:text-pink-700"
          >
            {isExpanded ? '閉じる' : 'もっと読む'}
          </button>
        )}
        <div className="mt-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">読了時間: {review.readTime}</span>
        </div>
      </div>

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
        <div className="text-sm text-gray-600">同年代の91%が満足と回答</div>
      </div>
    </div>
  );
};

export default ReviewCard;
