// lib/getCastsByStore.ts
import { Cast, CastStatus } from '@/types/cast';
import { supabase } from './supabaseClient';

export async function getCastsByStore(storeSlug: string): Promise<Cast[]> {
  // 店舗IDを取得
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('slug', storeSlug)
    .single();

  if (storeError || !store) {
    console.error('❌ 店舗取得エラー:', storeError?.message);
    return [];
  }

  // キャスト一覧を取得（priority を追加）
  const { data, error } = await supabase
    .from('cast_store_memberships')
    .select(
      `
      priority,
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
        mbti:mbti_id ( name ),
        face:face_id ( name ),
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
        )
      )
    `,
    )
    .eq('store_id', store.id);

  if (error) {
    console.error('❌ キャスト取得エラー:', error.message);
    return [];
  }

  const castIds = (data ?? [])
    .map((item: any) => {
      if (Array.isArray(item.casts)) {
        return item.casts[0]?.id;
      }
      return item.casts?.id;
    })
    .filter((id: string | undefined): id is string => !!id);

  console.log('✅ Found Cast IDs:', castIds.length, castIds.slice(0, 3));

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
        const existing = tweetsMap[t.cast_id];
        if (!existing) {
          tweetsMap[t.cast_id] = t.content;
        }
      }
    }
  }

  // 🆕 各キャストのレビュー統計を取得
  let reviewStatsMap: Record<string, { rating: number; count: number }> = {};
  if (castIds.length > 0) {
    const { data: reviews, error: reviewError } = await supabase
      .from('reviews')
      .select('cast_id, rating')
      .in('cast_id', castIds);

    if (reviewError) {
      console.error('❌ レビュー取得エラー:', reviewError.message);
    } else if (reviews) {
      const stats: Record<string, { sum: number; count: number }> = {};
      reviews.forEach((r: any) => {
        if (!stats[r.cast_id]) {
          stats[r.cast_id] = { sum: 0, count: 0 };
        }
        stats[r.cast_id].sum += r.rating;
        stats[r.cast_id].count += 1;
      });

      Object.keys(stats).forEach((id) => {
        reviewStatsMap[id] = {
          rating: Number((stats[id].sum / stats[id].count).toFixed(1)),
          count: stats[id].count,
        };
      });
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

      const mapped: Cast = {
        id: cast.id,
        slug: cast.slug,
        name: cast.name,
        age: cast.age ?? undefined,
        catchCopy: cast.catch_copy ?? undefined,
        mainImageUrl: cast.main_image_url ?? undefined,
        imageUrl: cast.image_url ?? undefined,
        isActive: cast.is_active,
        mbtiType: cast.mbti?.name ?? undefined,
        faceType: cast.face ? [cast.face.name] : [],
        statuses,
        sexinessLevel: cast.sexiness_level ?? 3,
        sexinessStrawberry: '🍓'.repeat(cast.sexiness_level ?? 3),
        voiceUrl: urlData?.publicUrl ?? undefined,
        latestTweet: tweetsMap[cast.id] ?? null,
        priority: item.priority ?? 0,
        isNewcomer,
        rating: reviewStatsMap[cast.id]?.rating ?? 0, // ⭐ 平均評価
        reviewCount: reviewStatsMap[cast.id]?.count ?? 0, // 💬 口コミ件数
      };

      return mapped;
    })
    .filter((c: Cast | null): c is Cast => c !== null);
}
