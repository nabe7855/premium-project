'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useRef, useEffect, useState } from 'react';
import { BottomNavItemConfig, DEFAULT_BOTTOM_NAV } from '@/lib/store/storeTopConfig';
import { getIconByName } from '@/lib/utils/icons';
import { resolveStoreLink } from '@/lib/utils/resolveStoreLink';
import { useStore } from '@/contexts/StoreContext';

interface MobileStickyButtonProps {
  config?: BottomNavItemConfig[];
  isVisible?: boolean;
}

const MobileStickyButton: React.FC<MobileStickyButtonProps> = ({ config, isVisible = true }) => {
  const { store } = useStore();
  if (!isVisible) return null;
  const pathname = usePathname();
  const match = pathname.match(/^\/store\/([^/]+)/);
  const storeSlug = match?.[1] || '';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRightFade, setShowRightFade] = useState(true);

  const items = (config && config.length > 0 ? config : DEFAULT_BOTTOM_NAV).filter(item => item.isVisible);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowRightFade(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [items]);

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full animate-in fade-in slide-in-from-bottom-5 duration-500 md:hidden">
      {/* 🔮 Premium Scroll Hint Overlay */}
      {showRightFade && (
        <div 
          className="pointer-events-none absolute right-0 top-0 z-20 h-full w-14 bg-gradient-to-l from-white via-white/80 to-transparent flex items-center justify-end pr-1"
          style={{ filter: 'drop-shadow(-4px 0 8px rgba(255,100,150,0.1))' }}
        >
          <div className="mr-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.3)] animate-pulse">
            <ChevronRight size={18} className="text-pink-500 ml-0.5" />
          </div>
        </div>
      )}

      <div className="border-t border-slate-200 bg-white/95 shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.15)] backdrop-blur-xl">
        <div
          ref={scrollRef}
          className="flex h-[72px] items-stretch overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item, idx) => {
            const resolvedHref = resolveStoreLink(
              item.href,
              storeSlug,
              store.contact?.phone,
              store.contact?.line,
            );
            const isActive = pathname === resolvedHref;
            const IconComponent = getIconByName(item.icon);
            
            return (
              <Link
                key={idx}
                href={resolvedHref}
                className={`group flex flex-shrink-0 flex-col items-center justify-center gap-1 transition-all active:scale-95 snap-center ${
                  isActive ? 'bg-slate-50/50' : 'bg-transparent'
                }`}
                style={{ width: '16.666%', minWidth: '16.666%' }}
              >
                <div className={`relative flex h-8 w-8 items-center justify-center rounded-2xl transition-all duration-300 ${
                  isActive ? 'scale-110 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)]' : 'group-hover:scale-110'
                }`}>
                  <IconComponent
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`${item.color || 'text-slate-600'} transition-all ${isActive ? 'drop-shadow-[0_0_5px_currentColor]' : 'opacity-80'}`}
                  />
                  {isActive && (
                    <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                  )}
                </div>
                <span className={`text-[10px] font-black tracking-tighter transition-colors ${
                  isActive ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Safe Area Padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </div>
  );
};

export default MobileStickyButton;
