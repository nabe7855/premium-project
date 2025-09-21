'use client';

import React, { useState, useEffect } from 'react';
import RadarChartComponent from '../RadarChart';
import SweetLevelGauge from '../SweetLevelGauge';
import RankSystem from '../RankSystem';
import MotivationBadges from '../MotivationBadges';
import { CastPerformance, CastLevel, Badge, CastTweet } from '@/types/cast-dashboard';
import { getCastTweets, postCastTweet } from '@/lib/getCastTweets';

interface DashboardHomeProps {
  performanceData: CastPerformance;
  levelData: CastLevel;
  badgesData: Badge[];
  castName: string;
  castId: string; // ← キャストIDを受け取る
}

export default function DashboardHome({
  performanceData,
  levelData,
  badgesData,
  castName,
  castId,
}: DashboardHomeProps) {
  const [tweetContent, setTweetContent] = useState('');
  const [tweets, setTweets] = useState<CastTweet[]>([]);

  useEffect(() => {
    loadTweets();
  }, []);

  async function loadTweets() {
    const data = await getCastTweets(castId);
    setTweets(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tweetContent.trim()) return;

    await postCastTweet(castId, tweetContent);
    setTweetContent('');
    loadTweets(); // 再取得
  }

  return (
    <div>
      {/* ヘッダー */}
      <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
        おかえりなさい、{castName} さん ✨
      </h2>
      <p className="text-sm text-gray-600 sm:text-base mb-4">
        今日も素敵な一日にしましょう！成長の記録を確認してみてください。
      </p>

      {/* 📝 つぶやきフォーム */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          最近あったことをつぶやいてみませんか？ ✍️
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            placeholder="今日は○○に行きました！"
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            投稿
          </button>
        </form>
      </div>

      {/* 📜 つぶやき一覧 */}
      <div className="mb-8">
        <h4 className="text-md font-semibold text-gray-700 mb-3">
          あなたのつぶやき (24時間以内)
        </h4>
        {tweets.length > 0 ? (
          tweets.map((tweet) => (
            <div key={tweet.id} className="bg-pink-50 rounded-lg p-3 mb-2 shadow-sm">
              <p className="text-gray-800 text-sm">{tweet.content}</p>
              <span className="text-xs text-gray-500">
                {new Date(tweet.created_at).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">まだつぶやきはありません。</p>
        )}
      </div>

      {/* 既存の成長データエリア */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <RadarChartComponent data={performanceData} />
        <SweetLevelGauge level={levelData} />
        <RankSystem currentLevel={levelData} />
        <MotivationBadges badges={badgesData} />
      </div>
    </div>
  );
}
