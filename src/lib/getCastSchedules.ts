// lib/getCastSchedules.ts
import { supabase } from './supabaseClient';
import { Schedule } from '@/types/schedule';

export async function getCastSchedules(castId: string): Promise<Schedule[]> {
  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);

  const { data, error } = await supabase
    .from('schedules')
    .select(`
      work_date,
      start_datetime,
      end_datetime,
      status
    `) // ✅ status を追加
    .eq('cast_id', castId)
    .gte('work_date', today.toISOString().split('T')[0])
    .lte('work_date', twoWeeksLater.toISOString().split('T')[0])
    .order('work_date', { ascending: true });

  if (error) {
    console.error('❌ スケジュール取得エラー:', error.message);
    return [];
  }

  return data as Schedule[];
}
