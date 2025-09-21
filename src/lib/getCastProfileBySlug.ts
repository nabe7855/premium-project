// lib/getCastProfileBySlug.ts
import { supabase } from './supabaseClient';
import { Cast } from '@/types/cast';
import { normalizeCast } from './normalizeCast';

export async function getCastProfileBySlug(slug: string): Promise<Cast | null> {
  console.log("🔍 getCastProfileBySlug called with slug:", slug);

  // 1. キャスト本体
  const { data: cast, error: castError } = await supabase
    .from('casts')
    .select(`
      id,
      name,
      slug,
      age,
      height,
      profile,
      voice_url,
      is_active,
      mbti_id,
      animal_id,
      face_id,
      catch_copy,
      sexiness_level,
      blood_type,
      created_at
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (castError || !cast) {
    console.error('❌ cast取得エラー:', castError);
    return null;
  }

  // 2. ギャラリー画像
  const { data: gallery, error: galleryError } = await supabase
    .from('gallery_items')
    .select(`id, image_url, caption, is_main, created_at`)
    .eq('cast_id', cast.id)
    .order('created_at', { ascending: false });

  if (galleryError) {
    console.error('❌ gallery取得エラー:', galleryError);
  }

  // ✅ メイン画像を決定（is_main優先、なければ最新の1枚）
  const mainImage = gallery?.find((g) => g.is_main) ?? gallery?.[0];

  // 3. 特徴データ
  const { data: features, error: featureError } = await supabase
    .from('cast_features')
    .select(`
      feature_id,
      level,
      feature_master:cast_features_feature_id_fkey (
        id,
        category,
        name,
        label_en
      )
    `)
    .eq('cast_id', cast.id);

  if (featureError) {
    console.error('❌ features取得エラー:', featureError);
  }

  // 4. ステータス
  const { data: statuses, error: statusError } = await supabase
    .from('cast_statuses')
    .select(`
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
    `)
    .eq('cast_id', cast.id);

  if (statusError) {
    console.error('❌ statuses取得エラー:', statusError);
  }

  // ✅ デバッグログ
  console.log("✅ castデータ:", cast);
  console.log("🖼️ gallery:", gallery);
  console.log("⭐ mainImage:", mainImage);
  console.log("✅ featuresデータ:", features);
  console.log("✅ statusesデータ:", statuses);

  // 5. 整形して返却
  return normalizeCast(
    {
      ...cast,
      main_image_url: mainImage?.image_url ?? null, // ✅ メイン画像
    },
    features ?? [],
    statuses ?? [],
    gallery ?? [] // ✅ ここで第4引数に渡す
  );
}
