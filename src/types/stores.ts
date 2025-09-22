export interface StoreStats {
  quality: number;
  variety: number;
  service: number;
  rarity: number;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  title: string;
  portraitUrl: string;
  fullImageUrl: string;
  stats: StoreStats;   // ←ここが必須
  description: string;
  bannerImage: string;
  themeColor: string;
  tags: string[];
}
