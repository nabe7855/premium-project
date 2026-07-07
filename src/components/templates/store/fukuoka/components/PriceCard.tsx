import React from 'react';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface PriceItem {
  title?: string;
  duration: string; // label mapping
  price: number;
  description?: string;
}

interface PriceCardProps {
  title: string;
  description: string;
  items: PriceItem[];
  isEditing?: boolean;
  onUpdate?: (key: string, value: any) => void;
  page?: number;
  direction?: number;
}

const PriceCard: React.FC<PriceCardProps> = ({
  title,
  description,
  items,
  isEditing,
  onUpdate,
  page = 0,
  direction = 0,
}) => {
  const handleItemUpdate = (index: number, key: keyof PriceItem, value: any) => {
    if (onUpdate) {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [key]: value };
      onUpdate('items', newItems);
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="relative mx-auto w-full max-w-[700px] bg-[#fffdf8] p-16 shadow-xl rounded-[2.5rem]">
      {/* Frame Background Image */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
        <NextImage 
          src="/images/store/fukuoka/price/A_お得なイベントコース/inner_frame.png" 
          fill 
          priority
          className="object-fill mix-blend-multiply opacity-90" 
          alt="frame" 
        />
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="relative z-10 w-full"
        >
          {/* Header Area */}
          <div className="mb-8 flex flex-col items-center text-center">
            {/* Small Strawberry Icon */}
            <div className="relative mb-3 h-[100px] w-[100px]">
               <NextImage 
                 src="/images/store/fukuoka/price/A_お得なイベントコース/card_strawberry.png" 
                 fill 
                 className="object-contain mix-blend-multiply" 
                 alt="strawberry" 
               />
            </div>
            
            <h3
              contentEditable={isEditing}
              onBlur={(e) => onUpdate?.('title', e.currentTarget.innerText)}
              suppressContentEditableWarning
              className="font-serif text-4xl font-bold tracking-widest text-[#b8324f] outline-none"
            >
              {title}
            </h3>
            
            {/* Gold Ornament Line */}
            <div className="my-5 flex w-full items-center justify-center">
               <div className="h-[1px] w-16 bg-[#d5a447]"></div>
               <div className="mx-2 text-xs text-[#d5a447]">❖</div>
               <div className="h-[1px] w-16 bg-[#d5a447]"></div>
            </div>

            <div className="flex min-h-[8rem] w-full items-center justify-center">
              <p
                contentEditable={isEditing}
                onBlur={(e) => onUpdate?.('description', e.currentTarget.innerText)}
                suppressContentEditableWarning
                className="whitespace-pre-line text-base leading-loose text-[#3b1f1a] outline-none font-medium"
              >
                {description}
              </p>
            </div>
          </div>

          {/* Price Table */}
          <div className="relative z-10 rounded-2xl border border-[#ead1a1] bg-[#fffdf8] p-8 shadow-sm">
            <div className="flex flex-col space-y-6">
              {items.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex flex-row items-center justify-between gap-4">
                    {/* Pill Label */}
                    <div className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#b8324f] to-[#dd5d7a] px-5 py-2.5 shadow-md min-w-[160px] border border-[#fffdf8]">
                      <span className="text-white text-xs">🌸</span>
                      <span
                        contentEditable={isEditing}
                        onBlur={(e) => handleItemUpdate(idx, 'duration', e.currentTarget.innerText)}
                        suppressContentEditableWarning
                        className="text-base font-bold tracking-wide text-white outline-none whitespace-nowrap"
                      >
                        {item.duration}
                      </span>
                    </div>

                    {/* Dot Leader */}
                    <div className="block h-[2px] flex-grow border-b-2 border-dotted border-[#ead1a1] mx-4 opacity-70" />

                    {/* Price */}
                    <div className="flex shrink-0 items-baseline gap-1 text-[#b8324f]">
                      <span className="font-serif text-2xl font-bold">¥</span>
                      <span
                        contentEditable={isEditing}
                        onBlur={(e) =>
                          handleItemUpdate(
                            idx,
                            'price',
                            parseInt(e.currentTarget.innerText.replace(/,/g, '')) || 0,
                          )
                        }
                        suppressContentEditableWarning
                        className="font-serif text-5xl font-bold tabular-nums tracking-tight outline-none"
                      >
                        {item.price.toLocaleString()}
                      </span>
                      <span className="text-base font-medium text-[#3b1f1a] ml-1">（税込）</span>
                    </div>
                  </div>
                  
                  {/* Divider for all except last */}
                  {idx < items.length - 1 && (
                    <div className="mt-6 flex items-center justify-center w-full">
                      <div className="h-[1px] w-[45%] border-b-2 border-dotted border-[#ead1a1] opacity-70" />
                      <div className="mx-2 text-[#d5a447] text-xs">❖</div>
                      <div className="h-[1px] w-[45%] border-b-2 border-dotted border-[#ead1a1] opacity-70" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PriceCard;
