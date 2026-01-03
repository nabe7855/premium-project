import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { CastMember } from '@/types/match';
import CastCard from './CastCard';
import LoadingIndicator from './LoadingIndicator';
import BackgroundAnimation from './BackgroundAnimation';
import ConfettiExplosion from './ConfettiExplosion';
import InitialCardAnimation from './InitialCardAnimation';
import SummonAnimation from '@/components/match2/SummonAnimation';

interface MatchingResultProps {
  castMembers: CastMember[];
}

const MatchingResult: React.FC<MatchingResultProps> = ({ castMembers }) => {
  const [showInitialCards, setShowInitialCards] = useState(true);
  const [showWhiteout, setShowWhiteout] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showCastCards, setShowCastCards] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const activeMember = castMembers[index];
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3D Carousel Constants
  const HORIZONTAL_OFFSET = isMobile ? 80 : 120;
  const DEPTH_OFFSET = isMobile ? 40 : 80;
  const ROTATION_ANGLE = 35;

  useEffect(() => {
    // Defines the sequence: Cards fall -> Float for 2s -> Whiteout with loading -> Results revealed
    const FALL_DURATION = 3000;
    const FLOAT_DURATION = 2000;
    const LOADING_DURATION = 2000;
    const FADE_OUT_DELAY = 250; 
    const CONFETTI_DELAY = 800;

    // 1. Trigger whiteout and loading animation after fall and float
    const transitionTimer = setTimeout(() => {
      setShowInitialCards(false);
      setShowWhiteout(true);
      setShowLoading(true);
    }, FALL_DURATION + FLOAT_DURATION);

    // 2. Trigger the switch from loading to results
    const showResultsTimer = setTimeout(() => {
      setShowLoading(false);
      setShowCastCards(true);
    }, FALL_DURATION + FLOAT_DURATION + LOADING_DURATION);

    // 3. Trigger the whiteout fade-out to reveal the results underneath
    const whiteoutOutTimer = setTimeout(() => {
      setShowWhiteout(false);
    }, FALL_DURATION + FLOAT_DURATION + LOADING_DURATION + FADE_OUT_DELAY);

    // 4. Trigger confetti explosion
    const confettiTimer = setTimeout(() => {
      setShowConfetti(true);
    }, FALL_DURATION + FLOAT_DURATION + LOADING_DURATION + CONFETTI_DELAY);

    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(showResultsTimer);
      clearTimeout(whiteoutOutTimer);
      clearTimeout(confettiTimer);
    };
  }, []);

  useEffect(() => {
    if (showCastCards) {
      count.set(0);
      const controls = animate(count, activeMember.compatibility, {
        duration: 1,
        delay: 0.2,
        ease: 'circOut',
      });
      return controls.stop;
    }
  }, [activeMember, showCastCards, count]);
  
  const handleDragEnd = (info: any) => {
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;

    if (swipe < -5000) { // Swipe left for next
      setIndex((prev) => (prev + 1) % castMembers.length);
    } else if (swipe > 5000) { // Swipe right for previous
      setIndex((prev) => (prev - 1 + castMembers.length) % castMembers.length);
    }
  };

  const handleCardClick = (cardIndex: number) => {
    setIndex(cardIndex);
  };

  const getCardAnimationProps = (position: number) => {
    const isFar = Math.abs(position) > 1;

    // Cards that are far from the center are animated off-screen
    if (isFar) {
      const xOffset = position > 0 ? 1000 : -1000;
      const rotate = position > 0 ? -90 : 90;
      return {
        x: `calc(-50% + ${xOffset}px)`,
        z: -500,
        rotateY: rotate,
        scale: 0.5,
        opacity: 0,
        zIndex: 0,
      };
    }

    // Cards in and near the center have dynamic properties
    return {
      x: `calc(-50% + ${position * HORIZONTAL_OFFSET}px)`,
      z: Math.abs(position) * -DEPTH_OFFSET,
      rotateY: position * -ROTATION_ANGLE,
      scale: 1 - Math.abs(position) * 0.15,
      opacity: position === 0 ? 1 : 0.5,
      filter: position === 0 ? 'none' : 'brightness(0.7)',
      zIndex: castMembers.length - Math.abs(position),
    };
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden">
<AnimatePresence>
  {showInitialCards && (
    <motion.div
      key="initial-cards"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 z-50"
    >
      <SummonAnimation />
    </motion.div>
  )}
</AnimatePresence>

        <AnimatePresence>
            {showWhiteout && (
                <motion.div
                    className="absolute inset-0 bg-white z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
            )}
        </AnimatePresence>

        <AnimatePresence>
            {showLoading && <LoadingIndicator />}
        </AnimatePresence>
        
        <AnimatePresence>
        {showCastCards && (
          <>
            <BackgroundAnimation />
            {showConfetti && <ConfettiExplosion />}
            <motion.div 
              className="w-full h-full relative z-10"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 1.0, ease: 'easeOut'}}
            >
              <motion.div
                className="absolute top-12 sm:top-16 w-full px-6"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <div className="max-w-md mx-auto flex justify-center items-start relative">
                  <h2 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-lg mt-4">You've Matched!</h2>
                  <div className="absolute top-0 right-0 sm:-right-8 flex flex-col items-center">
                    <motion.div
                      className="px-4 py-1.5 bg-pink-500 text-white rounded-full shadow-lg text-lg sm:text-xl font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: 'spring', stiffness: 120 }}
                    >
                      <motion.span>{rounded}</motion.span>%
                    </motion.div>
                    <p className="text-sm text-white/90 mt-1 font-semibold drop-shadow">Compatibility</p>
                  </div>
                </div>
              </motion.div>
              
              <div className="w-full h-full flex items-center justify-center">
                  <motion.div 
                      className="relative w-full h-[450px] sm:h-[500px]"
                      style={{ perspective: isMobile ? '800px' : '1200px', transformStyle: 'preserve-3d' }}
                  >
                      <div className="absolute w-full h-full">
                      {castMembers.map((cast, i) => {
                          const numMembers = castMembers.length;
                          let position = i - index;

                          // Handle wrapping for infinite carousel
                          if (position > numMembers / 2) {
                            position -= numMembers;
                          } else if (position < -numMembers / 2) {
                            position += numMembers;
                          }
                          
                          const isCenter = position === 0;

                          return (
                          <CastCard
                              key={cast.id}
                              castMember={cast}
                              animate={getCardAnimationProps(position)}
                              onDragEnd={isCenter ? handleDragEnd : undefined}
                              onClick={() => handleCardClick(i)}
                              isActive={isCenter}
                          />
                          );
                      })}
                      </div>
                  </motion.div>
              </div>
              
              <motion.p 
                className="absolute bottom-8 sm:bottom-10 w-full text-center text-white/80 text-sm sm:text-base drop-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Swipe or tap to see your matches
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MatchingResult;