'use client';

import { Button } from '@/components/ui/button';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useAgeVerification } from '@/hooks/useAgeVerification';
import AgeVerificationModal from '@/components/ui/AgeVerificationModal';

export default function ClosingCTA() {
  const { isModalOpen, requireAgeVerification, handleConfirm, handleClose } = useAgeVerification();

  const handleBookNowClick = () => {
    requireAgeVerification(() => {
      // ここに実際のアクション（予約ページへの遷移など）を実装
      console.log('今すぐ予約');
    });
  };

  const handleAIDiagnosisClick = () => {
    requireAgeVerification(() => {
      // ここに実際のアクション（AI診断ページへの遷移など）を実装
      console.log('AI診断開始');
    });
  };

  return (
    <>
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Heart className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div className="absolute top-20 right-20 opacity-20">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* SB Character */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-6 shadow-2xl">
              <span className="text-6xl">👋</span>
            </div>
          </div>

          {/* Main Message */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            あなたをお待ちしています
          </h2>
          
          <p className="text-lg sm:text-xl text-pink-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            今日という日を頑張ったあなたへ。
            <br />
            甘くとろける癒しの時間を、一緒に過ごしませんか？
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={handleBookNowClick}
              className="bg-white text-rose-600 hover:bg-pink-50 px-8 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <Heart className="w-5 h-5 mr-2" />
              今すぐ予約する
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleAIDiagnosisClick}
              className="border-white text-white hover:bg-white hover:text-rose-600 px-8 py-4 text-lg font-medium rounded-full"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              AI診断から始める
            </Button>
          </div>

          {/* Final Message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-pink-100 font-light">
              初回の方には<span className="font-semibold text-white">20%オフ</span>の特別価格でご利用いただけます。
              <br />
              専任コンシェルジュが丁寧にサポートいたしますので、
              <br className="hidden sm:block" />
              初めての方もご安心ください。
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex justify-center items-center gap-8 mt-8 text-pink-200 text-sm">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-pink-200 rounded-full mr-2"></span>
              創業7年の実績
            </div>
            <div>|</div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-pink-200 rounded-full mr-2"></span>
              満足度98.5%
            </div>
            <div>|</div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-pink-200 rounded-full mr-2"></span>
              24時間サポート
            </div>
          </div>
        </div>
      </section>

      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}