// lib/getTodayCastsByStore.ts
import { supabase } from './supabaseClient';

export interface TodayCast {
  id: string;
  name: string;
  slug: string | null;
  age?: number;
  height?: number;
  catch_copy?: string;
  main_image_url?: string;
  image_url?: string;
  mbti_name?: string | null;
  face_name?: string | null;
  rating?: number;
  review_count?: number;
  sexiness_strawberry?: string | null;
  tags?: string[];
  start_datetime: string;
  end_datetime: string;
}

// ✅ JSTの日付文字列 (YYYY-MM-DD) を取得
function getJSTDateString(date: Date): string {
  const jstDate = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tokyo',
  })
    .formatToParts(date)
    .reduce((acc: any, part) => {
      if (part.type !== 'literal') {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

  return `${jstDate.year}-${jstDate.month}-${jstDate.day}`;
}

export async function getTodayCastsByStore(
  storeSlug: string,
  targetDate?: string,
): Promise<TodayCast[]> {
  // 1. 日付を取得 (指定がなければ今日)
  const dateStr = targetDate || getJSTDateString(new Date());

  // 2. 対象日の出勤キャストを取得 (店舗slugで直接絞り込み)
  const { data, error } = await supabase
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
        height,
        slug,
        catch_copy,
        main_image_url,
        image_url,
        is_active,
        mbti:feature_master!casts_mbti_id_fkey ( name ),
        face:feature_master!casts_face_id_fkey ( name ),
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
    .eq('work_date', dateStr)
    .eq('casts.cast_store_memberships.stores.slug', storeSlug);

  if (error) {
    console.error('❌ getTodayCastsByStore query error:', error.message);
    return [];
  }

  const result = (data || [])
    .filter((item: any) => {
      // 1-to-1 か 1-to-N かで item.casts が配列かオブジェクトか変わる可能性があるため robust に処理
      const cast = Array.isArray(item.casts) ? item.casts[0] : item.casts;
      return cast?.is_active;
    })
    .map((item: any): TodayCast => {
      const cast = Array.isArray(item.casts) ? item.casts[0] : item.casts;

      return {
        id: cast.id, // UUID (string)
        name: cast.name,
        slug: cast.slug,
        age: cast.age,
        height: cast.height,
        catch_copy: cast.catch_copy,
        main_image_url: cast.main_image_url,
        image_url: cast.image_url,
        // tags は status_master から取得
        tags: (cast.cast_statuses || [])
          .filter((cs: any) => cs.is_active)
          .map((cs: any) => cs.status_master?.name)
          .filter(Boolean),
        // DBに未実装のカラムは一旦デフォルト値またはundefinedに
        rating: 5.0,
        review_count: 10,
        sexiness_strawberry: '🍓🍓🍓',
        // MBTI/Face は JOIN した name を取得
        mbti_name: Array.isArray(cast.mbti) ? cast.mbti[0]?.name : cast.mbti?.name,
        face_name: Array.isArray(cast.face) ? cast.face[0]?.name : cast.face?.name,
        start_datetime: item.start_datetime,
        end_datetime: item.end_datetime,
      };
    });

  return result;
}
