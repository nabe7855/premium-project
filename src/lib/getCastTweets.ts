import { supabase } from './supabaseClient';
import { CastTweet } from '@/types/cast-dashboard';

export async function getCastTweets(castId: string): Promise<CastTweet[]> {
  const { data, error } = await supabase
    .from('cast_tweets')
    .select('*')
    .eq('cast_id', castId)
    .gt('expires_at', new Date().toISOString()) // 期限内のみ
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ つぶやき取得エラー:', error.message);
    return [];
  }

  return data as CastTweet[];
}

export async function postCastTweet(castId: string, content: string) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('cast_tweets')
    .insert([{ cast_id: castId, content, expires_at: expiresAt }]);

  if (error) {
    console.error('❌ 投稿エラー:', error.message);
    throw error;
  }

  return data;
}
