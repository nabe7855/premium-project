'use client';

import { getCastTweets, postCastTweet } from '@/lib/getCastTweets';
import { Badge, CastLevel, CastTweet } from '@/types/cast-dashboard';
import { Heart, MessageCircle, Send, Sparkles, TrendingUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import MotivationBadges from '../MotivationBadges';
import RadarChartComponent from '../RadarChart';
import RankSystem from '../RankSystem';
import SweetLevelGauge from '../SweetLevelGauge';

interface DashboardHomeProps {
  performanceData: Record<string, number>;
  levelData: CastLevel;
  badgesData: Badge[];
  castName: string;
  castId: string;
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
    loadTweets();
  }

  return (
    <div className="space-y-8 duration-700 animate-in fade-in">
      {/* ✨ Premium Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-600 via-rose-500 to-amber-500 p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Sparkles className="h-6 w-6 text-yellow-200" />
          </div>
          <h2 className="mb-2 text-3xl font-black tracking-tight sm:text-4xl">
            おかえりなさい、
            <br className="sm:hidden" />
            {castName} さん ✨
          </h2>
          <p className="max-w-lg font-medium text-pink-50/80">
            今日も素敵な一日にしましょう！あなたの成長と活躍を応援しています。
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Input and Stats */}
        <div className="space-y-8 lg:col-span-2">
          {/* 📝 Modern Tweet Form */}
          <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-xl shadow-pink-500/5">
            <div className="flex items-center gap-2 border-b border-pink-100 bg-pink-50/50 p-4">
              <MessageCircle className="h-5 w-5 text-pink-500" />
              <h3 className="font-bold text-gray-800">今の気持ちをつぶやく</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  value={tweetContent}
                  onChange={(e) => setTweetContent(e.target.value)}
                  maxLength={30}
                  placeholder="今日も元気に頑張ります✨"
                  className={`min-h-[120px] w-full resize-none rounded-xl border-2 bg-gray-50/50 p-4 pb-12 pr-16 text-gray-700 outline-none transition-all focus:bg-white focus:ring-4 ${
                    tweetContent.length >= 30
                      ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-500/10'
                      : 'border-gray-100 focus:border-pink-300 focus:ring-pink-500/5'
                  }`}
                />
                
                {/* Character Counter */}
                <div className="absolute bottom-6 left-4 flex items-center gap-1">
                  <span
                    className={`text-xs font-bold ${
                      tweetContent.length >= 30 ? 'text-rose-500' : 'text-gray-400'
                    }`}
                  >
                    {tweetContent.length}
                  </span>
                  <span className="text-xs text-gray-300">/</span>
                  <span className="text-xs text-gray-400">30</span>
                </div>

                <button
                  type="submit"
                  disabled={!tweetContent.trim()}
                  className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg shadow-pink-200 transition-all hover:scale-110 active:scale-95 disabled:opacity-30"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* 📜 Elegant Tweet Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-gray-800">
                <TrendingUp className="h-4 w-4 text-rose-500" />
                Your Recent Timeline
              </h4>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-400">
                Last 24h
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {tweets.length > 0 ? (
                tweets.map((tweet) => (
                  <div
                    key={tweet.id}
                    className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-pink-100 hover:shadow-md"
                  >
                    <div className="absolute left-0 top-0 my-2 h-full w-1 rounded-full bg-gradient-to-b from-pink-400 to-rose-400 opacity-50 group-hover:opacity-100" />
                    <p className="mb-2 font-medium leading-relaxed text-gray-800">
                      {tweet.content}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <Heart className="h-3 w-3 fill-rose-100 text-rose-400" />
                      {new Date(tweet.created_at).toLocaleString('ja-JP', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50 py-12">
                  <MessageCircle className="mb-2 h-8 w-8 text-gray-200" />
                  <p className="text-sm font-medium italic text-gray-400">
                    まだつぶやきはありません
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Performance Indicators */}
        <div className="space-y-8">
          <div className="delay-100 duration-700 animate-in slide-in-from-right">
            <RadarChartComponent data={performanceData} />
          </div>
          <div className="delay-200 duration-700 animate-in slide-in-from-right">
            <SweetLevelGauge level={levelData} />
          </div>
          <div className="delay-300 duration-700 animate-in slide-in-from-right">
            <RankSystem currentLevel={levelData} />
          </div>
          <div className="delay-400 duration-700 animate-in slide-in-from-right">
            <MotivationBadges badges={badgesData} />
          </div>
        </div>
      </div>
    </div>
  );
}
