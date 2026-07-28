'use client';

import React, { useEffect, useRef, useState } from 'react';

interface DesktopScaleWrapperProps {
  children: React.ReactNode;
  desktopWidth?: number;
}

export default function DesktopScaleWrapper({ children, desktopWidth = 720 }: DesktopScaleWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && contentRef.current) {
        const viewportWidth = Math.min(window.innerWidth, containerRef.current.clientWidth || window.innerWidth);
        
        // 720px 基準でスケーリング (スマホでも文字が小さすぎず読みやすい絶妙サイズ)
        if (viewportWidth < desktopWidth && viewportWidth > 0) {
          const newScale = viewportWidth / desktopWidth;
          // scrollHeight も含めた実際の高さを正確に計測
          const currentContentHeight = Math.max(
            contentRef.current.offsetHeight,
            contentRef.current.scrollHeight
          );
          setScale(newScale);
          if (currentContentHeight > 0) {
            // 下部が見切れないよう少し余白パディング(20px)をプラス
            setHeight(Math.ceil(currentContentHeight * newScale) + 24);
          }
        } else {
          setScale(1);
          setHeight('auto');
        }
      }
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    
    window.addEventListener('resize', updateScale);
    
    // 画像やフォント読み込み後の再計算をマルチタイミングで実施
    const timer1 = setTimeout(updateScale, 100);
    const timer2 = setTimeout(updateScale, 400);
    const timer3 = setTimeout(updateScale, 1000);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [desktopWidth]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        height: height === 'auto' ? 'auto' : `${height}px`,
      }} 
      className="w-full overflow-hidden flex justify-center relative transition-all duration-200"
    >
      <div
        ref={contentRef}
        style={{
          width: `${desktopWidth}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
        className="flex-shrink-0 origin-top pb-6"
      >
        {children}
      </div>
    </div>
  );
}
