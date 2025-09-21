import { Cast, CastStatus, Status, ServiceLevel, GalleryItem, CastQuestion } from '@/types/cast';

export function normalizeCast(
  cast: any,
  features: any[],
  statuses: any[],
  gallery: any[] = [],
  castQuestions: CastQuestion[] = [] // 🆕 Q&Aを追加
): Cast {
  // ✅ personality
  const personalityFeatures = features.filter(
    (f) => f.feature_master?.category === 'personality'
  );
  const personalityIds = personalityFeatures.map((f) => f.feature_id);
  const personalityNames = personalityFeatures.map(
    (f) => f.feature_master?.name ?? ''
  );

  // ✅ appearance
  const appearanceFeatures = features.filter(
    (f) => f.feature_master?.category === 'appearance'
  );
  const appearanceIds = appearanceFeatures.map((f) => f.feature_id);
  const appearanceNames = appearanceFeatures.map(
    (f) => f.feature_master?.name ?? ''
  );

  // ✅ mbti / animal / face
  const mbtiType =
    features.find((f) => f.feature_master?.category === 'mbti')?.feature_master
      ?.name ?? undefined;

  const animalName =
    features.find((f) => f.feature_master?.category === 'animal')
      ?.feature_master?.name ?? undefined;

  const faceType = features
    .filter((f) => f.feature_master?.category === 'face')
    .map((f) => f.feature_master?.name ?? '')
    .filter((name) => name !== '');

  // ✅ service → { name, level }[] に変換
  const services: { name: string; level: ServiceLevel }[] = [];
  features
    .filter((f) => f.feature_master?.category === 'service')
    .forEach((f) => {
      if (f.feature_master?.name && f.level) {
        services.push({
          name: f.feature_master.name,
          level: f.level as ServiceLevel,
        });
      }
    });

  // ✅ statuses
  const castStatuses: CastStatus[] =
    statuses?.map((s: any) => ({
      id: s.id,
      cast_id: s.cast_id,
      status_id: s.status_id,
      isActive: s.is_active ?? false,
      created_at: s.created_at,
      status_master: s.status_master as Status,
    })) ?? [];

  // ✅ gallery → GalleryItem[] に変換
  const galleryItems: GalleryItem[] =
    gallery?.map((g: any) => ({
      id: g.id,
      castId: g.cast_id,
      imageUrl: g.image_url,
      caption: g.caption ?? undefined,
      isMain: g.is_main ?? false,
      createdAt: g.created_at,
      updatedAt: g.updated_at ?? undefined,
    })) ?? [];

  // ✅ return Cast
  return {
    id: cast.id,
    slug: cast.slug,
    name: cast.name,
    age: cast.age ?? undefined,
    height: cast.height ?? undefined,

    // プロフィール系
    catchCopy: cast.catch_copy ?? undefined,
    profile: cast.profile ?? undefined,

    // 画像
    imageUrl: cast.main_image_url ?? cast.image_url ?? undefined,
    mainImageUrl: cast.main_image_url ?? cast.image_url ?? undefined,
    galleryItems,

    // 音声
    voiceUrl: cast.voice_url ?? undefined,

    // ステータス
    isActive: cast.is_active ?? false,
    sexinessLevel: cast.sexiness_level ?? undefined,
    statuses: castStatuses,

    // 特徴カテゴリ
    mbtiType,
    animalName,
    faceType,

    personalityIds,
    appearanceIds,
    personalityNames,
    appearanceNames,

    // その他
    tags: [],
    profileDetail: undefined,
    services,
    bloodType: cast.blood_type ?? undefined,
    createdAt: cast.created_at ?? undefined,

    // 🆕 Q&Aを正しく統合
    castQuestions: castQuestions,
  };
}
