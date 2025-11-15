import { supabase } from './supabaseClient';
import { FeatureMaster } from '@/types/cast';

export async function getFeatureMasters(): Promise<FeatureMaster[]> {
  const { data, error } = await supabase
    .from('feature_master')
    .select('*')
    .order('category', { ascending: true });

  if (error) throw error;
  return data as FeatureMaster[];
}
