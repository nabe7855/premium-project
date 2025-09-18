// src/lib/getCastsByStore.ts
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

  // キャスト一覧を取得（在籍中のみ）
  const { data, error } = await supabase
    .from('cast_store_memberships')
    .select(
      `
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
    `
    )
    .eq('store_id', store.id);

  if (error) {
    console.error('❌ キャスト取得エラー:', error.message);
    return [];
  }

  // 整形して Cast[] に変換
  return (data ?? [])
    .map((item: any) => {
      const cast = item.casts;
      if (!cast || !cast.is_active) return null;

      // ステータスを整形
      const statuses: CastStatus[] =
        cast.cast_statuses?.map((s: any) => ({
          id: s.id,
          cast_id: cast.id,
          status_id: s.status_id,
          is_active: s.is_active,
          status_master: {
            id: s.status_master?.id,
            name: s.status_master?.name,
            label_color: s.status_master?.label_color, // ✅ 追加
            text_color: s.status_master?.text_color,   // ✅ 追加
          },
          created_at: s.created_at,
        })) ?? [];

      // セクシー度 🍓表現
      const sexinessLevel: number = cast.sexiness_level ?? 3;
      const sexinessStrawberry: string = '🍓'.repeat(sexinessLevel);

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
        sexinessLevel,
        // 🍓をUIで直接使いたいとき用に渡す
        tags: cast.tags ?? [],
        rating: cast.rating ?? 0,
        reviewCount: cast.review_count ?? 0,
        createdAt: cast.created_at ?? undefined,
        // 新規追加: 🍓表現済みのセクシー度
        sexinessStrawberry,
      };

      return mapped;
    })
    .filter((c: Cast | null): c is Cast => c !== null);
}
