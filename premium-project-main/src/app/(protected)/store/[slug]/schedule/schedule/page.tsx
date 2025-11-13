'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { ScheduleDay as ScheduleDayType, Cast } from '@/types/schedule';
import DateNavigation from '@/components/sections/schedule/DateNavigation';
import ScheduleDay from '@/components/sections/schedule/ScheduleDay';
import { useParams } from 'next/navigation';

function SchedulePage() {
  const params = useParams();
  const storeSlug = params.slug as string;

  const [schedule, setSchedule] = useState<ScheduleDayType[]>([]);
  const [activeDate, setActiveDate] = useState<string>('');

  // ✅ 予約ボタン押下処理
  const handleBooking = (castId: string) => {
    console.log(`🛎️ 予約処理: castId=${castId}, store=${storeSlug}`);
  };

  // ✅ 今日〜14日間の日付リスト
  const generateDateRange = (): { date: string; dayOfWeek: string }[] => {
    const today = new Date();
    const days = [];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({ date: dateStr, dayOfWeek: dayNames[d.getDay()] });
    }
    return days;
  };

  // ✅ Supabase からスケジュール取得
  useEffect(() => {
    const fetchSchedule = async () => {
      const dateRange = generateDateRange();

      const { data: schedules, error } = await supabase
        .from('schedules')
        .select(
          `
            id,
            work_date,
            start_datetime,
            end_datetime,
            status,
            casts (
              id,
              name,
              age,
              slug,
              main_image_url,
              catch_copy,
              cast_statuses (
                id,
                status_id,
                is_active,
                status_master (
                  id,
                  name,
                  label_color,
                  text_color
                )
              )
            )
          `
        )
        .gte('work_date', dateRange[0].date)
        .lte('work_date', dateRange[dateRange.length - 1].date);

      if (error) {
        console.error('❌ Supabase取得エラー:', error.message);
        return;
      }

      // 日付ごとに整形
      const scheduleData: ScheduleDayType[] = dateRange.map((day) => {
        const castsForDay: Cast[] =
          schedules
            ?.filter((s) => s.work_date === day.date)
            .map((s) => {
              const cast = Array.isArray(s.casts) ? s.casts[0] : s.casts;

              return {
                id: cast?.id ?? '',
                name: cast?.name ?? '',
                age: cast?.age ?? 0,
                photo: cast?.main_image_url ?? '',
                slug: cast?.slug ?? '',
                workingHours:
                  s.start_datetime && s.end_datetime
                    ? `${new Date(s.start_datetime).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })} - ${new Date(s.end_datetime).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}`
                    : '時間未定',
                status: 'available',
                description: cast?.catch_copy ?? '',
                isFavorite: false,
                isRecentlyViewed: false,
                category: '',
                // ✅ スケジュールのステータス
                scheduleStatus: s.status ?? null,
                // ✅ タグ用のステータス
                statuses: (cast?.cast_statuses ?? []).map((cs: any) => ({
                  id: cs.id,
                  statusId: cs.status_id,
                  label: cs.status_master?.name ?? '',
                  labelColor: cs.status_master?.label_color ?? '#fce7f3',
                  textColor: cs.status_master?.text_color ?? '#9d174d',
                })),
                storeSlug,
              } as Cast;
            }) ?? [];

        return {
          ...day,
          casts: castsForDay,
          recommendedCasts: [],
        };
      });

      setSchedule(scheduleData);
      setActiveDate(dateRange[0].date);
    };

    fetchSchedule();
  }, [storeSlug]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100"
            >
              <span className="text-xl text-red-500">🍓</span>
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="text-2xl font-bold text-gray-900"
              >
                Schedule
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
                className="font-serif text-sm text-gray-600"
              >
                あなたのご予定に、素敵な"いちご一会"を。
              </motion.p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <DateNavigation
              schedule={schedule}
              activeDate={activeDate}
              onDateChange={setActiveDate}
            />
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {schedule.map((day, index) => (
                <ScheduleDay
                  key={day.date}
                  day={day}
                  isToday={index === 0}
                  storeSlug={storeSlug}
                  onBooking={handleBooking}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SchedulePage;
