import React from 'react';
import { motion } from 'framer-motion';
import { ThemeIcon } from './icons/StrawberryIcon';

const LoadingIndicator: React.FC = () => {
  return (
    <motion.div
      className="absolute inset-0 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2.0,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <ThemeIcon className="w-24 h-24 text-red-400 drop-shadow-lg" />
      </motion.div>
    </motion.div>
  );
};

export default LoadingIndicator;