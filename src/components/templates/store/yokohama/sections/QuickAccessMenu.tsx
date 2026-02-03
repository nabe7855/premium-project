import { Calendar, CreditCard, Home, MapPin, Phone, Users } from 'lucide-react';
import React from 'react';

const MENU_ITEMS = [
  {
    ja: 'ホーム',
    en: 'HOME',
    href: '#hero',
    icon: Home,
  },
  {
    ja: 'スケジュール',
    en: 'SCHEDULE',
    href: '#cast',
    icon: Calendar,
  },
  {
    ja: 'セラピスト',
    en: 'THERAPIST',
    href: '#cast',
    icon: Users,
  },
  {
    ja: 'システム',
    en: 'SYSTEM',
    href: '#price',
    icon: CreditCard,
  },
  {
    ja: 'アクセス',
    en: 'ACCESS',
    href: '#info',
    icon: MapPin,
  },
  {
    ja: 'ご予約',
    en: 'RESERVATION',
    href: '#hero',
    icon: Phone,
  },
];

const QuickAccessMenu = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative z-30 -mt-8 px-4 pb-8 md:-mt-12 md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/90 p-1 shadow-2xl backdrop-blur-md md:grid-cols-6 md:gap-2 md:p-2">
          {MENU_ITEMS.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-white/5 to-transparent py-4 text-center transition-all duration-300 hover:border-cyan-400/30 hover:bg-slate-800/80"
            >
              {/* Decorative corners */}
              <div className="absolute left-0 top-0 h-2 w-2 border-l border-t border-cyan-200/20 transition-all duration-300 group-hover:border-cyan-200/50" />
              <div className="absolute right-0 top-0 h-2 w-2 border-r border-t border-cyan-200/20 transition-all duration-300 group-hover:border-cyan-200/50" />
              <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-200/20 transition-all duration-300 group-hover:border-cyan-200/50" />
              <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-cyan-200/20 transition-all duration-300 group-hover:border-cyan-200/50" />

              {/* Icon decoration */}
              <div className="mb-2 text-cyan-200/60 transition-colors duration-300 group-hover:text-cyan-200">
                <item.icon size={16} />
              </div>

              {/* Text */}
              <span className="font-serif text-sm font-bold tracking-widest text-white drop-shadow-sm group-hover:text-cyan-100">
                {item.ja}
              </span>
              <span className="mt-0.5 text-[0.5rem] font-medium tracking-[0.2em] text-cyan-300/80 group-hover:text-cyan-200">
                {item.en}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccessMenu;
