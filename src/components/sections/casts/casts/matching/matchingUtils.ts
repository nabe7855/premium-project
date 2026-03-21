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

      // 顔タイプが一致または相性が良い場合の加算 (1枚目の理論に基づくマッチング)
      if (inputs.faceType && cast.faceType && cast.faceType.length > 0) {
        const castType = cast.faceType[0];
        const userType = inputs.faceType;

        if (castType === userType) {
          score += 15; // 完全一致
        } else {
          // 軸ベースの補完計算 (子供/大人, 直線/曲線)
          const FACE_AXES: Record<string, { age: 'child' | 'adult'; shape: 'linear' | 'curved' }> = {
            さがほのか: { age: 'child', shape: 'linear' },
            パールホワイト: { age: 'child', shape: 'linear' },
            とちおとめ: { age: 'child', shape: 'curved' },
            '章姫（あきひめ）': { age: 'child', shape: 'curved' },
            スカイベリー: { age: 'adult', shape: 'linear' },
            ゆめのか: { age: 'adult', shape: 'linear' },
            あまおう: { age: 'adult', shape: 'curved' },
            '淡雪（あわゆき）': { age: 'adult', shape: 'curved' },
          };

          const cA = FACE_AXES[castType];
          const uA = FACE_AXES[userType];

          if (cA && uA) {
            if (cA.age === uA.age) score += 5;
            if (cA.shape === uA.shape) score += 5;
          }
        }
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
