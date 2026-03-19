import { getSupabasePublicUrl } from './image-url';
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

// Supabase URL を取得
const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    console.warn('⚠️ getTodayCastsByStore: NEXT_PUBLIC_SUPABASE_URL is not defined!');
    return '';
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

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

  const castMap = new Map<string, TodayCast>();

  (data || []).forEach((item: any) => {
    const cast = Array.isArray(item.casts) ? item.casts[0] : item.casts;
    if (!cast || !cast.is_active) return;
    
    const castId = cast.id;
    const nameKey = cast.name; // 名前での重複もチェック対象とする

    const mainImg = getSupabasePublicUrl(cast.main_image_url);
    const fallbackImg = getSupabasePublicUrl(cast.image_url);

    const mapped: TodayCast = {
      id: castId,
      name: cast.name,
      slug: cast.slug,
      age: cast.age,
      height: cast.height,
      catch_copy: cast.catch_copy,
      main_image_url: mainImg,
      image_url: fallbackImg,
      tags: (cast.cast_statuses || [])
        .filter((cs: any) => cs.is_active)
        .map((cs: any) => cs.status_master?.name)
        .filter(Boolean),
      rating: 5.0,
      review_count: 10,
      sexiness_strawberry: '🍓🍓🍓',
      mbti_name: Array.isArray(cast.mbti) ? cast.mbti[0]?.name : cast.mbti?.name,
      face_name: Array.isArray(cast.face) ? cast.face[0]?.name : cast.face?.name,
      start_datetime: item.start_datetime,
      end_datetime: item.end_datetime,
    };

    // 重複除去ロジック:
    // 1. 同一 ID の場合は先に出現したものを優先
    // 2. 同名の場合は、データが充実している方（画像がある、年齢がある等）を優先して残す
    const existing = Array.from(castMap.values()).find(c => c.name === mapped.name);
    
    if (existing) {
      // 既存の方がデータが薄く、新規の方が画像があるなら差し替える
      const existingScore = (existing.main_image_url ? 2 : 0) + (existing.age ? 1 : 0);
      const newScore = (mapped.main_image_url ? 2 : 0) + (mapped.age ? 1 : 0);
      
      if (newScore > existingScore) {
        castMap.delete(existing.id);
        castMap.set(mapped.id, mapped);
      }
    } else {
      if (!castMap.has(mapped.id)) {
        castMap.set(mapped.id, mapped);
      }
    }
  });

  return Array.from(castMap.values());
}
