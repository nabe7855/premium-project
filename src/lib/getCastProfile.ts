import { CastProfile, CastQuestion, CastStatus, Status } from '@/types/cast';
import { getCastQuestions } from './getCastQuestions';
import { supabase } from './supabaseClient';

interface CastFeatureRow {
  feature_id: string;
  level?: 'NG' | '要相談' | '普通' | '得意';
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
    .select(
      `
      id,
      name,
      age,
      height,
      profile,
      image_url,
      voice_url,
      is_active,
      mbti_id,
      animal_id,
      face_id,
      catch_copy,
      sexiness_level,
      blood_type,
      manager_comment
    `,
    )
    .or(`id.eq.${userId},user_id.eq.${userId}`)
    .maybeSingle();

  if (castError || !cast) {
    console.error('❌ cast取得エラー:', castError);
    return null;
  }

  // 2. 特徴データ（cast_features）
  const { data: features, error: featureError } = await supabase
    .from('cast_features')
    .select(
      `
      feature_id,
      level,
      feature_master:cast_features_feature_id_fkey (
        id,
        category,
        name,
        label_en
      )
    `,
    )
    .eq('cast_id', cast.id);

  if (featureError) {
    console.error('❌ features取得エラー:', featureError);
    return null;
  }

  const typedFeatures: CastFeatureRow[] = (features ?? []) as unknown as CastFeatureRow[];

  const personalityIds = typedFeatures
    .filter((f) => f.feature_master?.category === 'personality')
    .map((f) => f.feature_id);

  const appearanceIds = typedFeatures
    .filter((f) => f.feature_master?.category === 'appearance')
    .map((f) => f.feature_id);

  const services: Record<string, 'NG' | '要相談' | '普通' | '得意'> = {};
  typedFeatures
    .filter((f) => f.feature_master?.category === 'service')
    .forEach((f) => {
      if (f.feature_master?.name && f.level) {
        services[f.feature_master.name] = f.level;
      }
    });

  // 3. ステータス情報（cast_statuses + status_master）
  const { data: statuses, error: statusError } = await supabase
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
    .eq('cast_id', cast.id);

  if (statusError) {
    console.error('❌ statuses取得エラー:', statusError);
    return null;
  }

  const castStatuses: CastStatus[] =
    statuses?.map((s: any) => ({
      id: s.id,
      cast_id: s.cast_id,
      status_id: s.status_id,
      isActive: s.is_active,
      created_at: s.created_at,
      status_master: s.status_master as Status,
    })) ?? [];

  // 4. Q&A
  const castQuestionsList = await getCastQuestions(cast.id);
  const questionsRecord: Record<string, string> = {};
  castQuestionsList.forEach((q: CastQuestion) => {
    if (q.question_id && q.answer) {
      questionsRecord[q.question_id] = q.answer;
    }
  });

  // 5. 整形して返却
  const profile: CastProfile = {
    id: cast.id,
    name: cast.name,
    age: cast.age ?? undefined,
    height: cast.height ?? undefined,
    profile: cast.profile ?? undefined,
    imageUrl: cast.image_url ?? undefined,
    voiceUrl: cast.voice_url ?? undefined,
    isActive: cast.is_active,
    mbtiId: cast.mbti_id ?? undefined,
    animalId: cast.animal_id ?? undefined,
    faceId: cast.face_id ?? undefined,
    catchCopy: cast.catch_copy ?? undefined,
    sexinessLevel: cast.sexiness_level ?? undefined,
    bloodType: cast.blood_type ?? undefined,
    managerComment: cast.manager_comment ?? undefined,
    personalityIds,
    appearanceIds,
    services,
    statuses: castStatuses, // ✅ ステータス追加
    questions: questionsRecord, // ✅ Q&A追加
  };

  return profile;
}
