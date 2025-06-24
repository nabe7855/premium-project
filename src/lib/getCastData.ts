import qs from "qs";
import { CastSummary } from "@/types/cast";

export const getCastBySlug = async (slug: string): Promise<CastSummary | null> => {
  const query = qs.stringify({
    populate: ["GalleryItem"],
  }, { encodeValuesOnly: true });

  const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/casts?${query}`;

  console.log("🔍 Fetching cast data with URL:", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN_READ}`,
    },
  });

  if (!res.ok) {
    console.error("❌ Fetch failed:", res.status, res.statusText);
    return null;
  }

  const data = await res.json();
  console.log("✅ Raw cast response:", data);
  console.log("🔍 Looking for slug:", slug);
  console.log("🔍 Available slugs:", data.data?.map((d: any) => d.slug));

  const item = data.data?.find((d: any) => d.slug?.toLowerCase() === slug.toLowerCase());
  if (!item) {
    console.warn("⚠️ No cast found for slug:", slug);
    return null;
  }

  const result: CastSummary = {
    id: item.id,
    slug: item.slug ?? "",
    name: item.name ?? "",
    catchCopy: item.catchCopy ?? "",
    stillwork: item.stillwork ?? false,
    imageUrl: item.GalleryItem?.[0]?.imageUrl ?? null,
  };

  console.log("🎯 Parsed cast summary:", result);

  return result;
};
