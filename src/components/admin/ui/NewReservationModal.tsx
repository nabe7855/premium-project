'use client';

import { createReservation } from '@/lib/actions/reservation';
import { Calendar, FileText, Mail, Phone, Store, User, UserPlus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface NewReservationModalProps {
  onClose: () => void;
  onSuccess: () => void;
  stores: { id: string; name: string }[];
  casts: { id: string; name: string; storeIds?: string[] }[];
  initialData?: {
    customerName?: string;
    clientNickname?: string;
    phone?: string;
    email?: string;
    visitCount?: number;
    storeId?: string;
    castId?: string;
  };
}

export const NewReservationModal: React.FC<NewReservationModalProps> = ({
  onClose,
  onSuccess,
  stores,
  casts,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    clientNickname: initialData?.clientNickname || '',
    dateTime: '',
    visitCount: initialData?.visitCount || 1,
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    notes: '',
    castId: initialData?.castId || '',
    storeId: initialData?.storeId || '',
    skipCounseling: (initialData?.visitCount || 1) > 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 初回表示時に現在日時をセット（リピートでない場合）
  useEffect(() => {
    if (!initialData) {
      const now = new Date();
      const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      setFormData((prev) => ({
        ...prev,
        dateTime: jstNow.toISOString().slice(0, 16),
      }));
    } else {
      // リピート予約時、もし日時が空なら現在日時をセット
      if (formData.dateTime === '') {
        const now = new Date();
        const jstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        setFormData((prev) => ({
          ...prev,
          dateTime: jstNow.toISOString().slice(0, 16),
        }));
      }
    }
  }, [initialData]);

  // 当該店舗に紐づくキャストだけを抽出（全店舗対応のキャストも含む場合は店舗IDでチェック）
  const filteredCasts = React.useMemo(() => {
    if (!formData.storeId) return casts; // 店舗未選択時は全員表示するか、空にするか。今回は全員表示にしておく
    return casts.filter((c) => {
      if (!c.storeIds) return true; // DBに設定がない場合は安全のため表示
      return c.storeIds.includes(formData.storeId);
    });
  }, [casts, formData.storeId]);

  // 店舗が切り替わった時に、現在のキャストがその店舗に属していなければクリア
  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStoreId = e.target.value;
    const newFilteredCasts = casts.filter((c) => {
      if (!c.storeIds) return true;
      return c.storeIds.includes(newStoreId);
    });

    setFormData((prev) => {
      const stillHasCast = newFilteredCasts.some((c) => c.id === prev.castId);
      return {
        ...prev,
        storeId: newStoreId,
        castId: stillHasCast ? prev.castId : '',
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName) {
      toast.error('お客様名を入力してください');
      return;
    }
    if (!formData.dateTime) {
      toast.error('日時を選択してください');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createReservation({
        ...formData,
        visitCount: Number(formData.visitCount),
        preCompleteCounseling: formData.skipCounseling,
      });

      if (result.success) {
        toast.success(initialData ? 'リピート予約を作成しました' : '新規予約を作成しました');
        onSuccess();
        onClose();
      } else {
        toast.error('保存に失敗しました: ' + result.error);
      }
    } catch (error) {
      toast.error('エラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="flex items-center gap-2 font-bold text-slate-800">
            {initialData ? (
              <RotateCcw size={20} className="text-pink-500" />
            ) : (
              <UserPlus size={20} className="text-indigo-500" />
            )}
            {initialData ? 'リピート予約作成' : '新規予約登録'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6">
          <div className="space-y-4">
            {/* 基本情報 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  お客様名（本名）
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  ニックネーム
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                  value={formData.clientNickname}
                  onChange={(e) => setFormData({ ...formData, clientNickname: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  来店日時
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="datetime-local"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                    value={formData.dateTime}
                    onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  来店回数
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                  value={formData.visitCount}
                  onChange={(e) => setFormData({ ...formData, visitCount: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* 店舗・キャスト */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  店舗
                </label>
                <div className="relative">
                  <Store size={14} className="absolute left-3 top-3 text-slate-400" />
                  <select
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                    value={formData.storeId}
                    onChange={handleStoreChange}
                  >
                    <option value="">店舗を選択</option>
                    {stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  担当キャスト
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-slate-400" />
                  <select
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                    value={formData.castId}
                    onChange={(e) => setFormData({ ...formData, castId: e.target.value })}
                  >
                    <option value="">キャストを選択</option>
                    {filteredCasts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 任意情報 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  電話番号
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                要望・備考
              </label>
              <div className="relative">
                <FileText size={14} className="absolute left-3 top-3 text-slate-400" />
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:outline-none"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            {/* リピート時のみ詳細設定を表示 */}
            {initialData && (
              <div className="rounded-2xl border border-indigo-100/50 bg-indigo-50/50 p-4">
                <label className="group flex cursor-pointer items-center gap-3">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition-all checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none"
                      checked={formData.skipCounseling}
                      onChange={(e) =>
                        setFormData({ ...formData, skipCounseling: e.target.checked })
                      }
                    />
                    <svg
                      className="absolute left-0.5 top-0.5 h-4 w-4 scale-0 text-white transition-transform peer-checked:scale-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 transition-colors group-hover:text-indigo-600">
                      前回のカウンセリングを流用する
                    </span>
                    <span className="text-[11px] text-slate-500">
                      チェックを入れると、カウンセリングシートの手順が完了状態で作成されます
                    </span>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-100 py-3 text-sm font-bold text-slate-400 hover:bg-slate-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 rounded-2xl py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
                initialData
                  ? 'bg-pink-500 shadow-pink-200 hover:bg-pink-600'
                  : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700'
              } disabled:opacity-60`}
            >
              {isSubmitting ? '登録中...' : initialData ? 'リピート予約を作成' : '作成する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 重複修正用の RotateCcw アイコンがないので Lucide からインポート済みなはずだが RotateCcw は RotateCcw
import { RotateCcw } from 'lucide-react';
