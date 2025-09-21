import { Cast, CastStatus, Status, ServiceLevel, GalleryItem } from '@/types/cast';

export function normalizeCast(
  cast: any,
  features: any[],
  statuses: any[],
  gallery: any[] = [] // ✅ 第4引数で gallery を受け取れるように
): Cast {
  // personality
  const personalityIds = features
    .filter((f) => f.feature_master?.category === 'personality')
    .map((f) => f.feature_id);

  // appearance
  const appearanceIds = features
    .filter((f) => f.feature_master?.category === 'appearance')
    .map((f) => f.feature_id);

  // service → { name, level }[] に変換
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

  // statuses
  const castStatuses: CastStatus[] =
    statuses?.map((s: any) => ({
      id: s.id,
      cast_id: s.cast_id,
      status_id: s.status_id,
      isActive: s.is_active ?? false,
      created_at: s.created_at,
      status_master: s.status_master as Status,
    })) ?? [];

// gallery → GalleryItem[] に変換
const galleryItems: GalleryItem[] =
  gallery?.map((g: any) => ({
    id: g.id,
    castId: g.cast_id,                     // ✅ 追加
    imageUrl: g.image_url,
    caption: g.caption ?? undefined,
    isMain: g.is_main ?? false,
    createdAt: g.created_at,
    updatedAt: g.updated_at ?? undefined,  // ✅ 追加
  })) ?? [];

  // return Cast
  return {
    id: cast.id,
    slug: cast.slug,
    name: cast.name,
    age: cast.age ?? undefined,
    height: cast.height ?? undefined,

    // プロフィール系
    catchCopy: cast.catch_copy ?? undefined,
    profile: cast.profile ?? undefined,

    // 画像（main_image_url が優先）
    imageUrl: cast.main_image_url ?? cast.image_url ?? undefined,
    mainImageUrl: cast.main_image_url ?? cast.image_url ?? undefined,
    galleryItems, // ✅ 複数画像

    // 音声
    voiceUrl: cast.voice_url ?? undefined,

    // ステータス系
    isActive: cast.is_active ?? false,
    sexinessLevel: cast.sexiness_level ?? undefined,
    statuses: castStatuses,

    // 外部キー
    mbtiId: cast.mbti_id ?? undefined,
    animalId: cast.animal_id ?? undefined,
    faceId: cast.face_id ?? undefined,

    // タグや特徴
    tags: [],
    faceType: [],
    mbtiType: undefined,
    personalityIds,
    appearanceIds,

    // 特徴
    profileDetail: undefined,
    services,

    // その他
    bloodType: cast.blood_type ?? undefined,
    createdAt: cast.created_at ?? undefined,
  };
}
