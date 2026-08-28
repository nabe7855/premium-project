'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { getReviewTags, postReview } from '@/lib/reviewPost';
import { Review } from '@/types/review';
import ReviewCard from '@/components/sections/reviews/ReviewCard';

interface CastTabReviewPageProps {
  castId: string;
  castName?: string;
  storeSlug?: string;
  initialReviews?: Review[];
  reviewCount?: number;
}

interface Tag {
  id: string;
  name: string;
}

const CastTabReviewPage: React.FC<CastTabReviewPageProps> = ({
  castId,
  castName,
  storeSlug,
  initialReviews = [],
  reviewCount = 0,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  const [userAgeGroup, setUserAgeGroup] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [showThanks, setShowThanks] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayReviews = showAllReviews ? initialReviews : initialReviews.slice(0, 5);

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
        userAgeGroup ?? undefined
      );

      setShowThanks(true);

      // 入力リセット
      setRating(0);
      setComment('');
      setSelectedTags([]);
      setNickname('');
      setUserAgeGroup(null);

      setTimeout(() => setShowThanks(false), 4000);
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
    <div className="mx-auto max-w-4xl space-y-8 py-4 px-2 sm:px-4">
      {/* 1. 口コミ一覧セクション */}
      <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-rose-100 pb-4">
          <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-neutral-800 sm:text-xl">
            <MessageCircle className="h-5 w-5 text-pink-500" />
            <span>{castName ? `${castName}さんへの口コミ` : '口コミ'} ({reviewCount}件)</span>
          </h2>
          {storeSlug && (
            <Link
              href={`/store/${storeSlug}/reviews`}
              className="inline-flex items-center gap-1 text-xs font-bold text-pink-600 transition-colors hover:text-pink-700 sm:text-sm"
            >
              <span>店舗全件を見る</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {displayReviews.length > 0 ? (
          <div className="space-y-4">
            {displayReviews.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
            {initialReviews.length > 5 && !showAllReviews && (
              <button
                onClick={() => setShowAllReviews(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-pink-200 bg-pink-50/50 py-3 text-sm font-bold text-pink-600 transition-all hover:bg-pink-100/50"
              >
                <span>さらに口コミを表示する ({initialReviews.length - 5}件)</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/30 p-6 text-center">
            <p className="mb-1 text-sm font-bold text-neutral-700">まだ口コミはありません</p>
            <p className="text-xs text-neutral-500">ご予約・ご利用後に温かいメッセージをお寄せいただけると幸いです💐</p>
          </div>
        )}
      </div>

      {/* 2. 口コミ投稿フォームセクション */}
      <div className="rounded-3xl border border-rose-100 bg-gradient-to-b from-rose-50/40 to-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 border-b border-neutral-200 pb-4">
          <h3 className="text-lg font-bold text-neutral-800 sm:text-xl">口コミを投稿する</h3>
          <p className="mt-1 text-xs text-neutral-500">
            {castName ? `${castName}さんへの心温まる感想をお聞かせください` : 'ご感想をお聞かせください'}
          </p>
        </div>

        {showThanks ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-pink-50 p-8 text-center border border-pink-200">
            <div className="text-base font-bold text-pink-700 sm:text-lg">
              🍓 ご投稿ありがとうございました！
            </div>
            <p className="mt-2 text-xs text-neutral-600">
              お送りいただいた口コミは管理者の確認後に掲載されます。
            </p>
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
                    className="p-1 transition-transform active:scale-90"
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
                className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                placeholder="施術や接客の感想をお聞かせください..."
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
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
                placeholder="匿名希望"
                maxLength={20}
              />
            </div>

            {/* 年代 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                年代（非公開解析用）
              </label>
              <select
                value={userAgeGroup ?? ''}
                onChange={(e) => setUserAgeGroup(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all"
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
            {availableTags.length > 0 && (
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
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        selectedTags.includes(tag.id)
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-pink-50'
                      }`}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 送信ボタン */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className={`w-full py-3.5 rounded-full font-bold text-sm shadow-md transition-all ${
                  isSubmitting || rating === 0
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 active:scale-[0.99]'
                }`}
              >
                {isSubmitting ? '⏳ 投稿中...' : '🍓 口コミを送信する ✈️'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CastTabReviewPage;
