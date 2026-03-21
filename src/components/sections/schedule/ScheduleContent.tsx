'use client';
import DateNavigation from '@/components/sections/schedule/DateNavigation';
import ScheduleDay from '@/components/sections/schedule/ScheduleDay';
import { supabase } from '@/lib/supabaseClient';
import { Cast, ScheduleDay as ScheduleDayType } from '@/types/schedule';
import React, { useEffect, useState } from 'react';

interface ScheduleContentProps {
  storeSlug: string;
}

const ScheduleContent: React.FC<ScheduleContentProps> = ({ storeSlug }) => {
  const [schedule, setSchedule] = useState<ScheduleDayType[]>([]);
  const [activeDate, setActiveDate] = useState<string>('');

  const handleBooking = (castId: string) => {
    console.log(`🛎️ 予約処理: castId=${castId}, store=${storeSlug}`);
  };

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
            casts!inner (
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
              ),
              cast_store_memberships!inner (
                stores!inner ( slug )
              )
            )
          `,
        )
        .gte('work_date', dateRange[0].date)
        .lte('work_date', dateRange[dateRange.length - 1].date)
        .eq('casts.cast_store_memberships.stores.slug', storeSlug);

      if (error) {
        console.error('❌ Supabase取得エラー:', error.message);
        return;
      }

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
                    ? `${new Date(s.start_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} - ${new Date(s.end_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`
                    : '時間未定',
                status: 'available',
                description: cast?.catch_copy ?? '',
                isFavorite: false,
                isRecentlyViewed: false,
                category: '',
                scheduleStatus: s.status ?? null,
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
    <main className="mx-auto max-w-4xl px-4 py-6">
      <div className="lg:grid lg:grid-cols-4 lg:gap-6">
        <div className="space-y-6 lg:col-span-1">
          <DateNavigation
            schedule={schedule}
            activeDate={activeDate}
            onDateChange={setActiveDate}
          />
        </div>
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
  );
};

export default ScheduleContent;
