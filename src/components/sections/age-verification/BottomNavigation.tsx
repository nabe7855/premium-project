import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

interface BottomNavigationProps {
  onAgeVerification: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ onAgeVerification }) => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
    >
      {/* Character peek */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 bg-strawberry-100 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
        >
          <Heart className="w-6 h-6 text-strawberry-500" fill="currentColor" />
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="bg-white/95 backdrop-blur-lg border-t border-rose-100 px-4 py-3 safe-area-pb">
        <button
          onClick={onAgeVerification}
          className="w-full bg-gradient-to-r from-strawberry-500 to-rose-500 hover:from-strawberry-600 hover:to-rose-600 text-white py-4 rounded-2xl font-rounded font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Sparkles className="w-5 h-5" />
          あなただけのストロベリーボーイを探す
          <Heart className="w-5 h-5 animate-pulse" fill="currentColor" />
        </button>
      </div>
    </motion.div>
  );
};

export default BottomNavigation;