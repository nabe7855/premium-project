'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { getReviewTags, postReview } from '@/lib/reviews';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;   // ✅ 投稿成功時に親へ通知
  castId: string;
  castName?: string;
}

interface Tag {
  id: string;
  name: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
  castId,
  castName,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [showThanks, setShowThanks] = useState(false);

  // タグ一覧を取得
  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          const tags = await getReviewTags();
          setAvailableTags(tags);
        } catch (err) {
          console.error('❌ タグ取得エラー', err);
        }
      })();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('評価を選択してください');
      return;
    }

    setIsSubmitting(true);

    try {
      await postReview(
        castId,
        nickname || '匿名希望',
        rating,
        comment,
        selectedTags
      );

      // ✅ 投稿成功
      onSubmitted?.();
      setShowThanks(true);

      // 入力リセット
      setRating(0);
      setComment('');
      setSelectedTags([]);
      setNickname('');

      // 3秒後に閉じる
      setTimeout(() => {
        setShowThanks(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('❌ 口コミ投稿エラー:', error);
      alert('口コミの投稿に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* 背景 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* モーダル */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl flex flex-col max-h-[90vh] z-[10000]"
        >
          {/* Header */}
          <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-800">口コミを投稿</h2>
              {castName && (
                <p className="mt-1 text-sm text-neutral-600">キャスト: {castName}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* サンクスメッセージ */}
          {showThanks ? (
            <div className="flex flex-1 items-center justify-center text-center p-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="text-base sm:text-lg font-medium text-neutral-700"
              >
                🍓 ご投稿ありがとうございます！
              </motion.div>
            </div>
          ) : (
            /* フォーム */
            <form
              id="review-form"
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
            >
              {/* 評価（🍓） */}
              <div>
                <label className="mb-3 block text-sm font-medium text-neutral-700">
                  評価 <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2 text-2xl sm:text-3xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      {star <= rating ? '🍓' : '⚪'}
                    </button>
                  ))}
                </div>
              </div>

              {/* コメント */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  コメント
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="サービスの感想をお聞かせください..."
                />
              </div>

              {/* ニックネーム */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  ニックネーム（任意）
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  placeholder="匿名希望"
                  maxLength={20}
                />
              </div>

              {/* タグ */}
              <div>
                <label className="mb-3 block text-sm font-medium text-neutral-700">
                  タグ（複数選択可）
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                        selectedTags.includes(tag.id)
                          ? 'bg-primary text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-28" />
            </form>
          )}

          {/* 右下のFAB送信ボタン */}
          {!showThanks && (
            <button
              type="submit"
              form="review-form"
              disabled={isSubmitting || rating === 0}
              className={`fixed bottom-24 right-6 z-[10001] flex items-center justify-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all ${
                isSubmitting || rating === 0
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isSubmitting ? (
                <>⏳ 投稿中...</>
              ) : (
                <>
                  🍓 <span className="font-semibold">送信</span> ✈️
                </>
              )}
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;
