import { supabase } from './supabaseClient';
import { CastSchedule } from '@/types/cast-dashboard';

// スケジュール保存
export async function saveSchedule(schedule: {
  id: string;
  cast_id: string;
  store_id: string;
  work_date: string;
  start_datetime: string; // ISO形式
  end_datetime: string;   // ISO形式
  status: string;         // ✅ 状態を追加
}): Promise<CastSchedule> {
  const { data, error } = await supabase
    .from('schedules')
    .upsert(schedule, { onConflict: 'id' })
    .select('*')
    .single();

  if (error) {
    console.error('❌ Supabase 保存エラー:', error);
    throw error;
  }

  return data as CastSchedule;
}

// スケジュール取得
export async function fetchSchedules(castId: string, storeId: string): Promise<CastSchedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('cast_id', castId)
    .eq('store_id', storeId)
    .order('work_date', { ascending: true });

  if (error) {
    console.error('❌ Supabase 取得エラー:', error);
    throw error;
  }

  return data as CastSchedule[];
}
