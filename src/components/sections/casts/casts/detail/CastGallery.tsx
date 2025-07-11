'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CastGalleryProps {
  castName: string
  allImages: string[]
  currentImageIndex: number
  onImageChange: (index: number) => void
  onDragEnd: (event: any, info: any) => void
}

const CastGallery: React.FC<CastGalleryProps> = ({
  castName,
  allImages,
  currentImageIndex,
  onImageChange,
  onDragEnd
}) => {
  const nextImage = () => {
    onImageChange((currentImageIndex + 1) % allImages.length)
  }

  const prevImage = () => {
    onImageChange((currentImageIndex - 1 + allImages.length) % allImages.length)
  }

  return (
    <div className="bg-white">
      <div className="relative">
        {/* メイン画像 */}
        <div className="relative aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-neutral-100">
          <motion.div
            className="w-full h-full cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            whileDrag={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <img
              src={allImages[currentImageIndex]}
              alt={`${castName}の写真 ${currentImageIndex + 1}`}
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
          </motion.div>
          
          {/* 画像ナビゲーション */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200 z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all duration-200 z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* 画像インジケーター */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {allImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onImageChange(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* サムネイル横スクロール */}
        {allImages.length > 1 && (
          <div className="p-4">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => onImageChange(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                    index === currentImageIndex 
                      ? 'border-primary shadow-md scale-105' 
                      : 'border-neutral-200 hover:border-neutral-300'
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
            
            {/* スワイプヒント */}
            <div className="text-center mt-2">
              <p className="text-xs text-neutral-500">
                💡 画像を左右にスワイプして切り替えできます
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CastGallery