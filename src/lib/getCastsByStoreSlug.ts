import { supabase } from './supabaseClient';
import { Cast } from '@/types/cast';

// Supabaseから返るキャスト型
interface SupabaseCast {
  id: string;
  slug: string;
  name: string;
  age?: number;
  height?: number;
  catch_copy?: string;
  image_url?: string;
  main_image_url?: string;
  is_active: boolean;
  sexiness_level?: number;
  face?: { name: string } | null;
}

// 中間テーブルの型
interface CastMembershipRow {
  id: string;
  cast: SupabaseCast;
}

export const getCastsByStoreSlug = async (storeSlug: string): Promise<Cast[]> => {
  // 1. 店舗IDを取得
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('slug', storeSlug)
    .single();

  if (storeError || !store) {
    console.error('❌ 店舗が見つかりません', storeError);
    return [];
  }

  // 2. 店舗に所属するキャストを取得
  const { data, error } = await supabase
    .from('cast_store_memberships')
    .select(`
      id,
      cast:casts (
        id,
        slug,
        name,
        age,
        height,
        catch_copy,
        image_url,
        main_image_url,
        is_active,
        sexiness_level,
        face:face_id(name)
      )
    `)
    .eq('store_id', store.id)
    .returns<CastMembershipRow[]>(); // ✅ 型を明示

  if (error) {
    console.error('❌ キャスト取得エラー', error);
    return [];
  }

  // 3. 型を Cast にマッピング
  return (
    data?.map((item) => {
      const c = item.cast;
      return {
        id: c.id,
        slug: c.slug,
        name: c.name,
        age: c.age ?? undefined,
        height: c.height ?? undefined,
        catchCopy: c.catch_copy ?? undefined,
        imageUrl: c.image_url ?? undefined,
        mainImageUrl: c.main_image_url ?? undefined,
        isActive: c.is_active ?? false,
        sexinessLevel: c.sexiness_level ?? 0,
        faceType: c.face ? [c.face.name] : [],
      } as Cast;
    }) ?? []
  );
};
