'use client';

import React, { useEffect, useRef, useState } from 'react';

interface DesktopScaleWrapperProps {
  children: React.ReactNode;
  desktopWidth?: number;
}

export default function DesktopScaleWrapper({ children, desktopWidth = 1024 }: DesktopScaleWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current && contentRef.current) {
        const viewportWidth = window.innerWidth;
        if (viewportWidth < desktopWidth) {
          const newScale = viewportWidth / desktopWidth;
          setScale(newScale);
          setHeight(contentRef.current.offsetHeight * newScale);
        } else {
          setScale(1);
          setHeight('auto');
        }
      }
    };

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
    
    window.addEventListener('resize', updateScale);
    // Add a slight delay for initial layout calculation
    setTimeout(updateScale, 50);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [desktopWidth]);

  return (
    <div 
      ref={containerRef} 
      style={{ height: height === 'auto' ? 'auto' : `${height}px` }} 
      className="w-full overflow-hidden flex justify-center"
    >
      <div
        ref={contentRef}
        style={{
          width: `${desktopWidth}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
        className="flex-shrink-0 origin-top"
      >
        {children}
      </div>
    </div>
  );
}
