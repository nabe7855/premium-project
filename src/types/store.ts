// store.ts

export type StoreLocation = 'tokyo' | 'osaka' | 'nagoya' | 'fukuoka' | 'yokohama';

export interface Store {
  id: StoreLocation;
  template: 'common' | 'fukuoka' | 'yokohama';
  name: string;
  displayName: string;
  catchphrase: string;
  heroTitle: string;
  description: string;
  emoji?: string;
  subtext?: string;
  phone?: string;
  contact?: {
    phone?: string;
    line?: string;
    email?: string;
  };

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
      id: '1', // ← string 型に統一
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
      id: '2', // ← string 型に統一
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
  id: string; // ✅ string 型（UUIDに対応）
  name: string;
  slug?: string | null; // ✅ 追加
  image: string;
  isWorking: boolean;
  age?: number;
  mbtiType?: string | null;
  faceType?: string[] | null;
  rating?: number;
  reviewCount?: number;
  sexinessStrawberry?: string | null;
  schedule?: string[];
}

export interface NewsItem {
  id: string; // ✅ string 型に統一
  title: string;
  date: string;
  category: 'new-staff' | 'event' | 'diary' | 'media';
  excerpt: string;
}

export interface StoreData {
  id: string; // ✅ string 型に統一
  name: string;
  catchCopy: string;
  link: string;
  hashtags: string[];
  gradient: string;
}

export interface Diary {
  id: number; // ✅ Diary は数値IDを維持
  title: string;
  excerpt: string;
  image: string;
  date: string; // フォーマット例: "2025-07-05"
  castName: string;
  slug?: string;
}

export interface Event {
  id: number; // ✅ 数値ID
  image: string;
  title: string;
  date: string;
  type: 'live' | 'campaign' | 'event' | string;
  description: string;
}

export interface Media {
  id: number; // ✅ 数値ID
  title: string;
  image: string;
  date: string;
  publication: string;
  url: string;
}

export interface Newcomer {
  id: number; // ✅ 数値ID
  name: string;
  image: string;
  age: number;
  startDate: string;
  introduction: string;
  slug?: string;
}

export interface Plan {
  id: string; // ✅ string 型に統一
  name: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface Review {
  id: string; // ✅ string 型に統一
  author: string;
  rating: number; // 1〜5
  content: string;
  date: string;
  service: string;
}

export interface Video {
  id: string; // ✅ string 型に統一
  thumbnail: string;
  title: string;
  duration: string;
  views: number;
  date: string;
}

// types/store.ts
export interface StoreRow {
  id: string;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  catch_copy?: string;
  image_url?: string;
  theme_color?: string;
  tags?: string[];
  created_at?: string;
}
