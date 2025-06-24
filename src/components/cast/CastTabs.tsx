// components/cast/CastTabs.tsx
"use client";
import { useState } from "react";
import CastInfoTab from "./tabs/CastInfoTab";
import ReviewTab from "./tabs/ReviewTab";
import ScheduleTab from "./tabs/ScheduleTab";
import GalleryTab from "./tabs/GalleryTab";

const tabs = [
  { label: "基本情報", key: "info" },
  { label: "口コミ", key: "review" },
  { label: "出勤", key: "schedule" },
  { label: "ギャラリー", key: "gallery" },
];

const CastTabs = () => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="px-4">
      {/* タブ切り替えボタン */}
      <div className="flex gap-4 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-1 border-b-2 ${
              activeTab === tab.key ? "border-pink-500 text-pink-700" : "border-transparent text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブの中身 */}
      <div className="mt-4">
        {activeTab === "info" && <CastInfoTab />}
        {activeTab === "review" && <ReviewTab />}
        {activeTab === "schedule" && <ScheduleTab />}
        {activeTab === "gallery" && <GalleryTab />}
      </div>
    </div>
  );
};

export default CastTabs;
