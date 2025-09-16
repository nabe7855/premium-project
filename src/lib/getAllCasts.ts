import { Cast, GalleryItem, CastSNS as CastSNSType } from '@/types/cast';
import qs from 'qs';

// StrapiのAPIレスポンス型を定義
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
  stillwork?: boolean; // ✅ 追加（Boolean型）
  isReception?: boolean;
  is_active?: boolean;
}

interface StrapiResponse {
  data: StrapiCastItem[];
}

export const getAllCasts = async (): Promise<Cast[]> => {
  const query = qs.stringify(
    {
      filters: {
        stillwork: {
          $eq: true,
        },
      },
      populate: {
        GalleryItem: true,
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
  });

  if (!res.ok) {
    console.error('❌ Strapi API fetch failed', res.status, res.statusText);
    throw new Error('Strapi API fetch failed');
  }

  const data: StrapiResponse = await res.json();

  return data.data.map((item): Cast => {
    const galleryItems: GalleryItem[] = item.GalleryItem ?? [];
    const firstImage = galleryItems.find((g) => g.imageUrl);

    const sns: CastSNSType = {
      line: item.SNSURL ?? '',
    };

    return {
      id: String(item.id),
      slug: item.slug,
      name: item.name,
      age: item.age,
      height: item.height,
      weight: item.weight,
      catchCopy: item.catchCopy,
      imageUrl: firstImage?.imageUrl ?? undefined,
      galleryItems,
      sns,
      isNew: item.isNew ?? false,
      sexinessLevel: item.sexinessLevel ?? 0,
      isReception: item.isReception,
      stillwork: item.stillwork ?? true,
      isActive: item.is_active ?? true,
    };
  });
};
