// lib/getRandomTodayCast.ts
import { supabase } from './supabaseClient';

export interface RandomCast {
  id: string;
  name: string;
  catch_copy?: string | null;
  ichioshi_point?: string | null;
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
    .select('id, name')
    .eq('slug', storeSlug)
    .single();

  if (storeError || !store) {
    console.error('❌ 店舗取得エラー:', storeError?.message);
    return [];
  }

  console.log(`🔍 [${storeSlug}] 店舗取得成功: ID=${store.id}`);

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

  console.log(`🔍 イチ押しキャストデータ取得数: ${data?.length || 0}`);

  // 🆕 3. 店舗設定（store_top_configs）からイチ押しごとの「イチ押しポイント（コメント）」を取得
  let ichioshiMap: Record<string, { point: string; rank: number }> = {};
  const { data: configRes, error: configError } = await supabase
    .from('store_top_configs')
    .select('config')
    .eq('store_id', store.id)
    .maybeSingle();

  if (configError) {
    console.error('❌ store_top_configs取得エラー:', configError.message);
  }

  if (configRes?.config) {
    const items = (configRes.config as any)?.cast?.items || [];
    console.log(`🔍 イチ押し設定数 (config): ${items.length}`);
    items.forEach((item: any) => {
      if (item.id) {
        ichioshiMap[item.id] = {
          point: item.ichioshiPoint || '',
          rank: item.ichioshiRank || 1,
        };
      }
    });
  } else {
    console.log('⚠️ イチ押し設定 (config) が見つかりません');
  }

  // 4. is_active なキャストをマッピング
  const result: RandomCast[] = data
    .filter((d: any) => d.casts?.is_active)
    .map((d: any) => {
      const cast = d.casts;
      const ichioshiInfo = ichioshiMap[cast.id];

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
        ichioshi_point: ichioshiInfo?.point || null,
        main_image_url: cast.main_image_url,
        mbti_name: mbti,
        face_name: face,
        is_ichioshi: true,
        start_datetime: d.start_datetime || '',
        end_datetime: d.end_datetime || '',
      };
    });

  console.log(`🔍 最終的なイチ押しキャスト数: ${result.length}`);

  // 5. 配列をシャッフル（ランダム配列の実装）
  return result.sort(() => Math.random() - 0.5);
}

export async function getRandomTodayCast(storeSlug: string): Promise<RandomCast | null> {
  const casts = await getTodayCasts(storeSlug);
  if (casts.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * casts.length);
  return casts[randomIndex];
}
