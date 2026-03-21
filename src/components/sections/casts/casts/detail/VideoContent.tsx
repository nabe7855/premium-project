'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, ExternalLink, Heart, Share2, Eye, Calendar, Youtube, Instagram, TrendingUp } from 'lucide-react'
import { Cast } from '@/types/cast'

interface VideoItem {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  viewCount: string
  uploadDate: string
  platform: 'youtube' | 'instagram' | 'tiktok'
  url: string
  isNew?: boolean
  isPopular?: boolean
}

interface VideoContentProps {
  cast: Cast
}

const VideoContent: React.FC<VideoContentProps> = ({ cast }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'youtube' | 'instagram' | 'tiktok'>('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const mockVideos: VideoItem[] = []

  useEffect(() => {
    // 動画データの読み込みをシミュレート
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const categories = [
    { id: 'all', label: 'すべて', icon: Play },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'tiktok', label: 'TikTok', icon: TrendingUp }
  ]

  const filteredVideos = selectedCategory === 'all' 
    ? mockVideos 
    : mockVideos.filter(video => video.platform === selectedCategory)

  const handleVideoClick = (video: VideoItem) => {
    // 外部リンクを新しいタブで開く
    window.open(video.url, '_blank', 'noopener,noreferrer')
    
    // アナリティクス用のイベント送信（実装時）
    console.log('Video clicked:', {
      videoId: video.id,
      platform: video.platform,
      castId: cast.id
    })
  }

  const toggleFavorite = (videoId: string) => {
    setFavorites(prev => 
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    )
  }

  const handleShare = (video: VideoItem) => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: video.url
      })
    } else {
      // フォールバック: クリップボードにコピー
      navigator.clipboard.writeText(video.url)
      alert('リンクをクリップボードにコピーしました')
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />
      case 'tiktok':
        return <TrendingUp className="w-4 h-4 text-black" />
      default:
        return <Play className="w-4 h-4 text-neutral-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '昨日'
    if (diffDays <= 7) return `${diffDays}日前`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}週間前`
    return date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">動画を読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-neutral-800">
            {cast.name}の動画コンテンツ
          </h3>
          <div className="flex items-center text-sm text-neutral-600">
            <Eye className="w-4 h-4 mr-1" />
            <span>総再生回数 9.4K</span>
          </div>
        </div>
        
        <p className="text-sm sm:text-base text-neutral-600 mb-4">
          普段の様子や魅力をお伝えする動画をご覧ください
        </p>

        {/* カテゴリフィルター */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`flex items-center px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 動画グリッド */}
      <AnimatePresence mode="wait">
        {filteredVideos.length > 0 ? (
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {filteredVideos.map((video, index) => (
              <motion.article
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-soft hover:shadow-luxury transition-all duration-300 group"
              >
                {/* サムネイル */}
                <div className="relative aspect-video bg-neutral-100">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* オーバーレイ */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handleVideoClick(video)}
                      className="opacity-0 group-hover:opacity-100  bg-white/90 backdrop-blur-sm text-neutral-800 p-3 rounded-full hover:bg-white hover:scale-110 transform transition-all duration-200"
                      aria-label={`${video.title}を再生`}
                    >
                      <Play className="w-6 h-6 fill-current" />
                    </button>
                  </div>

                  {/* バッジ */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    {video.isNew && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        NEW
                      </span>
                    )}
                    {video.isPopular && (
                      <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        人気
                      </span>
                    )}
                  </div>

                  {/* 再生時間 */}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {video.duration}
                  </div>

                  {/* プラットフォームアイコン */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full">
                    {getPlatformIcon(video.platform)}
                  </div>
                </div>

                {/* コンテンツ */}
                <div className="p-3 sm:p-4">
                  <h4 className="font-semibold text-neutral-800 mb-2 line-clamp-2 text-sm sm:text-base leading-tight">
                    {video.title}
                  </h4>
                  
                  <p className="text-xs sm:text-sm text-neutral-600 mb-3 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>

                  {/* メタ情報 */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        <span>{video.viewCount}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(video.uploadDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleVideoClick(video)}
                      className="flex items-center text-primary hover:text-primary/80 transition-colors duration-200 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      <span>視聴する</span>
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(video.id)}
                        className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors duration-200"
                        aria-label="お気に入り"
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favorites.includes(video.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-neutral-400'
                          }`}
                        />
                      </button>
                      
                      <button
                        onClick={() => handleShare(video)}
                        className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors duration-200"
                        aria-label="シェア"
                      >
                        <Share2 className="w-4 h-4 text-neutral-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 sm:py-12"
          >
            <div className="mb-4">
              <Play className="w-12 sm:w-16 h-12 sm:h-16 text-neutral-300 mx-auto" />
            </div>
            <h4 className="text-base sm:text-lg font-medium text-neutral-600 mb-2">
              {selectedCategory === 'all' ? '動画コンテンツ準備中' : `${categories.find(c => c.id === selectedCategory)?.label}の動画はまだありません`}
            </h4>
            <p className="text-sm sm:text-base text-neutral-500 mb-4">
              近日公開予定です。お楽しみに！
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-primary hover:text-primary/80 transition-colors duration-200 text-sm font-medium"
              >
                すべての動画を見る
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* フッター */}
      {filteredVideos.length > 0 && (
        <div className="mt-8 p-4 bg-neutral-50 rounded-xl text-center">
          <p className="text-sm text-neutral-600 mb-2">
            💡 動画は外部サイトで再生されます
          </p>
          <p className="text-xs text-neutral-500">
            より多くのコンテンツは各プラットフォームでご覧いただけます
          </p>
        </div>
      )}
    </div>
  )
}

export default VideoContent