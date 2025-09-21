import { supabase } from "@/lib/supabaseClient";
import { Review, ReviewRaw } from "@/types/review";

interface ReviewTag {
  id: string;
  name: string;
  category: string;
}

// snake_case → camelCase に変換
function mapReview(raw: ReviewRaw): Review {
  return {
    id: raw.id,
    castId: raw.cast_id,
    userName: raw.user_name || "匿名希望",
    rating: raw.rating,
    comment: raw.comment,
    createdAt: raw.created_at,
    tags: (raw.review_tag_links ?? []).map(
      (l) => l.review_tag_master.name
    ),
  };
}

// ✅ キャストごとの口コミ一覧を取得
export async function getCastReviews(castId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      cast_id,
      user_name,
      rating,
      comment,
      created_at,
      review_tag_links (
        review_tag_master ( id, name )
      )
    `
    )
    .eq("cast_id", castId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ レビュー取得エラー:", error.message);
    throw error;
  }

  return ((data as unknown) as ReviewRaw[] ?? []).map(mapReview);
}

// ✅ 口コミ投稿
export async function postReview(
  castId: string,
  userName: string,
  rating: number,
  comment: string,
  tagIds: string[] = []
): Promise<Review> {
  // 1. reviews に投稿
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .insert([{ cast_id: castId, user_name: userName || "匿名希望", rating, comment }])
    .select()
    .single();

  if (reviewError) {
    console.error("❌ レビュー投稿エラー:", reviewError.message);
    throw reviewError;
  }

  // 2. タグを review_tag_links に登録
  if (tagIds.length > 0) {
    const links = tagIds.map((tagId) => ({
      review_id: review.id,
      tag_id: tagId,
    }));

    const { error: tagError } = await supabase
      .from("review_tag_links")
      .insert(links);

    if (tagError) {
      console.error("❌ タグ登録エラー:", tagError.message);
      throw tagError;
    }
  }

  return mapReview(review as ReviewRaw);
}

// ✅ タグマスタ一覧を取得
export async function getReviewTags(): Promise<ReviewTag[]> {
  const { data, error } = await supabase
    .from("review_tag_master")
    .select("id, name, category")
    .eq("is_active", true)
    .order("category", { ascending: true });

  if (error) {
    console.error("❌ タグマスタ取得エラー:", error.message);
    throw error;
  }

  return data ?? [];
}
