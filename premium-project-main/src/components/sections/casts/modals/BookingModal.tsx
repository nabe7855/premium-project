'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Calendar, Clock, CreditCard } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  castName?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, castName }) => {
  const [formData, setFormData] = useState({
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert('予約申し込みを受け付けました。確認メールをお送りしますので、しばらくお待ちください。');
    onClose();
    setIsSubmitting(false);
    setFormData({
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
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-neutral-800">ご予約フォーム</h2>
                  {castName && (
                    <p className="mt-1 text-sm text-neutral-600">キャスト: {castName}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-400 transition-colors duration-200 hover:text-neutral-600"
                  aria-label="閉じる"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {/* お名前 */}
                <div>
                  <label className="mb-2 flex items-center text-sm font-medium text-neutral-700">
                    <User className="mr-2 h-4 w-4" />
                    合流時のお名前 <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    placeholder="偽名OK"
                    required
                  />
                </div>

                {/* メールアドレス */}
                <div>
                  <label className="mb-2 flex items-center text-sm font-medium text-neutral-700">
                    <Mail className="mr-2 h-4 w-4" />
                    ご連絡先メールアドレス <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    placeholder="example@email.com（半角英数）"
                    required
                  />
                </div>

                {/* 利用希望日時 */}
                <div>
                  <label className="mb-2 flex items-center text-sm font-medium text-neutral-700">
                    <Calendar className="mr-2 h-4 w-4" />
                    ご利用希望日時 <span className="ml-1 text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.datetime}
                    onChange={(e) => handleInputChange('datetime', e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    placeholder="例：第1希望 10/5 15時　第2希望 10/6 10時～17時"
                    required
                  />
                </div>

                {/* 利用状況 */}
                <div>
                  <label className="mb-2 flex items-center text-sm font-medium text-neutral-700">
                    <Clock className="mr-2 h-4 w-4" />
                    当店の利用状況 <span className="ml-1 text-red-500">*</span>
                  </label>
                  <select
                    value={formData.usageStatus}
                    onChange={(e) => handleInputChange('usageStatus', e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="初回利用">初回利用</option>
                    <option value="2回目">2回目</option>
                    <option value="3回目以上">3回目以上</option>
                    <option value="リピーター（月1回程度）">リピーター（月1回程度）</option>
                    <option value="リピーター（月2回以上）">リピーター（月2回以上）</option>
                  </select>
                </div>

                {/* 希望コース */}
                <div>
                  <label className="mb-2 flex items-center text-sm font-medium text-neutral-700">
                    <CreditCard className="mr-2 h-4 w-4" />
                    希望コース <span className="ml-1 text-red-500">*</span>
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="初回限定120分コース（特別価格）">
                      初回限定120分コース（特別価格）
                    </option>
                    <option value="90分スタンダードコース">90分スタンダードコース</option>
                    <option value="120分プレミアムコース">120分プレミアムコース</option>
                    <option value="180分ラグジュアリーコース">180分ラグジュアリーコース</option>
                    <option value="240分VIPコース">240分VIPコース</option>
                    <option value="カスタムコース（要相談）">カスタムコース（要相談）</option>
                  </select>
                  <p className="mt-1 text-sm text-red-500">
                    初回の方は初回限定120分コースがとてもお得です
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center rounded-xl bg-red-500 py-4 font-medium text-white transition-all duration-200 hover:bg-red-600 disabled:bg-neutral-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                        送信中...
                      </>
                    ) : (
                      '予約申し込みを送信'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
