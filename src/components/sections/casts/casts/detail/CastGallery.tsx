'use client'

import React from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CastGalleryProps {
  castName: string
  allImages: string[]
  currentImageIndex: number
  onImageChange: (index: number) => void
}

const CastGallery: React.FC<CastGalleryProps> = ({
  castName,
  allImages,
  currentImageIndex,
  onImageChange
}) => {
  const nextImage = () => {
    onImageChange((currentImageIndex + 1) % allImages.length)
  }

  const prevImage = () => {
    onImageChange((currentImageIndex - 1 + allImages.length) % allImages.length)
  }

  // ✅ motion value を使って傾き効果を作る
  const x = useMotionValue(0)
  const rotateY = useTransform(x, [-200, 0, 200], [-15, 0, 15]) // 横に動かすと傾く
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]) // 端に行くほど縮小

  // ✅ スワイプ操作で切替
  const handleDragEnd = (_: unknown, info: any) => {
    const swipeThreshold = 80
    const velocityThreshold = 500

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      prevImage()
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      nextImage()
    }
  }

  return (
    <div className="relative bg-gradient-to-br from-[#2c0f24] via-[#4a103a] to-[#7b206f]">
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-pink-400/10 blur-2xl pointer-events-none" />

      <div className="relative">
        {/* メイン画像（3Dスワイプ） */}
        <div className="relative aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/10] 
                        overflow-hidden flex items-center justify-center perspective-[1200px]">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={currentImageIndex}
              src={allImages[currentImageIndex]}
              alt={`${castName}の写真 ${currentImageIndex + 1}`}
              className="max-h-full max-w-full object-contain select-none relative z-10 drop-shadow-xl"
              draggable={false}
              // ✅ アニメーション初期状態
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              // ✅ 3Dスワイプ
              style={{ x, rotateY, scale }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={handleDragEnd}
            />
          </AnimatePresence>

          {/* ナビゲーションボタン */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 
                           bg-gradient-to-br from-pink-600 to-purple-700 text-white 
                           p-2 rounded-full hover:scale-110 transition-all duration-300 z-20 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 
                           bg-gradient-to-br from-pink-600 to-purple-700 text-white 
                           p-2 rounded-full hover:scale-110 transition-all duration-300 z-20 shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* インジケータ */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onImageChange(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-pink-400 shadow-[0_0_12px_rgba(255,105,180,0.9)] scale-125'
                        : 'bg-white/40 hover:bg-pink-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* サムネイル */}
        {allImages.length > 1 && (
          <div className="p-4 relative z-10">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => onImageChange(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden 
                              border-2 transition-all duration-300 hover:scale-105 ${
                                index === currentImageIndex
                                  ? 'border-pink-500 shadow-md scale-105'
                                  : 'border-neutral-300 hover:border-pink-300'
                              }`}
                >
                  <img
                    src={image}
                    alt={`${castName}の写真 ${index + 1}`}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-neutral-200">
                💡 左右にスワイプして切り替えできます
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CastGallery
