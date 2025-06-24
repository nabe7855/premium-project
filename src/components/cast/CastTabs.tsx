// components/cast/CastTabs.tsx
"use client";

import { useState } from "react";
import CastInfoTab from "./tabs/CastInfoTab";
import ReviewTab from "./tabs/ReviewTab";
import ScheduleTab from "./tabs/ScheduleTab";
import GalleryTab from "./tabs/GalleryTab";
import { CastSummary } from "@/types/cast"; // 型のインポートを忘れずに

// 🔧 props の型定義を追加
interface CastTabsProps {
  cast: CastSummary;
}

const tabs = [
  { label: "基本情報", key: "info" },
  { label: "口コミ", key: "review" },
  { label: "出勤", key: "schedule" },
  { label: "ギャラリー", key: "gallery" },
];

const CastTabs: React.FC<CastTabsProps> = ({ cast }) => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="px-4">
      {/* タブボタン */}
      <div className="flex gap-4 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-sm pb-1 border-b-2 text-center ${
              activeTab === tab.key
                ? "border-pink-500 text-pink-700"
                : "border-transparent text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブの中身 */}
      <div className="mt-4">
        {activeTab === "info" && <CastInfoTab cast={cast} />}
        {activeTab === "review" && <ReviewTab cast={cast} />}
        {activeTab === "schedule" && <ScheduleTab cast={cast} />}
        {activeTab === "gallery" && <GalleryTab cast={cast} />}
      </div>
    </div>
  );
};

export default CastTabs;
