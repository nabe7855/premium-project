import CastHeader from "@/components/cast/CastHeader";
import CastTabs from "@/components/cast/CastTabs";

const CastDetailPage = () => {
  return (
    <div className="bg-pink-50 min-h-screen">
      {/* ヘッダー（名前・画像など） */}
      <CastHeader
        name="Taiki"
        catchCopy="癒し系でまったりおしゃべり好き♪"
        imageUrl="/no-image.png"
      />

      {/* タブエリア */}
      <CastTabs />
    </div>
  );
};

export default CastDetailPage;

