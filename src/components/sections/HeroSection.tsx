'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Shield } from 'lucide-react';
import { useAgeVerification } from '@/hooks/useAgeVerification';
import AgeVerificationModal from '@/components/ui/AgeVerificationModal';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isModalOpen, requireAgeVerification, handleConfirm, handleClose } = useAgeVerification();

  const heroImages = [
    'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const handleStartClick = () => {
    requireAgeVerification(() => {
      console.log('サービス開始');
    });
  };

  const handleViewCastsClick = () => {
    requireAgeVerification(() => {
      console.log('キャスト一覧表示');
    });
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden">

        {/* 背景パターン */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, #dc2626 2px, transparent 2px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/* ヒーローカルーセル */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-30' : 'opacity-0'
              }`}
            >
              <img src={image} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/80 via-white/90 to-rose-100/80" />
        </div>

        {/* コンテンツ */}
        <div className="relative z-10 flex flex-col justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">

            {/* 信頼バッジ */}
            <div className="flex justify-center mb-6">
              <Badge
                variant="secondary"
                className="bg-white/80 text-rose-700 px-4 py-2 text-sm font-medium"
              >
                <Shield className="w-4 h-4 mr-2" />
                創業7年の信頼と実績
              </Badge>
            </div>

            {/* メイン見出し */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              毎日頑張るあなたに、
              <br />
              <span className="text-rose-600">
  甘くとろける
  <span className="text-rose-700 text-[1.3em] font-bold animate-float inline-block  mx-1">
    いちご一会
  </span>
  なひととき
</span>を
            </h1>

            {/* サブ見出し */}
            <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto font-light">
              AIが導く最適なマッチングで、あなただけの
              <span className="font-medium text-rose-600">"ストロベリーボーイ"</span>
              と出会える上質な時間をお届けします
            </p>

            {/* CTAボタン */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                size="lg"
                onClick={handleStartClick}
                className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Heart className="w-5 h-5 mr-2" />
                今すぐ始める
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleViewCastsClick}
                className="border-rose-300 text-rose-700 hover:bg-rose-50 px-8 py-4 text-lg font-medium rounded-full"
              >
                キャストを見る
              </Button>
            </div>

            {/* ソーシャル実績 */}
            <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span>満足度 4.9/5.0</span>
              </div>
              <div>|</div>
              <div>累計利用者数 12,000名突破</div>
              <div>|</div>
              <div>リピート率 87%</div>
            </div>
          </div>
        </div>

        {/* スクロールインジケーター */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-rose-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-rose-400 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 年齢確認モーダル */}
      <AgeVerificationModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}
