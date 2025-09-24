// 共通ベース型
export interface DiaryBase {
  id: string;
  title: string;
  excerpt: string;
  content?: string;   // 本文は optional
  date: string;
  tags: string[];
  storeSlug: string;
  castName: string;
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
  castAvatar: string;
  readTime: number;
  reactions: {
    likes: number;
    healing: number;
    energized: number;
    supportive: number;
  };
}
