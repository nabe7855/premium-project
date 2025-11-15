'use client'; 
import React from 'react';
import { MessageCircle } from 'lucide-react';

export const SBGuidance: React.FC = () => {
  return (
    <section className="py-8 px-4 bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-sm mx-auto sm:max-w-2xl lg:max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-4 text-center sm:p-6">
          <div className="flex flex-col items-center mb-4 sm:flex-row sm:justify-center sm:mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-2 sm:mb-0 sm:mr-4 sm:w-12 sm:h-12">
              <span className="text-red-600 text-base sm:text-lg">🍓</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 font-sans sm:text-xl">
              SBくんからの最終案内
            </h3>
          </div>
          
          <p className="text-gray-700 leading-relaxed font-serif text-sm mb-4 sm:text-base sm:mb-6">
            他にもご不明な点がございましたら、いつでもお気軽にお問い合わせください。<br />
            安心してご利用いただけるよう、スタッフ一同心よりお待ちしております🍓
          </p>
          
          <div className="flex items-center justify-center">
            <MessageCircle className="text-red-600 mr-2 flex-shrink-0" size={18} />
            <a 
              href="/contact" 
              className="text-red-600 hover:text-red-700 underline font-serif font-medium text-sm sm:text-base"
            >
              お問い合わせフォームへ
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};