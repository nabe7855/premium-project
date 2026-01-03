import React from 'react';
import { motion } from 'framer-motion';
import { ThemeIcon } from './icons/StrawberryIcon';

const CONFETTI_COUNT = 50;
const COLORS = ['#FFC0CB', '#FF69B4', '#DC143C', '#F08080']; // Pinks and reds

const ConfettiPiece: React.FC = () => {
  const x = Math.random() * 500 - 250;
  const y = Math.random() * 500 - 250;
  const rotate = Math.random() * 360;
  const duration = Math.random() * 2 + 1.5;
  const delay = Math.random() * 0.2;
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const initialScale = Math.random() * 0.5 + 0.8;

  return (
    <motion.div
      className="absolute"
      style={{ willChange: 'transform, opacity' }}
      initial={{ x: 0, y: 0, opacity: 1, scale: initialScale, rotate: 0 }}
      animate={{ 
        x, 
        y, 
        rotate, 
        opacity: 0, 
      }}
      transition={{ duration, delay, ease: 'easeOut' }}
      whileHover={{ scale: 2, rotate: 0, zIndex: 50, transition: { duration: 0.2 } }}
    >
        <ThemeIcon className="w-5 h-5" style={{ color }} />
    </motion.div>
  );
};

const ConfettiExplosion: React.FC = () => {
    return (
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 z-50 pointer-events-none">
             {[...Array(CONFETTI_COUNT)].map((_, i) => (
                <div key={i} className="pointer-events-auto">
                    <ConfettiPiece />
                </div>
            ))}
        </div>
    );
};

export default ConfettiExplosion;