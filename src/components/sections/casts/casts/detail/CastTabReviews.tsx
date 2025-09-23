'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getReviewTags, postReview } from '@/lib/reviewPost';

interface CastTabReviewPageProps {
  castId: string;
  castName?: string;
  storeSlug?: string;
}

interface Tag {
  id: string;
  name: string;
}

const CastTabReviewPage: React.FC<CastTabReviewPageProps> = ({ castId, castName, storeSlug }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  const [userAgeGroup, setUserAgeGroup] = useState<number | null>(null); // 👈 年代
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [showThanks, setShowThanks] = useState(false);

  // タグ一覧を取得
  useEffect(() => {
    (async () => {
      try {
        const tags = await getReviewTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error('❌ タグ取得エラー', err);
      }
    })();
  }, []);

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
        selectedTags,
        userAgeGroup ?? undefined // 👈 年代を渡す
      );

      setShowThanks(true);

      // 入力リセット
      setRating(0);
      setComment('');
      setSelectedTags([]);
      setNickname('');
      setUserAgeGroup(null);

      setTimeout(() => setShowThanks(false), 3000);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl p-6">
        {/* Header */}
        <div className="border-b border-neutral-200 pb-4 mb-4">
          <h2 className="text-xl font-bold text-neutral-800">口コミを投稿</h2>
          {castName && (
            <p className="mt-1 text-sm text-neutral-600">キャスト: {castName}</p>
          )}
        </div>

        {showThanks ? (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="text-base sm:text-lg font-medium text-neutral-700">
              🍓 ご投稿ありがとうございます！
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 評価 */}
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

            {/* 年代（解析用） */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                年代（解析用・非表示）
              </label>
              <select
                value={userAgeGroup ?? ''}
                onChange={(e) => setUserAgeGroup(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
              >
                <option value="">選択してください</option>
                <option value="10">10代</option>
                <option value="20">20代</option>
                <option value="30">30代</option>
                <option value="40">40代</option>
                <option value="50">50代</option>
                <option value="60">60代以上</option>
              </select>
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

            {/* 送信ボタン */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className={`w-full py-3 rounded-full shadow-md transition-all ${
                  isSubmitting || rating === 0
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isSubmitting ? '⏳ 投稿中...' : '🍓 送信 ✈️'}
              </button>
            </div>
          </form>
        )}

        {/* 口コミ一覧ページへリンク */}
        {storeSlug && (
          <div className="mt-8 text-center">
            <Link
              href={`/store/${storeSlug}/reviews/reviews`}
              className="inline-block rounded-full bg-pink-500 px-6 py-3 text-white font-medium shadow-md hover:bg-pink-600 transition-all"
            >
              📖 口コミ一覧を見る
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CastTabReviewPage;
