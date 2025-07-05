import qs from 'qs';
import { CastSummary, GalleryItem } from '@/types/cast';

export const getCastBySlug = async (slug: string): Promise<CastSummary | null> => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        galleryItems: true, // 小文字に修正
      },
    },
    { encodeValuesOnly: true },
  );

  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/casts?${query}`;
  console.log('🔍 Fetching cast data with URL:', url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN_READ}`,
    },
    cache: 'no-store', // キャッシュ無効
  });

  if (!res.ok) {
    console.error('❌ Fetch failed:', res.status, res.statusText);
    return null;
  }

  const json = await res.json();
  const item = json.data?.[0];

  if (!item) {
    console.warn('⚠️ No cast found for slug:', slug);
    return null;
  }

  // galleryItemsの型変換
  const galleryItems: GalleryItem[] = Array.isArray(item.galleryItems)
    ? item.galleryItems.map((img: GalleryItem) => ({
        id: img.id,
        imageUrl: img.imageUrl ?? '', // デフォルト値
        videoUrl: img.videoUrl ?? null, // 動画URLがない場合はnull
        caption: img.caption ?? '', // キャプションがない場合は空文字
        type: img.type ?? 'image', // タイプがない場合はデフォルトで'image'
      }))
    : [];

  // CastSummaryに合わせたデータ構造
  const result: CastSummary = {
    id: item.id,
    slug: item.slug ?? '', // slugがなければ空文字
    name: item.name ?? '',
    catchCopy: item.catchCopy ?? '',
    stillwork: item.stillwork ?? false, // stillworkがない場合はfalse
    imageUrl: item.imageUrl ?? '',
    galleryItems: galleryItems, // 修正済みのgalleryItemsを使用
    height: item.height ?? 0, // デフォルト値0
    weight: item.weight ?? 0, // デフォルト値0
    age: item.age ?? 0, // デフォルト値0
    bloodType: item.bloodType ?? '', // デフォルト値空文字
    customID: item.customID ?? '', // デフォルト値空文字
    isWorking: item.isWorking ?? false, // isWorkingがなければfalse
  };

  console.log('🎯 Parsed cast summary:', result);
  return result;
};
