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
        name,
        main_image_url, 
        cast_store_memberships (
          stores ( id, slug, name )
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

  // ① Supabaseから取得した生データ
  console.log('📡 Supabase reviews JSON:', JSON.stringify(data, null, 2));

  // Supabase → ReviewRaw に整形
  const reviews: ReviewRaw[] = (data || []).map((d: any) => {
    return {
      id: d.id,
      cast_id: d.cast_id,
      user_name: d.user_name,
      rating: d.rating,
      comment: d.comment,
      created_at: d.created_at,
      // casts はオブジェクト or null
      casts: d.casts
        ? {
            id: d.casts.id,
            name: d.casts.name,
            main_image_url: d.casts.main_image_url || null, // 👈 追加
            cast_store_memberships: d.casts.cast_store_memberships || [],
          }
        : null,
      // review_tag_links は配列
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

  console.log('🟡 型整形後 (ReviewRaw[]):', JSON.stringify(reviews, null, 2));

  // ② 店舗slugフィルタリング
  const filtered = reviews.filter((review) => {
    console.log('🔎 判定中 review.id:', review.id, ' review.casts:', review.casts);

    const cast = review.casts;
    if (!cast) {
      console.log('⚠️ casts が null のため除外:', review.id);
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

  console.log('🟢 フィルタ後 reviews:', JSON.stringify(filtered, null, 2));

  // ③ mapReview適用後
  const mapped = filtered.map(mapReview);
  console.log('🔵 mapReview後 (Review[]):', JSON.stringify(mapped, null, 2));

  return mapped;
}
