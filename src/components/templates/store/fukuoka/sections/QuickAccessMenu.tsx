import { QuickAccessConfig } from '@/lib/store/storeTopConfig';
import {
  CalendarCheck,
  Camera,
  HelpCircle,
  Info,
  LucideIcon,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Users,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

interface QuickAccessMenuProps {
  config?: QuickAccessConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
}

const getIcon = (iconName: string): LucideIcon => {
  switch (iconName) {
    case 'Users':
      return Users;
    case 'CalendarCheck':
      return CalendarCheck;
    case 'Sparkles':
      return Sparkles;
    case 'Camera':
      return Camera;
    case 'MessageCircle':
      return MessageCircle;
    case 'HelpCircle':
      return HelpCircle;
    case 'ShoppingBag':
      return ShoppingBag;
    case 'Info':
      return Info;
    default:
      return Info;
  }
};

const QuickAccessMenu: React.FC<QuickAccessMenuProps> = ({ config, isEditing, onUpdate }) => {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  // {slug} プレースホルダーを実際の店舗スラグに置換
  const resolveLink = (href: string) => href.replace(/\{slug\}/g, slug);

  if (!config) return null;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isEditing) return; // 編集モード時はスクロールしない
    if (!href.startsWith('#')) return; // ページ内リンクでなければ何もしない

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

  const handleItemUpdate = (index: number, key: string, value: string) => {
    if (onUpdate) {
      const newItems = [...config.items];
      newItems[index] = { ...newItems[index], [key]: value };
      onUpdate('quickAccess', 'items', newItems);
    }
  };

  const handleLinkUpdate = (index: number) => {
    if (!onUpdate) return;
    const currentLink = config.items[index]?.href || '';
    const newLink = window.prompt(
      'リンクURLまたはセクションID(#cast等)を入力してください:\n※ {slug} は店舗スラグ（fukuoka等）に自動置換されます',
      currentLink,
    );
    if (newLink !== null) {
      handleItemUpdate(index, 'href', newLink);
    }
  };

  return (
    <section id="quickAccess" className="relative z-30 w-full bg-white shadow-xl">
      <div className="mx-auto w-full">
        <div className="grid grid-cols-3 gap-2 px-2 pb-2 md:grid-cols-6">
          {config.items.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <a
                key={index}
                href={isEditing ? undefined : resolveLink(item.href)}
                onClick={(e) => scrollToSection(e, resolveLink(item.href))}
                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-md border border-white/10 bg-rose-950 py-2 text-center shadow-sm transition-all duration-300 hover:bg-rose-900 hover:shadow-md"
              >
                {/* Icon decoration */}
                <div className="mb-1 text-rose-200/60 transition-colors duration-300 group-hover:text-rose-200">
                  <Icon size={20} />
                </div>

                {/* Text */}
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => handleItemUpdate(index, 'ja', e.currentTarget.innerText)}
                  className={`font-serif text-sm font-bold tracking-widest text-white drop-shadow-sm transition-colors group-hover:text-rose-100 ${
                    isEditing ? 'cursor-text rounded px-1 hover:bg-white/10' : ''
                  }`}
                >
                  {item.ja}
                </span>
                <span
                  contentEditable={isEditing}
                  suppressContentEditableWarning={isEditing}
                  onBlur={(e) => handleItemUpdate(index, 'en', e.currentTarget.innerText)}
                  className={`mt-0.5 text-[0.6rem] font-medium tracking-[0.2em] text-rose-300/80 transition-colors group-hover:text-rose-200 ${
                    isEditing ? 'cursor-text rounded px-1 hover:bg-white/10' : ''
                  }`}
                >
                  {item.en}
                </span>

                {isEditing && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkUpdate(index);
                    }}
                    className="absolute right-1 top-1 rounded bg-black/50 p-1 text-[8px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Link
                  </button>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickAccessMenu;
