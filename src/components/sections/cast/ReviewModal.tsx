'use client';
import { getReviewTags, postReview } from '@/lib/reviewPost';
import { AlertCircle, MessageCircle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  castName: string;
  castId: string;
}

interface Tag {
  id: string;
  name: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, castName, castId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [userAgeGroup, setUserAgeGroup] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // タグ一覧を取得
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const tags = await getReviewTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error('❌ タグ取得エラー', err);
      }
    })();
  }, [isOpen]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (rating === 0) errs.rating = '評価を選択してください';
    if (!title.trim()) errs.title = 'タイトルは必須です';
    if (comment.trim().length < 10) errs.comment = '10文字以上で入力してください';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      await postReview(
        castId,
        isAnonymous ? '匿名希望' : nickname || '匿名希望',
        rating,
        `【${title}】\n${comment}`,
        selectedTags,
        userAgeGroup ?? undefined,
      );

      setShowThanks(true);
      // リセット
      setRating(0);
      setTitle('');
      setComment('');
      setSelectedTags([]);
      setNickname('');
      setIsAnonymous(true);
      setUserAgeGroup(null);
      setErrors({});

      setTimeout(() => {
        setShowThanks(false);
        onClose();
      }, 2500);
    } catch (error) {
      console.error('❌ 口コミ投稿エラー:', error);
      alert('口コミの投稿に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      {/* 背景 */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* モーダル本体 */}
      <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 border-b border-neutral-100 bg-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-800">口コミを投稿</h2>
              <p className="mt-0.5 text-sm text-neutral-500">キャスト: {castName}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
              aria-label="閉じる"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="max-h-[calc(92vh-76px)] overflow-y-auto">
          {showThanks ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-4xl">
                🍓
              </div>
              <p className="text-lg font-bold text-neutral-800">投稿ありがとうございます！</p>
              <p className="mt-2 text-sm text-neutral-500">口コミが送信されました</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              {/* ⭐ 評価 */}
              <div>
                <label className="mb-3 block text-sm font-bold text-neutral-700">
                  総合評価 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl transition-transform hover:scale-110"
                    >
                      <span
                        className={
                          (hoverRating || rating) >= star ? 'text-rose-500' : 'text-neutral-200'
                        }
                      >
                        🍓
                      </span>
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm font-bold text-rose-500">{rating}つ星</span>
                  )}
                </div>
                {errors.rating && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.rating}
                  </p>
                )}
              </div>

              {/* 🏷 タグ */}
              {availableTags.length > 0 && (
                <div>
                  <label className="mb-3 block text-sm font-bold text-neutral-700">
                    当てはまるものを選択（複数可）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                          selectedTags.includes(tag.id)
                            ? 'border-rose-400 bg-rose-50 text-rose-600'
                            : 'border-neutral-200 bg-white text-neutral-600 hover:border-rose-200'
                        }`}
                      >
                        #{tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 📝 タイトル */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-neutral-700">
                  <MessageCircle size={14} />
                  タイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-sm transition-colors focus:outline-none ${
                    errors.title
                      ? 'border-red-300 bg-red-50'
                      : 'border-neutral-200 focus:border-rose-400'
                  }`}
                  placeholder="例：心から癒された素晴らしい時間でした"
                  maxLength={50}
                />
                <div className="mt-1 flex justify-between">
                  {errors.title && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle size={12} /> {errors.title}
                    </p>
                  )}
                  <span className="ml-auto text-xs text-neutral-400">{title.length}/50</span>
                </div>
              </div>

              {/* コメント */}
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-sm font-bold text-neutral-700">
                  <MessageCircle size={14} />
                  口コミ内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className={`w-full resize-none rounded-xl border-2 px-4 py-3 text-sm transition-colors focus:outline-none ${
                    errors.comment
                      ? 'border-red-300 bg-red-50'
                      : 'border-neutral-200 focus:border-rose-400'
                  }`}
                  placeholder="具体的な体験や感想をお聞かせください。（10文字以上）"
                  maxLength={500}
                />
                <div className="mt-1 flex justify-between">
                  {errors.comment && (
                    <p className="flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle size={12} /> {errors.comment}
                    </p>
                  )}
                  <span className="ml-auto text-xs text-neutral-400">{comment.length}/500</span>
                </div>
              </div>

              {/* 👤 投稿者 */}
              <div className="rounded-2xl bg-neutral-50 p-4">
                <p className="mb-3 text-sm font-bold text-neutral-700">投稿者設定</p>
                <div className="mb-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(true)}
                    className={`flex-1 rounded-xl border-2 py-2.5 text-xs font-bold transition-all ${
                      isAnonymous
                        ? 'border-rose-400 bg-rose-50 text-rose-600'
                        : 'border-neutral-200 bg-white text-neutral-500'
                    }`}
                  >
                    匿名で投稿
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(false)}
                    className={`flex-1 rounded-xl border-2 py-2.5 text-xs font-bold transition-all ${
                      !isAnonymous
                        ? 'border-rose-400 bg-rose-50 text-rose-600'
                        : 'border-neutral-200 bg-white text-neutral-500'
                    }`}
                  >
                    名前を表示
                  </button>
                </div>
                {!isAnonymous && (
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="ニックネーム"
                    maxLength={20}
                    className="mb-3 w-full rounded-xl border-2 border-neutral-200 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none"
                  />
                )}
                {/* 年代 */}
                <div className="flex gap-1.5">
                  {[
                    { label: '10代', value: 10 },
                    { label: '20代', value: 20 },
                    { label: '30代', value: 30 },
                    { label: '40代', value: 40 },
                    { label: '50代+', value: 50 },
                  ].map((ag) => (
                    <button
                      key={ag.value}
                      type="button"
                      onClick={() => setUserAgeGroup(userAgeGroup === ag.value ? null : ag.value)}
                      className={`flex-1 rounded-lg py-1.5 text-[10px] font-bold transition-all ${
                        userAgeGroup === ag.value
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      {ag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className={`w-full rounded-2xl py-4 font-black text-white shadow-lg transition-all active:scale-[0.98] ${
                  isSubmitting || rating === 0
                    ? 'cursor-not-allowed bg-neutral-300'
                    : 'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    投稿中...
                  </span>
                ) : (
                  '🍓 口コミを投稿する'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
