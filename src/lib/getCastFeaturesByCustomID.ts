<<<<<<< HEAD
// src/lib/getCastFeaturesByCustomID.ts
import qs from 'qs';
import { CastFeature } from '@/types/cast';

export const getCastFeaturesByCustomID = async (customID: string): Promise<CastFeature[]> => {
  const query = qs.stringify(
    {
      filters: {
        cast: { customID: { $eq: customID } },
        $or: [
          { feature_master: { category: { $eq: 'face' } } },
          { feature_master: { category: { $eq: 'MBTI' } } },
          {
            $and: [
              { feature_master: { category: { $eq: 'personality' } } },
              { value_boolean: { $eq: true } },
            ],
          },
          {
            $and: [
              { feature_master: { category: { $eq: 'appearance' } } },
              { value_boolean: { $eq: true } },
            ],
          },
        ],
      },
      populate: { feature_master: true },
    },
    { encodeValuesOnly: true },
  );

  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/cast-features?${query}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN_READ}`,
    },
    // ✅ ISRを有効にして毎回のAPIアクセスを回避
    next: {
      revalidate: 60, // ← 60秒キャッシュ（状況に応じて調整可能）
    },
  });

  if (!res.ok) throw new Error('Cast Feature fetch failed');

  const json = await res.json();
  return json.data as CastFeature[];
=======
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
>>>>>>> animation-test
};
