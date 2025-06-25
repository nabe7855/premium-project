import qs from "qs";
import { CastSummary, GalleryItem } from "@/types/cast";

export const getCastBySlug = async (slug: string): Promise<CastSummary | null> => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        GalleryItem: true,
      },
    },
    { encodeValuesOnly: true }
  );

  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/casts?${query}`;
  console.log("🔍 Fetching cast data with URL:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN_READ}`,
    },
    cache: 'no-store', // ✅ 念のためキャッシュ無効
  });

  if (!res.ok) {
    console.error("❌ Fetch failed:", res.status, res.statusText);
    return null;
  }

  const json = await res.json();
  const item = json.data?.[0];

  if (!item) {
    console.warn("⚠️ No cast found for slug:", slug);
    return null;
  }

  // ✅ GalleryItem の型安全な変換
  const galleryItems: GalleryItem[] = Array.isArray(item.GalleryItem)
    ? item.GalleryItem.map((img: GalleryItem) => ({
        id: img.id,
        imageUrl: img.imageUrl ?? "",
        videoUrl: img.videoUrl ?? null,
        caption: img.caption ?? null,
        type: img.type ?? "image",
      }))
    : [];

  const result: CastSummary = {
    id: item.id,
    slug: item.slug ?? "",
    name: item.name ?? "",
    catchCopy: item.catchCopy ?? "",
    stillwork: item.stillwork ?? false,
    imageUrl: galleryItems[0]?.imageUrl ?? null,
    galleryItems,
  };

  console.log("🎯 Parsed cast summary:", result);
  return result;
};
