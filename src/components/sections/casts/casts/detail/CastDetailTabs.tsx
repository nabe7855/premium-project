'use client'

import React from 'react'
import { Cast, Review } from '@/types/caststypes'
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
        {activeTab === 'basic' && (
          <CastTabBasicInformation cast={cast} />
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