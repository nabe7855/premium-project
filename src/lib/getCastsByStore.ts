// lib/getCastsByStore.ts
import { Cast, CastStatus } from '@/types/cast';
import { getSupabasePublicUrl } from './image-url';
import { supabase } from './supabaseClient';
import { convertSchedulesToAvailability } from '@/utils/scheduleUtils';

export interface CastListMini {
  id: string;
  name: string;
  age?: number;
  isNewcomer: boolean;
  isShopAccount: boolean;
  priority: number;
}

export async function getCastsByStore(storeSlug: string): Promise<Cast[]> {
  // 1. 店舗に所属するキャスト一覧を取得（reviews も JOIN して直接集計）
  // stores テーブルを JOIN して slug でフィルタリングすることで、店舗ID取得の1回分のリクエストを削減
  const { data, error } = await supabase
    .from('cast_store_memberships')
    .select(
      `
      priority,
      is_shop_account,
      is_ichioshi,
      stores!inner ( slug, id ),
      casts (
        id,
        slug,
        name,
        age,
        height,
        weight,
        blood_type,
        catch_copy,
        main_image_url,
        image_url,
        is_active,
        sexiness_level,
        sns_url,
        mbti:feature_master!casts_mbti_id_fkey ( name ),
        face:feature_master!casts_face_id_fkey ( name ),
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
        reviews (
          rating
        )
      )
    `,
    )
    .eq('stores.slug', storeSlug);

  if (error) {
    console.error('❌ キャスト取得エラー:', error.message);
    return [];
  }

  // 🆕 店舗IDの取得
  const storeId = (data?.[0]?.stores as any)?.id;
  
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

  // 全キャストIDを抽出（つぶやき取得用）
  const castIds = (data ?? [])
    .map((item: any) => {
      if (Array.isArray(item.casts)) {
        return item.casts[0]?.id;
      }
      return item.casts?.id;
    })
    .filter((id: string | undefined): id is string => !!id);

  // 🆕 各キャストの最新つぶやきを取得
  let tweetsMap: Record<string, { content: string; createdAt: string }> = {};
  if (castIds.length > 0) {
    const { data: tweets, error: tweetError } = await supabase
      .from('cast_tweets')
      .select('cast_id, content, created_at, expires_at')
      .in('cast_id', castIds)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (tweetError) {
      console.error('❌ つぶやき取得エラー:', tweetError.message);
    } else if (tweets) {
      for (const t of tweets) {
        if (!tweetsMap[t.cast_id]) {
          tweetsMap[t.cast_id] = { content: t.content, createdAt: t.created_at };
        }
      }
    }
  }

  // 🆕 各キャストの最新日記投稿時間を取得
  let diariesMap: Record<string, string> = {};
  if (castIds.length > 0) {
    const { data: diaries, error: diaryError } = await supabase
      .from('blogs')
      .select('cast_id, published_at')
      .in('cast_id', castIds)
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (diaryError) {
      console.error('❌ 日記取得エラー:', diaryError.message);
    } else if (diaries) {
      for (const d of diaries) {
        if (!diariesMap[d.cast_id]) {
          diariesMap[d.cast_id] = d.published_at;
        }
      }
    }
  }

  // 🆕 本日のスケジュールを取得（本日出勤フィルター用）
  let availabilityMap: Record<string, { [key: string]: string[] }> = {};
  if (castIds.length > 0) {
    const todayStr = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' });
    const { data: schedules, error: scheduleError } = await supabase
      .from('schedules')
      .select('cast_id, work_date, start_datetime, end_datetime, status')
      .in('cast_id', castIds)
      .eq('work_date', todayStr);

    if (scheduleError) {
      console.error('❌ スケジュール取得エラー:', scheduleError.message);
    } else if (schedules) {
      for (const s of schedules) {
        if (!availabilityMap[s.cast_id]) {
          availabilityMap[s.cast_id] = {};
        }
        const converted = convertSchedulesToAvailability([{
          work_date: s.work_date,
          start_datetime: s.start_datetime,
          end_datetime: s.end_datetime,
          status: s.status,
        }]);
        // Merge into existing availability
        for (const [date, times] of Object.entries(converted)) {
          if (!availabilityMap[s.cast_id][date]) {
            availabilityMap[s.cast_id][date] = [];
          }
          availabilityMap[s.cast_id][date].push(...times);
        }
      }
    }
  }

  return (data ?? [])
    .map((item: any) => {
      const cast = Array.isArray(item.casts) ? item.casts[0] : item.casts;
      if (!cast || !cast.is_active) return null;

      // ✅ Supabase Storage の公開URL
      const { data: urlData } = supabase.storage
        .from('cast-voices')
        .getPublicUrl(`voice-${cast.id}.webm`);

      // ✅ statuses を CastStatus[] に整形
      const statuses: CastStatus[] =
        cast.cast_statuses?.map((s: any) => ({
          id: s.id,
          status_id: s.status_id,
          isActive: s.is_active,
          created_at: s.created_at,
          status_master: s.status_master
            ? {
                id: s.status_master.id,
                name: s.status_master.name,
                label_color: s.status_master.label_color,
                text_color: s.status_master.text_color,
              }
            : null,
        })) ?? [];

      // ✅ 新人判定
      const isNewcomer = statuses.some((s) => s.isActive && s.status_master?.name === '新人');

      // ✅ reviewsを JOIN で取得済み → 直接集計
      const castReviews: { rating: number }[] = Array.isArray(cast.reviews) ? cast.reviews : [];
      const reviewCount = castReviews.length;
      const rating =
        reviewCount > 0
          ? Number(
              (
                castReviews.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / reviewCount
              ).toFixed(1),
            )
          : 0;

      const mapped: Cast = {
        id: cast.id,
        slug: cast.slug,
        name: cast.name,
        age: cast.age ?? undefined,
        height: cast.height ?? undefined,
        weight: cast.weight ?? undefined,
        bloodType: cast.blood_type ?? undefined,
        catchCopy: cast.catch_copy ?? undefined,
        mainImageUrl: getSupabasePublicUrl(cast.main_image_url || cast.image_url) || '/cast-default.jpg',
        imageUrl: getSupabasePublicUrl(cast.main_image_url || cast.image_url) || '/cast-default.jpg',
        isActive: cast.is_active,
        mbtiType: Array.isArray(cast.mbti)
          ? (cast.mbti[0]?.name ?? undefined)
          : (cast.mbti?.name ?? undefined),
        faceType: Array.isArray(cast.face)
          ? cast.face.map((f: any) => f.name).filter(Boolean)
          : cast.face
            ? [cast.face.name]
            : [],
        statuses,
        sexinessLevel: (cast.sexiness_level ?? 3) * 20,
        sexinessStrawberry: '🍓'.repeat(cast.sexiness_level ?? 3),
        voiceUrl: urlData?.publicUrl ?? undefined,
        latestTweet: tweetsMap[cast.id]?.content ?? null,
        latestTweetAt: tweetsMap[cast.id]?.createdAt ?? null,
        latestDiaryAt: diariesMap[cast.id] ?? null,
        priority: item.priority ?? 0,
        isNewcomer,
        isShopAccount: item.is_shop_account || false,
        isIchioshi: item.is_ichioshi || false,
        ichioshiPoint: ichioshiMap[cast.id]?.point,
        ichioshiRank: ichioshiMap[cast.id]?.rank,
        availability: availabilityMap[cast.id] || undefined, // 📅 本日出勤フィルター用
        sns: (() => {
          try {
            const parsed = JSON.parse(cast.sns_url || '');
            if (typeof parsed === 'object' && parsed !== null) return parsed;
          } catch {
            return undefined;
          }
          return undefined;
        })(),
        snsUrl: cast.sns_url ?? undefined,
        rating, // ⭐ 平均評価
        reviewCount, // 💬 口コミ件数
      };

      return mapped;
    })
    .filter((c: Cast | null): c is Cast => c !== null)
    .sort((a, b) => {
      // 1. 店舗アカウントを一番下に
      if (a.isShopAccount && !b.isShopAccount) return 1;
      if (!a.isShopAccount && b.isShopAccount) return -1;

      // 🆕 2. イチ押しを最優先（ランク順）
      if (a.isIchioshi && !b.isIchioshi) return -1;
      if (!a.isIchioshi && b.isIchioshi) return 1;
      if (a.isIchioshi && b.isIchioshi) {
        return (b.ichioshiRank || 0) - (a.ichioshiRank || 0);
      }

      // 3. それ以外は優先度（降順）
      return (b.priority ?? 0) - (a.priority ?? 0);
    });
}

// 🆕 予約フォーム専用の軽量版キャスト取得
export async function getCastListMini(storeSlug: string): Promise<CastListMini[]> {
  const { data, error } = await supabase
    .from('cast_store_memberships')
    .select(
      `
      priority,
      is_shop_account,
      stores!inner ( slug ),
      casts (
        id,
        name,
        age,
        is_active,
        cast_statuses (
          is_active,
          status_master ( name )
        )
      )
    `,
    )
    .eq('stores.slug', storeSlug);

  if (error || !data) {
    console.error('❌ getCastListMini error:', error?.message);
    return [];
  }

  return (data ?? [])
    .map((item: any) => {
      const cast = Array.isArray(item.casts) ? item.casts[0] : item.casts;
      if (!cast || !cast.is_active) return null;

      const statuses = Array.isArray(cast.cast_statuses)
        ? cast.cast_statuses
        : [cast.cast_statuses];
      const isNewcomer = statuses.some(
        (s: any) => s?.is_active && s?.status_master?.name === '新人',
      );

      return {
        id: cast.id,
        name: cast.name,
        age: cast.age || undefined,
        isNewcomer,
        isShopAccount: item.is_shop_account || false,
        priority: item.priority ?? 0,
      } as CastListMini;
    })
    .filter((c): c is CastListMini => c !== null)
    .sort((a, b) => {
      // 1. 店舗アカウントを一番下に
      if ((a as any).isShopAccount && !(b as any).isShopAccount) return 1;
      if (!(a as any).isShopAccount && (b as any).isShopAccount) return -1;

      // 2. それ以外は優先度（降順）
      return (b.priority ?? 0) - (a.priority ?? 0);
    });
}
