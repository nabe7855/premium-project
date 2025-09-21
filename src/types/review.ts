// Supabaseから返ってくるそのままの型 (snake_case)
export interface ReviewRaw {
  id: string;
  cast_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  review_tag_links?: {
    review_tag_master: {
      id: string;
      name: string;
    };
  }[];
}

// フロント用 (camelCase)
export interface Review {
  id: string;
  castId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  tags: string[];
}
