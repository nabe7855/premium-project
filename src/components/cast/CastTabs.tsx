"use client";

import { useState } from "react";
import CastInfoTab from "./tabs/CastInfoTab";
import ReviewTab from "./tabs/ReviewTab";
import ScheduleTab from "./tabs/ScheduleTab";
import GalleryTab from "./tabs/GalleryTab";
import { CastSummary } from "@/types/cast";
import CharacterTab from "./tabs/CharacterTab";

interface CastTabsProps {
  cast: CastSummary;
}


const tabs = [
  { label: "基本情報", key: "info" },
  { label: "キャラクター", key: "character" }, // 🆕 追加
  { label: "口コミ", key: "review" },
  { label: "出勤予定", key: "schedule" },
  { label: "ギャラリー", key: "gallery" },
];

const CastTabs: React.FC<CastTabsProps> = ({ cast }) => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="px-4">
      {/* タブボタン（横スクロール対応） */}
      <div className="overflow-x-auto mb-2">
        <div className="flex w-max min-w-full gap-4 border-b pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-3 py-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === tab.key
                  ? "border-pink-500 text-pink-700 font-bold"
                  : "border-transparent text-gray-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* タブ中身 */}
      <div className="mt-4">
        {activeTab === "info" && <CastInfoTab cast={cast} />}
        {activeTab === "character" && <CharacterTab cast={cast} />}
        {activeTab === "review" && <ReviewTab cast={cast} />}
        {activeTab === "schedule" && <ScheduleTab cast={cast} />}
        {activeTab === "gallery" && <GalleryTab cast={cast} />}
      </div>
    </div>
  );
};

export default CastTabs;
