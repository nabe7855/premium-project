'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Bell, Star, Gift, Zap } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'promotion';
  icon?: React.ReactNode;
  image?: string;
  imageAlt?: string;
  ctaText?: string;
  ctaAction?: () => void;
}

interface BannerSlideProps {
  banners: Banner[];
  autoSlide?: boolean;
  slideInterval?: number;
  showControls?: boolean;
  className?: string;
}

export const BannerSlide: React.FC<BannerSlideProps> = ({
  banners,
  autoSlide = true,
  slideInterval = 5000,
  showControls = true,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoSlide || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [autoSlide, slideInterval, banners.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const getTypeStyles = (type: Banner['type']) => {
    switch (type) {
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
      case 'promotion':
        return 'bg-gradient-to-r from-purple-500 to-pink-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getDefaultIcon = (type: Banner['type']) => {
    switch (type) {
      case 'info':
        return <Bell className="h-5 w-5" />;
      case 'success':
        return <Star className="h-5 w-5" />;
      case 'warning':
        return <Zap className="h-5 w-5" />;
      case 'promotion':
        return <Gift className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  if (!isVisible || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}>
      <div className={`${getTypeStyles(currentBanner.type)} relative`}>
        {/* Image Section */}
        {currentBanner.image && (
          <div className="relative h-32 overflow-hidden sm:h-40 md:h-48">
            <img
              src={currentBanner.image}
              alt={currentBanner.imageAlt || currentBanner.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>

            {/* Controls overlay on image */}
            <div className="absolute right-2 top-2 flex items-center space-x-2">
              {showControls && banners.length > 1 && (
                <div className="flex space-x-1">
                  <button
                    onClick={prevSlide}
                    className="rounded-full bg-black bg-opacity-30 p-1.5 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="rounded-full bg-black bg-opacity-30 p-1.5 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-50"
                  >
                    <ChevronRight className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsVisible(false)}
                className="rounded-full bg-black bg-opacity-30 p-1.5 backdrop-blur-sm transition-all duration-200 hover:bg-opacity-50"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center space-x-3">
              <div className="flex-shrink-0">
                {currentBanner.icon || getDefaultIcon(currentBanner.type)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold sm:text-base">
                  {currentBanner.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs opacity-90 sm:text-sm">
                  {currentBanner.message}
                </p>
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center space-x-2">
              {currentBanner.ctaText && currentBanner.ctaAction && (
                <button
                  onClick={currentBanner.ctaAction}
                  className="rounded-full bg-white bg-opacity-20 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-opacity-30"
                >
                  {currentBanner.ctaText}
                </button>
              )}

              {/* Controls for non-image banners */}
              {!currentBanner.image && showControls && banners.length > 1 && (
                <div className="flex space-x-1">
                  <button
                    onClick={prevSlide}
                    className="rounded-full bg-white bg-opacity-20 p-1 transition-all duration-200 hover:bg-opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="rounded-full bg-white bg-opacity-20 p-1 transition-all duration-200 hover:bg-opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Close button for non-image banners */}
              {!currentBanner.image && (
                <button
                  onClick={() => setIsVisible(false)}
                  className="rounded-full bg-white bg-opacity-20 p-1 transition-all duration-200 hover:bg-opacity-30"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Progress indicators */}
          {banners.length > 1 && (
            <div className="mt-3 flex justify-center space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'scale-125 bg-white'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
