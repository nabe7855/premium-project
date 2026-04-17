import { cache } from 'react';
import { getSupabasePublicUrl } from './image-url';
import { supabase } from './supabaseClient';

export interface TodayCast {
  id: string;
  name: string;
  slug: string | null;
  age?: number;
  height?: number;
  weight?: number;
  catch_copy?: string;
  main_image_url?: string;
  image_url?: string;
  mbti_name?: string | null;
  face_name?: string | null;
  rating?: number;
  review_count?: number;
  sexiness_strawberry?: string | null;
  sexiness_level?: number;
  tags?: string[];
  start_datetime: string;
  end_datetime: string;
  isIchioshi: boolean;
  isShopAccount: boolean;
  ichioshiPoint?: string;
  ichioshiRank?: number;
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

export const getTodayCastsByStore = cache(async function getTodayCastsByStore(
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
        weight,
        slug,
        catch_copy,
        main_image_url,
        image_url,
        is_active,
        sexiness_level,
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
          is_ichioshi,
          is_shop_account,
          stores!inner ( slug, id )
        ),
        reviews ( rating )
      )
    `,
    )
    .eq('work_date', dateStr)
    .eq('casts.cast_store_memberships.stores.slug', storeSlug);

  if (error) {
    console.error('❌ getTodayCastsByStore query error:', error.message);
    return [];
  }

  // 🆕 店舗IDの取得（1件目から抽出）
  const firstItemCasts = Array.isArray(data?.[0]?.casts) ? data[0].casts[0] : (data?.[0]?.casts as any);
  const firstMemberships = Array.isArray(firstItemCasts?.cast_store_memberships) 
    ? firstItemCasts.cast_store_memberships 
    : (firstItemCasts?.cast_store_memberships ? [firstItemCasts.cast_store_memberships] : []);
  const storeId = firstMemberships.find((m: any) => m.stores?.slug === storeSlug)?.stores?.id;
  
  // 🆕 店舗設定からイチ押し情報を取得
  let ichioshiMap: Record<string, { point: string; rank: number }> = {};
  if (storeId) {
     const { data: configRes } = await supabase
       .from('store_top_configs')
       .select('config')
       .eq('store_id', storeId)
       .single();
     
     const items = (configRes?.config as any)?.cast?.items || [];
     items.forEach((item: any) => {
       if (item.id) ichioshiMap[item.id] = { point: item.ichioshiPoint || '', rank: item.ichioshiRank || 1 };
     });
  }

  const castMap = new Map<string, TodayCast>();

  (data || []).forEach((item: any) => {
    const cast = Array.isArray(item.casts) ? item.casts[0] : item.casts;
    if (!cast || !cast.is_active) return;
    
    const castId = cast.id;
    const ichioshiInfo = ichioshiMap[castId];

    const castReviews = Array.isArray(cast.reviews) ? cast.reviews : [];
    const reviewCount = castReviews.length;
    const rating = reviewCount > 0 
      ? Number((castReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviewCount).toFixed(1)) 
      : 0;

    const mapped: TodayCast = {
      id: castId,
      name: cast.name,
      slug: cast.slug,
      age: cast.age,
      height: cast.height,
      weight: cast.weight,
      catch_copy: cast.catch_copy,
      main_image_url: getSupabasePublicUrl(cast.main_image_url) || '/cast-default.jpg',
      image_url: getSupabasePublicUrl(cast.image_url) || '/cast-default.jpg',
      tags: (cast.cast_statuses || [])
        .filter((cs: any) => cs.is_active)
        .map((cs: any) => cs.status_master?.name)
        .filter(Boolean),
      rating: rating,
      review_count: reviewCount,
      sexiness_strawberry: '🍓'.repeat(Math.max(1, Math.min(5, cast.sexiness_level || 3))),
      sexiness_level: (cast.sexiness_level || 3) * 20,
      mbti_name: Array.isArray(cast.mbti) ? cast.mbti[0]?.name : cast.mbti?.name,
      face_name: Array.isArray(cast.face) ? cast.face[0]?.name : cast.face?.name,
      start_datetime: item.start_datetime,
      end_datetime: item.end_datetime,
      isIchioshi: Array.isArray(cast.cast_store_memberships) 
        ? cast.cast_store_memberships.some((m: any) => m.stores.slug === storeSlug && m.is_ichioshi)
        : (cast.cast_store_memberships?.is_ichioshi || false),
      isShopAccount: Array.isArray(cast.cast_store_memberships)
        ? cast.cast_store_memberships.some((m: any) => m.stores.slug === storeSlug && m.is_shop_account)
        : (cast.cast_store_memberships?.is_shop_account || false),
      ichioshiPoint: ichioshiInfo?.point,
      ichioshiRank: ichioshiInfo?.rank,
    };

    // 重複除去ロジック...
    const existing = Array.from(castMap.values()).find(c => c.name === mapped.name);
    if (existing) {
      const existingScore = (existing.main_image_url ? 2 : 0) + (existing.age ? 1 : 0);
      const newScore = (mapped.main_image_url ? 2 : 0) + (mapped.age ? 1 : 0);
      if (newScore > existingScore) {
        castMap.delete(existing.id);
        castMap.set(mapped.id, mapped);
      }
    } else if (!castMap.has(mapped.id)) {
      castMap.set(mapped.id, mapped);
    }
  });

  return Array.from(castMap.values()).sort((a, b) => {
    // 1. 店舗アカウントを一番下に
    if (a.isShopAccount && !b.isShopAccount) return 1;
    if (!a.isShopAccount && b.isShopAccount) return -1;
    
    // 🆕 2. イチ押しを優先（ランク順かつランダム性を考慮した順）
    // とりあえずランク降順
    if (a.isIchioshi && !b.isIchioshi) return -1;
    if (!a.isIchioshi && b.isIchioshi) return 1;
    if (a.isIchioshi && b.isIchioshi) {
       return (b.ichioshiRank || 0) - (a.ichioshiRank || 0);
    }
    
    return 0;
  });
});
