'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface AgeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AgeVerificationModal({ isOpen, onClose, onConfirm }: AgeVerificationModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <Card className={`relative z-10 w-full max-w-md mx-4 p-8 bg-white shadow-2xl transition-all duration-300 transform ${
        isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
      }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* SB Character */}
          <div className="flex justify-center mb-6">
            <div className="bg-rose-100 rounded-full p-4">
              <span className="text-4xl">🍓</span>
            </div>
          </div>

          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            年齢確認
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            このサービスは18歳以上の方を対象としております。
            <br />
            あなたは18歳以上ですか？
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleConfirm}
              className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-3 rounded-full transition-all duration-300 transform hover:-translate-y-1"
            >
              はい、18歳以上です
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 py-3 rounded-full"
            >
              いいえ
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            ※18歳未満の方はご利用いただけません
          </p>
        </div>
      </Card>
    </div>
  );
}