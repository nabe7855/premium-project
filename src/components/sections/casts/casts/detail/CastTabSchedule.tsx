'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Cast } from '@/types/cast'
import { getCastSchedules } from '@/lib/getCastSchedules'
import { convertSchedulesToAvailability } from '@/utils/scheduleUtils'

// 共通の状態バッジスタイル
const scheduleStatusStyles: Record<string, string> = {
  '予約可能': 'schedule-available',
  '残りあとわずか': 'schedule-limited',
  '満員御礼': 'schedule-full',
  '応相談': 'schedule-negotiable',
  default: 'schedule-default',
}

interface CastTabScheduleProps {
  cast: Cast
  onBookingOpen: () => void
}

const CastTabSchedule: React.FC<CastTabScheduleProps> = ({ cast, onBookingOpen }) => {
  const [availability, setAvailability] = useState<{ [key: string]: string[] }>({})
  const [statusByDate, setStatusByDate] = useState<{ [key: string]: string }>({})

  // ✅ DBからスケジュール取得
  useEffect(() => {
    (async () => {
      const schedules = await getCastSchedules(cast.id)
      setAvailability(convertSchedulesToAvailability(schedules))

      const statusMap: { [key: string]: string } = {}
      schedules.forEach((s: any) => {
        statusMap[s.work_date] = s.status
      })
      setStatusByDate(statusMap)
    })()
  }, [cast.id])

  // 直近2週間を埋める
  const getTwoWeeksSchedule = (availability: { [key: string]: string[] } = {}) => {
    const schedule: { [key: string]: string[] } = {}
    const today = new Date()

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateString = date.toISOString().split('T')[0]
      schedule[dateString] = availability[dateString] || []
    }

    return schedule
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft"
    >
      {/* 予約ボタン */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-neutral-800">出勤スケジュール</h3>
        <button
          onClick={onBookingOpen}
          className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors duration-200 text-sm sm:text-base"
        >
          予約する
        </button>
      </div>

      {/* スケジュール一覧 */}
      <div className="space-y-4">
        {Object.entries(getTwoWeeksSchedule(availability)).map(([date, times]) => {
          const dateObj = new Date(date)
          const isToday = date === new Date().toISOString().split('T')[0]
          const isTomorrow = (() => {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            return date === tomorrow.toISOString().split('T')[0]
          })()
          const dayOfWeek = dateObj.getDay()
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

          const status = statusByDate[date] ?? 'default'

          return (
            <div
              key={date}
              className={`flex flex-col items-center text-center p-4 rounded-2xl shadow-sm border transition-colors duration-200 ${
                isToday
                  ? 'border-primary bg-primary/5'
                  : isTomorrow
                  ? 'border-blue-300 bg-blue-50'
                  : isWeekend
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-neutral-200 bg-white'
              }`}
            >
              {/* 日付ラベル */}
              <div className="flex flex-col items-center gap-2 mb-3">
                <span
                  className={`font-semibold text-base sm:text-lg ${
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
                </span>

                {/* 今日/明日/週末タグ */}
                <div className="flex gap-2 flex-wrap justify-center">
                  {isToday && (
                    <span className="text-xs bg-primary text-white px-3 py-1 rounded-full">今日</span>
                  )}
                  {isTomorrow && (
                    <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">明日</span>
                  )}
                  {isWeekend && !isToday && !isTomorrow && (
                    <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full">週末</span>
                  )}

                  {/* 出勤がある日だけ状態バッジを表示 */}
                  {times.length > 0 && status !== 'default' && (
                    <span
                      className={`${scheduleStatusStyles[status] || scheduleStatusStyles.default}`}
                    >
                      {status}
                    </span>
                  )}
                </div>
              </div>

              {/* 出勤時間 or お休み */}
              <div className="flex flex-wrap justify-center gap-2">
                {times.length > 0 ? (
                  times.map((time) => (
                    <span
                      key={time}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isToday ? 'bg-primary/20 text-primary' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {time}
                    </span>
                  ))
                ) : (
                  <span className="px-3 py-1 rounded-full text-sm text-neutral-500 bg-neutral-100">
                    お休み
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-3 bg-neutral-50 rounded-lg">
        <p className="text-xs text-neutral-600 text-center">
          💡 直近2週間のスケジュールを表示しています
        </p>
      </div>
    </motion.div>
  )
}

export default CastTabSchedule
