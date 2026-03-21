// lib/getRandomTodayCast.ts
import { supabase } from './supabaseClient';

export interface RandomCast {
  id: string;
  name: string;
  catch_copy?: string | null;
  main_image_url?: string | null;
  mbti_name?: string | null;
  face_name?: string | null;
  is_ichioshi?: boolean;
  start_datetime?: string;
  end_datetime?: string;
}

// ✅ JSTの日付を取得 (YYYY-MM-DD)
function getTodayDateString(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC → JST
  return jst.toISOString().slice(0, 10);
}

export async function getTodayCasts(storeSlug: string): Promise<RandomCast[]> {
  const today = getTodayDateString();

  // 1. 店舗取得
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('slug', storeSlug)
    .single();

  if (storeError || !store) {
    console.error('❌ 店舗取得エラー:', storeError?.message);
    return [];
  }

  // 2. 店舗のイチ押しキャストを取得（出勤日は問わない）
  const { data, error } = await supabase
    .from('cast_store_memberships')
    .select(`
      is_ichioshi,
      casts (
        id,
        name,
        catch_copy,
        main_image_url,
        is_active,
        mbti:feature_master!casts_mbti_id_fkey ( name ),
        face:feature_master!casts_face_id_fkey ( name )
      )
    `)
    .eq('store_id', store.id)
    .eq('is_ichioshi', true);

  if (error || !data) {
    console.error('❌ getFeaturedCasts error:', error?.message);
    return [];
  }

  // 3. is_active なキャストをマッピング
  const result: RandomCast[] = data
    .filter((d: any) => d.casts?.is_active)
    .map((d: any) => {
      const cast = d.casts;
      let mbti: string | null = null;
      if (Array.isArray(cast.mbti) && cast.mbti.length > 0) {
        mbti = cast.mbti[0]?.name ?? null;
      } else if (cast.mbti && typeof cast.mbti === 'object') {
        mbti = cast.mbti.name ?? null;
      }

      let face: string | null = null;
      if (Array.isArray(cast.face) && cast.face.length > 0) {
        face = cast.face[0]?.name ?? null;
      } else if (cast.face && typeof cast.face === 'object') {
        face = cast.face.name ?? null;
      }

      return {
        id: cast.id,
        name: cast.name,
        catch_copy: cast.catch_copy,
        main_image_url: cast.main_image_url,
        mbti_name: mbti,
        face_name: face,
        is_ichioshi: true, // フィルタを通ったので常にtrue
        start_datetime: d.start_datetime || '',
        end_datetime: d.end_datetime || '',
      };
    });

  return result;
}

export async function getRandomTodayCast(storeSlug: string): Promise<RandomCast | null> {
  const casts = await getTodayCasts(storeSlug);
  if (casts.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * casts.length);
  return casts[randomIndex];
}
