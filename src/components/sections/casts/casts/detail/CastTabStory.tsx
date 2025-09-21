'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Cast, CastQuestion } from '@/types/cast'

interface CastTabStoryProps {
  cast: Cast
}

const CastTabStory: React.FC<CastTabStoryProps> = ({ cast }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft"
    >
      {/* ストーリー */}
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-neutral-800">
        私のストーリー
      </h3>
      <div className="prose prose-sm sm:prose-lg max-w-none mb-8">
        <p className="text-sm sm:text-base lg:text-lg text-neutral-700 leading-relaxed">
          {cast.story ?? cast.profile ?? 'まだストーリーは登録されていません'}
        </p>
      </div>

      {/* Q&Aセクション */}
      {cast.castQuestions && cast.castQuestions.length > 0 && (
        <div>
          <h4 className="text-md sm:text-lg font-semibold mb-4 text-pink-600">
            Q&A
          </h4>
          <ul className="space-y-6">
            {cast.castQuestions.map((cq: CastQuestion) => (
              <li key={cq.id} className="border-b border-neutral-200 pb-4">
                <p className="font-medium text-pink-500">
                  Q. {cq.question?.text ?? '質問が見つかりません'}
                </p>
                <p className="mt-2 px-3 py-2 bg-pink-50 text-neutral-800 rounded-lg">
                  A. {cq.answer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  )
}

export default CastTabStory
