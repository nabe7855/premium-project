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

  // 3. 対象日の出勤キャストを取得 (スケジュールページを参考に、store_id フィルタリングなしで一旦取得)
  const { data, error } = await supabase
    .from('schedules')
    .select(
      `
      id,
      work_date,
      start_datetime,
      end_datetime,
      status,
      casts (
        id,
        name,
        age,
        height,
        slug,
        catch_copy,
        main_image_url,
        image_url,
        is_active,
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
        )
      )
    `,
    )
    .eq('work_date', dateStr);

  if (error) {
    console.error('❌ getTodayCastsByStore error:', error.message);
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
        // 追加の情報があればマッピング
        mbti_name: null, // 今回のクエリからは除外（必要なら追加）
        face_name: null,
        start_datetime: item.start_datetime,
        end_datetime: item.end_datetime,
      };
    });

  return result;
}
