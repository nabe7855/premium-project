// app/store/[store]/cast/[slug]/page.tsx
import CastHeader from "@/components/cast/CastHeader";
import CastTabs from "@/components/cast/CastTabs";

const CastDetailPage = () => {
  return (
    <div className="bg-pink-50 min-h-screen">
      {/* ヘッダー（名前・画像など） */}
      <CastHeader />

      {/* タブエリア */}
      <CastTabs />
    </div>
  );
};

export default CastDetailPage;
