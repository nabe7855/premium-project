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
    { encodeValuesOnly: true }
  );

  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/cast-features?${query}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN_READ}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Cast Feature fetch failed');

  const json = await res.json();
  return json.data as CastFeature[];
};
