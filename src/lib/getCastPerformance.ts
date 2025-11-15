import { supabase } from '@/lib/supabaseClient'

/**
 * 指定キャストの能力チャートデータを取得
 * @param castId 対象キャストのUUID
 * @returns {Record<string, number>} カテゴリごとの平均スコア (0〜5)
 */
export async function getCastPerformance(
  castId: string
): Promise<Record<string, number> | null> {
  // ① レビュー総数を取得（idだけでOK）
  const { count: reviewCount, error: reviewError } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('cast_id', castId)

  if (reviewError) {
    console.error('❌ レビュー件数取得エラー:', reviewError.message)
    return null
  }
  if (!reviewCount || reviewCount === 0) {
    return null // 口コミがない場合
  }

  // ② タグ情報を JOIN して取得
  const { data, error } = await supabase
    .from('review_tag_links')
    .select(
      `
      review_id,
      review_tag_master!inner(id, name, category),
      reviews!inner(cast_id)
    `
    )
    .eq('reviews.cast_id', castId)

  if (error) {
    console.error('❌ タグ取得エラー:', error.message)
    return null
  }
  if (!data || data.length === 0) {
    return null // タグが一つもない場合
  }

  // ③ カテゴリごとに件数を集計
  const categoryCounts: Record<string, number> = {}
  data.forEach((item: any) => {
    const tag = item.review_tag_master // ← オブジェクト
    if (!tag?.category) return
    categoryCounts[tag.category] = (categoryCounts[tag.category] ?? 0) + 1
  })

  // ④ 平均ベースで正規化（0〜5）
  const performance: Record<string, number> = {}
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    const avg = (count / reviewCount) * 5 // 1レビューあたりタグ付与率 × 5点
    performance[cat] = Number(avg.toFixed(1))
  })

  return performance
}
