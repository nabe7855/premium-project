'use client'

import React from 'react'
import { Cast, Review, CastProfile } from '@/types/cast'
import CastTabBasicInformation from './CastTabBasicInformation'
import CastTabStory from './CastTabStory'
import CastTabSchedule from './CastTabSchedule'
import CastTabReviews from './CastTabReviews'
import CastTabMovie from './CastTabMovie'

interface Tab {
  id: string
  label: string
  icon: any
  count?: number
}

interface CastDetailTabsProps {
  cast: Cast
  castProfile?: CastProfile   // ✅ 詳細用のCastProfileを追加
  activeTab: 'basic' | 'story' | 'schedule' | 'reviews' | 'videos'
  tabs: Tab[]
  isSticky: boolean
  castReviews: Review[]
  isLoadingReviews: boolean
  onTabChange: (tab: 'basic' | 'story' | 'schedule' | 'reviews' | 'videos') => void
  onBookingOpen: () => void
  onReviewOpen: () => void
}

export const CastDetailTabs: React.FC<CastDetailTabsProps> = ({
  cast,
  castProfile,
  activeTab,
  castReviews = [],
  isLoadingReviews,
  onBookingOpen,
  onReviewOpen
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* タブコンテンツ */}
      <div>
{/* CastProfileを渡す */}
{activeTab === 'basic' && castProfile && (
  <CastTabBasicInformation cast={castProfile} />
)}

        {activeTab === 'story' && (
          <CastTabStory cast={cast} />
        )}

        {activeTab === 'schedule' && (
          <CastTabSchedule cast={cast} onBookingOpen={onBookingOpen} />
        )}

        {activeTab === 'reviews' && (
          <CastTabReviews
            castReviews={castReviews}
            isLoadingReviews={isLoadingReviews}
            onReviewOpen={onReviewOpen}
          />
        )}

        {activeTab === 'videos' && (
          <CastTabMovie cast={cast} />
        )}
      </div>
    </div>
  )
}
