import { supabase } from './supabaseClient';
import { mapReview } from './mappers/reviewMapper';
import { Review, ReviewRaw } from '@/types/review';

/**
 * ストアごとのレビューをページネーション付きで取得
 * @param storeSlug ストアのスラッグ
 * @param limit 1ページあたりの件数 (デフォルト: 20)
 * @param offset 取得開始位置 (デフォルト: 0)
 */
export async function getReviewsByStore(
  storeSlug: string,
  { limit = 20, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<{ reviews: Review[]; totalCount: number }> {
  const { data, error, count } = await supabase
    .from('reviews')
    .select(
      `
      id,
      cast_id,
      user_name,
      rating,
      comment,
      created_at,
      casts (
        id,
        slug,
        name,
        main_image_url,
        is_active,
        cast_store_memberships (
          stores (
            id,
            slug,
            name
          )
        )
      ),
      review_tag_links (
        review_tag_master ( id, name )
      )
    `,
      { count: 'exact' } // ✅ 総件数も取得
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('❌ レビュー取得エラー:', error.message);
    return { reviews: [], totalCount: 0 };
  }

  // Supabase → ReviewRaw に整形
  const rawReviews: ReviewRaw[] = (data || []).map((d: any) => ({
    id: d.id,
    cast_id: d.cast_id,
    user_name: d.user_name,
    rating: d.rating,
    comment: d.comment,
    created_at: d.created_at,
    casts: d.casts
      ? {
          id: d.casts.id,
          slug: d.casts.slug,
          name: d.casts.name,
          main_image_url: d.casts.main_image_url || null,
          is_active: d.casts.is_active,
          cast_store_memberships: d.casts.cast_store_memberships || [],
        }
      : null,
    review_tag_links: (d.review_tag_links || []).map((l: any) => ({
      review_tag_master: l.review_tag_master
        ? {
            id: l.review_tag_master.id,
            name: l.review_tag_master.name,
          }
        : null,
    })),
  }));

  // 店舗slug + 在籍フィルタリング
  const filtered = rawReviews.filter((review) => {
    const cast = review.casts;
    if (!cast) {
      console.log(`⚠️ cast が null のため除外 review.id=${review.id}`);
      return false;
    }
    if (!cast.is_active) {
      console.log(`⚠️ 非アクティブキャスト除外 review.id=${review.id}`);
      return false;
    }
    return (cast.cast_store_memberships || []).some(
      (m) => m.stores?.slug === storeSlug
    );
  });

  const mapped = filtered.map(mapReview);

  console.log(
    `📊 getReviewsByStore: store=${storeSlug}, offset=${offset}, limit=${limit}, 返却件数=${mapped.length}, 総件数=${count ?? 0}`
  );

  return {
    reviews: mapped,
    totalCount: count ?? 0,
  };
}
