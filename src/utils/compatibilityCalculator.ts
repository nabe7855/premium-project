/**
 * キャスト相性診断ロジック
 *
 * MBTI・動物占い・希望シチュエーションに基づいて
 * キャストとの相性スコアを計算します。
 */

import { Cast, ScoredCast } from '@/types/cast';

// =============================================================================
// 設定値
// =============================================================================

export const COMPATIBILITY_WEIGHTS = {
  mbtiExactMatch: 30,
  mbtiCompatible: 20,
  loveStyleMatch: 25,
  animalCompatible: 15,
  ratingBonus: 5,
  reviewCountBonus: 10,
  faceTypeMatch: 20,
} as const;

export const RECOMMENDED_CAST_COUNT = 3;

export const COMPATIBILITY_RANKS = {
  1: '相性◎',
  2: '相性○',
  3: 'おすすめ',
} as const;

// =============================================================================
// 顔タイプ相性表 (子供/大人 x 直線/曲線)
// =============================================================================

export const FACE_TYPE_AXES: Record<string, { age: 'child' | 'adult'; shape: 'linear' | 'curved' }> = {
  フレッシュハード: { age: 'child', shape: 'linear' },
  フレッシュソフト: { age: 'child', shape: 'linear' },
  チャーミングハード: { age: 'child', shape: 'curved' },
  チャーミングソフト: { age: 'child', shape: 'curved' },
  クールハード: { age: 'adult', shape: 'linear' },
  クールソフト: { age: 'adult', shape: 'linear' },
  エレガントハード: { age: 'adult', shape: 'curved' },
  エレガントソフト: { age: 'adult', shape: 'curved' },
};

export function calculateFaceTypeScore(castFaceType: string, userFaceType: string): number {
  if (!castFaceType || !userFaceType) return 0;
  if (castFaceType === userFaceType) return COMPATIBILITY_WEIGHTS.faceTypeMatch;

  const castAxis = FACE_TYPE_AXES[castFaceType];
  const userAxis = FACE_TYPE_AXES[userFaceType];

  if (!castAxis || !userAxis) return 0;

  // 同じ要素を持っている場合はボーナス
  let score = 0;
  if (castAxis.age === userAxis.age) score += 5;
  if (castAxis.shape === userAxis.shape) score += 5;

  return score;
}

// =============================================================================
// MBTI相性表
// =============================================================================

export const MBTI_COMPATIBILITY_MAP: Record<string, string[]> = {
  INTJ: ['ENFP', 'ENTP', 'INFP', 'ENTJ'],
  INTP: ['ENTJ', 'ESTJ', 'INTJ', 'ENTP'],
  ENTJ: ['INTP', 'INTJ', 'ENFP', 'ENTP'],
  ENTP: ['INFJ', 'INTJ', 'ENTJ', 'ENFJ'],
  INFJ: ['ENFP', 'ENTP', 'INFP', 'ENFJ'],
  INFP: ['ENFJ', 'ENTJ', 'INFJ', 'ENFP'],
  ENFJ: ['INFP', 'ISFP', 'ENFP', 'INFJ'],
  ENFP: ['INFJ', 'INTJ', 'ENFJ', 'INFP'],
  ISTJ: ['ESFP', 'ESTP', 'ISFP', 'ESTJ'],
  ISFJ: ['ESFP', 'ESTP', 'ISFP', 'ESFJ'],
  ESTJ: ['ISTP', 'ISFP', 'ESTP', 'ISTJ'],
  ESFJ: ['ISFP', 'ISTP', 'ESFP', 'ISFJ'],
  ISTP: ['ESFJ', 'ESTJ', 'ISFJ', 'ESTP'],
  ISFP: ['ENFJ', 'ESFJ', 'ISFJ', 'ESFP'],
  ESTP: ['ISFJ', 'ISTJ', 'ESTJ', 'ISTP'],
  ESFP: ['ISFJ', 'ISTJ', 'ESFJ', 'ISFP'],
};

// =============================================================================
// 動物占い相性表（簡易）
// =============================================================================

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
// 希望シチュエーション
// =============================================================================

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
// 相性計算
// =============================================================================

export function calculateCompatibilityScore(
  cast: Cast,
  userMBTI: string,
  userAnimal: string,
  userLoveStyle: string,
  userFaceType?: string,
): number {
  let score = 0;

  score += calculateMBTIScore(cast.mbtiType ?? '', userMBTI);
  score += calculateLoveStyleScore(cast.tags ?? [], userLoveStyle);
  score += calculateAnimalScore(userAnimal);
  score += calculateRatingBonus(cast.rating ?? 0, cast.reviewCount ?? 0);
  
  // 🆕 顔タイプ診断のスコアを加算
  if (userFaceType && cast.faceType && cast.faceType.length > 0) {
    score += calculateFaceTypeScore(cast.faceType[0], userFaceType);
  }

  return Math.round(score);
}

function calculateMBTIScore(castMBTI: string, userMBTI: string): number {
  if (castMBTI === userMBTI) return COMPATIBILITY_WEIGHTS.mbtiExactMatch;
  const compatibleTypes = MBTI_COMPATIBILITY_MAP[userMBTI] || [];
  return compatibleTypes.includes(castMBTI)
    ? COMPATIBILITY_WEIGHTS.mbtiCompatible
    : 0;
}

function calculateLoveStyleScore(castTags: string[], userLoveStyle: string): number {
  const matchingKeywords = LOVE_STYLE_MATCHING_RULES[userLoveStyle] || [];
  return castTags.some((tag) =>
    matchingKeywords.some(
      (keyword) => tag.includes(keyword) || keyword.includes(tag.replace('たい', '')),
    ),
  )
    ? COMPATIBILITY_WEIGHTS.loveStyleMatch
    : 0;
}

function calculateAnimalScore(_userAnimal: string): number {
  return Math.random() > 0.5 ? COMPATIBILITY_WEIGHTS.animalCompatible : 0;
}

function calculateRatingBonus(rating: number, reviewCount: number): number {
  const ratingBonus = rating * COMPATIBILITY_WEIGHTS.ratingBonus;
  const reviewBonus = Math.min(reviewCount / 5, COMPATIBILITY_WEIGHTS.reviewCountBonus);
  return ratingBonus + reviewBonus;
}

// =============================================================================
// おすすめキャスト選出
// =============================================================================

export function getRecommendedCasts(
  allCasts: Cast[],
  userMBTI: string,
  userAnimal: string,
  userLoveStyle: string,
  userFaceType?: string,
): ScoredCast[] {
  const castsWithScore: ScoredCast[] = allCasts.map((cast) => ({
    ...cast,
    compatibilityScore: calculateCompatibilityScore(cast, userMBTI, userAnimal, userLoveStyle, userFaceType),
  }));

  return castsWithScore
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, RECOMMENDED_CAST_COUNT);
}

export function getCompatibilityRankLabel(rank: number): string {
  return COMPATIBILITY_RANKS[rank as keyof typeof COMPATIBILITY_RANKS] || 'おすすめ';
}

// =============================================================================
// デバッグ用
// =============================================================================

export function getScoreBreakdown(
  cast: Cast,
  userMBTI: string,
  userAnimal: string,
  userLoveStyle: string,
  userFaceType?: string,
) {
  return {
    mbtiScore: calculateMBTIScore(cast.mbtiType ?? '', userMBTI),
    loveStyleScore: calculateLoveStyleScore(cast.tags ?? [], userLoveStyle),
    animalScore: calculateAnimalScore(userAnimal),
    ratingBonus: calculateRatingBonus(cast.rating ?? 0, cast.reviewCount ?? 0),
    faceTypeScore: userFaceType && cast.faceType && cast.faceType.length > 0 
      ? calculateFaceTypeScore(cast.faceType[0], userFaceType) 
      : 0,
    totalScore: calculateCompatibilityScore(cast, userMBTI, userAnimal, userLoveStyle, userFaceType),
  };
}
