import { Cast } from '@/types/cast';

export interface MatchingResult extends Cast {
  matchScore: number;
}

/**
 * ユーザーの入力に基づいてキャストとの相性スコアを算出する（簡易ロジック）
 */
export function calculateMatchScores(
  casts: Cast[],
  inputs: { mbti: string; animalType: string; loveStyles: string; faceType?: string },
): MatchingResult[] {
  return casts
    .map((cast) => {
      let score = 70 + Math.floor(Math.random() * 15); // ベーススコア 70-85

      // MBTIが一致または相性が良い場合の加算（簡易的なマッチング）
      if (cast.mbtiType === inputs.mbti) {
        score += 8;
      } else if (inputs.mbti && cast.mbtiType) {
        const commonChars = [...inputs.mbti].filter((char) => cast.mbtiType?.includes(char)).length;
        score += commonChars * 2;
      }

      // 顔タイプが一致する場合の加算 (1枚目の理論に基づくマッチング)
      if (inputs.faceType && cast.faceType?.includes(inputs.faceType)) {
        score += 12; // 顔の好みは重要度が高いため少し高めに設定
      }

      // 99%を超えないように調整
      score = Math.min(score, 99);

      return {
        ...cast,
        matchScore: score,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
