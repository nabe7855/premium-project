// 共通ベース型
export interface DiaryBase {
  id: string;
  title: string;
  excerpt: string;
  content?: string; // 本文は optional
  date: string;
  tags: string[];
  storeSlug: string;
  castName: string;
  castId: string;
  castSlug: string;
}

// 店舗用（日記一覧用）
export interface DiaryPost extends DiaryBase {
  reactions: {
    total: number;
  };
  commentCount: number;
}

// キャスト用（個人マイページ用）
export interface PostType extends DiaryBase {
  image: string;
  image_url?: string; // DiaryCard 互換用
  castAvatar: string;
  readTime: number;
  commentCount: number;
  reactions: {
    total: number; // 合計リアクション数
    likes: number;
    healing: number;
    energized: number;
    supportive: number;
  };
}
