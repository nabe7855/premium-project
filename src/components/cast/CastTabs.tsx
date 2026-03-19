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
        rootMargin: "-64px 0px 0px 0px", // ✅ ヘッダー底面（2+14=16=64px）に合わせる
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
        className={`z-40 transition-all duration-300 ${
          isSticky 
            ? "sticky top-[60px] md:top-[68px] bg-white shadow-xl rounded-t-2xl mx-[-16px] px-4 ring-1 ring-black/5" 
            : "bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20"
        }`}
      >
        {/* 上段：アクションボタン */}
        <div className="flex justify-center gap-2 py-4">
          <a
            href={cast.diaryUrl || "#"}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-br from-pink-400 to-rose-400 text-white text-xs font-bold shadow-sm active:scale-95 transition-transform"
          >
            📸 写メ日記
          </a>
          <a
            href={cast.snsUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-400 text-white text-xs font-bold shadow-sm active:scale-95 transition-transform"
          >
            📸 SNSリンク
          </a>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-transform"
          >
            📅 予約する
          </button>
        </div>

        {/* 下段：ナビゲーションタブ */}
        <div className="flex w-full overflow-x-auto gap-3 border-t border-gray-50 pb-1 pt-1 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-4 py-3 text-[13px] font-bold transition-all relative ${
                activeTab === tab.key
                  ? "text-pink-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-2 right-2 h-1 bg-pink-500 rounded-full" />
              )}
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
