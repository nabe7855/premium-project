'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Cast } from '@/types/cast' // 👈 Cast に変更

interface CastTabBasicInformationProps {
  cast: Cast
}

const DEBUG = false // ← true にすると JSON 出力あり

const CastTabBasicInformation: React.FC<CastTabBasicInformationProps> = ({ cast }) => {
  // ✅ デバッグログ
  console.log('🟢 CastTabBasicInformation received cast:', cast)

  // ✅ サービスの色分け
  const getServiceColor = (level: string) => {
    switch (level) {
      case '得意':
        return 'bg-green-100 text-green-700'
      case '普通':
        return 'bg-blue-100 text-blue-700'
      case '要相談':
        return 'bg-yellow-100 text-yellow-700'
      case 'NG':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-neutral-100 text-neutral-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* ✅ デバッグ用 JSON 出力 */}
      {DEBUG && (
        <div className="bg-gray-100 rounded-md p-3 text-xs text-gray-700 overflow-x-auto">
          <pre>{JSON.stringify(cast, null, 2)}</pre>
        </div>
      )}

 {/* 基本情報カード */}
<div className="bg-white rounded-2xl p-6 shadow-lg">
  <h3 className="text-xl font-bold mb-6 text-pink-600 flex items-center gap-2">
    <span>🌸</span> 基本情報
  </h3>

  <div className="grid grid-cols-2 gap-6">
    {/* 年齢 */}
    <div className="flex justify-between items-center">
      <span className="text-sm sm:text-base text-neutral-500">年齢</span>
      <span
        className="px-3 py-1 rounded-full text-sm font-semibold bg-pink-50 text-pink-600 shadow-sm"
      >
        {cast.age ? `${cast.age}歳` : '秘密❤'}
      </span>
    </div>

    {/* 血液型 */}
    <div className="flex justify-between items-center">
      <span className="text-sm sm:text-base text-neutral-500">血液型</span>
      <span
        className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-50 text-purple-600 shadow-sm"
      >
        {cast.bloodType ?? '秘密❤'}
      </span>
    </div>

    {/* 身長 */}
    <div className="flex justify-between items-center">
      <span className="text-sm sm:text-base text-neutral-500">身長</span>
      <span
        className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-600 shadow-sm"
      >
        {cast.height ? `${cast.height}cm` : '秘密❤'}
      </span>
    </div>

    {/* 体重 */}
    <div className="flex justify-between items-center">
      <span className="text-sm sm:text-base text-neutral-500">体重</span>
      <span
        className="px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-600 shadow-sm"
      >
        {cast.weight ? `${cast.weight}kg` : '秘密❤'}
      </span>
    </div>
  </div>
</div>



{/* 性格 */} 
{cast.personalityNames && cast.personalityNames.length > 0 && (
  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
    <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-pink-600">✨ 性格</h4>
    <div className="flex flex-wrap gap-3">
      {cast.personalityNames.map((name, idx) => (
        <span
          key={idx}
          className="px-4 py-1.5 rounded-full text-sm bg-pink-50 text-pink-700 font-medium shadow-sm hover:bg-pink-100 transition"
        >
          💕 {name}
        </span>
      ))}
    </div>
  </div>
)}

{/* 外見 */} 
{cast.appearanceNames && cast.appearanceNames.length > 0 && (
  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
    <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-purple-600">🌸 外見</h4>
    <div className="flex flex-wrap gap-3">
      {cast.appearanceNames.map((name, idx) => (
        <span
          key={idx}
          className="px-4 py-1.5 rounded-full text-sm bg-purple-50 text-purple-700 font-medium shadow-sm hover:bg-purple-100 transition"
        >
          ✨ {name}
        </span>
      ))}
    </div>
  </div>
)}


      {/* 自己紹介 */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
        <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neutral-800">自己紹介</h4>
        <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
          {cast.profile ?? '自己紹介はまだ登録されていません'}
        </p>
      </div>

{/* サービススキル */}
{Array.isArray(cast.services) && cast.services.length > 0 && (
  <div className="bg-gradient-to-br from-pink-50 via-white to-purple-50 rounded-2xl p-6 shadow-lg">
    <h4 className="text-lg font-bold mb-4 text-pink-700">サービス対応</h4>
    <ul className="space-y-3">
      {cast.services.map((service, idx) => (
        <li
          key={idx}
          className="bg-white rounded-xl shadow-md px-4 py-3 flex items-center justify-between hover:shadow-pink-200 transition"
        >
          {/* 左側（アイコン＋名前） */}
          <div className="flex items-center gap-2">
            <span className="text-pink-400 text-lg">💖</span>
            <span className="text-sm sm:text-base font-medium text-neutral-800">
              {service.name}
            </span>
          </div>
          {/* 右側（レベルバッジ） */}
          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${getServiceColor(
              service.level
            )}`}
          >
            {service.level}
          </span>
        </li>
      ))}
    </ul>
  </div>
)}



      {/* ステータス */}
      {cast.statuses && cast.statuses.length > 0 && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft">
          <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neutral-800">ステータス</h4>
          <div className="flex flex-wrap gap-2">
            {cast.statuses.map((status) => {
              const master = status.status_master
              if (!master) return null
              return (
                <span
                  key={status.id}
                  className="px-3 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: master.label_color ?? '#f3f4f6',
                    color: master.text_color ?? '#111827',
                  }}
                >
                  {master.name}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default CastTabBasicInformation
