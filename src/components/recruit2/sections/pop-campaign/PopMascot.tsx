'use client';

import { motion } from 'framer-motion';
import React from 'react';

const PopMascot: React.FC = () => {
  return (
    <motion.div
      animate={{
        y: [0, -15, 0],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="relative h-28 w-28 md:h-36 md:w-36"
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ears */}
        <ellipse
          cx="25"
          cy="25"
          rx="10"
          ry="22"
          fill="#4ade80"
          stroke="black"
          strokeWidth="3"
          transform="rotate(-10 25 25)"
        />
        <ellipse
          cx="75"
          cy="25"
          rx="10"
          ry="22"
          fill="#4ade80"
          stroke="black"
          strokeWidth="3"
          transform="rotate(10 75 25)"
        />

        {/* Body/Head */}
        <circle cx="50" cy="55" r="38" fill="#4ade80" stroke="black" strokeWidth="3" />

        {/* Face White area */}
        <ellipse cx="50" cy="58" rx="28" ry="20" fill="white" stroke="black" strokeWidth="3" />

        {/* Eyes */}
        <circle cx="40" cy="55" r="3" fill="black" />
        <circle cx="60" cy="55" r="3" fill="black" />

        {/* Smile */}
        <path
          d="M45 65Q50 70 55 65"
          stroke="black"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Arms */}
        <motion.path
          animate={{ rotate: [0, 15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          d="M15 55L2 45"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <motion.path
          animate={{ rotate: [0, -15, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          d="M85 55L98 45"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Phone in hand */}
        <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <rect
            x="88"
            y="30"
            width="10"
            height="16"
            rx="2"
            fill="white"
            stroke="black"
            strokeWidth="2"
          />
          <rect x="91" y="33" width="4" height="6" rx="0.5" fill="#f3f4f6" />
        </motion.g>
      </svg>

      {/* Sparkle near mascot */}
      <div className="absolute right-[-10px] top-0">
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PopMascot;
