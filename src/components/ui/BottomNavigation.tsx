'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Brain, Heart } from 'lucide-react';
import { useAgeVerification } from '@/hooks/useAgeVerification';
import AgeVerificationModal from '@/components/ui/AgeVerificationModal';

export default function BottomNavigation() {
  const { isModalOpen, requireAgeVerification, handleConfirm, handleClose } = useAgeVerification();

  const handleSearchClick = () => {
    requireAgeVerification(() => {
      console.log('キャストを探す');
    });
  };

  const handleAIDiagnosisClick = () => {
    requireAgeVerification(() => {
      console.log('AI診断');
    });
  };

  const handleBookingClick = () => {
    requireAgeVerification(() => {
      console.log('今すぐ予約');
    });
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 md:hidden">
        {/* SB Character Peek */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-rose-600 rounded-full w-16 h-16 flex items-center justify-center shadow-lg animate-float">
            <span className="text-2xl">🍓</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 p-4 pt-6">
          <Button
            variant="ghost"
            onClick={handleSearchClick}
            className="flex flex-col items-center gap-1 h-auto py-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50"
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">キャストを探す</span>
          </Button>

          <Button
            variant="ghost"
            onClick={handleAIDiagnosisClick}
            className="flex flex-col items-center gap-1 h-auto py-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50"
          >
            <Brain className="w-5 h-5" />
            <span className="text-xs">AI診断</span>
          </Button>

          <Button
            onClick={handleBookingClick}
            className="flex flex-col items-center gap-1 h-auto py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs">今すぐ予約</span>
          </Button>
        </div>
      </div>

      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}