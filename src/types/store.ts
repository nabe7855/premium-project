// store.ts

export type StoreLocation = 'tokyo' | 'osaka' | 'nagoya';

export interface Store {
  id: StoreLocation;
  name: string;
  displayName: string;
  catchphrase: string;
  heroTitle: string;
  description: string;
  emoji?: string;
  subtext?: string;
  colors: {
    primary: string;
    secondary: string;
    gradient: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export const store = {
  casts: [
    {
      id: '1',
      name: 'John Doe',
      age: 30,
      height: 180,
      weight: 75,
      catchCopy: 'A talented actor',
      imageUrl: '/images/Cast1.png', // public フォルダ内の画像を参照
      isWorking: true,
      schedule: ['Monday', 'Wednesday'],
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 28,
      height: 165,
      weight: 55,
      catchCopy: 'An experienced actress',
      imageUrl: '/images/Cast2.png', // public フォルダ内の画像を参照
      isWorking: false,
      schedule: ['Friday', 'Saturday'],
    },
    // 他のキャストデータを追加...
  ],
};

export interface CastMember {
  id: string; // `string` 型が適切（`CastSummary` と統一）
  name: string;
  image: string;
  isWorking: boolean;
  schedule?: string[]; // `string[]` 型に変更（複数日のスケジュールが必要な場合）
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: 'new-staff' | 'event' | 'diary' | 'media';
  excerpt: string;
}

export interface StoreData {
  id: string; // `string` 型が適切（`StoreLocation` と合わせる）
  name: string;
  catchCopy: string;
  link: string;
  hashtags: string[];
  gradient: string;
}

export interface Diary {
  id: number; // `number` 型（`Diary` ID が数値の場合）
  title: string;
  excerpt: string;
  image: string;
  date: string; // フォーマット例: "2025-07-05"
  castName: string;
  slug?: string; // 詳細ページへリンクしたい場合に使用
}

export interface Event {
  id: number;
  image: string;
  title: string;
  date: string;
  type: 'live' | 'campaign' | 'event' | string;
  description: string;
}

export interface Media {
  id: number;
  title: string;
  image: string;
  date: string; // 日付（例: "2025-07-05"）
  publication: string; // 掲載されたメディア名（例: "日経ウーマン"）
  url: string; // 記事へのリンク
}

export interface Newcomer {
  id: number;
  name: string;
  image: string;
  age: number;
  startDate: string; // 入店日（例: '2025-07-01'）
  introduction: string;
  slug?: string; // 任意：プロフィール遷移などで使用される場合
}

export interface Plan {
  id: string; // `string` 型が適切
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean; // 人気プランには true がついてる（オプション）
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1〜5
  content: string;
  date: string;
  service: string;
}

export interface Video {
  id: string; // `string` 型が適切
  thumbnail: string;
  title: string;
  duration: string;
  views: number;
  date: string;
}
