// lib/getCastsByStore.ts
import { supabase } from './supabaseClient';
import { Cast, CastStatus } from '@/types/cast';

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

  // キャスト一覧を取得
  const { data, error } = await supabase
    .from('cast_store_memberships')
    .select(`
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
    `)
    .eq('store_id', store.id);

  if (error) {
    console.error('❌ キャスト取得エラー:', error.message);
    return [];
  }

  // まず全キャストIDを抽出
  const castIds = (data ?? [])
    .map((item: any) => item.casts?.id)
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
      // cast_id ごとに最新 created_at を持つものを保持
      for (const t of tweets) {
        const existing = tweetsMap[t.cast_id];
        if (!existing) {
          tweetsMap[t.cast_id] = t.content;
        }
      }
    }
  }

  return (data ?? [])
    .map((item: any) => {
      const cast = item.casts;
      if (!cast || !cast.is_active) return null;

      // ✅ Supabase Storage の公開URLを組み立てる
      const { data: urlData } = supabase.storage
        .from('cast-voices')
        .getPublicUrl(`voice-${cast.id}.webm`);

      // ✅ statuses を CastStatus[] に整形
      const statuses: CastStatus[] =
        cast.cast_statuses?.map((s: any) => ({
          id: s.id,
          status_id: s.status_id,
          is_active: s.is_active,
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
        // 🆕 最新つぶやき
        latestTweet: tweetsMap[cast.id] ?? null,
      };

      return mapped;
    })
    .filter((c: Cast | null): c is Cast => c !== null);
}
