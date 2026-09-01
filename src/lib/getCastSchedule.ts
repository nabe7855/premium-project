import { supabase } from './supabaseClient';
import { CastSchedule } from '@/types/cast';

import { getJstDateString, getJstTodayString } from '@/lib/utils/formatSchedule';

export async function getCastSchedules(castId: string): Promise<CastSchedule[]> {
  const todayStr = getJstTodayString();
  const twoWeeksLaterStr = getJstDateString(14);

  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('cast_id', castId)
    .gte('work_date', todayStr) // 今日以降
    .lte('work_date', twoWeeksLaterStr) // 2週間後まで
    .order('work_date', { ascending: true });

  if (error) {
    console.error('❌ schedule取得エラー:', error);
    return [];
  }

  return data as CastSchedule[];
}
