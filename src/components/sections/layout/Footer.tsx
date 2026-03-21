'use client';

import { getStoreContactData } from '@/actions/store-contact';
import { Calendar, CreditCard, Heart, MessageCircle, Phone, Users, Home, Camera, Star } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const params = useParams();
  const pathname = usePathname();
  const slug = params?.slug ?? '';

  const [isMounted, setIsMounted] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isBusinessHours, setIsBusinessHours] = useState(true);
  const [storeContact, setStoreContact] = useState({
    phone: '050-5212-5818',
    lineUrl: 'https://lin.ee/xxxxx',
  });
  const [navItems, setNavItems] = useState<any[]>([]);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isNavLoaded, setIsNavLoaded] = useState(false);

  // 初めての方へページかどうかを判定
  const isFirstTimePage = pathname?.includes('/first-time');

  const [showRightFade, setShowRightFade] = useState(true);
  const scrollRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    setIsMounted(true);

    const visited = localStorage.getItem('sb_visited');
    if (!visited) {
      setIsFirstVisit(true);
      localStorage.setItem('sb_visited', 'true');
    }

    const updateBusinessHours = () => {
      const now = new Date();
      const hour = now.getHours();
      setIsBusinessHours(hour >= 10 && hour < 24);
    };

    updateBusinessHours();
    const interval = setInterval(updateBusinessHours, 60000);

    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowRightFade(scrollLeft + clientWidth < scrollWidth - 10);
      }
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }

    const fetchConfig = async () => {
      if (!slug) return;
      try {
        const { getStoreTopConfig } = await import('@/lib/store/getStoreTopConfig');
        const res = await getStoreTopConfig(slug as string);
        if (res.success && res.config) {
          const config = res.config;
          if (config.footer?.bottomNav) {
            setNavItems(config.footer.bottomNav.filter((it: any) => it.isVisible));
          }
          if (typeof config.footer?.isBottomNavVisible === 'boolean') {
            setIsNavVisible(config.footer.isBottomNavVisible);
          }
        }
      } catch (err) {
        console.error('Failed to fetch footer config:', err);
      } finally {
        setIsNavLoaded(true);
      }
    };

    fetchConfig();

    if (slug) {
      getStoreContactData(slug as string).then((res) => {
        if (res.success && res.data) {
          setStoreContact({
            phone: res.data.phone || '050-5212-5818',
            lineUrl: res.data.lineUrl || 'https://lin.ee/xxxxx',
          });
        }
      });
    }

    return () => {
      clearInterval(interval);
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [slug]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isMounted) return null;

  if (!isMounted || !isNavVisible || !isNavLoaded) return null;

  const items = navItems.length > 0 ? navItems : [
    { id: 'home', label: 'ホーム', icon: Home, href: `/store/${slug}` },
    { id: 'schedule', label: '出勤', icon: Calendar, href: `/store/${slug}/schedule/schedule` },
    { id: 'pricing', label: '料金', icon: CreditCard, href: `/store/${slug}/price`, badge: isFirstVisit ? '初' : null },
    { id: 'diary', label: '写メ日記', icon: Camera, href: `/store/${slug}/diary` },
    { id: 'line', label: 'LINE', icon: MessageCircle, href: storeContact.lineUrl },
  ];

  return (
    <footer
      className={`footer-nav sm:relative sm:mt-10 ${className}`}
      aria-label="主要サービスへのクイックアクセス"
      itemScope
      itemType="https://schema.org/LocalBusiness"
    >
      <meta itemProp="name" content="ストロベリーボーイズ" />
      <meta itemProp="telephone" content={storeContact.phone} />

      {/* ✅ 1段目（上段）: 初めての方へページのみ表示 */}
      {isFirstTimePage && (
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 pb-2 md:hidden">
          <a
            href={storeContact.lineUrl || 'https://line.me'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#06C755] py-3 text-sm font-bold text-white shadow-md transition-transform active:scale-95"
          >
            <MessageCircle size={18} fill="currentColor" />
            <span>LINEで無料相談・予約</span>
          </a>
          <button
            onClick={scrollToTop}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white shadow-md transition-transform active:scale-95"
            aria-label="ページトップに戻る"
          >
            <span className="text-xl font-bold">↑</span>
          </button>
        </div>
      )}

      {showRightFade && (
        <div className="footer-nav__scroll-indicator md:hidden">
          <span></span>
        </div>
      )}

      <nav className="footer-nav__container">
        <ul ref={scrollRef} className="footer-nav__list scrollbar-hide">
          {items.map((item, idx) => {
            const { getIconByName } = require('@/lib/utils/icons');
            const { resolveStoreLink } = require('@/lib/utils/resolveStoreLink');
            const Icon = typeof item.icon === 'string' ? getIconByName(item.icon) : item.icon;
            
            // 電話アイコンの場合の自動補完
            let originalHref = item.href;
            if ((item.icon === 'Phone' || item.label === '電話') && (!originalHref || originalHref === '/' || originalHref === '#')) {
              originalHref = `tel:${storeContact.phone}`;
            }

            const resolvedHref = resolveStoreLink(originalHref, slug as string, storeContact.phone, storeContact.lineUrl);
            
            return (
              <li key={item.id || idx} className="footer-nav__item">
                <a
                  href={resolvedHref}
                  className={`footer-nav__link ${item.color || 'text-slate-600'} ${item.highlighted ? 'footer-nav__link--highlighted' : ''} ${item.urgent ? 'footer-nav__link--urgent' : ''}`}
                  aria-label={item.ariaLabel || item.label}
                >
                  <div className="footer-nav__icon-container">
                    <Icon className="footer-nav__icon" aria-hidden="true" />
                    {item.urgent && <span className="footer-nav__urgent-indicator">🔥</span>}
                  </div>
                  <span className="footer-nav__text">{item.label}</span>
                  {item.badge && <span className="footer-nav__badge">{item.badge}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="footer-legal">
        <a href="/privacy" className="footer-legal__link">
          プライバシーポリシー
        </a>
        <a href="/terms" className="footer-legal__link">
          利用規約
        </a>
      </div>
    </footer>
  );
};

export default Footer;
