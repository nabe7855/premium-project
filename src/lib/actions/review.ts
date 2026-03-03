'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { markStepCompleted } from './reservation';

/** 予約IDから口コミに必要な情報を取得 */
export async function getReservationForReview(reservationId: string) {
  const { data, error } = await supabaseAdmin
    .from('reservations')
    .select(
      `
      id,
      customer_name,
      client_nickname,
      cast_id,
      store_id,
      status
    `,
    )
    .eq('id', reservationId)
    .single();

  if (error || !data) return null;

  // キャスト名を取得
  let castName = '';
  if (data.cast_id) {
    const { data: cast } = await supabaseAdmin
      .from('casts')
      .select('name')
      .eq('id', data.cast_id)
      .single();
    castName = cast?.name || '';
  }

  return {
    reservationId: data.id,
    customerName: data.customer_name || data.client_nickname || '匿名',
    castId: data.cast_id,
    castName,
  };
}

/** 口コミを保存（reviews + review_tag_links） */
export async function saveReview(data: {
  reservationId: string;
  castId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  tagIds: string[];
  userAgeGroup?: number;
}) {
  // 1. reviews に投稿
  const { data: review, error: reviewError } = await supabaseAdmin
    .from('reviews')
    .insert([
      {
        cast_id: data.castId,
        user_name: data.userName || '匿名希望',
        rating: data.rating,
        comment: `【${data.title}】\n${data.comment}`,
        user_age_group: data.userAgeGroup ?? null,
        reservation_id: data.reservationId, // 予約との紐付け（カラムがあれば）
      },
    ])
    .select('id')
    .single();

  if (reviewError) {
    console.error('❌ saveReview error:', reviewError);
    return { success: false, error: reviewError.message };
  }

  // 2. タグを登録
  if (data.tagIds.length > 0 && review) {
    const links = data.tagIds.map((tagId) => ({
      review_id: review.id,
      tag_id: tagId,
    }));
    const { error: tagError } = await supabaseAdmin.from('review_tag_links').insert(links);
    if (tagError) console.error('❌ tag link error:', tagError);
  }

  // 3. ワークフローの口コミステップを完了にする（失敗しても主処理に影響しない）
  markStepCompleted(data.reservationId, 'review').catch((e) =>
    console.error('[saveReview] markStep failed:', e),
  );

  return { success: true };
}

/** タグ一覧を取得 */
export async function fetchReviewTags(): Promise<{ id: string; name: string }[]> {
  const { data, error } = await supabaseAdmin
    .from('review_tag_master')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) return [];
  return data ?? [];
}
