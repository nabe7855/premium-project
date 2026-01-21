// lib/getTodayCastsByStore.ts
import { supabase } from './supabaseClient';

export interface TodayCast {
  id: string;
  name: string;
  age?: number;
  height?: number;
  catch_copy?: string;
  main_image_url?: string;
  image_url?: string;
  mbti_name?: string | null;
  face_name?: string | null;
  tags?: string[];
  start_datetime: string;
  end_datetime: string;
}

// ✅ JSTの日付文字列 (YYYY-MM-DD) を取得
function getJSTDateString(date: Date): string {
  const diff = 9 * 60; // JST (+9時間) 分
  const jstDate = new Date(date.getTime() + diff * 60 * 1000); // UTCに関係なくローカルタイムとして扱う必要があれば調整
  // シンプルにローカル時間をYYYY-MM-DDにする
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getTodayCastsByStore(
  storeSlug: string,
  targetDate?: string,
): Promise<TodayCast[]> {
  console.log(`📡 getTodayCastsByStore start for slug: [${storeSlug}], date: [${targetDate}]`);
  // 1. 店舗IDを取得
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('slug', storeSlug)
    .single();

  if (storeError || !store) {
    console.error(
      `❌ store not found for slug: [${storeSlug}]. Error:`,
      storeError?.message || 'No data',
    );
    return [];
  }

  // 2. 日付を取得 (指定がなければ今日)
  const dateStr = targetDate || getJSTDateString(new Date());
  console.log('📅 対象日付:', dateStr);

  // 3. 対象日の出勤キャストを取得
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
        height,
        catch_copy,
        main_image_url,
        image_url,
        is_active,
        mbti:mbti_id ( name ),
        face:face_id ( name ),
        cast_tags (
          tags (
            name
          )
        )
      )
    `,
    )
    .gte('work_date', dateStr)
    .lte('work_date', dateStr)
    .eq('store_id', store.id);

  if (error) {
    console.error('❌ getTodayCastsByStore error:', error.message);
    return [];
  }

  // console.log('🔍 schedules raw data:', data);

  if (!data || data.length === 0) {
    // console.warn('⚠️ 指定日の出勤キャストは見つかりませんでした');
    return [];
  }

  // 4. 整形して返す
  return data
    .filter((item: any) => item.casts?.is_active)
    .map((item: any): TodayCast => {
      const mbti = Array.isArray(item.casts.mbti) ? item.casts.mbti[0] : item.casts.mbti;
      const face = Array.isArray(item.casts.face) ? item.casts.face[0] : item.casts.face;

      // タグ情報の抽出
      const tags =
        item.casts.cast_tags?.map((ct: any) => ct.tags?.name).filter((t: any) => t) || [];

      return {
        id: item.casts.id,
        name: item.casts.name,
        age: item.casts.age,
        height: item.casts.height,
        catch_copy: item.casts.catch_copy,
        main_image_url: item.casts.main_image_url,
        image_url: item.casts.image_url,
        mbti_name: mbti?.name ?? null,
        face_name: face?.name ?? null,
        tags: tags,
        start_datetime: item.start_datetime,
        end_datetime: item.end_datetime,
      };
    });
}
