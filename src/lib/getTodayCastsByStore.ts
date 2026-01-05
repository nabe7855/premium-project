// lib/getTodayCastsByStore.ts
import { supabase } from './supabaseClient';

export interface TodayCast {
  id: string;
  name: string;
  age?: number;
  catch_copy?: string;
  main_image_url?: string;
  image_url?: string;
  mbti_name?: string | null;
  face_name?: string | null;
  start_datetime: string;
  end_datetime: string;
}

// ✅ JSTの今日の日付 (YYYY-MM-DD)
function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getTodayCastsByStore(storeSlug: string): Promise<TodayCast[]> {
<<<<<<< HEAD
=======
  console.log(`📡 getTodayCastsByStore start for slug: [${storeSlug}]`);
>>>>>>> animation-test
  // 1. 店舗IDを取得
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('slug', storeSlug)
    .single();

  if (storeError || !store) {
<<<<<<< HEAD
    console.error('❌ store not found:', storeError?.message);
=======
    console.error(
      `❌ store not found for slug: [${storeSlug}]. Error:`,
      storeError?.message || 'No data',
    );
>>>>>>> animation-test
    return [];
  }

  // 2. JST基準の今日の日付を取得
  const today = getTodayDateString();
  console.log('📅 JST 今日の日付:', today);

  // 3. 今日の出勤キャストを取得 (範囲検索に変更)
  const { data, error } = await supabase
    .from('schedules')
    .select(
      `
      start_datetime,
      end_datetime,
      casts (
        id,
        name,
        age,
        catch_copy,
        main_image_url,
        image_url,
        is_active,
        mbti:mbti_id ( name ),
        face:face_id ( name )
      )
<<<<<<< HEAD
    `
=======
    `,
>>>>>>> animation-test
    )
    .gte('work_date', today) // ✅ >= 今日
    .lte('work_date', today) // ✅ <= 今日（つまり今日と一致）
    .eq('store_id', store.id);

  if (error) {
    console.error('❌ getTodayCastsByStore error:', error.message);
    return [];
  }

  console.log('🔍 schedules raw data:', data);

  if (!data || data.length === 0) {
    console.warn('⚠️ 今日の出勤キャストは見つかりませんでした');
    return [];
  }

  // 4. 整形して返す
  return data
    .filter((item: any) => item.casts?.is_active)
    .map((item: any): TodayCast => {
      const mbti = Array.isArray(item.casts.mbti) ? item.casts.mbti[0] : item.casts.mbti;
      const face = Array.isArray(item.casts.face) ? item.casts.face[0] : item.casts.face;

      return {
        id: item.casts.id,
        name: item.casts.name,
        age: item.casts.age,
        catch_copy: item.casts.catch_copy,
        main_image_url: item.casts.main_image_url,
        image_url: item.casts.image_url,
        mbti_name: mbti?.name ?? null,
        face_name: face?.name ?? null,
        start_datetime: item.start_datetime,
        end_datetime: item.end_datetime,
      };
    });
}
