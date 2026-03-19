import { Home, Camera, Star, Calendar, MessageCircle, PhoneCall, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useRef, useEffect, useState } from 'react';

const MobileStickyButton: React.FC = () => {
  const pathname = usePathname();
  const match = pathname.match(/^\/store\/([^/]+)/);
  const storeSlug = match?.[1] || '';
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRightFade, setShowRightFade] = useState(true);

  const navItems = [
    { label: 'HOME', icon: Home, href: `/store/${storeSlug}`, color: 'text-slate-600' },
    { label: '写メ日記', icon: Camera, href: `/store/${storeSlug}/diary`, color: 'text-pink-500' },
    { label: '口コミ', icon: Star, href: `/store/${storeSlug}/reviews`, color: 'text-amber-500' },
    { label: 'WEB予約', icon: Calendar, href: `/store/${storeSlug}/reservation`, color: 'text-blue-500' },
    { label: 'LINE予約', icon: MessageCircle, href: 'https://line.me', color: 'text-green-500' },
    { label: '電話予約', icon: PhoneCall, href: 'tel:050-5491-3991', color: 'text-rose-500' },
  ];

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
  }, []);

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full md:hidden">
      {/* Scroll Indicator Overlay */}
      {showRightFade && (
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white via-white/40 to-transparent flex items-center justify-end pr-1">
          <ChevronRight size={16} className="text-slate-400 animate-pulse" />
        </div>
      )}

      <div className="border-t border-slate-200 bg-white/95 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] backdrop-blur-md">
        <div
          ref={scrollRef}
          className="flex h-16 items-stretch overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`group flex min-w-[20%] flex-1 flex-col items-center justify-center gap-1 px-1 transition-all active:scale-95 snap-center ${
                  isActive ? 'bg-slate-50' : 'bg-transparent'
                }`}
              >
                <div className={`relative flex h-7 w-7 items-center justify-center rounded-xl transition-all ${
                  isActive ? 'scale-110 shadow-inner' : 'group-hover:scale-105'
                }`}>
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`${item.color} ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]' : 'opacity-80'}`}
                  />
                  {isActive && (
                    <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-current" />
                  )}
                </div>
                <span className={`text-[9px] font-black tracking-tighter ${
                  isActive ? 'text-slate-900 scale-105' : 'text-slate-500'
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
