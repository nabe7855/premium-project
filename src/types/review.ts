// Supabaseから取ってくる生データ (snake_case)
export interface ReviewRaw {
  id: string;
  cast_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  user_age_group?: number | null; // ✅ 追加: 年代 (10, 20, 30...)

  casts: {
    id: string;
    slug: string;
    name: string;
    main_image_url?: string | null;
    is_active: boolean; // 👈 型に追加
    cast_store_memberships: {
      stores: {
        id: string;
        slug: string;
        name: string;
      };
    }[];
  } | null;

  review_tag_links: {
    review_tag_master: {
      id: string;
      name: string;
    } | null;
  }[];
}

// フロント用 (camelCase)
export interface Review {
  id: string;

  // 紐づくキャスト
  castId: string;          // DB用のID (UUIDなど)
  castSlug?: string;       // URL用（/cast/[slug] に対応）
  castName?: string;
  castImage?: string;

  // 紐づく店舗
  storeSlug?: string;      // URL用（/store/[slug] に対応）

  // レビュー内容
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  tags: string[];

  // ✅ 解析用（UIでは表示しない）
  userAgeGroup?: number;   // 10 → 10代, 20 → 20代 ...
}
