'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface PopSpeechBubbleProps {
  text: string;
  className?: string;
  delay?: number;
  variant?: 'normal' | 'cloud';
  isRect?: boolean;
  hasMascotIcon?: boolean;
}

const PopSpeechBubble: React.FC<PopSpeechBubbleProps> = ({
  text,
  className = '',
  delay = 0,
  variant = 'normal',
  isRect = false,
  hasMascotIcon = false,
}) => {
  const lines = text.split('\\n');

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay,
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      className={`z-20 ${className}`}
    >
      <div
        className={`relative border-[4px] border-black bg-white px-6 py-3 shadow-[6px_6px_0_#000] ${variant === 'cloud' ? 'rounded-[40px] border-[5px] border-dashed' : isRect ? 'rounded-xl' : 'rounded-[50px]'} `}
      >
        {/* Pointer */}
        {variant !== 'cloud' && (
          <div className="absolute bottom-[-18px] left-1/2 -translate-x-1/2">
            <div className="h-0 w-0 border-l-[12px] border-r-[12px] border-t-[18px] border-l-transparent border-r-transparent border-t-black"></div>
            <div className="absolute left-[-9px] top-[-22px] h-0 w-0 border-l-[9px] border-r-[9px] border-t-[15px] border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        )}

        {/* Content */}
        <div className="flex items-center gap-2 whitespace-nowrap">
          <div className="text-center text-xl font-black leading-[1.2] text-black md:text-2xl">
            {lines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
          {hasMascotIcon && (
            <div className="-mr-2 flex h-8 w-8 items-center justify-center">
              <span className="text-2xl">🐰</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PopSpeechBubble;
