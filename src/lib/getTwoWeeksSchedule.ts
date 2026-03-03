// lib/getTwoWeeksSchedule.ts
import { Cast, CastStatus, ScheduleDay } from '@/types/schedule';
import { supabase } from './supabaseClient';

export async function getTwoWeeksSchedule(): Promise<ScheduleDay[]> {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 13);

  const { data, error } = await supabase
    .from('schedules')
    .select(
      `
      id,
      work_date,
      start_datetime,
      end_datetime,
      status:status,      -- ✅ 直指定
      cast_id,     -- ✅ 紐付け確認
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
    `,
    )
    .gte('work_date', today.toISOString().split('T')[0])
    .lte('work_date', endDate.toISOString().split('T')[0])
    .order('work_date', { ascending: true });

  if (error) {
    console.error('❌ スケジュール取得エラー:', error.message);
    return [];
  }

  // ✅ まず全体をダンプ
  console.log('📦 schedules raw:', JSON.stringify(data, null, 2));

  const grouped: { [date: string]: ScheduleDay } = {};

  data?.forEach((row: any) => {
    // ✅ row 単位のキー確認
    console.log('🛠 row keys:', Object.keys(row));

    // ✅ status の候補を徹底的にチェック
    console.log('🛠 row.status:', row.status);
    console.log('🛠 row.cast_id:', row.cast_id);
    if (row.casts) {
      (Array.isArray(row.casts) ? row.casts : [row.casts]).forEach((cast: any) => {
        console.log('🛠 inside cast:', {
          castName: cast.name,
          directStatus: cast.status, // cast 側に入ってないか？
          scheduleStatus: row.status, // schedule 側の値
        });
      });
    }

    const date = row.work_date;
    if (!grouped[date]) {
      grouped[date] = {
        date,
        dayOfWeek: new Date(date).toLocaleDateString('ja-JP', { weekday: 'short' }),
        casts: [],
        recommendedCasts: [],
      };
    }

    (row.casts ? (Array.isArray(row.casts) ? row.casts : [row.casts]) : []).forEach(
      (castData: any) => {
        const statuses: CastStatus[] = (castData.cast_statuses ?? [])
          .filter((cs: any) => cs.is_active)
          .map(
            (cs: any): CastStatus => ({
              id: cs.id,
              castId: castData.id,
              statusId: cs.status_id,
              label: cs.status_master?.name ?? '',
              labelColor: cs.status_master?.label_color ?? '#fce7f3',
              textColor: cs.status_master?.text_color ?? '#9d174d',
            }),
          );

        const storeSlug = castData.cast_store_memberships?.[0]?.stores?.slug ?? '';

        // ✅ schedule 側のステータスを採用
        const scheduleStatus: string | null = row.status ?? null;

        console.log('🟣 cast assignment:', {
          castName: castData.name,
          scheduleStatus,
        });

        const cast: Cast = {
          id: castData.id,
          name: castData.name,
          age: castData.age ?? 0,
          photo: castData.main_image_url ?? '',
          slug: castData.slug ?? '',
          workingHours: `${row.start_datetime?.slice(11, 16) ?? '??:??'} - ${row.end_datetime?.slice(11, 16) ?? '??:??'}`,
          status: 'active',
          scheduleStatus,
          description: castData.catch_copy ?? '',
          isFavorite: false,
          isRecentlyViewed: false,
          category: '',
          statuses,
          storeSlug,
        };

        grouped[date].casts.push(cast);
      },
    );
  });

  return Object.values(grouped);
}
