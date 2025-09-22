// lib/getTwoWeeksSchedule.ts
import { supabase } from './supabaseClient';
import { ScheduleDay, Cast, CastStatus } from '@/types/schedule';

export async function getTwoWeeksSchedule(): Promise<ScheduleDay[]> {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 13);

  // Supabase から schedules を取得
  const { data, error } = await supabase
    .from('schedules')
    .select(`
      id,
      work_date,
      start_datetime,
      end_datetime,
      casts (
        id,
        name,
        age,
        catch_copy,
        main_image_url,
        slug,
        cast_statuses (
          id,
          status_id,
          is_active,
          created_at,
          status_master (
            id,
            name,
            label_color,
            text_color
          )
        ),
        cast_store_memberships!inner (
          stores!inner (
            slug
          )
        )
      )
    `)
    .gte('work_date', today.toISOString().split('T')[0])
    .lte('work_date', endDate.toISOString().split('T')[0])
    .order('work_date', { ascending: true });

  if (error) {
    console.error('❌ スケジュール取得エラー:', error.message);
    return [];
  }

  console.log('📦 Supabase schedules raw:', data);

  // 📅 日付ごとに整形
  const grouped: { [date: string]: ScheduleDay } = {};

  data?.forEach((row) => {
    const date = row.work_date;
    if (!grouped[date]) {
      const dayOfWeek = new Date(date).toLocaleDateString('ja-JP', { weekday: 'short' });
      grouped[date] = {
        date,
        dayOfWeek,
        casts: [],
        recommendedCasts: [],
      };
    }

    // ✅ casts が配列の場合に対応
(row.casts ? (Array.isArray(row.casts) ? row.casts : [row.casts]) : []).forEach((castData: any) => {
  const statuses: CastStatus[] = (castData.cast_statuses ?? [])
    .filter((cs: any) => cs.is_active)
    .map((cs: any): CastStatus => ({
      id: cs.id,
      castId: castData.id,
      statusId: cs.status_id,
      label: cs.status_master?.name ?? '',
      labelColor: cs.status_master?.label_color ?? '#fce7f3',
      textColor: cs.status_master?.text_color ?? '#9d174d',
    }));

  const storeSlug = castData.cast_store_memberships?.[0]?.stores?.slug ?? 'tokyo';

  const cast: Cast = {
    id: castData.id,
    name: castData.name,
    age: castData.age ?? 0,
    photo: castData.main_image_url ?? '',
    slug: castData.slug ?? '',
    workingHours: `${row.start_datetime?.slice(11, 16) ?? '??:??'} - ${row.end_datetime?.slice(11, 16) ?? '??:??'}`,
    status: 'available',
    description: castData.catch_copy ?? '',
    isFavorite: false,
    isRecentlyViewed: false,
    category: '',
    statuses,
    storeSlug,
  };

  grouped[date].casts.push(cast);
});

  });

  return Object.values(grouped);
}
