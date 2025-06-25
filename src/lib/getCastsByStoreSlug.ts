import { Cast, GalleryItem, CastSNS } from '@/types/cast';
import qs from 'qs';

interface StrapiCastItem {
  id: number;
  slug: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  catchCopy?: string;
  SNSURL?: string;
  GalleryItem?: GalleryItem[];
  isNew?: boolean;
  sexinessLevel?: number;
  stillwork?: boolean | string;
  isReception?: boolean;
}

interface StrapiResponse {
  data: StrapiCastItem[];
}

export const getCastsByStoreSlug = async (storeSlug: string): Promise<Cast[]> => {
  const query = qs.stringify(
    {
      filters: {
        store: {
          slug: {
            $eq: storeSlug,
          },
        },
        // stillwork の filter は Strapi 側で型によって効かない可能性があるため、フロント側で処理
      },
      populate: {
        GalleryItem: true,
        store: true,
      },
    },
    { encodeValuesOnly: true }
  );

  const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/casts?${query}`;
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN_READ;

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store', // ✅ 最新データを必ず取得
  });

  if (!res.ok) {
    console.error('❌ Strapi API fetch failed', res.status, res.statusText);
    throw new Error('Strapi API fetch failed');
  }

  const data: StrapiResponse = await res.json();

  // ✅ stillwork が true または "true" のみ通す
  const filtered = data.data.filter((item) => {
    const val = item.stillwork;
    return val === true || val === "true";
  });

  return filtered.map((item): Cast => {
    const galleryItems: GalleryItem[] = item.GalleryItem ?? [];
    console.log('🎯 galleryItems count:', galleryItems.length); 
    const firstImage = galleryItems.find((g) => g.imageUrl);

    const sns: CastSNS = {
      line: item.SNSURL ?? '',
    };

    return {
      id: item.id,
      slug: item.slug,
      name: item.name,
      age: item.age,
      height: item.height,
      weight: item.weight,
      catchCopy: item.catchCopy,
      imageUrl: firstImage?.imageUrl ?? null,
      galleryItems,
      sns,
      isNew: item.isNew ?? false,
      sexinessLevel: item.sexinessLevel ?? 0,
      isReception: item.isReception,
      stillwork: true, // ✅ ここは既に filter 済みなので true に固定でOK
    };
  });
};
