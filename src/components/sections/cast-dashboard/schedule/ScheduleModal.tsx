import React, { useState, useEffect } from 'react';
import { X, Clock, Save } from 'lucide-react';
import { CastSchedule } from '@/types/cast-dashboard';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: { startTime: string; endTime: string }) => void;
  selectedDate: string | null;
  existingSchedule?: CastSchedule;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  existingSchedule,
}: ScheduleModalProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingSchedule) {
      setStartTime(existingSchedule.startTime);
      setEndTime(existingSchedule.endTime);
    } else {
      setStartTime('');
      setEndTime('');
    }
    setError('');
  }, [existingSchedule, isOpen]);

  const formatDateDisplay = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const validateTime = (time: string) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleSave = () => {
    setError('');

    if (!startTime.trim() || !endTime.trim()) {
      setError('開始時間と終了時間を入力してください');
      return;
    }

    if (!validateTime(startTime) || !validateTime(endTime)) {
      setError('時間は HH:MM 形式で入力してください（例：14:00）');
      return;
    }

    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

    if (startMinutes >= endMinutes) {
      setError('終了時間は開始時間より後に設定してください');
      return;
    }

    onSave({ startTime, endTime });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4 sm:p-6">
          <h3 className="text-base font-semibold text-gray-800 sm:text-lg">スケジュール編集</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4">
            <div className="mb-2 text-sm text-gray-600">{formatDateDisplay(selectedDate)}</div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">開始時間</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="14:00"
                  className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-4 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-pink-500 sm:py-3 sm:pl-10 sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">終了時間</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="22:00"
                  className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-4 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-pink-500 sm:py-3 sm:pl-10 sm:text-base"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:text-base"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-3 text-sm font-medium text-white transition-all hover:from-pink-600 hover:to-rose-600 sm:text-base"
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
