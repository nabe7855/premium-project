import { supabase } from './supabaseClient';
import { mapReview } from './mappers/reviewMapper';
import { Review, ReviewRaw } from '@/types/review';

/**
 * ストアごとのレビューをページネーション付きで取得
 * @param storeSlug ストアのスラッグ
 * @param limit 1ページあたりの件数 (デフォルト: 20)
 * @param offset 取得開始位置 (デフォルト: 0)
 * @param castId 特定キャストの口コミだけ取得したい場合に指定
 */
export async function getReviewsByStore(
  storeSlug: string,
  {
    limit = 20,
    offset = 0,
    castId,
  }: { limit?: number; offset?: number; castId?: string } = {}
): Promise<{ reviews: Review[]; totalCount: number; averageRating?: string }> {
  try {
    let targetCastIds: string[] = [];

    if (castId) {
      targetCastIds = [castId];
    } else {
      // 当該店舗に所属するアクティブキャストのIDリストをSupabaseで取得 (Client/Server両対応)
      const { data: activeCastsData, error: castError } = await supabase
        .from('casts')
        .select('id, cast_store_memberships!inner(stores!inner(slug))')
        .eq('is_active', true)
        .eq('cast_store_memberships.stores.slug', storeSlug);

      if (castError) {
        console.error('❌ アクティブキャスト取得エラー:', castError.message);
        return { reviews: [], totalCount: 0 };
      }

      targetCastIds = (activeCastsData || []).map((c: any) => c.id);
    }

    if (targetCastIds.length === 0) {
      return { reviews: [], totalCount: 0 };
    }

    // DBレベルで対象キャストの口コミのみを厳密クエリ＆総件数取得
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
          is_active
        ),
        review_tag_links (
          review_tag_master ( id, name )
        )
      `,
        { count: 'exact' }
      )
      .in('cast_id', targetCastIds)
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
            cast_store_memberships: [{ stores: { id: storeSlug, slug: storeSlug, name: storeSlug } }],
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

    const mapped = rawReviews.map(mapReview);

    // 🚀 店舗全体の平均評価（全件を対象とした動的計算。丸めルール: 小数第1位・四捨五入）
    const { data: allRatingsData } = await supabase
      .from('reviews')
      .select('rating')
      .in('cast_id', targetCastIds);

    let averageRating = '0.0';
    if (allRatingsData && allRatingsData.length > 0) {
      const sum = allRatingsData.reduce((acc: number, r: any) => acc + (r.rating || 0), 0);
      const rawAvg = sum / allRatingsData.length;
      // 小数第1位で四捨五入（例: 4.78125 -> 4.8, 4.9419 -> 4.9）
      averageRating = (Math.round(rawAvg * 10) / 10).toFixed(1);
    }

    console.log(
      `📊 getReviewsByStore: store=${storeSlug}, castId=${castId ?? 'ALL'}, 返却件数=${mapped.length}, 店舗総件数=${count ?? 0}, 店舗全体平均=${averageRating}`
    );

    return {
      reviews: mapped,
      totalCount: count ?? 0,
      averageRating,
    };
  } catch (err: any) {
    console.error('getReviewsByStore exception:', err);
    return { reviews: [], totalCount: 0, averageRating: '0.0' };
  }
}
