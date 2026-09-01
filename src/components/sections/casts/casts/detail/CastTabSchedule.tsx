'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cast } from '@/types/cast';
import { getCastSchedules } from '@/lib/getCastSchedules';
import {
  formatJstDateForDisplay,
  getJstDateString,
  getJstTodayString,
} from '@/lib/utils/formatSchedule';
import { convertSchedulesToAvailability } from '@/utils/scheduleUtils';

// 共通の状態バッジスタイル
const scheduleStatusStyles: Record<string, string> = {
  予約可能: 'schedule-available',
  残りあとわずか: 'schedule-limited',
  満員御礼: 'schedule-full',
  応相談: 'schedule-negotiable',
  default: 'schedule-default',
};

interface CastTabScheduleProps {
  cast: Cast;
  onBookingOpen: () => void;
}

const CastTabSchedule: React.FC<CastTabScheduleProps> = ({ cast, onBookingOpen }) => {
  const [availability, setAvailability] = useState<{ [key: string]: string[] }>({});
  const [statusByDate, setStatusByDate] = useState<{ [key: string]: string }>({});

  // ✅ DBからスケジュール取得
  useEffect(() => {
    (async () => {
      const schedules = await getCastSchedules(cast.id);
      setAvailability(convertSchedulesToAvailability(schedules));

      const statusMap: { [key: string]: string } = {};
      schedules.forEach((s: any) => {
        statusMap[s.work_date] = s.status;
      });
      setStatusByDate(statusMap);
    })();
  }, [cast.id]);

  // 直近2週間を埋める (JST基準)
  const getTwoWeeksSchedule = (availability: { [key: string]: string[] } = {}) => {
    const schedule: { [key: string]: string[] } = {};

    for (let i = 0; i < 14; i++) {
      const dateString = getJstDateString(i);
      schedule[dateString] = availability[dateString] || [];
    }

    return schedule;
  };

  const todayStr = getJstTodayString();
  const tomorrowStr = getJstDateString(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white p-4 shadow-soft sm:rounded-2xl sm:p-6"
    >
      {/* 予約ボタン */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h3 className="text-lg font-semibold text-neutral-800 sm:text-xl">出勤スケジュール</h3>
        <button
          onClick={onBookingOpen}
          className="rounded-full bg-primary px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-primary/90 sm:text-base"
        >
          予約する
        </button>
      </div>

      {/* スケジュール一覧 */}
      <div className="space-y-4">
        {Object.entries(getTwoWeeksSchedule(availability)).map(([date, times]) => {
          const { displayText, dayOfWeekNum } = formatJstDateForDisplay(date);
          const isToday = date === todayStr;
          const isTomorrow = date === tomorrowStr;
          const isWeekend = dayOfWeekNum === 0 || dayOfWeekNum === 6;

          const status = statusByDate[date] ?? 'default';

          return (
            <div
              key={date}
              className={`flex flex-col items-center rounded-2xl border p-4 text-center shadow-sm transition-colors duration-200 ${
                isToday
                  ? 'border-primary bg-primary/5'
                  : isTomorrow
                    ? 'border-blue-300 bg-blue-50'
                    : isWeekend
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-neutral-200 bg-white'
              }`}
            >
              {/* 日付ラベル */}
              <div className="mb-3 flex flex-col items-center gap-2">
                <span
                  className={`text-base font-semibold sm:text-lg ${
                    isToday
                      ? 'text-primary'
                      : isTomorrow
                        ? 'text-blue-600'
                        : isWeekend
                          ? 'text-orange-600'
                          : 'text-neutral-800'
                  }`}
                >
                  {displayText}
                </span>

                {/* 今日/明日/週末タグ */}
                <div className="flex flex-wrap justify-center gap-2">
                  {isToday && (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs text-white">
                      今日
                    </span>
                  )}
                  {isTomorrow && (
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-xs text-white">
                      明日
                    </span>
                  )}
                  {isWeekend && !isToday && !isTomorrow && (
                    <span className="rounded-full bg-orange-500 px-3 py-1 text-xs text-white">
                      週末
                    </span>
                  )}

                  {/* 出勤がある日だけ状態バッジを表示 */}
                  {times.length > 0 && status !== 'default' && (
                    <span
                      className={`${scheduleStatusStyles[status] || scheduleStatusStyles.default}`}
                    >
                      {status}
                    </span>
                  )}
                </div>
              </div>

              {/* 出勤時間 or お休み */}
              <div className="flex flex-wrap justify-center gap-2">
                {times.length > 0 ? (
                  times.map((time) => (
                    <span
                      key={time}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        isToday ? 'bg-primary/20 text-primary' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {time}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-500">
                    お休み
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg bg-neutral-50 p-3">
        <p className="text-center text-xs text-neutral-600">
          💡 直近2週間のスケジュールを表示しています
        </p>
      </div>
    </motion.div>
  );
};

export default CastTabSchedule;
