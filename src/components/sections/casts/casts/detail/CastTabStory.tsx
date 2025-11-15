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

{/* 店長からのコメント */}
{cast.managerComment && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, amount: 0.2 }}
    transition={{ duration: 0.5 }}
    className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 shadow-md"
  >
    <h4 className="text-md sm:text-lg font-semibold mb-3 text-purple-600">
      店長からのコメント
    </h4>
    <p className="text-neutral-900 leading-relaxed">
      {cast.managerComment}
    </p>
  </motion.div>
)}
      {/* Q&Aセクション */}
      {cast.castQuestions && cast.castQuestions.length > 0 && (
        <div className="rounded-2xl p-6 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 shadow-sm">
          <h4 className="text-md sm:text-lg font-semibold mb-6 text-pink-600">
            Q&A
          </h4>
          <ul className="space-y-8">
            {cast.castQuestions.map((cq: CastQuestion) => (
              <li key={cq.id} className="flex flex-col gap-6">
                {/* Q（左寄せ｜ミント系） */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-emerald-400 text-white rounded-full text-sm font-bold shadow-md">
                    Q
                  </div>
                  <div className="max-w-[75%] px-4 py-3 bg-emerald-50 text-neutral-900 rounded-2xl rounded-tl-none shadow-md 
                                  hover:scale-[1.02] hover:shadow-lg transition duration-300 ease-out">
                    {cq.question?.text ?? '質問が見つかりません'}
                  </div>
                </motion.div>

                {/* A（右寄せ｜ラベンダー系） */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-start gap-2 justify-end"
                >
                  <div className="max-w-[75%] px-4 py-3 bg-purple-50 text-neutral-900 rounded-2xl rounded-tr-none shadow-md 
                                  hover:scale-[1.02] hover:shadow-lg transition duration-300 ease-out">
                    {cq.answer}
                  </div>
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-400 text-white rounded-full text-sm font-bold shadow-md">
                    A
                  </div>
                </motion.div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </motion.div>
  )
}

export default CastTabStory
