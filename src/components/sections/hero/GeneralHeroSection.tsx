'use client';

import AgeVerificationModal from '@/components/ui/AgeVerificationModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAgeVerification } from '@/hooks/useAgeVerification';
import { Heart, Shield, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isModalOpen, requireAgeVerification, handleConfirm, handleClose } = useAgeVerification();

  const heroImages = [
    'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800',
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
            className="h-full w-full"
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
              <img src={image} alt={`Hero ${index + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/80 via-white/90 to-rose-100/80" />
        </div>

        {/* コンテンツ */}
        <div className="relative z-10 flex min-h-screen flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* 信頼バッジ */}
            <div className="mb-6 flex justify-center">
              <Badge
                variant="secondary"
                className="bg-white/80 px-4 py-2 text-sm font-medium text-rose-700"
              >
                <Shield className="mr-2 h-4 w-4" />
                創業7年の信頼と実績
              </Badge>
            </div>

            {/* メイン見出し */}
            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              毎日頑張るあなたに、
              <br />
              <span className="text-rose-600">
                甘くとろける
                <span className="animate-float mx-1 inline-block text-[1.3em] font-bold text-rose-700">
                  いちご一会
                </span>
                なひととき
              </span>
              を
            </h1>

            {/* サブ見出し */}
            <p className="mx-auto mb-8 max-w-2xl text-lg font-light text-gray-700 sm:text-xl">
              AIが導く最適なマッチングで、あなただけの
              <span className="font-medium text-rose-600">"ストロベリーボーイズ"</span>
              と出会える上質な時間をお届けします
            </p>

            {/* CTAボタン */}
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={handleStartClick}
                className="transform rounded-full bg-rose-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-rose-700 hover:shadow-xl"
              >
                <Heart className="mr-2 h-5 w-5" />
                今すぐ始める
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleViewCastsClick}
                className="rounded-full border-rose-300 px-8 py-4 text-lg font-medium text-rose-700 hover:bg-rose-50"
              >
                キャストを見る
              </Button>
            </div>

            {/* ソーシャル実績 */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 text-yellow-500" />
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-rose-300">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-rose-400" />
          </div>
        </div>
      </div>

      {/* 年齢確認モーダル */}
      <AgeVerificationModal isOpen={isModalOpen} onClose={handleClose} onConfirm={handleConfirm} />
    </>
  );
}
