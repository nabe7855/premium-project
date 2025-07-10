/**
 * キャスト相性診断ロジック
 *
 * このファイルでは、MBTI・動物占い・希望シチュエーションに基づいて
 * キャストとの相性スコアを計算します。
 *
 * 各項目の重み付けや相性表は簡単に変更できるよう設計されています。
 */

import { Cast } from '@/types/caststypes';

// =============================================================================
// 設定値（カスタマイズ可能）
// =============================================================================

/**
 * 相性スコアの重み付け設定
 * 合計が100になるよう調整することを推奨
 */
export const COMPATIBILITY_WEIGHTS = {
  mbtiExactMatch: 30, // MBTI完全一致
  mbtiCompatible: 20, // MBTI相性良好
  loveStyleMatch: 25, // 希望シチュエーション一致
  animalCompatible: 15, // 動物占い相性
  ratingBonus: 5, // 評価ボーナス（rating × この値）
  reviewCountBonus: 10, // レビュー数ボーナス（最大値）
} as const;

/**
 * 表示するおすすめキャスト数
 */
export const RECOMMENDED_CAST_COUNT = 3;

/**
 * 相性ランクの表示ラベル
 */
export const COMPATIBILITY_RANKS = {
  1: '相性◎',
  2: '相性○',
  3: 'おすすめ',
} as const;

// =============================================================================
// MBTI相性表
// =============================================================================

/**
 * MBTI相性マップ
 * 各MBTIタイプと相性の良いタイプの組み合わせ
 *
 * 参考: 一般的なMBTI相性理論に基づく
 * カスタマイズ: 実際のデータに基づいて調整可能
 */
export const MBTI_COMPATIBILITY_MAP: Record<string, string[]> = {
  // アナリスト（NT）
  INTJ: ['ENFP', 'ENTP', 'INFP', 'ENTJ'],
  INTP: ['ENTJ', 'ESTJ', 'INTJ', 'ENTP'],
  ENTJ: ['INTP', 'INTJ', 'ENFP', 'ENTP'],
  ENTP: ['INFJ', 'INTJ', 'ENTJ', 'ENFJ'],

  // 外交官（NF）
  INFJ: ['ENFP', 'ENTP', 'INFP', 'ENFJ'],
  INFP: ['ENFJ', 'ENTJ', 'INFJ', 'ENFP'],
  ENFJ: ['INFP', 'ISFP', 'ENFP', 'INFJ'],
  ENFP: ['INFJ', 'INTJ', 'ENFJ', 'INFP'],

  // 番人（SJ）
  ISTJ: ['ESFP', 'ESTP', 'ISFP', 'ESTJ'],
  ISFJ: ['ESFP', 'ESTP', 'ISFP', 'ESFJ'],
  ESTJ: ['ISTP', 'ISFP', 'ESTP', 'ISTJ'],
  ESFJ: ['ISFP', 'ISTP', 'ESFP', 'ISFJ'],

  // 探検家（SP）
  ISTP: ['ESFJ', 'ESTJ', 'ISFJ', 'ESTP'],
  ISFP: ['ENFJ', 'ESFJ', 'ISFJ', 'ESFP'],
  ESTP: ['ISFJ', 'ISTJ', 'ESTJ', 'ISTP'],
  ESFP: ['ISFJ', 'ISTJ', 'ESFJ', 'ISFP'],
};

// =============================================================================
// 動物占い相性表
// =============================================================================

/**
 * 動物占い相性マップ
 * 各動物タイプと相性の良いタイプの組み合わせ
 *
 * 注意: 実際の動物占いは生年月日から算出されるため、
 * 現在は簡易版として実装。将来的には正確な相性表に置き換え可能
 */
export const ANIMAL_COMPATIBILITY_MAP: Record<string, string[]> = {
  チーター: ['ライオン', 'ペガサス', 'トラ', 'くろひょう'],
  ライオン: ['チーター', 'ゾウ', 'くろひょう', 'トラ'],
  ペガサス: ['チーター', 'こじか', 'サル', 'ひつじ'],
  ゾウ: ['ライオン', 'ひつじ', 'コアラ', 'たぬき'],
  ひつじ: ['ゾウ', 'ペガサス', 'おおかみ', 'たぬき'],
  おおかみ: ['ひつじ', 'こじか', 'トラ', 'くろひょう'],
  こじか: ['ペガサス', 'おおかみ', 'サル', 'コアラ'],
  たぬき: ['ゾウ', 'ひつじ', 'コアラ', 'サル'],
  コアラ: ['ゾウ', 'こじか', 'たぬき', 'サル'],
  トラ: ['チーター', 'ライオン', 'おおかみ', 'くろひょう'],
  くろひょう: ['チーター', 'ライオン', 'トラ', 'おおかみ'],
  サル: ['ペガサス', 'こじか', 'たぬき', 'コアラ'],
};

// =============================================================================
// 希望シチュエーション マッチング
// =============================================================================

/**
 * 希望シチュエーションとキャストタグのマッチングルール
 *
 * キー: ユーザーの希望シチュエーション
 * 値: マッチするキャストタグのキーワード配列
 */
export const LOVE_STYLE_MATCHING_RULES: Record<string, string[]> = {
  ドキドキしたい: ['アクティブ', '明るい', '元気', '楽しい'],
  癒されたい: ['癒しの時間', '心の癒し', 'リラックス', '優しい'],
  元気になりたい: ['明るい', '元気', 'エネルギッシュ', 'アクティブ'],
  甘やかされたい: ['とことん甘やかされたい', '大人の贅沢', '特別な時間'],
  落ち着きたい: ['癒しの時間', 'リラックス', '深い会話', '心の癒し'],
  しゃべりたい: ['深い会話', '明るい', '楽しい', '信頼関係'],
  励まされたい: ['元気', '明るい', '信頼関係', '心の癒し'],
  リードされたい: ['プロ意識', '信頼関係', '大人の贅沢', '特別な時間'],
};

// =============================================================================
// 相性計算メイン関数
// =============================================================================

/**
 * キャストとの相性スコアを計算
 *
 * @param cast - 対象キャスト
 * @param userMBTI - ユーザーのMBTIタイプ
 * @param userAnimal - ユーザーの動物占いタイプ
 * @param userLoveStyle - ユーザーの希望シチュエーション
 * @returns 相性スコア（0-100の範囲）
 */
export function calculateCompatibilityScore(
  cast: Cast,
  userMBTI: string,
  userAnimal: string,
  userLoveStyle: string,
): number {
  let score = 0;

  // 1. MBTI相性スコア
  score += calculateMBTIScore(cast.mbtiType, userMBTI);

  // 2. 希望シチュエーション相性スコア
  score += calculateLoveStyleScore(cast.tags, userLoveStyle);

  // 3. 動物占い相性スコア（現在は簡易実装）
  score += calculateAnimalScore(userAnimal);

  // 4. 評価・レビュー数ボーナス
  score += calculateRatingBonus(cast.rating, cast.reviewCount);

  return Math.round(score);
}

/**
 * MBTI相性スコアを計算
 */
function calculateMBTIScore(castMBTI: string, userMBTI: string): number {
  if (castMBTI === userMBTI) {
    return COMPATIBILITY_WEIGHTS.mbtiExactMatch;
  }

  const compatibleTypes = MBTI_COMPATIBILITY_MAP[userMBTI] || [];
  if (compatibleTypes.includes(castMBTI)) {
    return COMPATIBILITY_WEIGHTS.mbtiCompatible;
  }

  return 0;
}

/**
 * 希望シチュエーション相性スコアを計算
 */
function calculateLoveStyleScore(castTags: string[], userLoveStyle: string): number {
  const matchingKeywords = LOVE_STYLE_MATCHING_RULES[userLoveStyle] || [];

  const hasMatch = castTags.some((tag) =>
    matchingKeywords.some(
      (keyword) => tag.includes(keyword) || keyword.includes(tag.replace('たい', '')),
    ),
  );

  return hasMatch ? COMPATIBILITY_WEIGHTS.loveStyleMatch : 0;
}

/**
 * 動物占い相性スコアを計算
 *
 * 注意: 現在は簡易実装。実際のキャストデータに動物タイプが
 * 追加されたら、より正確な計算に変更可能
 */
function calculateAnimalScore(_userAnimal: string): number {
  // 現在は一律でボーナスを付与（実装時に要修正）
  return Math.random() > 0.5 ? COMPATIBILITY_WEIGHTS.animalCompatible : 0;
}

/**
 * 評価・レビュー数ボーナスを計算
 */
function calculateRatingBonus(rating: number, reviewCount: number): number {
  const ratingBonus = rating * COMPATIBILITY_WEIGHTS.ratingBonus;
  const reviewBonus = Math.min(reviewCount / 5, COMPATIBILITY_WEIGHTS.reviewCountBonus);

  return ratingBonus + reviewBonus;
}

// =============================================================================
// おすすめキャスト選出関数
// =============================================================================

/**
 * 診断結果に基づいておすすめキャストを選出
 *
 * @param allCasts - 全キャストデータ
 * @param userMBTI - ユーザーのMBTIタイプ
 * @param userAnimal - ユーザーの動物占いタイプ
 * @param userLoveStyle - ユーザーの希望シチュエーション
 * @returns おすすめキャスト配列（相性スコア付き）
 */
export function getRecommendedCasts(
  allCasts: Cast[],
  userMBTI: string,
  userAnimal: string,
  userLoveStyle: string,
): (Cast & { compatibilityScore: number })[] {
  // 各キャストの相性スコアを計算
  const castsWithScore = allCasts.map((cast) => ({
    ...cast,
    compatibilityScore: calculateCompatibilityScore(cast, userMBTI, userAnimal, userLoveStyle),
  }));

  // 相性スコア順にソートして上位を選出
  const sortedCasts = castsWithScore
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, RECOMMENDED_CAST_COUNT);

  // 該当がない場合は評価の高い順で選出
  if (sortedCasts.every((cast) => cast.compatibilityScore === 0)) {
    return allCasts
      .sort((a, b) => b.rating - a.rating)
      .slice(0, RECOMMENDED_CAST_COUNT)
      .map((cast) => ({ ...cast, compatibilityScore: 0 }));
  }

  return sortedCasts;
}

/**
 * 相性ランクのラベルを取得
 *
 * @param rank - ランク（1-3）
 * @returns ランクラベル
 */
export function getCompatibilityRankLabel(rank: number): string {
  return COMPATIBILITY_RANKS[rank as keyof typeof COMPATIBILITY_RANKS] || 'おすすめ';
}

// =============================================================================
// デバッグ・分析用関数
// =============================================================================

/**
 * 相性スコアの内訳を取得（デバッグ用）
 *
 * @param cast - 対象キャスト
 * @param userMBTI - ユーザーのMBTIタイプ
 * @param userAnimal - ユーザーの動物占いタイプ
 * @param userLoveStyle - ユーザーの希望シチュエーション
 * @returns スコア内訳オブジェクト
 */
export function getScoreBreakdown(
  cast: Cast,
  userMBTI: string,
  userAnimal: string,
  userLoveStyle: string,
) {
  return {
    mbtiScore: calculateMBTIScore(cast.mbtiType, userMBTI),
    loveStyleScore: calculateLoveStyleScore(cast.tags, userLoveStyle),
    animalScore: calculateAnimalScore(userAnimal),
    ratingBonus: calculateRatingBonus(cast.rating, cast.reviewCount),
    totalScore: calculateCompatibilityScore(cast, userMBTI, userAnimal, userLoveStyle),
  };
}
