// src/app/store/page.tsx
'use client';

import React from 'react';
import StoreSelectionScreen from '@/components/store/StoreSelectionScreen';

export default function StorePage() {
  return (
    <main className="min-h-screen w-full bg-gray-900 text-white">
      {/* 背景画像 */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20" 
        style={{ backgroundImage: "url('https://picsum.photos/seed/bg/1920/1080')" }}
      ></div>

      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-700/80 via-pink-500/85 to-rose-900/90"></div>

      {/* 本体 */}
      <div className="relative z-10">
        <StoreSelectionScreen />
      </div>
    </main>
  );
}
