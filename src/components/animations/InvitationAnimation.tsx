'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function InvitationAnimation() {
  const [showLight, setShowLight] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLight(true);
    }, 1200); // 封筒回転後に白フラッシュ

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      {/* 封筒アニメーション */}
      <Image
        src="/images/envelope.png"
        alt="招待状"
        width={160}
        height={160}
        className="animate-spin-scale z-10"
      />

      {/* 白光フェード */}
      {showLight && <div className="animate-fadeIn absolute inset-0 bg-white" />}
    </div>
  );
}
