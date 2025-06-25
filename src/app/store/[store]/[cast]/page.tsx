import { getCastBySlug } from "@/lib/getCastData";
import CastHeader from "@/components/cast/CastHeader";
import CastTabs from "@/components/cast/CastTabs";
import ImageCarousel from "@/components/ui/ImageCarousel"; // 🆕 追加！

interface CastDetailPageProps {
  params: { store: string; cast: string };
}

const CastDetailPage = async ({ params }: CastDetailPageProps) => {
  const { cast } = params;

  console.log("🔍 [CastDetailPage] params:", params);

  if (!cast || typeof cast !== "string") {
    console.error("❌ 無効なURLです:", cast);
    return (
      <div className="text-center p-8 text-red-500">
        無効なURLです。
      </div>
    );
  }

  const castData = await getCastBySlug(cast);

  if (!castData || !castData.stillwork) {
    console.warn("⚠️ キャストが見つからないか非公開です:", castData);
    return (
      <div className="text-center p-8 text-gray-500">
        現在このセラピストの情報は表示できません。
      </div>
    );
  }

  return (
    <div className="bg-pink-50 min-h-screen">
      
      {/* 🖼️ ギャラリーがあれば表示 */}
      {castData.galleryItems && castData.galleryItems.length > 0 && (
        <div className="px-4 py-6">
          <ImageCarousel items={castData.galleryItems} />
        </div>
      )}

      {/* 🔽 タブを表示 */}
      <CastTabs cast={castData} />
    </div>
  );
};

export default CastDetailPage;
