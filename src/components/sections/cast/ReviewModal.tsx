'use client';
import React, { useState } from 'react';
import { X, MessageCircle, AlertCircle } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  castName: string;
}

interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  tags: string[];
  nickname: string;
  isAnonymous: boolean;
}

interface ReviewFormErrors {
  rating?: string;
  title?: string;
  comment?: string;
  nickname?: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, castName }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: '',
    comment: '',
    tags: [],
    nickname: '',
    isAnonymous: true,
  });

  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [, setIsSubmitting] = useState(false);

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  const handleInputChange = (field: keyof ReviewFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ReviewFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ReviewFormErrors = {};
    if (formData.rating === 0) newErrors.rating = '評価を選択してください';
    if (!formData.title.trim()) newErrors.title = 'タイトルは必須です';
    if (!formData.comment.trim()) {
      newErrors.comment = '口コミ内容は必須です';
    } else if (formData.comment.length < 10) {
      newErrors.comment = '10文字以上で入力してください';
    }
    if (!formData.isAnonymous && !formData.nickname.trim()) {
      newErrors.nickname = 'ニックネームを入力してください';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('口コミを投稿しました。ありがとうございます！');
      onClose();
      setFormData({
        rating: 0,
        title: '',
        comment: '',
        tags: [],
        nickname: '',
        isAnonymous: true,
      });
    } catch (error) {
      alert('投稿に失敗しました。しばらく経ってから再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* 背景 */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* モーダル本体 */}
      <div className="z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-800">口コミを投稿</h2>
              <p className="mt-1 text-sm text-neutral-600">キャスト: {castName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label="閉じる"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* フォーム */}
        <div className="max-h-[calc(90vh-80px)] space-y-6 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            {/* 評価 */}
            <div>
              <label className="mb-3 block text-sm font-medium text-neutral-700">
                総合評価<span className="ml-1 text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="text-3xl transition-transform duration-200 hover:scale-110"
                  >
                    <span className={star <= formData.rating ? 'text-primary' : 'text-neutral-300'}>
                      🍓
                    </span>
                  </button>
                ))}
                <span className="ml-4 text-sm text-neutral-600">
                  {formData.rating > 0 && `${formData.rating}つ星`}
                </span>
              </div>
              {errors.rating && (
                <p className="mt-1 flex items-center text-sm text-red-500">
                  <AlertCircle className="mr-1 h-4 w-4" />
                  {errors.rating}
                </p>
              )}
            </div>

            {/* タイトル */}
            <div>
              <label className="mb-2 flex items-center text-sm font-medium text-neutral-700">
                <MessageCircle className="mr-2 h-4 w-4" />
                タイトル<span className="ml-1 text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`focus:ring-primary/20 w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-neutral-200'
                }`}
                placeholder="例：心から癒される素晴らしい時間でした"
                maxLength={50}
              />
              <div className="mt-1 flex justify-between">
                {errors.title && (
                  <p className="flex items-center text-sm text-red-500">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    {errors.title}
                  </p>
                )}
                <p className="ml-auto text-xs text-neutral-500">{formData.title.length}/50</p>
              </div>
            </div>

            {/* コメント */}
            <div>
              <label className="mb-2 flex items-center text-sm font-medium text-neutral-700">
                <MessageCircle className="mr-2 h-4 w-4" />
                口コミ内容<span className="ml-1 text-red-500">*</span>
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                rows={6}
                className={`focus:ring-primary/20 w-full resize-none rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 ${
                  errors.comment ? 'border-red-300 bg-red-50' : 'border-neutral-200'
                }`}
                placeholder="具体的な体験や感想をお聞かせください。他のお客様の参考になります。"
                maxLength={500}
              />
              <div className="mt-1 flex justify-between">
                {errors.comment && (
                  <p className="flex items-center text-sm text-red-500">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    {errors.comment}
                  </p>
                )}
                <p className="ml-auto text-xs text-neutral-500">{formData.comment.length}/500</p>
              </div>
            </div>

            {/* 他の入力欄や送信ボタンなどはここに追加でOK */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
