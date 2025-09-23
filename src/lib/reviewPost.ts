import { supabase } from "@/lib/supabaseClient";
import { Review, ReviewRaw } from "@/types/review";
import { mapReview } from "./mappers/reviewMapper";

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
    .insert([
      {
        cast_id: castId,
        user_name: userName || "匿名希望",
        rating,
        comment,
      },
    ])
    .select(
      `
      id,
      cast_id,
      user_name,
      rating,
      comment,
      created_at
    `
    )
    .single<ReviewRaw>();

  if (reviewError) {
    console.error("❌ レビュー投稿エラー:", reviewError.message);
    throw reviewError;
  }

  if (!review) {
    throw new Error("レビューが作成されませんでした");
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

  // 3. 最新のレビューを再取得（タグも含める）
  const { data: fullReview, error: fetchError } = await supabase
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
    .eq("id", review.id)
    .single<ReviewRaw>();

  if (fetchError) {
    console.error("❌ 投稿後のレビュー再取得エラー:", fetchError.message);
    throw fetchError;
  }

  return mapReview(fullReview);
}

// ✅ タグ一覧を取得
export async function getReviewTags(): Promise<{ id: string; name: string }[]> {
  const { data, error } = await supabase
    .from("review_tag_master")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("❌ タグ取得エラー:", error.message);
    throw error;
  }

  return data ?? [];
}
