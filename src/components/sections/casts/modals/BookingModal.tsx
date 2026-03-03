'use client';

import { createReservation } from '@/lib/actions/reservation';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, CreditCard, Mail, User, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  castName?: string;
  castId?: string;
  storeId?: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  castName,
  castId,
  storeId,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    datetime: '',
    usageStatus: '',
    meetingPlace: '',
    course: '',
    outfit: '',
    discount: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('>>> [BookingModal] Form Submit Start');
    setIsSubmitting(true);

    try {
      const payload = {
        customerName: formData.name,
        dateTime: formData.datetime,
        visitCount: formData.usageStatus === 'first' ? 1 : 2,
        email: formData.email,
        phone: formData.phone,
        notes: `コース: ${formData.course}\n合流場所: ${formData.meetingPlace}\n指名: ${castName || 'なし'}\n衣装: ${formData.outfit}\n割引: ${formData.discount}\n要望: ${formData.message}`,
        castId: castId,
        storeId: storeId,
      };
      console.log('>>> [BookingModal] Calling createReservation with:', payload);

      const result = await createReservation(payload);
      console.log('>>> [BookingModal] createReservation Result:', result);

      if (result.success) {
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          datetime: '',
          usageStatus: '',
          meetingPlace: '',
          course: '',
          outfit: '',
          discount: '',
          message: '',
        });
      } else {
        console.error('>>> [BookingModal] createReservation ERROR:', result.error);
        toast.error('予約に失敗しました: ' + result.error);
      }
    } catch (error) {
      console.error('>>> [BookingModal] Unexpected ERROR:', error);
      toast.error('予期せぬエラーが発生しました');
    } finally {
      setIsSubmitting(false);
      console.log('>>> [BookingModal] Form Submit End');
    }
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
                    <p className="mt-1 text-sm text-neutral-600">指名キャスト: {castName}</p>
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

            {/* Content Area */}
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
              {isSuccess ? (
                <div className="flex flex-col items-center p-8 text-center md:p-12">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500 shadow-inner">
                    <Calendar className="h-10 w-10 duration-500 animate-in zoom-in" />
                  </div>

                  <h3 className="mb-4 text-2xl font-black text-gray-800">
                    ご予約リクエストを
                    <br />
                    承りました
                  </h3>

                  <div className="mb-8 space-y-4 text-left text-sm">
                    <div className="flex items-start gap-3 rounded-xl bg-rose-50/50 p-4">
                      <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                      <div>
                        <p className="font-bold text-gray-800">店舗からの連絡をお待ちください</p>
                        <p className="leading-relaxed text-gray-600">
                          ご入力いただいた内容を確認後、店舗スタッフまたはキャストより折り返しご連絡を差し上げます。その連絡をもちまして予約確定となります。
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl bg-blue-50/50 p-4">
                      <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                      <div>
                        <p className="font-bold text-gray-800">確認メールを送信しました</p>
                        <p className="leading-relaxed text-gray-600">
                          自動返信の確認メールをお送りしました。届いていない場合は、迷惑メールフォルダをご確認ください。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    <button
                      onClick={onClose}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 py-4 text-lg font-black text-white shadow-xl transition-all hover:bg-rose-600 hover:shadow-2xl active:scale-95"
                    >
                      閉じる
                    </button>
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
                      <Clock className="h-4 w-4" />
                      迅速な対応を心がけていますが、混雑状況によりお返事が遅れる場合がございます。
                      お店からお返事が遅れている場合、当日ご利用、お急ぎのお客様はお手数をお掛け致しますがお電話にてご連絡を頂けますとスムーズです。
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
                      placeholder="イチゴ"
                      required
                    />
                    <p className="mt-1 text-xs text-neutral-400">偽名OK</p>
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
                      placeholder="example@email.com"
                      required
                    />
                    <p className="mt-1 text-xs text-neutral-400">半角英数</p>
                  </div>

                  {/* 電話番号 */}
                  <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-neutral-700">
                      <Clock className="mr-2 h-4 w-4" />
                      ご連絡先TEL
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      placeholder="090-1234-5678"
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
                      placeholder="例：第1希望 10/5 15時、第2希望 10/6 10時～17時"
                      required
                    />
                  </div>

                  {/* 利用状況 */}
                  <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-neutral-700">
                      当店の利用状況 <span className="ml-1 text-red-500">*</span>
                    </label>
                    <select
                      value={formData.usageStatus}
                      onChange={(e) => handleInputChange('usageStatus', e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      required
                    >
                      <option value="">選択して下さい</option>
                      <option value="first">初めて</option>
                      <option value="second">2回目</option>
                      <option value="multiple">3回目以上</option>
                    </select>
                  </div>

                  {/* 待ち合わせの場所 */}
                  <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-neutral-700">
                      <Calendar className="mr-2 h-4 w-4" />
                      待ち合わせの場所は？
                    </label>
                    <input
                      type="text"
                      value={formData.meetingPlace}
                      onChange={(e) => handleInputChange('meetingPlace', e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      placeholder=""
                    />
                  </div>

                  {/* 希望コース */}
                  <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-neutral-700">
                      希望コース <span className="ml-1 text-red-500">*</span>
                    </label>
                    <p className="mb-3 text-xs text-gray-500">
                      豊富なコースラインナップをご用意しております。お客様のご希望に合わせてお選びください。
                    </p>
                    <select
                      value={formData.course}
                      onChange={(e) => handleInputChange('course', e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      required
                    >
                      <option value="">選択して下さい</option>
                      <optgroup label="基本コース">
                        <option value="基本コース-60分">60分</option>
                        <option value="基本コース-90分">90分</option>
                        <option value="基本コース-120分">120分</option>
                        <option value="基本コース-150分">150分</option>
                        <option value="基本コース-180分">180分</option>
                        <option value="基本コース-240分">240分</option>
                        <option value="基本コース-300分">300分</option>
                      </optgroup>
                      <optgroup label="お泊りコース">
                        <option value="お泊りコース-10時間">10時間</option>
                        <option value="お泊りコース-12時間">12時間</option>
                        <option value="お泊りコース-14時間">14時間</option>
                        <option value="お泊りコース-16時間">16時間</option>
                        <option value="お泊りコース-18時間">18時間</option>
                      </optgroup>
                      <optgroup label="デートコース">
                        <option value="デートコース-180分">180分</option>
                        <option value="デートコース-240分">240分</option>
                        <option value="デートコース-300分">300分</option>
                      </optgroup>
                      <optgroup label="新苺コース">
                        <option value="新苺コース-90分">90分</option>
                      </optgroup>
                      <optgroup label="カップルコース">
                        <option value="カップルコース-60分">60分</option>
                        <option value="カップルコース-90分">90分</option>
                        <option value="カップルコース-120分">120分</option>
                      </optgroup>
                      <optgroup label="3Pコース">
                        <option value="3Pコース-90分">90分</option>
                        <option value="3Pコース-120分">120分</option>
                      </optgroup>
                      <optgroup label="トラベルコース">
                        <option value="トラベルコース-24時間以内">24時間以内</option>
                        <option value="トラベルコース-30時間以内">30時間以内</option>
                        <option value="トラベルコース-36時間以内">36時間以内</option>
                        <option value="トラベルコース-42時間以内">42時間以内</option>
                        <option value="トラベルコース-48時間以内">48時間以内</option>
                        <option value="トラベルコース-54時間以内">54時間以内</option>
                        <option value="トラベルコース-60時間以内">60時間以内</option>
                        <option value="トラベルコース-60時間以上">60時間以上</option>
                      </optgroup>
                    </select>
                    <p className="mt-2 text-xs text-rose-600">
                      💡 初回の方は初回限定120分コースがとてもお得です
                    </p>
                  </div>

                  {/* 当日の服装 */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      当日の服装は？
                    </label>
                    <input
                      type="text"
                      value={formData.outfit}
                      onChange={(e) => handleInputChange('outfit', e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      placeholder="例：赤いTシャツ、赤いスカート、赤いバック、赤い靴"
                    />
                    <p className="mt-1 text-xs text-neutral-400">
                      まだわからない方は分かり次第に教えてください
                    </p>
                  </div>

                  {/* 割引き申請 */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      割引き申請
                    </label>
                    <input
                      type="text"
                      value={formData.discount}
                      onChange={(e) => handleInputChange('discount', e.target.value)}
                      className="w-full rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      placeholder="割引キャンペーン等をご利用の場合ご記入ください"
                    />
                  </div>

                  {/* ご不明の点 */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      ご不明の点、ご要望があればお書きください
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={4}
                      className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 transition-all duration-200 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      placeholder="例：タバコは吸われない方で。優しそうな方がいいです。"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 py-6 text-xl font-black text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      ) : (
                        '予約をリクエストする'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
