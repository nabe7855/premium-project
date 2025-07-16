'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Star } from 'lucide-react';
import { Review } from '@/types/caststypes';

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
      {/* 本体 */}
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
            <div className="space-y-4 sm:space-y-6">
              {castReviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-neutral-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="flex text-amber-400 mr-2 sm:mr-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              i < review.rating ? 'fill-current' : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-neutral-800 text-sm sm:text-base">
                        {review.author}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-500">{review.date}</span>
                  </div>

                  <p className="text-sm sm:text-base text-neutral-700 mb-3 sm:mb-4 leading-relaxed">
                    {review.comment}
                  </p>

                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 sm:px-3 py-1 bg-secondary text-primary rounded-full text-xs sm:text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
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

      {/* ✅ モバイル画面下に固定ボタン */}
      {!isLoadingReviews && (
        <div className="fixed bottom-20 left-0 right-0 z-50 px-4 sm:hidden">
          <button
            onClick={onReviewOpen}
            className="w-full bg-primary text-white py-3 rounded-full shadow-lg hover:bg-primary/90 transition duration-200 text-sm font-semibold flex items-center justify-center"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            口コミを投稿
          </button>
        </div>
      )}
    </>
  );
};

export default CastTabReviews;
