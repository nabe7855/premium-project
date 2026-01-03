import React from 'react';
import { motion } from 'framer-motion';
import { ThemeIcon } from './icons/StrawberryIcon';

const PARTICLE_COUNT = 15;

const BackgroundParticle: React.FC = () => {
  const duration = Math.random() * 10 + 10; // 10-20 seconds
  const delay = Math.random() * 10;
  const initialX = `${Math.random() * 100}vw`;
  const initialY = `${Math.random() * 100}vh`;
  const finalX = `${Math.random() * 100}vw`;
  const finalY = `${Math.random() * 100}vh`;
  const initialScale = Math.random() * 0.4 + 0.1; // 0.1 to 0.5
  const finalScale = Math.random() * 0.4 + 0.1;

  return (
    <motion.div
      className="absolute top-0 left-0"
      style={{ willChange: 'transform, opacity' }}
      initial={{ 
        x: initialX, 
        y: initialY,
        scale: initialScale, 
        opacity: 0 
      }}
      animate={{
        x: [initialX, finalX],
        y: [initialY, finalY],
        scale: [initialScale, finalScale, initialScale],
        opacity: [0, 0.4, 0],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      }}
    >
      <ThemeIcon className="w-16 h-16 text-red-300/50" />
    </motion.div>
  );
};

const BackgroundAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {[...Array(PARTICLE_COUNT)].map((_, i) => (
        <BackgroundParticle key={i} />
      ))}
    </div>
  );
};

export default BackgroundAnimation;