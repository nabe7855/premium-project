"use client";

import React from "react";

const CastInfoTab = () => {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      {/* NEWバッジ・受付状況 */}
      <div className="flex items-center gap-4">
        <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded">
          🆕 NEW
        </span>
        <span className="text-green-600 font-semibold">受付中</span>
      </div>

      {/* 年齢・身長・体重 */}
      <div className="grid grid-cols-3 text-center border border-gray-200 rounded-md">
        <div className="py-2 border-r border-gray-200">
          <p className="text-xs text-gray-500">年齢</p>
          <p className="font-semibold">22歳</p>
        </div>
        <div className="py-2 border-r border-gray-200">
          <p className="text-xs text-gray-500">身長</p>
          <p className="font-semibold">160cm</p>
        </div>
        <div className="py-2">
          <p className="text-xs text-gray-500">体重</p>
          <p className="font-semibold">48kg</p>
        </div>
      </div>

      {/* 自己紹介文（仮） */}
      <div>
        <p className="font-bold text-pink-700 mb-1">自己紹介</p>
        <p className="leading-relaxed">
          はじめまして！元気いっぱいのTaikiです🍓 趣味はカフェ巡りと映画鑑賞♪
          お話しするのが大好きなので、たくさんお話ししましょう〜！
        </p>
      </div>
    </div>
  );
};

export default CastInfoTab;
