'use client';
import React, { useState, useEffect } from 'react';

export const ProgressIndicator: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 z-50 h-1 w-full bg-gray-200">
      <div
        className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
