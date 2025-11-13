'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  castName?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  datetime: string;
  usageStatus: string;
  meetingPlace: string;
  course: string;
  nomination: string;
  outfit: string;
  discount: string;
  notes: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, castName }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    datetime: '',
    usageStatus: '',
    meetingPlace: '',
    course: '',
    nomination: '',
    outfit: '',
    discount: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = 'お名前は必須です';
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = '正しいメールアドレスを入力してください（半角英数）';
    }
    if (!formData.datetime.trim()) newErrors.datetime = 'ご利用希望日時は必須です';
    if (!formData.usageStatus) newErrors.usageStatus = '利用状況を選択してください';
    if (!formData.course) newErrors.course = 'コースを選択してください';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    // TODO: Submit API連携

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-800">ご予約フォーム</h2>
              {castName && <p className="mt-1 text-sm text-neutral-600">キャスト: {castName}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-600"
              aria-label="閉じる"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* フォーム本体 */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium">お名前</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">メールアドレス</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">電話番号</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">ご利用希望日時</label>
            <input
              type="datetime-local"
              name="datetime"
              value={formData.datetime}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
            {errors.datetime && <p className="text-sm text-red-500">{errors.datetime}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">利用状況</label>
            <select
              name="usageStatus"
              value={formData.usageStatus}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            >
              <option value="">選択してください</option>
              <option value="first">初めてのご利用</option>
              <option value="repeat">リピーター</option>
            </select>
            {errors.usageStatus && <p className="text-sm text-red-500">{errors.usageStatus}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">コース</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            >
              <option value="">選択してください</option>
              <option value="60min">60分</option>
              <option value="90min">90分</option>
              <option value="120min">120分</option>
            </select>
            {errors.course && <p className="text-sm text-red-500">{errors.course}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">ご指名</label>
            <input
              type="text"
              name="nomination"
              value={formData.nomination}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">衣装リクエスト</label>
            <input
              type="text"
              name="outfit"
              value={formData.outfit}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">割引コード</label>
            <input
              type="text"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">その他ご要望</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
              rows={4}
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 disabled:opacity-50"
            >
              {isSubmitting ? '送信中...' : '予約を確定'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
