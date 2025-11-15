// lib/reviewTags.ts
import { supabase } from "@/lib/supabaseClient";

export interface ReviewTag {
  id: string;
  name: string;
  category: string;
}

export async function getReviewTags(): Promise<ReviewTag[]> {
  const { data, error } = await supabase
    .from("review_tag_master")
    .select("id, name, category")
    .eq("is_active", true) // 使用中のみ
    .order("category", { ascending: true });

  if (error) {
    console.error("❌ タグマスタ取得エラー:", error.message);
    throw error;
  }

  return data ?? [];
}
