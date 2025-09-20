'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Cast } from '@/types/cast'

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
      <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-neutral-800">私のストーリー</h3>
      <div className="prose prose-sm sm:prose-lg max-w-none">
        <p className="text-sm sm:text-base lg:text-lg text-neutral-700 leading-relaxed">{cast.story}</p>
      </div>
    </motion.div>
  )
}

export default CastTabStory