import { Cast, GalleryItem, CastSNS } from '@/types/cast';
import qs from 'qs';

interface StrapiCastItem {
  id: string;
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
  is_active?: boolean;
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
      },
      populate: {
        GalleryItem: true,
        store: true,
      },
    },
    { encodeValuesOnly: true },
  );

  const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/casts?${query}`;
  const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN_READ;

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // ✅ 最適なキャッシュ設定（ISR）
    next: {
      revalidate: 60, // ← 60秒ごとにデータを再取得してページ再生成
    },
  });

  if (!res.ok) {
    console.error('❌ Strapi API fetch failed', res.status, res.statusText);
    throw new Error('Strapi API fetch failed');
  }

  const data: StrapiResponse = await res.json();

  // ✅ stillwork が true または "true" のみ通す
  const filtered = data.data.filter((item) => {
    const val = item.stillwork;
    return val === true || val === 'true';
  });

  return filtered.map((item): Cast => {
    const galleryItems: GalleryItem[] = item.GalleryItem ?? [];
    const firstImage = galleryItems.find((g) => g.imageUrl);

    const sns: CastSNS = {
      line: item.SNSURL ?? '',
    };

    return {
      id: String(item.id),
      slug: item.slug,
      name: item.name,
      age: item.age?? undefined,
      height: item.height?? undefined,
      weight: item.weight?? undefined,
      catchCopy: item.catchCopy ?? undefined, // ✅ null を undefined に統一
      imageUrl: firstImage?.imageUrl ?? undefined,
      galleryItems,
      sns,
      isNew: item.isNew ?? false,
      sexinessLevel: item.sexinessLevel ?? 0,
      isReception: item.isReception,
      isActive: item.is_active ?? true,
      stillwork: true, // ここは filter 済みなので true に固定
    };
  });
};
