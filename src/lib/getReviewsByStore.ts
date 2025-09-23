import { supabase } from './supabaseClient';
import { mapReview } from './mappers/reviewMapper';
import { Review, ReviewRaw } from '@/types/review';

export async function getReviewsByStore(storeSlug: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
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
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ レビュー取得エラー:', error.message);
    return [];
  }

  // Supabase → ReviewRaw に整形
  const reviews: ReviewRaw[] = (data || []).map((d: any) => {
    return {
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
            is_active: d.casts.is_active, // 👈 型に追加
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
    };
  });

  // ② 店舗slug + 在籍フィルタリング
  const filtered = reviews.filter((review) => {
    const cast = review.casts;
    if (!cast) {
      console.log('⚠️ casts が null のため除外:', review.id);
      return false;
    }

    if (!cast.is_active) {
      console.log('⚠️ 非アクティブキャストのため除外:', review.id);
      return false;
    }

    const matched = (cast.cast_store_memberships || []).some(
      (m) => m.stores?.slug === storeSlug
    );

    if (!matched) {
      console.log('⚠️ 除外されたレビュー (storeSlug不一致):', review.id);
    } else {
      console.log('✅ storeSlug一致 review.id:', review.id, ' cast.name:', cast.name);
    }

    return matched;
  });

  // ③ mapReview適用後
  const mapped = filtered.map(mapReview);

  return mapped;
}
