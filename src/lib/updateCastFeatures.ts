// src/lib/updateCastFeatures.ts
import { supabase } from './supabaseClient';

export async function updateCastFeatures(castId: string, featureIds: string[]) {
  // 既存削除
  await supabase.from('cast_features').delete().eq('cast_id', castId);

  // 新規挿入
  if (featureIds.length > 0) {
    const rows = featureIds.map((fid) => ({
      cast_id: castId,
      feature_id: fid,
    }));
    const { data, error } = await supabase.from('cast_features').insert(rows);
    if (error) throw error;
    return data;
  }

  return [];
}
