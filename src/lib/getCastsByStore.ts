// lib/getCastsByStore.ts
import { Cast, CastStatus } from '@/types/cast';
import { supabase } from './supabaseClient';

export interface CastListMini {
  id: string;
  name: string;
  age?: number;
  isNewcomer: boolean;
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
      stores!inner ( slug ),
      casts (
        id,
        slug,
        name,
        age,
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
  let tweetsMap: Record<string, string> = {};
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
          tweetsMap[t.cast_id] = t.content;
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
        catchCopy: cast.catch_copy ?? undefined,
        mainImageUrl: cast.main_image_url ?? undefined,
        imageUrl: cast.image_url ?? undefined,
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
        sexinessLevel: cast.sexiness_level ?? 3,
        sexinessStrawberry: '🍓'.repeat(cast.sexiness_level ?? 3),
        voiceUrl: urlData?.publicUrl ?? undefined,
        latestTweet: tweetsMap[cast.id] ?? null,
        priority: item.priority ?? 0,
        isNewcomer,
        rating, // ⭐ 平均評価
        reviewCount, // 💬 口コミ件数
      };

      return mapped;
    })
    .filter((c: Cast | null): c is Cast => c !== null);
}

// 🆕 予約フォーム専用の軽量版キャスト取得
export async function getCastListMini(storeSlug: string): Promise<CastListMini[]> {
  const { data, error } = await supabase
    .from('cast_store_memberships')
    .select(
      `
      priority,
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
        priority: item.priority ?? 0,
      } as CastListMini;
    })
    .filter((c): c is CastListMini => c !== null)
    .sort((a, b) => b.priority - a.priority);
}
