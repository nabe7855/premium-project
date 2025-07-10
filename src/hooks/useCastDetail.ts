'use client'

import { useState, useEffect, useRef } from 'react'

export const useCastDetail = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'story' | 'schedule' | 'reviews' | 'videos'>('basic')
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (galleryRef.current) {
        const galleryRect = galleryRef.current.getBoundingClientRect()
        const headerHeight = 80 // ナビゲーションヘッダーの高さ
        
        // フォトギャラリーが画面から完全に消えたら固定表示
        setIsSticky(galleryRect.bottom <= headerHeight)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleDiaryClick = () => {
    console.log('日記クリック - 外部リンクに遷移')
    alert('日記ページに遷移します（デモ）')
  }

  const handleSNSClick = () => {
    console.log('SNSクリック - 外部リンクに遷移')
    alert('SNSページに遷移します（デモ）')
  }

  const handleBookingModalOpen = () => {
    setIsBookingModalOpen(true)
  }

  const handleBookingModalClose = () => {
    setIsBookingModalOpen(false)
  }

  const handleReviewModalOpen = () => {
    setIsReviewModalOpen(true)
  }

  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false)
  }

  return {
    activeTab,
    selectedImage,
    isFavorite,
    isBookingModalOpen,
    isReviewModalOpen,
    isSticky,
    galleryRef,
    setActiveTab,
    setSelectedImage,
    setIsFavorite,
    setIsBookingModalOpen,
    setIsReviewModalOpen,
    handleDiaryClick,
    handleSNSClick,
    handleBookingModalOpen,
    handleBookingModalClose,
    handleReviewModalOpen,
    handleReviewModalClose
  }
}