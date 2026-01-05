<<<<<<< HEAD
import { Cast, GalleryItem, CastSNS as CastSNSType } from '@/types/cast';
import qs from 'qs';

// StrapiのAPIレスポンス型を定義
interface StrapiCastItem {
  id: string;
  slug: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  catchCopy?: string;
  SNSURL?: string;
  GalleryItem?: GalleryItem[];
  isNew?: boolean;
  sexinessLevel?: number;
  isActive?: boolean; // ✅ 追加（Boolean型）
  isReception?: boolean;
  is_active?: boolean;
}

interface StrapiResponse {
  data: StrapiCastItem[];
}

export const getAllCasts = async (): Promise<Cast[]> => {
  const query = qs.stringify(
    {
      filters: {
        isActive: {
          $eq: true,
        },
      },
      populate: {
        GalleryItem: true,
      },
    },
    { encodeValuesOnly: true },
  );

  const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/casts?${query}`;
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN_READ;

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error('❌ Strapi API fetch failed', res.status, res.statusText);
    throw new Error('Strapi API fetch failed');
  }

  const data: StrapiResponse = await res.json();

  return data.data.map((item): Cast => {
    const galleryItems: GalleryItem[] = item.GalleryItem ?? [];
    const firstImage = galleryItems.find((g) => g.imageUrl);

    const sns: CastSNSType = {
      line: item.SNSURL ?? '',
    };

    return {
      id: String(item.id),
      slug: item.slug,
      name: item.name,
      age: item.age,
      height: item.height,
      catchCopy: item.catchCopy,
      imageUrl: firstImage?.imageUrl ?? undefined,
      galleryItems,
      sns,
      sexinessLevel: item.sexinessLevel ?? 0,
      isReception: item.isReception,
      isActive: item.is_active ?? true,
    };
=======
import { Cast } from '@/types/cast';
import { normalizeCast } from './normalizeCast';
import { supabase } from './supabaseClient';

export const getAllCasts = async (): Promise<Cast[]> => {
  // 1. キャスト一覧を取得
  const { data: castData, error: castError } = await supabase
    .from('casts')
    .select(
      `
      id,
      slug,
      name,
      age,
      height,
      catch_copy,
      profile,
      image_url,
      main_image_url,
      voice_url,
      is_active,
      sexiness_level,
      blood_type,
      created_at
    `,
    )
    .eq('is_active', true);

  if (castError) {
    console.error('❌ getAllCasts 取得エラー:', castError.message);
    throw new Error('Supabase fetch failed');
  }

  if (!castData || castData.length === 0) {
    return [];
  }

  // 2. 全キャストのIDリスト
  const castIds = castData.map((c) => c.id);

  // 3. 特徴データを一括取得
  const { data: featureData, error: featureError } = await supabase
    .from('cast_features')
    .select(
      `
      cast_id,
      feature_id,
      level,
      feature_master:cast_features_feature_id_fkey (
        id,
        category,
        name
      )
    `,
    )
    .in('cast_id', castIds);

  if (featureError) {
    console.error('❌ feature取得エラー:', featureError.message);
  }

  // 4. ステータスを一括取得
  const { data: statusData, error: statusError } = await supabase
    .from('cast_statuses')
    .select(
      `
      id,
      cast_id,
      status_id,
      is_active,
      created_at,
      status_master (
        id,
        name,
        label_color,
        text_color
      )
    `,
    )
    .in('cast_id', castIds);

  if (statusError) {
    console.error('❌ status取得エラー:', statusError.message);
  }

  // 5. ギャラリーを一括取得
  const { data: galleryData, error: galleryError } = await supabase
    .from('gallery_items')
    .select('id, cast_id, image_url, caption, is_main, created_at, updated_at')
    .in('cast_id', castIds);

  if (galleryError) {
    console.error('❌ gallery取得エラー:', galleryError.message);
  }

  // 6. 正規化して返却
  return castData.map((cast) => {
    const castFeatures = featureData?.filter((f) => f.cast_id === cast.id) || [];
    const castStatuses = statusData?.filter((s) => s.cast_id === cast.id) || [];
    const castGallery = galleryData?.filter((g) => g.cast_id === cast.id) || [];

    return normalizeCast(cast, castFeatures, castStatuses, castGallery);
>>>>>>> animation-test
  });
};
