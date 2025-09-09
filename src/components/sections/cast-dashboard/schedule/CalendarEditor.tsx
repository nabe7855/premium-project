'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Plus, Camera } from 'lucide-react';
import { CastSchedule } from '@/types/cast-dashboard';
import { CastDiary } from '@/types/cast';
import ScheduleModal from './ScheduleModal';
import { saveSchedule } from '@/lib/scheduleApi';

interface CalendarEditorProps {
  schedules: CastSchedule[];
  onScheduleUpdate: (schedules: CastSchedule[]) => void;
  diaries: CastDiary[];
  castId: string;   // ✅ キャストID（uuid）
  storeId: string;  // ✅ 店舗ID（uuid）
}

export default function CalendarEditor({
  schedules,
  onScheduleUpdate,
  diaries,
  castId,
  storeId,
}: CalendarEditorProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    '1月','2月','3月','4月','5月','6月',
    '7月','8月','9月','10月','11月','12月',
  ];
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') newDate.setMonth(prev.getMonth() - 1);
      else newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getScheduleForDate = (date: string) => {
    return schedules.find((schedule) => schedule.work_date === date);
  };

  const getDiaryForDate = (date: string) => {
    return diaries.find((diary) => {
      const diaryDate = new Date(diary.createdAt).toISOString().split('T')[0];
      return diaryDate === date;
    });
  };

  const isToday = (day: number) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDate(day);
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  // ✅ DB保存処理（start_datetime / end_datetime）
  const handleScheduleSave = async (scheduleData: { startTime: string; endTime: string }) => {
    if (!selectedDate) return;

    if (!castId || !storeId) {
      console.error('❌ castId または storeId が空です');
      return;
    }

    const existingSchedule = schedules.find((s) => s.work_date === selectedDate);

    // 🔹 28時対応 → 翌日にシフト
    const toDateTime = (date: string, time: string) => {
      let [h, m] = time.split(':').map(Number);
      let d = new Date(`${date}T00:00:00+09:00`); // 日本時間ベース
      if (h >= 24) {
        d.setDate(d.getDate() + 1);
        h = h - 24;
      }
      d.setHours(h, m, 0, 0);
      return d.toISOString();
    };

    const newSchedule = {
      id: existingSchedule?.id ?? crypto.randomUUID(),
      cast_id: castId,
      store_id: storeId,
      work_date: selectedDate, // YYYY-MM-DD
      start_datetime: toDateTime(selectedDate, scheduleData.startTime),
      end_datetime: toDateTime(selectedDate, scheduleData.endTime),
    };

    try {
      const saved = await saveSchedule(newSchedule);
      const updated = existingSchedule
        ? schedules.map((s) => (s.id === saved.id ? saved : s))
        : [...schedules, saved];

      onScheduleUpdate(updated);
    } catch (err) {
      console.error('❌ スケジュール保存エラー:', err);
    }

    setIsModalOpen(false);
    setSelectedDate(null);
  };

  // ✅ 表示用フォーマッター（28時 → そのまま28:00表記）
  const formatTime = (datetime: string, baseDate: string) => {
    const d = new Date(datetime);
    const base = new Date(baseDate + "T00:00:00+09:00");
    let hours = d.getHours();
    const minutes = d.getMinutes();

    // 翌日だったら +24時間して表示
    if (d.getDate() > base.getDate()) {
      hours += 24;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 sm:h-20 md:h-24"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(day);
      const schedule = getScheduleForDate(dateStr);
      const diary = getDiaryForDate(dateStr);
      const isTodayDate = isToday(day);

      days.push(
        <div
          key={day}
          className={`h-16 cursor-pointer overflow-hidden border border-gray-200 p-1 transition-all hover:bg-pink-50 sm:h-20 md:h-24 ${
            isTodayDate ? 'border-pink-300 bg-pink-100' : 'bg-white'
          }`}
          onClick={() => handleDateClick(day)}
        >
          <div className={`mb-1 text-xs font-medium ${isTodayDate ? 'text-pink-600' : 'text-gray-700'}`}>
            {day}
            {isTodayDate && <span className="ml-1 hidden text-xs sm:inline">今日</span>}
          </div>

          <div className="space-y-1">
            {diary && (
              <div className="rounded border border-red-300 bg-red-100 px-1 py-0.5 text-xs">
                <div className="flex items-center text-red-700">
                  <Camera className="mr-1 h-2 w-2 flex-shrink-0" />
                  <span className="truncate text-xs">日記</span>
                </div>
              </div>
            )}

            {schedule ? (
              <div className="rounded border border-green-300 bg-green-100 px-1 py-0.5 text-xs">
                <div className="mb-0.5 flex items-center text-green-700">
                  <Check className="mr-1 h-2 w-2 flex-shrink-0" />
                  <span className="truncate text-xs">投稿済み</span>
                </div>
                <div className="text-xs leading-tight text-green-600">
                  {formatTime(schedule.start_datetime, dateStr)}〜
                  <br className="sm:hidden" />
                  <span className="sm:inline">{formatTime(schedule.end_datetime, dateStr)}</span>
                </div>
              </div>
            ) : (
              <div className="rounded border border-gray-200 bg-gray-100 px-1 py-0.5 text-xs text-gray-500">
                <div className="flex items-center">
                  <Plus className="mr-1 h-2 w-2 flex-shrink-0" />
                  <span className="truncate text-xs">追加</span>
                </div>
              </div>
            )}
          </div>
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-3 shadow-lg sm:p-4 md:p-6">
      {/* header */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h3 className="text-base font-semibold text-gray-800 sm:text-lg">スケジュール管理</h3>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button onClick={() => navigateMonth('prev')} className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-pink-50 hover:text-pink-600">
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <h4 className="min-w-[70px] text-center text-sm font-medium text-gray-800 sm:min-w-[80px] sm:text-lg">
            {year}年{monthNames[month]}
          </h4>
          <button onClick={() => navigateMonth('next')} className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-pink-50 hover:text-pink-600">
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Week days header */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="flex h-6 items-center justify-center text-xs font-medium text-gray-600 sm:h-8 sm:text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="mb-4 grid grid-cols-7 gap-1">{renderCalendarDays()}</div>

      {/* Legend */}
      <div className="flex flex-col space-y-2 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:text-sm">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded border border-pink-300 bg-pink-100"></div>
            <span>今日</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded border border-green-300 bg-green-100"></div>
            <span>投稿済み</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded border border-red-300 bg-red-100"></div>
            <span>写メ日記</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">クリックしてスケジュールを編集</div>
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDate(null);
        }}
        onSave={handleScheduleSave}
        selectedDate={selectedDate}
        existingSchedule={selectedDate ? getScheduleForDate(selectedDate) : undefined}
      />
    </div>
  );
}
