import { Schedule } from '@/types/schedule';

export function convertSchedulesToAvailability(schedules: Schedule[]): { [key: string]: string[] } {
  const availability: { [key: string]: string[] } = {};

  schedules.forEach((s) => {
    if (!availability[s.work_date]) {
      availability[s.work_date] = [];
    }

    if (s.start_datetime && s.end_datetime) {
      const start = new Date(s.start_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
      const end = new Date(s.end_datetime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
      availability[s.work_date].push(`${start}〜${end}`);
    }
  });

  return availability;
}
