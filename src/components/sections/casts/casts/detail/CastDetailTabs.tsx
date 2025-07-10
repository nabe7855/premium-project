'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, Calendar, MessageCircle, Play, Star } from 'lucide-react';
import { Cast, Review } from '@/types/caststypes';
import VideoContent from './VideoContent';

interface CastDetailTabsProps {
  cast: Cast;
  activeTab: 'basic' | 'story' | 'schedule' | 'reviews' | 'videos';
  isSticky: boolean;
  castReviews: Review[];
  isLoadingReviews: boolean;
  onTabChange: (tab: 'basic' | 'story' | 'schedule' | 'reviews' | 'videos') => void;
  onBookingOpen: () => void;
  onReviewOpen: () => void;
}

// 直近2週間のスケジュールを取得する関数
const getTwoWeeksSchedule = (availability: { [key: string]: string[] }) => {
  const schedule: { [key: string]: string[] } = {};
  const today = new Date();

  // 直近14日間のスケジュールを生成
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0];

    // 既存のスケジュールがあればそれを使用、なければ空配列
    schedule[dateString] = availability[dateString] || [];
  }

  return schedule;
};

export const CastDetailTabs: React.FC<CastDetailTabsProps> = ({
  cast,
  activeTab,
  isSticky,
  castReviews = [],
  isLoadingReviews,
  onTabChange,
  onBookingOpen,
  onReviewOpen,
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'basic', label: '基本情報', icon: User },
    { id: 'story', label: 'ストーリー', icon: BookOpen },
    { id: 'schedule', label: 'スケジュール', icon: Calendar },
    { id: 'reviews', label: '口コミ', icon: MessageCircle, count: castReviews.length },
    { id: 'videos', label: '動画', icon: Play },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* タブナビゲーション */}
      <div
        ref={tabsRef}
        className={`border-b border-neutral-200 bg-white transition-all duration-200 ${
          isSticky ? 'fixed left-0 right-0 top-36 z-30 shadow-md' : 'relative'
        }`}
      >
        <div className="mx-auto max-w-7xl">
          {/* モバイル用横スクロールタブ */}
          <div className="scrollbar-hide flex overflow-x-auto px-4 py-1 sm:px-6 lg:px-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id as any)}
                  className={`flex min-w-max items-center whitespace-nowrap border-b-2 px-4 py-3 font-medium transition-colors duration-200 sm:px-5 sm:py-4 ${
                    activeTab === tab.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-transparent text-neutral-600 hover:border-neutral-200 hover:text-neutral-800'
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4 flex-shrink-0 sm:mr-3 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 sm:ml-3">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className={isSticky ? 'mt-20' : ''}>
        {activeTab === 'basic' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* 基本情報カード */}
            <div className="rounded-xl bg-white p-4 shadow-soft sm:rounded-2xl sm:p-6">
              <h3 className="mb-4 text-lg font-semibold text-neutral-800 sm:mb-6 sm:text-xl">
                基本情報
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600 sm:text-base">年齢</span>
                    <span className="text-sm font-medium text-neutral-800 sm:text-base">
                      {cast.age}歳
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600 sm:text-base">評価</span>
                    <div className="flex items-center">
                      <span className="mr-1 text-sm font-medium text-neutral-800 sm:text-base">
                        {cast.rating}
                      </span>
                      <span className="text-amber-400">⭐</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600 sm:text-base">口コミ数</span>
                    <span className="text-sm font-medium text-neutral-800 sm:text-base">
                      {cast.reviewCount}件
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-600 sm:text-base">出勤状況</span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        cast.isOnline
                          ? 'bg-green-100 text-green-700'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {cast.isOnline ? '本日出勤' : 'お休み'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* プロフィール詳細 */}
            <div className="rounded-xl bg-white p-4 shadow-soft sm:rounded-2xl sm:p-6">
              <h4 className="mb-3 text-base font-semibold text-neutral-800 sm:mb-4 sm:text-lg">
                自己紹介
              </h4>
              <p className="mb-4 text-sm leading-relaxed text-neutral-600 sm:mb-6 sm:text-base">
                {cast.profile.introduction}
              </p>

              <h4 className="mb-3 text-base font-semibold text-neutral-800 sm:mb-4 sm:text-lg">
                経験・実績
              </h4>
              <p className="mb-4 text-sm leading-relaxed text-neutral-600 sm:mb-6 sm:text-base">
                {cast.profile.experience}
              </p>

              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div>
                  <h4 className="mb-3 text-base font-semibold text-neutral-800 sm:text-lg">
                    得意分野
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {cast.profile.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-primary sm:px-3 sm:text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-base font-semibold text-neutral-800 sm:text-lg">趣味</h4>
                  <div className="flex flex-wrap gap-2">
                    {cast.profile.hobbies.map((hobby) => (
                      <span
                        key={hobby}
                        className="rounded-full bg-neutral-100 px-2 py-1 text-xs text-neutral-700 sm:px-3 sm:text-sm"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* フレーバータグ */}
            <div className="rounded-xl bg-white p-4 shadow-soft sm:rounded-2xl sm:p-6">
              <h4 className="mb-4 text-base font-semibold text-neutral-800 sm:text-lg">
                フレーバータグ
              </h4>
              <div className="flex flex-wrap gap-2">
                {cast.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-2 text-sm font-medium text-primary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 魅力チャート */}
            <div className="rounded-xl bg-white p-4 shadow-soft sm:rounded-2xl sm:p-6">
              <h4 className="mb-4 text-base font-semibold text-neutral-800 sm:mb-6 sm:text-lg">
                魅力チャート
              </h4>
              <div className="space-y-3 sm:space-y-4">
                {cast.radarData.map((item) => (
                  <div key={item.label} className="flex items-center">
                    <div className="flex flex-1 items-center">
                      <span className="mr-2 text-lg sm:mr-3 sm:text-xl">{item.emoji}</span>
                      <span className="flex-1 text-xs text-neutral-700 sm:text-sm">
                        {item.label}
                      </span>
                    </div>
                    <div className="ml-2 flex items-center sm:ml-4">
                      <div className="mr-2 h-2 w-16 rounded-full bg-neutral-200 sm:mr-3 sm:w-24">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.value / 5) * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                      <span className="w-6 text-right text-xs font-semibold text-neutral-800 sm:w-8 sm:text-sm">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'story' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white p-4 shadow-soft sm:rounded-2xl sm:p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-neutral-800 sm:mb-6 sm:text-xl">
              私のストーリー
            </h3>
            <div className="prose prose-sm sm:prose-lg max-w-none">
              <p className="text-sm leading-relaxed text-neutral-700 sm:text-base lg:text-lg">
                {cast.story}
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'schedule' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white p-4 shadow-soft sm:rounded-2xl sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h3 className="text-lg font-semibold text-neutral-800 sm:text-xl">
                出勤スケジュール
              </h3>
              <button
                onClick={onBookingOpen}
                className="rounded-full bg-primary px-3 py-2 text-sm text-white transition-colors duration-200 hover:bg-primary/90 sm:px-6 sm:text-base"
              >
                予約する
              </button>
            </div>

            <div className="max-h-96 space-y-3 overflow-y-auto sm:space-y-4">
              {Object.entries(getTwoWeeksSchedule(cast.availability)).map(([date, times]) => {
                const dateObj = new Date(date);
                const isToday = date === new Date().toISOString().split('T')[0];
                const isTomorrow = (() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  return date === tomorrow.toISOString().split('T')[0];
                })();
                const dayOfWeek = dateObj.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                return (
                  <div
                    key={date}
                    className={`flex flex-col rounded-lg border p-3 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between sm:rounded-xl sm:p-4 ${
                      isToday
                        ? 'border-primary bg-primary/5'
                        : isTomorrow
                          ? 'border-blue-300 bg-blue-50'
                          : isWeekend
                            ? 'border-orange-200 bg-orange-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="mb-2 sm:mb-0">
                      <div
                        className={`flex items-center text-sm font-medium sm:text-base ${
                          isToday
                            ? 'text-primary'
                            : isTomorrow
                              ? 'text-blue-600'
                              : isWeekend
                                ? 'text-orange-600'
                                : 'text-neutral-800'
                        }`}
                      >
                        {dateObj.toLocaleDateString('ja-JP', {
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short',
                        })}
                        {isToday && (
                          <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                            今日
                          </span>
                        )}
                        {isTomorrow && (
                          <span className="ml-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                            明日
                          </span>
                        )}
                        {isWeekend && !isToday && !isTomorrow && (
                          <span className="ml-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                            週末
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {times.length > 0 ? (
                        times.map((time) => (
                          <span
                            key={time}
                            className={`rounded-full px-2 py-1 text-xs font-medium sm:px-3 sm:text-sm ${
                              isToday ? 'bg-primary/20 text-primary' : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {time}
                          </span>
                        ))
                      ) : (
                        <span
                          className={`rounded-full px-2 py-1 text-xs sm:px-3 sm:text-sm ${
                            isWeekend
                              ? 'bg-orange-100 text-orange-600'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          お休み
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-lg bg-neutral-50 p-3">
              <p className="text-center text-xs text-neutral-600">
                💡 直近2週間のスケジュールを表示しています
              </p>
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* 固定ヘッダー - 口コミ投稿ボタン */}
            <div className="sticky top-0 z-20 -mx-4 border-b border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 sm:py-4">
              <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 sm:text-xl">
                      お客様の声
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      {castReviews.length > 0
                        ? `${castReviews.length}件の口コミ`
                        : '口コミはまだありません'}
                    </p>
                  </div>
                  <button
                    onClick={onReviewOpen}
                    className="flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-md transition-colors duration-200 hover:bg-primary/90 hover:shadow-lg sm:px-6 sm:py-3 sm:text-base"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    口コミを投稿
                  </button>
                </div>
              </div>
            </div>

            {/* 口コミコンテンツ */}
            <div className="rounded-xl bg-white p-4 shadow-soft sm:rounded-2xl sm:p-6">
              {isLoadingReviews ? (
                <div className="py-8 text-center sm:py-12">
                  <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="text-neutral-600">口コミを読み込み中...</p>
                </div>
              ) : castReviews.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* 口コミ一覧 */}
                  {castReviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-lg border border-neutral-200 p-4 transition-shadow duration-200 hover:shadow-md sm:rounded-xl sm:p-6"
                    >
                      <div className="mb-3 flex flex-col sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-2 flex items-center sm:mb-0">
                          <div className="mr-2 flex text-amber-400 sm:mr-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 sm:h-5 sm:w-5 ${i < review.rating ? 'fill-current' : 'text-neutral-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-neutral-800 sm:text-base">
                            {review.author}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-500 sm:text-sm">{review.date}</span>
                      </div>

                      <p className="mb-3 text-sm leading-relaxed text-neutral-700 sm:mb-4 sm:text-base">
                        {review.comment}
                      </p>

                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {review.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-secondary px-2 py-1 text-xs text-primary sm:px-3 sm:text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center sm:py-12">
                  <div className="mb-4">
                    <MessageCircle className="mx-auto h-12 w-12 text-neutral-300 sm:h-16 sm:w-16" />
                  </div>
                  <h4 className="mb-2 text-base font-medium text-neutral-600 sm:text-lg">
                    まだ口コミがありません
                  </h4>
                  <p className="mb-4 text-sm text-neutral-500 sm:mb-6 sm:text-base">
                    最初の口コミを投稿してみませんか？
                  </p>
                  <button
                    onClick={onReviewOpen}
                    className="rounded-full bg-primary px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-primary/90 sm:px-6 sm:py-3 sm:text-base"
                  >
                    口コミを投稿する
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'videos' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl bg-white shadow-soft sm:rounded-2xl"
          >
            <VideoContent cast={cast} />
          </motion.div>
        )}
      </div>
    </div>
  );
};
