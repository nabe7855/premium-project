import { supabase } from './supabaseClient';

/**
 * 全店舗合計の口コミ件数を取得（件数のみ・行データは取得しない軽量クエリ）
 *
 * - テーブル: reviews（getReviewsByStore と同一）
 * - 公開条件: reviews テーブルに公開ステータス列は存在しないため、
 *   getReviewsByStore と同じく「在籍中(is_active=true)キャストの口コミ」のみを対象とする。
 *   （getReviewsByStore はさらに店舗slugで絞るが、ここは全店舗合計なので絞らない）
 *
 * 実数を保証できない場合は 0 を返し、呼び出し側で非表示にフォールバックする。
 */
export async function getTotalReviewCount(): Promise<number> {
  const { count, error } = await supabase
    .from('reviews')
    .select('*, casts!inner(is_active)', { count: 'exact', head: true })
    .eq('casts.is_active', true);

  if (error) {
    console.error('❌ 口コミ総件数の取得エラー:', error.message);
    return 0;
  }

  return count ?? 0;
}
