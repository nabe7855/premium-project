'use client'

import React from 'react'
import { Cast, CastProfile } from '@/types/cast'
import CastTabBasicInformation from './CastTabBasicInformation'
import CastTabStory from './CastTabStory'
import CastTabSchedule from './CastTabSchedule'
import CastTabMovie from './CastTabMovie'
import CastTabReviewPage from './CastTabReviews'  // ✅ 追加：投稿フォーム本体

interface Tab {
  id: string
  label: string
  icon: any
  count?: number
}

interface CastDetailTabsProps {
  cast: Cast
  castProfile?: CastProfile
  activeTab: 'basic' | 'story' | 'schedule' | 'reviews' | 'videos'
  tabs: Tab[]
  isSticky: boolean
  onTabChange: (tab: 'basic' | 'story' | 'schedule' | 'reviews' | 'videos') => void
  onBookingOpen: () => void
  storeSlug: string   // ✅ propsとして受け取る
}

export const CastDetailTabs: React.FC<CastDetailTabsProps> = ({
  cast,
  castProfile,
  activeTab,
  onBookingOpen,
  storeSlug,   // ✅ propsから受け取る
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        {/* 基本情報 */}
        {activeTab === 'basic' && castProfile && (
          <CastTabBasicInformation cast={cast} />
        )}

        {/* ストーリー */}
        {activeTab === 'story' && <CastTabStory cast={cast} />}

        {/* スケジュール */}
        {activeTab === 'schedule' && (
          <CastTabSchedule cast={cast} onBookingOpen={onBookingOpen} />
        )}

        {/* ✅ 口コミタブ */}
        {activeTab === 'reviews' && (
          <CastTabReviewPage
            castId={cast.id}
            castName={cast.name}
            storeSlug={storeSlug}   // ✅ 修正：ここで props を使う
          />
        )}

        {/* 動画 */}
        {activeTab === 'videos' && <CastTabMovie cast={cast} />}
      </div>
    </div>
  )
}
