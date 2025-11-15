import { supabase } from './supabaseClient';
import { CastSchedule } from '@/types/cast';

export async function getCastSchedules(castId: string): Promise<CastSchedule[]> {
  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);

  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('cast_id', castId)
    .gte('work_date', today.toISOString().split('T')[0])      // 今日以降
    .lte('work_date', twoWeeksLater.toISOString().split('T')[0]) // 2週間後まで
    .order('work_date', { ascending: true });

  if (error) {
    console.error('❌ schedule取得エラー:', error);
    return [];
  }

  return data as CastSchedule[];
}
