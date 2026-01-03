import React from 'react';
import { motion, PanInfo, useMotionValue, useTransform, animate } from 'framer-motion';
import { CastMember } from '@/types/match';

interface CastCardProps {
  castMember: CastMember;
  animate: Record<string, any>;
  onDragEnd?: (info: PanInfo) => void;
  onClick: () => void;
  isActive: boolean;
}

const CastCard: React.FC<CastCardProps> = ({ castMember, animate: motionAnimate, onDragEnd, onClick, isActive }) => {
  const dragX = useMotionValue(0);

  // Transform drag offset for visual feedback
  const rotate = useTransform(dragX, [-200, 200], [-20, 20]);

  const handleShowDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing
    alert(`Navigating to details for ${castMember.name}...`);
  };

  const onInternalDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Spring the feedback animations back to their origin
    animate(dragX, 0, {
      type: 'spring',
      stiffness: 500,
      damping: 40,
    });
    // Propagate event to parent for swipe detection
    if (onDragEnd) {
      onDragEnd(info);
    }
  };
    
  return (
    <motion.div
      className="absolute w-56 h-[340px] sm:w-64 sm:h-96 md:w-72 md:h-[420px] cursor-pointer"
      style={{ 
        left: '50%', 
        willChange: 'transform',
        rotate: isActive ? rotate : undefined, // Apply tilt based on drag
      }}
      animate={motionAnimate}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDrag={(_e, info) => dragX.set(info.offset.x)}
      onDragEnd={onInternalDragEnd}
      onClick={onClick}
      // Physics-based transition for carousel movement
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="relative w-full h-full bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden flex flex-col transform-gpu">
        <img
          src={castMember.imageUrl}
          alt={castMember.name}
          className="w-full h-full object-cover"
          draggable="false"
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {castMember.name}, {castMember.age}
          </h3>
          <p className="text-white/90 text-xs sm:text-sm">{castMember.status}</p>
        </div>
        {isActive && (
             <motion.div 
             className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4"
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 1.2, duration: 0.4, ease: 'easeOut' }}
           >
             <motion.button
               onClick={handleShowDetails}
               className="text-sm sm:text-base px-4 py-1.5 sm:px-5 sm:py-2 bg-white/90 text-pink-600 font-bold rounded-full shadow-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
               whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 1)' }}
               whileTap={{ scale: 0.95 }}
             >
               Details
             </motion.button>
           </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CastCard;