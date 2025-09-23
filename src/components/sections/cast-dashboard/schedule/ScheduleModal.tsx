import React, { useState, useEffect } from 'react';
import { X, Clock, Save } from 'lucide-react';
import { CastSchedule } from '@/types/cast-dashboard';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: { startTime: string; endTime: string; status: string }) => void; // 👈 status付き
  selectedDate: string | null;
  existingSchedule?: CastSchedule;
}

// ✅ 状態の候補（DBの enum schedule_status と一致させる）
const STATUS_OPTIONS = ['予約可能', '残りあとわずか', '満員御礼', '応相談'];

export default function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  existingSchedule,
}: ScheduleModalProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('予約可能'); // デフォルト
  const [error, setError] = useState('');

  // ✅ 28時対応フォーマッター
  const formatTimeForInput = (datetime: string, baseDate: string | null) => {
    if (!datetime || !baseDate) return '';
    const d = new Date(datetime);
    const base = new Date(baseDate + 'T00:00:00+09:00');
    let hours = d.getHours();
    const minutes = d.getMinutes();
    if (d.getDate() > base.getDate()) {
      hours += 24; // 翌日なら +24時間
    }
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (existingSchedule) {
      setStartTime(formatTimeForInput(existingSchedule.start_datetime, selectedDate));
      setEndTime(formatTimeForInput(existingSchedule.end_datetime, selectedDate));
      setStatus(existingSchedule.status || '予約可能'); // 既存スケジュールのstatusを復元
    } else {
      setStartTime('');
      setEndTime('');
      setStatus('予約可能');
    }
    setError('');
  }, [existingSchedule, isOpen, selectedDate]);

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleSave = () => {
    setError('');
    if (!startTime || !endTime) {
      setError('開始時間と終了時間を入力してください');
      return;
    }
    onSave({ startTime, endTime, status }); // ✅ status を親に渡す
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6">
          <h3 className="text-base font-semibold text-gray-800 sm:text-lg">スケジュール編集</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* 本文 */}
        <div className="p-4 sm:p-6">
          {/* 日付表示 */}
          <div className="mb-4">
            <div className="mb-2 text-sm text-gray-600">{formatDateDisplay(selectedDate)}</div>
          </div>

          {/* 入力フィールド */}
          <div className="space-y-4">
            {/* 開始時間 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">開始時間</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="14:00"
                  className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* 終了時間 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">終了時間</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="22:00"
                  className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* 状態 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">状態</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* エラー */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* アクション */}
          <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-sm font-medium text-white hover:from-pink-600 hover:to-rose-600"
            >
              <Save className="mr-2 h-4 w-4" />
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
