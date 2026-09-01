// lib/getCastSchedules.ts
import { supabase } from './supabaseClient';
import { Schedule } from '@/types/schedule';

import { getJstDateString, getJstTodayString } from '@/lib/utils/formatSchedule';

export async function getCastSchedules(castId: string): Promise<Schedule[]> {
  const todayStr = getJstTodayString();
  const twoWeeksLaterStr = getJstDateString(14);

  const { data, error } = await supabase
    .from('schedules')
    .select(
      `
      work_date,
      start_datetime,
      end_datetime,
      status
    `,
    ) // ✅ status を追加
    .eq('cast_id', castId)
    .gte('work_date', todayStr)
    .lte('work_date', twoWeeksLaterStr)
    .order('work_date', { ascending: true });

  if (error) {
    console.error('❌ スケジュール取得エラー:', error.message);
    return [];
  }

  return data as Schedule[];
}
