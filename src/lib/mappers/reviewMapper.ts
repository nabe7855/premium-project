import { ReviewRaw, Review } from '@/types/review';

export function mapReview(raw: ReviewRaw): Review {
  // casts がオブジェクト or null の両対応
  const cast = raw.casts ?? null;

  return {
    id: raw.id,
    castId: raw.cast_id,
    userName: raw.user_name || '匿名希望',
    rating: raw.rating,
    comment: raw.comment,
    createdAt: raw.created_at,
    tags: raw.review_tag_links
      .map((l) => l.review_tag_master?.name)
      .filter((name): name is string => Boolean(name)),

    // 追加フィールド
    castName: cast?.name ?? '不明',
    castImage: cast?.main_image_url ?? undefined, // 👈 ここを追加
  };
}
