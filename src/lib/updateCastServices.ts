// src/lib/updateCastServices.ts
import { supabase } from './supabaseClient';
import { FeatureMaster } from '@/types/cast';

/**
 * サービス内容を cast_features に保存する
 */
export async function updateCastServices(
  castId: string,
  services: { [key: string]: 'NG' | '要相談' | '普通' | '得意' },
  featureMasters: FeatureMaster[]
) {
  // サービス名 → feature_master.id に変換
  const rows = Object.entries(services).map(([name, level]) => {
    const match = featureMasters.find(
      (f) => f.category === 'service' && f.name === name
    );
    if (!match) {
      console.warn(`⚠️ サービス「${name}」が feature_master に存在しません`);
      return null;
    }
    return {
      cast_id: castId,
      feature_id: match.id,
      level,
    };
  }).filter(Boolean);

  if (rows.length === 0) return;

  const { error } = await supabase.from('cast_features').upsert(rows, {
    onConflict: 'cast_id,feature_id',
  });

  if (error) throw error;
}
