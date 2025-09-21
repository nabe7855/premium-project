'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Review } from '@/types/review';

interface CastTabReviewsProps {
  castReviews: Review[];
  isLoadingReviews: boolean;
  onReviewOpen: () => void;
}

const CastTabReviews: React.FC<CastTabReviewsProps> = ({
  castReviews,
  isLoadingReviews,
  onReviewOpen,
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6 pb-24"
      >
        {/* 固定ヘッダー */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-200 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-800">お客様の声</h3>
                <p className="text-sm text-neutral-600 mt-1">
                  {castReviews.length > 0
                    ? `${castReviews.length}件の口コミ`
                    : '口コミはまだありません'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 口コミ本体 */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
          {isLoadingReviews ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-600">口コミを読み込み中...</p>
            </div>
          ) : castReviews.length > 0 ? (
            <div className="space-y-6">
              {castReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-neutral-200 pb-6 last:border-none last:pb-0"
                >
                  {/* 名前 */}
                  <p className="font-semibold text-neutral-800 text-base mb-1">
                    {review.userName}
                  </p>

                  {/* 評価 + 日付 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-lg">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? '' : 'opacity-30'}
                        >
                          🍓
                        </span>
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* コメント */}
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-2">
                    {review.comment}
                  </p>

                  {/* タグ */}
                  {review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 sm:px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs sm:text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="mb-4">
                <MessageCircle className="w-12 sm:w-16 h-12 sm:h-16 text-neutral-300 mx-auto" />
              </div>
              <h4 className="text-base sm:text-lg font-medium text-neutral-600 mb-2">
                まだ口コミがありません
              </h4>
              <p className="text-sm sm:text-base text-neutral-500 mb-4 sm:mb-6">
                最初の口コミを投稿してみませんか？
              </p>
              <button
                onClick={onReviewOpen}
                className="bg-primary text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-primary/90 transition-colors duration-200 text-sm sm:text-base"
              >
                口コミを投稿する
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default CastTabReviews;
