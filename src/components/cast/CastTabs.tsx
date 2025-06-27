"use client";

import { useState, useRef, useEffect } from "react";
import CastInfoTab from "./tabs/CastInfoTab";
import ReviewTab from "./tabs/ReviewTab";
import ScheduleTab from "./tabs/ScheduleTab";
import GalleryTab from "./tabs/GalleryTab";
import CharacterTab from "./tabs/CharacterTab";
import { CastSummary } from "@/types/cast";

const tabs = [
  { label: "基本情報", key: "info" },
  { label: "キャラクター", key: "character" },
  { label: "口コミ", key: "review" },
  { label: "出勤予定", key: "schedule" },
  { label: "ギャラリー", key: "gallery" },
];

interface CastTabsProps {
  cast: CastSummary;
}

const CastTabs: React.FC<CastTabsProps> = ({ cast }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      {
        threshold: 0,
        rootMargin: "-80px 0px 0px 0px", // ✅ ヘッダー高さより少し上（例: ヘッダーが56pxなら-60px前後）
      }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="px-4">
      {/* ✅ Sticky 発動タイミングを調整したい基準位置 */}
      <div ref={stickyRef} className="h-1" />

      {/* Sticky領域 */}
      <div
        className={`z-50 transition-all duration-300 ${
          isSticky ? "sticky top-[56px] bg-pink-50 shadow" : ""
        }`}
      >
        {/* 上段：ボタン */}
        <div className="flex justify-center gap-3 py-2 border-b">
          <a
            href={cast.diaryUrl || "#"}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-medium"
          >
            📸 写メ日記
          </a>
          <a
            href={cast.snsUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
          >
            🐦 SNSリンク
          </a>
        </div>

        {/* 下段：タブ */}
        <div className="flex w-full overflow-x-auto gap-4 border-b pb-2 pt-2 justify-center">
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
