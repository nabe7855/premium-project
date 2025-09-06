import { supabase } from './supabaseClient';
import { CastProfile } from '@/types/cast';

// Supabase から join して返るレコード型
interface CastFeatureRow {
  feature_id: string;
  feature_master: {
    id: string;
    category: string;
    name: string;
    label_en?: string;
  } | null;
}

export async function getCastProfile(userId: string): Promise<CastProfile | null> {
  // 1. キャスト本体
  const { data: cast, error: castError } = await supabase
    .from('casts')
    .select(`
      id,
      name,
      age,
      height,
      profile,
      image_url,
      is_active,
      mbti_id,
      animal_id,
      face_id
    `)
    .eq('user_id', userId)
    .maybeSingle(); // ✅ レコードが無い場合は null を返す

  if (castError || !cast) {
    console.error('❌ cast取得エラー:', castError);
    return null;
  }

  // 2. cast_features 経由で特徴取得
  const { data: features, error: featureError } = await supabase
  .from('cast_features')
  .select(`
    feature_id,
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
    return null;
  }

  // ✅ TS が誤推論するため unknown を経由
  const typedFeatures: CastFeatureRow[] = (features ?? []) as unknown as CastFeatureRow[];

  // 3. カテゴリごとに分類
  const personalityIds = typedFeatures
    .filter((f) => f.feature_master?.category === 'personality')
    .map((f) => f.feature_id);

  const appearanceIds = typedFeatures
    .filter((f) => f.feature_master?.category === 'appearance')
    .map((f) => f.feature_id);

  // 4. CastProfile 型に整形
  const profile: CastProfile = {
    id: cast.id,
    name: cast.name,
    age: cast.age ?? undefined,
    height: cast.height ?? undefined,
    profile: cast.profile ?? undefined,
    imageUrl: cast.image_url ?? undefined,
    is_active: cast.is_active,
    mbtiId: cast.mbti_id ?? undefined,
    animalId: cast.animal_id ?? undefined,
    faceId: cast.face_id ?? undefined,
    personalityIds,
    appearanceIds,
  };

  return profile;
}
