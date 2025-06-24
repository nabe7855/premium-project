"use client";

import React from "react";

const dummySchedules = [
  { date: "6/19（木）", times: ["18:00〜翌08:00"], reservedOut: false },
  { date: "6/20（金）", times: ["13:00〜16:00", "18:00〜翌08:00"], reservedOut: false },
  { date: "6/21（土）", times: ["13:30〜18:00"], reservedOut: false },
  { date: "6/22（日）", times: ["20:00〜翌08:00"], reservedOut: false },
  { date: "6/23（月）", times: ["11:00〜16:00", "18:00〜翌08:00"], reservedOut: false },
  { date: "6/24（火）", times: ["予約満了"], reservedOut: true },
  { date: "6/25（水）", times: ["08:00〜16:00", "18:00〜翌08:00"], reservedOut: false },
  { date: "6/26（木）", times: ["08:00〜16:00", "18:00〜翌08:00"], reservedOut: false },
  { date: "6/27（金）", times: ["休み"], reservedOut: true },
  { date: "6/28（土）", times: ["休み"], reservedOut: true },
  { date: "6/29（日）", times: ["休み"], reservedOut: true },
  { date: "6/30（月）", times: ["08:00〜16:00", "18:00〜翌08:00"], reservedOut: false },
];

const ScheduleTab = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold text-pink-700 mb-4">🗓️ 出勤スケジュール</h2>
      <div className="space-y-2">
        {dummySchedules.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between items-start md:items-center border rounded-md p-3 bg-white shadow-sm"
          >
            <div className="text-sm font-semibold w-24 text-pink-800">{item.date}</div>
            <div className="flex-1 space-y-1 mt-1 md:mt-0 md:ml-4">
              {item.times.map((time, i) => (
                <div key={i} className={`text-sm ${time === "予約満了" ? "text-yellow-600 font-bold" : ""}`}>
                  {time}
                </div>
              ))}
            </div>
            <div className="mt-2 md:mt-0 md:ml-4">
              {!item.reservedOut ? (
                <button className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600">
                  予約
                </button>
              ) : (
                <span className="text-gray-400 text-sm">ー</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleTab;
