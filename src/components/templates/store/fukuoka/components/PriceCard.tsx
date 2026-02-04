import { Clock } from 'lucide-react';
import React from 'react';

interface PriceItem {
  title: string;
  duration: number;
  price: number;
  description: string;
}

interface PriceCardProps {
  title: string;
  description: string;
  items: PriceItem[];
  themeColor?: string; // e.g., '[#642B2B]'
  badgeColor?: string; // e.g., '[#D37B47]'
}

const PriceCard: React.FC<PriceCardProps> = ({
  title,
  description,
  items,
  themeColor = '[#642B2B]',
  badgeColor = '[#D37B47]',
}) => {
  return (
    <div
      className={`relative mx-auto w-full max-w-lg overflow-hidden rounded-[2rem] border-[4px] border-[#642B2B] bg-[#FDFCF1] shadow-xl`}
    >
      {/* Header */}
      <div className={`bg-[#642B2B] py-4 text-center`}>
        <h3 className="text-xl font-black tracking-[0.2em] text-white">{title}</h3>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Description */}
        <p className="mb-8 text-sm font-bold leading-relaxed text-[#642B2B]/80 md:text-base">
          {description}
        </p>

        {/* Course List */}
        <div className="space-y-6">
          {items.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between gap-4">
                {/* Duration Badge */}
                <div
                  className={`flex items-center gap-2 rounded-lg bg-[#D37B47] px-4 py-2 text-white`}
                >
                  <Clock size={16} strokeWidth={3} />
                  <span className="text-lg font-black tracking-tighter">{item.duration} 分</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 text-[#642B2B]">
                  <span className="text-2xl font-black">¥</span>
                  <span className="text-3xl font-black tabular-nums">
                    {item.price.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold">(税込)</span>
                </div>
              </div>
              {idx < items.length - 1 && <div className="mt-6 border-b border-[#642B2B]/20" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
