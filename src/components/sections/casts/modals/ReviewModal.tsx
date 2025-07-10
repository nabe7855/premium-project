'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  castName?: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, castName }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = [
    '癒された',
    'また会いたい',
    'プロ意識',
    '時間を忘れる',
    'リラックス',
    '特別な時間',
    '記念日に利用',
    '新人',
    'エネルギッシュ',
    '楽しい',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('評価を選択してください');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: 実際のAPI呼び出しに置き換え
      // await createReview({
      //   castId: cast.id,
      //   rating,
      //   comment,
      //   tags: selectedTags,
      //   author: nickname
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert('口コミを投稿しました。ありがとうございます！');
      onClose();
      setRating(0);
      setComment('');
      setSelectedTags([]);
      setNickname('');
    } catch (error) {
      console.error('口コミ投稿エラー:', error);
      alert('口コミの投稿に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
    setNickname('');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl"
          >
            {/* Header */}
            <div className="border-b border-neutral-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-800">口コミを投稿</h2>
                  {castName && (
                    <p className="mt-1 text-sm text-neutral-600">キャスト: {castName}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-400 transition-colors duration-200 hover:text-neutral-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* Rating */}
              <div>
                <label className="mb-3 block text-sm font-medium text-neutral-700">
                  評価 <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating ? 'fill-current text-amber-400' : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">コメント</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="サービスの感想をお聞かせください..."
                />
              </div>

              {/* Nickname */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  ニックネーム（任意）
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="匿名希望"
                  maxLength={20}
                />
                <p className="mt-1 text-xs text-neutral-500">
                  未入力の場合は「匿名希望」として投稿されます
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="mb-3 block text-sm font-medium text-neutral-700">
                  タグ（複数選択可）
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-full px-3 py-1 text-sm font-medium transition-all duration-200 ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="flex w-full items-center justify-center rounded-xl bg-red-500 py-3 font-medium text-white transition-all duration-200 hover:bg-red-600 disabled:bg-neutral-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    投稿中...
                  </>
                ) : (
                  '口コミを投稿'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;
