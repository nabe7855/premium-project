'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CastProfile } from '@/types/cast'

interface CastTabBasicInformationProps {
  cast: CastProfile
}

const CastTabBasicInformation: React.FC<CastTabBasicInformationProps> = ({ cast }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* 基本情報カード */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-neutral-800">基本情報</h3>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-neutral-600">年齢</span>
              <span className="text-sm sm:text-base font-medium text-neutral-800">
                {cast.age ? `${cast.age}歳` : '未登録'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-neutral-600">身長</span>
              <span className="text-sm sm:text-base font-medium text-neutral-800">
                {cast.height ? `${cast.height}cm` : '未登録'}
              </span>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-neutral-600">血液型</span>
              <span className="text-sm sm:text-base font-medium text-neutral-800">
                {cast.bloodType ?? '未登録'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-neutral-600">活動状況</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  cast.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {cast.is_active ? '稼働中' : 'お休み'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* プロフィール詳細（今は profile を string 扱い） */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neutral-800">自己紹介</h4>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          {cast.profile ?? '自己紹介はまだ登録されていません'}
        </p>
      </div>

      {/* サービススキル */}
      {cast.services && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
          <h4 className="text-base sm:text-lg font-semibold mb-3 text-neutral-800">サービス対応</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(cast.services).map(([service, level]) => (
              <span
                key={service}
                className="px-2 sm:px-3 py-1 bg-secondary text-primary rounded-full text-xs sm:text-sm font-medium"
              >
                {service}: {level}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ステータス */}
{cast.statuses && cast.statuses.length > 0 && (
  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
    <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neutral-800">ステータス</h4>
    <div className="flex flex-wrap gap-2">
      {cast.statuses.map((status) => (
        <span
          key={status.id}
          className="px-3 py-2 rounded-full text-sm font-medium"
          style={{
            backgroundColor: status.status_master?.label_color ?? '#f3f4f6',
            color: status.status_master?.text_color ?? '#111827',
          }}
        >
          {status.status_master?.name ?? '不明'}
        </span>
      ))}
    </div>
  </div>
)}
    </motion.div>
  )
}

export default CastTabBasicInformation
