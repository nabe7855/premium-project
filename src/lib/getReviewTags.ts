import { supabase } from './supabaseClient';

export interface ReviewTag {
  id: string;
  name: string;
}

export async function getReviewTags(): Promise<ReviewTag[]> {
  const { data, error } = await supabase
    .from('review_tag_master')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('❌ タグ取得エラー:', error.message);
    return [];
  }

  return data || [];
}
