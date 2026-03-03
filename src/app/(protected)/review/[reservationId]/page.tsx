'use client';

import { fetchReviewTags, getReservationForReview, saveReview } from '@/lib/actions/review';
import { AlertCircle, CheckCircle, HeartIcon, MessageCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AGE_GROUPS = [
  { label: '10代', value: 1 },
  { label: '20代', value: 2 },
  { label: '30代', value: 3 },
  { label: '40代', value: 4 },
  { label: '50代以上', value: 5 },
];

export default function ReviewPage() {
  const params = useParams();
  const reservationId = params.reservationId as string;

  const [step, setStep] = useState<'form' | 'done'>('form');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationInfo, setReservationInfo] = useState<{
    customerName: string;
    castId: string;
    castName: string;
  } | null>(null);
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [ageGroup, setAgeGroup] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const init = async () => {
      const [info, tagList] = await Promise.all([
        getReservationForReview(reservationId),
        fetchReviewTags(),
      ]);
      if (!info) {
        toast.error('予約情報が見つかりません');
      } else {
        setReservationInfo(info);
        setNickname(info.customerName);
      }
      setTags(tagList);
      setIsLoading(false);
    };
    init();
  }, [reservationId]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (rating === 0) errs.rating = '評価を選択してください';
    if (!title.trim()) errs.title = 'タイトルは必須です';
    if (comment.trim().length < 10) errs.comment = '10文字以上で入力してください';
    if (!isAnonymous && !nickname.trim()) errs.nickname = 'ニックネームを入力してください';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !reservationInfo) return;
    setIsSubmitting(true);

    const result = await saveReview({
      reservationId,
      castId: reservationInfo.castId,
      userName: isAnonymous ? '匿名希望' : nickname,
      rating,
      title,
      comment,
      tagIds: selectedTagIds,
      userAgeGroup: ageGroup,
    });

    setIsSubmitting(false);

    if (result.success) {
      setStep('done');
    } else {
      toast.error('投稿に失敗しました: ' + result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-rose-400" />
          <p className="text-sm text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!reservationInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-white p-4">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <p className="font-bold text-gray-700">この口コミフォームは無効です</p>
          <p className="mt-2 text-sm text-gray-400">
            URLをご確認いただくか、スタッフにお問い合わせください。
          </p>
        </div>
      </div>
    );
  }

  // 完了画面
  if (step === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-white p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl shadow-rose-100">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-rose-100">
            <HeartIcon className="h-12 w-12 text-rose-500" fill="currentColor" />
          </div>
          <h2 className="mb-3 text-2xl font-black text-rose-600">ありがとうございます！</h2>
          <p className="mb-6 leading-relaxed text-gray-600">
            口コミを投稿いただきありがとうございます。
            <br />
            いただいたご感想は、より良いサービスのために活用させていただきます。
          </p>
          <div className="flex justify-center gap-1 text-2xl">
            {Array.from({ length: rating }).map((_, i) => (
              <span key={i}>🍓</span>
            ))}
          </div>
          <p className="mt-6 text-xs text-gray-300">またのご利用をお待ちしております。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500 shadow-lg shadow-rose-200">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-800">口コミを投稿する</h1>
          <p className="mt-2 text-sm text-gray-500">
            担当キャスト：
            <span className="font-bold text-rose-500">{reservationInfo.castName || '未設定'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ⭐ 評価 */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <label className="mb-3 block text-sm font-bold text-gray-700">
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
                  className="text-4xl transition-transform hover:scale-110"
                >
                  <span
                    className={(hoverRating || rating) >= star ? 'text-rose-400' : 'text-gray-200'}
                  >
                    🍓
                  </span>
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-3 text-sm font-bold text-rose-500">{rating}つ星</span>
              )}
            </div>
            {errors.rating && (
              <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                <AlertCircle size={12} /> {errors.rating}
              </p>
            )}
          </div>

          {/* 🏷 タグ */}
          {tags.length > 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <label className="mb-3 block text-sm font-bold text-gray-700">
                当てはまるものを選択（複数可）
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
                      selectedTagIds.includes(tag.id)
                        ? 'border-rose-400 bg-rose-50 text-rose-600'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-rose-200'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 📝 タイトル・コメント */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold text-gray-700">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={50}
                placeholder="例：素晴らしい時間でした"
                className={`w-full rounded-xl border-2 px-4 py-3 text-sm transition-colors focus:border-rose-400 focus:outline-none ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              <div className="mt-1 flex justify-between">
                {errors.title && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.title}
                  </p>
                )}
                <span className="ml-auto text-xs text-gray-400">{title.length}/50</span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                口コミ内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                maxLength={500}
                placeholder="具体的な体験や感想をお聞かせください。他のお客様の参考になります。（10文字以上）"
                className={`w-full resize-none rounded-xl border-2 px-4 py-3 text-sm transition-colors focus:border-rose-400 focus:outline-none ${
                  errors.comment ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              <div className="mt-1 flex justify-between">
                {errors.comment && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.comment}
                  </p>
                )}
                <span className="ml-auto text-xs text-gray-400">{comment.length}/500</span>
              </div>
            </div>
          </div>

          {/* 👤 投稿者情報 */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <label className="mb-3 block text-sm font-bold text-gray-700">投稿者設定</label>
            <div className="mb-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsAnonymous(true)}
                className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all ${
                  isAnonymous
                    ? 'border-rose-400 bg-rose-50 text-rose-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                匿名で投稿
              </button>
              <button
                type="button"
                onClick={() => setIsAnonymous(false)}
                className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold transition-all ${
                  !isAnonymous
                    ? 'border-rose-400 bg-rose-50 text-rose-600'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                名前を表示
              </button>
            </div>
            {!isAnonymous && (
              <div className="mb-4">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="表示名（ニックネーム可）"
                  className={`w-full rounded-xl border-2 px-4 py-3 text-sm focus:border-rose-400 focus:outline-none ${
                    errors.nickname ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.nickname && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                    <AlertCircle size={12} /> {errors.nickname}
                  </p>
                )}
              </div>
            )}

            {/* 年代 */}
            <label className="mb-2 block text-xs font-bold text-gray-500">年代（任意）</label>
            <div className="flex gap-2">
              {AGE_GROUPS.map((ag) => (
                <button
                  key={ag.value}
                  type="button"
                  onClick={() => setAgeGroup(ageGroup === ag.value ? undefined : ag.value)}
                  className={`flex-1 rounded-lg border py-1.5 text-[10px] font-bold transition-all ${
                    ageGroup === ag.value
                      ? 'border-rose-400 bg-rose-50 text-rose-600'
                      : 'border-gray-100 bg-gray-50 text-gray-400'
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
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 py-4 font-black text-white shadow-lg shadow-rose-200 transition-all hover:bg-rose-600 active:scale-[0.98] disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                投稿中...
              </>
            ) : (
              <>
                <CheckCircle size={18} /> 口コミを投稿する
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-gray-400">
            投稿内容は確認後、掲載される場合があります。
          </p>
        </form>
      </div>
    </div>
  );
}
