import { Cast, Review } from '@/types/caststypes';
import { mockCasts, mockReviews } from '@/data/castsmockData';

/**
 * キャストデータサービス
 *
 * このファイルは、キャストデータの取得を抽象化します。
 * 現在はモックデータを返しますが、将来的にはデータベースからの
 * データフェッチに簡単に切り替えることができます。
 */

// =============================================================================
// キャスト関連のサービス関数
// =============================================================================

/**
 * 全キャストを取得
 *
 * @returns Promise<Cast[]> - 全キャストの配列
 */
export async function getAllCasts(): Promise<Cast[]> {
  // TODO: 将来的にはデータベースからフェッチ
  // const response = await fetch('/api/casts');
  // return response.json();

  // 現在はモックデータを返す
  return Promise.resolve(mockCasts);
}

/**
 * IDでキャストを取得
 *
 * @param id - キャストID
 * @returns Promise<Cast | null> - 見つかったキャスト、または null
 */
export async function getCastById(id: string): Promise<Cast | null> {
  // TODO: 将来的にはデータベースからフェッチ
  // const response = await fetch(`/api/casts/${id}`);
  // if (!response.ok) return null;
  // return response.json();

  // 現在はモックデータから検索
  const cast = mockCasts.find((c) => c.id === id);
  return Promise.resolve(cast || null);
}

/**
 * 店舗別キャストを取得
 *
 * @param storeSlug - 店舗スラッグ
 * @returns Promise<Cast[]> - 店舗のキャスト配列
 */
export async function getCastsByStore(): Promise<Cast[]> {
  // TODO: 将来的にはデータベースからフェッチ
  // const response = await fetch(`/api/stores/${storeSlug}/casts`);
  // return response.json();

  // 現在は全キャストを返す（店舗フィルタリングは未実装）
  return getAllCasts();
}

/**
 * 検索条件でキャストをフィルタリング
 *
 * @param filters - 検索フィルター
 * @returns Promise<Cast[]> - フィルタリングされたキャスト配列
 */
export interface CastFilters {
  searchTerm?: string;
  tags?: string[];
  ageRange?: [number, number];
  mbtiType?: string;
  faceTypes?: string[];
  isOnlineOnly?: boolean;
}

export async function searchCasts(filters: CastFilters): Promise<Cast[]> {
  // TODO: 将来的にはデータベースクエリで実装
  // const queryParams = new URLSearchParams();
  // if (filters.searchTerm) queryParams.set('search', filters.searchTerm);
  // const response = await fetch(`/api/casts/search?${queryParams}`);
  // return response.json();

  // 現在はクライアントサイドフィルタリング
  const allCasts = await getAllCasts();

  return allCasts.filter((cast) => {
    // 検索キーワード
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch =
        cast.name.toLowerCase().includes(searchLower) ||
        cast.catchphrase.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // タグフィルター
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) => cast.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    // 年齢範囲
    if (filters.ageRange) {
      const [minAge, maxAge] = filters.ageRange;
      if (cast.age < minAge || cast.age > maxAge) return false;
    }

    // MBTIタイプ
    if (filters.mbtiType && cast.mbtiType !== filters.mbtiType) {
      return false;
    }

    // 顔タイプ
    if (filters.faceTypes && filters.faceTypes.length > 0) {
      const hasMatchingFaceType = filters.faceTypes.some((faceType) =>
        cast.faceType.includes(faceType),
      );
      if (!hasMatchingFaceType) return false;
    }

    // オンライン状態
    if (filters.isOnlineOnly && !cast.isOnline) {
      return false;
    }

    return true;
  });
}

// =============================================================================
// レビュー関連のサービス関数
// =============================================================================

/**
 * キャストのレビューを取得
 *
 * @param castId - キャストID
 * @returns Promise<Review[]> - レビューの配列
 */
export async function getReviewsByCastId(castId: string): Promise<Review[]> {
  // TODO: 将来的にはデータベースからフェッチ
  // const response = await fetch(`/api/casts/${castId}/reviews`);
  // return response.json();

  // 現在はモックデータから検索
  const reviews = mockReviews.filter((review) => review.castId === castId);
  return Promise.resolve(reviews);
}

/**
 * レビューを投稿
 *
 * @param review - 投稿するレビューデータ
 * @returns Promise<Review> - 投稿されたレビュー
 */
export interface CreateReviewData {
  castId: string;
  rating: number;
  comment: string;
  tags: string[];
  author?: string;
}

export async function createReview(reviewData: CreateReviewData): Promise<Review> {
  // TODO: 将来的にはAPIに送信
  // const response = await fetch('/api/reviews', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(reviewData)
  // });
  // return response.json();

  // 現在はモックレスポンス
  const newReview: Review = {
    id: Date.now().toString(),
    castId: reviewData.castId,
    rating: reviewData.rating,
    comment: reviewData.comment,
    tags: reviewData.tags,
    author: reviewData.author?.trim() || '匿名希望',
    date: new Date().toISOString().split('T')[0],
  };

  return Promise.resolve(newReview);
}

// =============================================================================
// 統計・分析関連のサービス関数
// =============================================================================

/**
 * キャストの統計情報を取得
 *
 * @param castId - キャストID
 * @returns Promise<CastStats> - 統計情報
 */
export interface CastStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: { [rating: number]: number };
  popularTags: { tag: string; count: number }[];
}

export async function getCastStats(castId: string): Promise<CastStats> {
  // TODO: 将来的にはデータベースから集計
  // const response = await fetch(`/api/casts/${castId}/stats`);
  // return response.json();

  // 現在はモックデータから計算
  const reviews = await getReviewsByCastId(castId);

  const stats: CastStats = {
    totalReviews: reviews.length,
    averageRating:
      reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
    ratingDistribution: {},
    popularTags: [],
  };

  // 評価分布を計算
  reviews.forEach((review) => {
    stats.ratingDistribution[review.rating] = (stats.ratingDistribution[review.rating] || 0) + 1;
  });

  // 人気タグを計算
  const tagCounts: { [tag: string]: number } = {};
  reviews.forEach((review) => {
    review.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  stats.popularTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return Promise.resolve(stats);
}

// =============================================================================
// キャッシュ・パフォーマンス関連
// =============================================================================

/**
 * キャストデータのキャッシュ管理
 * 将来的にはRedisやメモリキャッシュを使用
 */
class CastCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly TTL = 5 * 60 * 1000; // 5分

  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const castCache = new CastCache();

/**
 * キャッシュ付きでキャストを取得
 *
 * @param id - キャストID
 * @returns Promise<Cast | null>
 */
export async function getCastByIdCached(id: string): Promise<Cast | null> {
  const cacheKey = `cast:${id}`;
  const cached = castCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const cast = await getCastById(id);
  if (cast) {
    castCache.set(cacheKey, cast);
  }

  return cast;
}

// =============================================================================
// エラーハンドリング
// =============================================================================

export class CastServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'CastServiceError';
  }
}

/**
 * サービスエラーをハンドリング
 */
export function handleServiceError(error: unknown): CastServiceError {
  if (error instanceof CastServiceError) {
    return error;
  }

  if (error instanceof Error) {
    return new CastServiceError(error.message, 'UNKNOWN_ERROR');
  }

  return new CastServiceError('An unknown error occurred', 'UNKNOWN_ERROR');
}
