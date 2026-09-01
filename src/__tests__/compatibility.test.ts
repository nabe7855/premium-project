import { describe, it, expect } from 'vitest';
import { calculateFaceTypeScore, COMPATIBILITY_WEIGHTS } from '../utils/compatibilityCalculator';

describe('compatibilityCalculator Unit Tests', () => {
  it('should return max face type match score when face types match exactly', () => {
    const score = calculateFaceTypeScore('あまおう', 'あまおう');
    expect(score).toBe(COMPATIBILITY_WEIGHTS.faceTypeMatch);
  });

  it('should return partial bonus score when sharing age or shape axes', () => {
    // さがほのか (child, linear) vs ゆめのか (adult, linear) -> same shape (linear)
    const score = calculateFaceTypeScore('さがほのか', 'ゆめのか');
    expect(score).toBe(5);
  });

  it('should return 0 score when inputs are empty or unknown', () => {
    expect(calculateFaceTypeScore('', 'あまおう')).toBe(0);
    expect(calculateFaceTypeScore('未知のタイプ', 'あまおう')).toBe(0);
  });
});
