export type PostType = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  castName: string;
  castAvatar: string;
  date: string;
  readTime: number;
  tags: string[];
  reactions: {
    likes: number;
    healing: number;
    energized: number;
    supportive: number;
  };
  storeSlug: string; // ✅ 追加
};
