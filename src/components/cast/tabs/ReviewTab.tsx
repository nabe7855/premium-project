"use client";

import React from "react";

const ReviewTab = () => {
  // 仮口コミデータ
  const dummyReviews = [
    {
      id: 1,
      name: "ユーザーA",
      date: "2025/06/24",
      rating: 5,
      comment: "とても優しくて癒されました！また指名したいです♪",
    },
    {
      id: 2,
      name: "ユーザーB",
      date: "2025/06/22",
      rating: 4,
      comment: "対応が丁寧でした。予約して良かったです。",
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold text-pink-700">📝 口コミ</h2>

      {dummyReviews.map((review) => (
        <div
          key={review.id}
          className="bg-white shadow-sm border border-gray-200 rounded-lg p-4"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-gray-800">{review.name}</span>
            <span className="text-sm text-gray-500">{review.date}</span>
          </div>

          {/* 星評価（★4.5風の表示） */}
          <div className="text-yellow-400 mb-2">
            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
          </div>

          <p className="text-sm text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewTab;
