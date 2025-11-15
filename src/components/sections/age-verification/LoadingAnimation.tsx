import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50 to-cream-100 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Main Animation */}
        <div className="relative mb-8">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 bg-strawberry-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <Heart className="w-10 h-10 text-white" fill="currentColor" />
          </motion.div>

          {/* Floating strawberries */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="absolute w-4 h-4 bg-strawberry-300 rounded-full"
              style={{
                top: '50%',
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 60}%`,
                marginTop: `${Math.sin(i * 60 * Math.PI / 180) * 60}px`,
                marginLeft: '-8px'
              }}
            />
          ))}
        </div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl font-rounded font-bold text-gray-800 mb-2">
            ストロベリーボーイ
          </h2>
          <p className="text-strawberry-600 font-medium">
            甘い時間をご用意しています...
          </p>
        </motion.div>

        {/* Loading dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-strawberry-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;