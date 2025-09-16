// lib/getRandomTodayCast.ts
import { supabase } from './supabaseClient';

export interface RandomCast {
  id: string;
  name: string;
  catch_copy?: string | null;
  main_image_url?: string | null;
  mbti_name?: string | null;
  face_name?: string | null;
  start_datetime: string;
  end_datetime: string;
}

// ✅ JSTの日付を取得 (YYYY-MM-DD)
function getTodayDateString(): string {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC → JST
  return jst.toISOString().slice(0, 10);
}

export async function getRandomTodayCast(storeSlug: string): Promise<RandomCast | null> {
  const today = getTodayDateString();

  // 1. 店舗取得
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('slug', storeSlug)
    .single();

  if (storeError || !store) {
    console.error('❌ 店舗取得エラー:', storeError?.message);
    return null;
  }

  // 2. 今日出勤予定キャストを取得
  const { data, error } = await supabase
    .from('schedules')
    .select(
      `
      start_datetime,
      end_datetime,
      casts (
        id,
        name,
        catch_copy,
        main_image_url,
        is_active,
        mbti:mbti_id ( name ),
        face:face_id ( name )
      )
    `
    )
    .eq('store_id', store.id)
    .eq('work_date', today);

  if (error) {
    console.error('❌ getRandomTodayCast error:', error.message);
    return null;
  }

  if (!data || data.length === 0) {
    console.warn('⚠️ 今日の出勤キャストは見つかりませんでした');
    return null;
  }

  // 3. is_active のキャストだけ残す
  const activeCasts = data.filter((d: any) => d.casts?.is_active);
  if (activeCasts.length === 0) return null;

  // 4. ランダムに1人選ぶ
  const randomIndex = Math.floor(Math.random() * activeCasts.length);
  const cast: any = activeCasts[randomIndex].casts;

  // 5. mbti / face の安全な取得
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
    start_datetime: activeCasts[randomIndex].start_datetime,
    end_datetime: activeCasts[randomIndex].end_datetime,
  };
}
