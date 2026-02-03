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
    href: '#footer',
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
    <section className="relative z-30 w-full bg-rose-950 shadow-xl">
      <div className="mx-auto w-full">
        <div className="grid grid-cols-3 gap-[1px] border-b border-rose-900/20 md:grid-cols-6">
          {MENU_ITEMS.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="group relative flex flex-col items-center justify-center overflow-hidden bg-rose-950 py-6 text-center transition-all duration-300 hover:bg-rose-900"
            >
              {/* Icon decoration */}
              <div className="mb-2 text-rose-200/60 transition-colors duration-300 group-hover:text-rose-200">
                <item.icon size={20} />
              </div>

              {/* Text */}
              <span className="font-serif text-sm font-bold tracking-widest text-white drop-shadow-sm group-hover:text-rose-100">
                {item.ja}
              </span>
              <span className="mt-0.5 text-[0.6rem] font-medium tracking-[0.2em] text-rose-300/80 group-hover:text-rose-200">
                {item.en}
              </span>

              {/* Horizontal Divider for mobile (every 3 items, except last row) */}
              <div className="absolute bottom-0 right-0 h-[1px] w-full bg-rose-900/30 md:hidden" />
              {/* Vertical Divider for mobile */}
              <div className="absolute right-0 top-0 h-full w-[1px] bg-rose-900/30 md:hidden" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccessMenu;
