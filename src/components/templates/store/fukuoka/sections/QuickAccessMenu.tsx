import { CalendarCheck, Camera, HelpCircle, MessageCircle, Sparkles, Users } from 'lucide-react';
import React from 'react';

const MENU_ITEMS = [
  {
    ja: 'セラピスト一覧',
    en: 'THERAPIST',
    href: '#cast',
    icon: Users,
  },
  {
    ja: '当日出勤',
    en: 'TODAY',
    href: '#cast',
    icon: CalendarCheck,
  },
  {
    ja: 'イベント',
    en: 'EVENT',
    href: '#campaign',
    icon: Sparkles,
  },
  {
    ja: '写メ日記',
    en: 'DIARY',
    href: '#diary',
    icon: Camera,
  },
  {
    ja: '口コミ',
    en: 'REVIEW',
    href: '#review',
    icon: MessageCircle,
  },
  {
    ja: 'QA',
    en: 'Q&A',
    href: '#faq',
    icon: HelpCircle,
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
    <section className="relative z-30 w-full bg-white shadow-xl">
      <div className="mx-auto w-full">
        <div className="grid grid-cols-3 gap-2 px-2 md:grid-cols-6">
          {MENU_ITEMS.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="group relative flex flex-col items-center justify-center overflow-hidden rounded-md border border-white/10 bg-rose-950 py-2 text-center shadow-sm transition-all duration-300 hover:bg-rose-900 hover:shadow-md"
            >
              {/* Icon decoration */}
              <div className="mb-1 text-rose-200/60 transition-colors duration-300 group-hover:text-rose-200">
                <item.icon size={20} />
              </div>

              {/* Text */}
              <span className="font-serif text-sm font-bold tracking-widest text-white drop-shadow-sm transition-colors group-hover:text-rose-100">
                {item.ja}
              </span>
              <span className="mt-0.5 text-[0.6rem] font-medium tracking-[0.2em] text-rose-300/80 transition-colors group-hover:text-rose-200">
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
