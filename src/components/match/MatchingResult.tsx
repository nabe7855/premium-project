import SummonAnimation from '@/components/match2/SummonAnimation';
import { CastMember } from '@/types/match';
import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import BackgroundAnimation from './BackgroundAnimation';
import CastCard from './CastCard';
import ConfettiExplosion from './ConfettiExplosion';
import LoadingIndicator from './LoadingIndicator';

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
    const showResultsTimer = setTimeout(
      () => {
        setShowLoading(false);
        setShowCastCards(true);
      },
      FALL_DURATION + FLOAT_DURATION + LOADING_DURATION,
    );

    // 3. Trigger the whiteout fade-out to reveal the results underneath
    const whiteoutOutTimer = setTimeout(
      () => {
        setShowWhiteout(false);
      },
      FALL_DURATION + FLOAT_DURATION + LOADING_DURATION + FADE_OUT_DELAY,
    );

    // 4. Trigger confetti explosion
    const confettiTimer = setTimeout(
      () => {
        setShowConfetti(true);
      },
      FALL_DURATION + FLOAT_DURATION + LOADING_DURATION + CONFETTI_DELAY,
    );

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

    if (swipe < -5000) {
      // Swipe left for next
      setIndex((prev) => (prev + 1) % castMembers.length);
    } else if (swipe > 5000) {
      // Swipe right for previous
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
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
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
            className="absolute inset-0 z-40 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{showLoading && <LoadingIndicator />}</AnimatePresence>

      <AnimatePresence>
        {showCastCards && (
          <>
            <BackgroundAnimation />
            {showConfetti && <ConfettiExplosion />}
            <motion.div
              className="relative z-10 h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0, ease: 'easeOut' }}
            >
              <motion.div
                className="absolute top-12 w-full px-6 sm:top-16"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              >
                <div className="relative mx-auto flex max-w-md items-start justify-center">
                  <h2 className="mt-4 text-4xl font-bold text-white drop-shadow-lg sm:text-5xl">
                    You've Matched!
                  </h2>
                  <div className="absolute right-0 top-0 flex flex-col items-center sm:-right-8">
                    <motion.div
                      className="rounded-full bg-pink-500 px-4 py-1.5 text-lg font-bold text-white shadow-lg sm:text-xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: 'spring', stiffness: 120 }}
                    >
                      <motion.span>{rounded}</motion.span>%
                    </motion.div>
                    <p className="mt-1 text-sm font-semibold text-white/90 drop-shadow">
                      Compatibility
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="flex h-full w-full items-center justify-center">
                <motion.div
                  className="relative h-[450px] w-full sm:h-[500px]"
                  style={{
                    perspective: isMobile ? '800px' : '1200px',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="absolute h-full w-full">
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
                className="absolute bottom-8 w-full text-center text-sm text-white/80 drop-shadow sm:bottom-10 sm:text-base"
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
