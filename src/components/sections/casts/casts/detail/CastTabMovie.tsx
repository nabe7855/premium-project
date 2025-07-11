'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Cast } from '@/types/caststypes'
import VideoContent from './VideoContent'

interface CastTabMovieProps {
  cast: Cast
}

const CastTabMovie: React.FC<CastTabMovieProps> = ({ cast }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-soft overflow-hidden"
    >
      <VideoContent cast={cast} />
    </motion.div>
  )
}

export default CastTabMovie