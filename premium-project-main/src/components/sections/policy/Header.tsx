'use client';
import React from 'react';
import { Clock, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-b from-pink-50 to-white px-4 py-8">
      <div className="mx-auto max-w-sm text-center sm:max-w-2xl lg:max-w-4xl">
        <div className="mb-4 flex flex-col items-center">
          <Shield className="mb-2 text-red-600" size={28} />
          <h1 className="font-sans text-2xl font-bold leading-tight text-gray-800 sm:text-3xl lg:text-4xl">
            プライバシーポリシー
          </h1>
        </div>

        <div className="mb-6 flex items-center justify-center text-gray-600">
          <Clock size={16} className="mr-2" />
          <span className="text-sm">約3分で読めます</span>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
          <p className="font-serif text-base leading-relaxed text-gray-700 sm:text-lg">
            ストロベリーボーイズでは、個人情報の保護と適切な管理を最優先に考え、お客様が安心してご利用いただける環境づくりに努めています。
          </p>

          <div className="mt-4 flex items-center justify-center">
            <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 sm:mr-3 sm:h-8 sm:w-8">
              <span className="text-xs text-red-600 sm:text-sm">🍓</span>
            </div>
            <span className="rounded-full bg-pink-50 px-2 py-1 text-xs sm:px-3 sm:text-sm">
              安心してご利用ください
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
