import { useState, useRef, useEffect } from 'react';

export const useCastDetail = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'story' | 'schedule' | 'reviews' | 'videos'>('basic');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const actionBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!actionBarRef.current) return;

      const rect = actionBarRef.current.getBoundingClientRect();
      const headerHeight = 56; // モバイル基準で確実に低めに設定

      setIsSticky(rect.top <= headerHeight);
    };

    handleScroll(); // 初回強制判定（重要）

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    activeTab,
    setActiveTab,
    selectedImage,
    setSelectedImage,
    isSticky,
    actionBarRef,
    isBookingModalOpen,
    isReviewModalOpen,
    handleBookingModalOpen: () => setIsBookingModalOpen(true),
    handleBookingModalClose: () => setIsBookingModalOpen(false),
    handleReviewModalOpen: () => setIsReviewModalOpen(true),
    handleReviewModalClose: () => setIsReviewModalOpen(false),
  };
};
