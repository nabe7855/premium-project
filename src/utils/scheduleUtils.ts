import { Schedule } from '@/types/schedule';
import { formatScheduleTime } from '@/lib/utils/formatSchedule';

export function convertSchedulesToAvailability(schedules: Schedule[]): { [key: string]: string[] } {
  const availability: { [key: string]: string[] } = {};

  schedules.forEach((s) => {
    if (!availability[s.work_date]) {
      availability[s.work_date] = [];
    }

    if (s.start_datetime && s.end_datetime) {
      availability[s.work_date].push(formatScheduleTime(s.start_datetime, s.end_datetime, '〜'));
    }
  });

  return availability;
}
