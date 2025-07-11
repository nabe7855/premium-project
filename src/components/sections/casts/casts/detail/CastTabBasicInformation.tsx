'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Cast } from '@/types/caststypes'

interface CastTabBasicInformationProps {
  cast: Cast
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
              <span className="text-sm sm:text-base font-medium text-neutral-800">{cast.age}歳</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-neutral-600">評価</span>
              <div className="flex items-center">
                <span className="text-sm sm:text-base font-medium text-neutral-800 mr-1">{cast.rating}</span>
                <span className="text-amber-400">⭐</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-neutral-600">口コミ数</span>
              <span className="text-sm sm:text-base font-medium text-neutral-800">{cast.reviewCount}件</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm sm:text-base text-neutral-600">出勤状況</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                cast.isOnline 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-neutral-100 text-neutral-600'
              }`}>
                {cast.isOnline ? '本日出勤' : 'お休み'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* プロフィール詳細 */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neutral-800">自己紹介</h4>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-4 sm:mb-6">{cast.profile.introduction}</p>
        
        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neutral-800">経験・実績</h4>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-4 sm:mb-6">{cast.profile.experience}</p>
        
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 text-neutral-800">得意分野</h4>
            <div className="flex flex-wrap gap-2">
              {cast.profile.specialties.map(specialty => (
                <span key={specialty} className="px-2 sm:px-3 py-1 bg-secondary text-primary rounded-full text-xs sm:text-sm font-medium">
                  {specialty}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 text-neutral-800">趣味</h4>
            <div className="flex flex-wrap gap-2">
              {cast.profile.hobbies.map(hobby => (
                <span key={hobby} className="px-2 sm:px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs sm:text-sm">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* フレーバータグ */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
        <h4 className="text-base sm:text-lg font-semibold mb-4 text-neutral-800">フレーバータグ</h4>
        <div className="flex flex-wrap gap-2">
          {cast.tags.map(tag => (
            <span key={tag} className="px-3 py-2 bg-secondary text-primary rounded-full text-sm font-medium">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 魅力チャート */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
        <h4 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-neutral-800">魅力チャート</h4>
        <div className="space-y-3 sm:space-y-4">
          {cast.radarData.map(item => (
            <div key={item.label} className="flex items-center">
              <div className="flex items-center flex-1">
                <span className="text-lg sm:text-xl mr-2 sm:mr-3">{item.emoji}</span>
                <span className="text-xs sm:text-sm text-neutral-700 flex-1">{item.label}</span>
              </div>
              <div className="flex items-center ml-2 sm:ml-4">
                <div className="w-16 sm:w-24 h-2 bg-neutral-200 rounded-full mr-2 sm:mr-3">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / 5) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-neutral-800 w-6 sm:w-8 text-right">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default CastTabBasicInformation