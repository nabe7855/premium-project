import { CastFeature } from '@/types/cast';
import { supabase } from './supabaseClient';

export const getCastFeaturesByCustomID = async (id: string): Promise<CastFeature[]> => {
  const { data, error } = await supabase
    .from('cast_features')
    .select(
      `
      id,
      cast_id,
      feature_id,
      level,
      feature_master:cast_features_feature_id_fkey (
        id,
        category,
        name
      )
    `,
    )
    .eq('cast_id', id);

  if (error) {
    console.error(`❌ Cast Feature fetch failed [ID: ${id}]`, error.message);
    return [];
  }

  return (data as any[]) || [];
};
