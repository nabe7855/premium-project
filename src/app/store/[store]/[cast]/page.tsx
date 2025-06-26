import { getCastBySlug } from "@/lib/getCastData";
import CastHeader from "@/components/cast/CastHeader";
import CastTabs from "@/components/cast/CastTabs";

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
      {/* 🧑‍🎤 キャストのヘッダー部分（画像・名前・キャッチコピー） */}
      <CastHeader
        name={castData.name}
        catchCopy={castData.catchCopy}
        galleryItems={castData.galleryItems}
      />

      {/* 🔽 タブ表示（口コミ・出勤など） */}
      <CastTabs cast={castData} />
    </div>
  );
};

export default CastDetailPage;
