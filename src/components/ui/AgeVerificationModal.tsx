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

export default function AgeVerificationModal({
  isOpen,
  onClose,
  onConfirm,
}: AgeVerificationModalProps) {
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
      <Card
        className={`relative z-10 mx-4 w-full max-w-md transform bg-white p-8 shadow-2xl transition-all duration-300 ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-rose-100 p-4">
              <span className="text-4xl">🍓</span>
            </div>
          </div>

          <h2 className="mb-4 font-serif text-2xl font-bold text-gray-900">年齢確認</h2>

          <p className="mb-6 leading-relaxed text-gray-600">
            このサービスは18歳以上の方を対象としております。
            <br />
            あなたは18歳以上ですか？
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleConfirm}
              className="transform rounded-full bg-rose-600 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-rose-700"
            >
              はい、18歳以上です
            </Button>

            <Button
              variant="outline"
              onClick={handleClose}
              className="rounded-full border-gray-300 py-3 text-gray-600 hover:bg-gray-50"
            >
              いいえ
            </Button>
          </div>

          <p className="mt-4 text-xs text-gray-500">※18歳未満の方はご利用いただけません</p>
        </div>
      </Card>
    </div>
  );
}
