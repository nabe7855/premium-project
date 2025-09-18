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
        statuses, // ✅ 型安全にした CastStatus[]
        sexinessLevel: cast.sexiness_level ?? 3,
        sexinessStrawberry: '🍓'.repeat(cast.sexiness_level ?? 3),
        voiceUrl: urlData?.publicUrl ?? undefined, // 🎤 音声URL
      };

      return mapped;
    })
    .filter((c: Cast | null): c is Cast => c !== null);
}
