'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ScrollToTopButtonProps {
  threshold?: number;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ threshold = 400 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-5 z-[55] flex h-12 w-12 items-center justify-center rounded-full bg-amber-600 font-bold text-white shadow-2xl transition-colors hover:bg-amber-700 active:scale-95 md:bottom-10 md:right-10"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6 stroke-[3]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
