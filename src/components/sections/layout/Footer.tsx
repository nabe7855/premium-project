'use client';

import { getStoreContactData } from '@/actions/store-contact';
import { Calendar, CreditCard, Heart, MessageCircle, Phone } from 'lucide-react';
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

  // 初めての方へページかどうかを判定
  const isFirstTimePage = pathname?.includes('/first-time');

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

    return () => clearInterval(interval);
  }, [slug]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isMounted) return null;

  const footerItems = [
    {
      id: 'schedule',
      label: '出勤',
      icon: Calendar,
      href: `/store/${slug}/schedule/schedule`,
      ariaLabel: '今日明日の出勤スケジュール確認',
    },
    {
      id: 'pricing',
      label: '料金',
      icon: CreditCard,
      href: `/store/${slug}/price`,
      ariaLabel: '料金システム・予算確認',
      badge: isFirstVisit ? '初' : null,
    },
    {
      id: 'phone',
      label: '電話',
      icon: Phone,
      href: `tel:${storeContact.phone.replace(/-/g, '')}`,
      ariaLabel: isBusinessHours
        ? '今すぐ電話で予約・相談'
        : '営業時間外のためLINEをご利用ください',
      urgent: isBusinessHours,
    },
    {
      id: 'line',
      label: 'LINE',
      icon: MessageCircle,
      href: storeContact.lineUrl,
      ariaLabel: 'LINEで手軽に予約・相談',
      highlighted: !isBusinessHours,
    },
    {
      id: 'cast',
      label: '推し達',
      icon: Heart,
      href: `/store/${slug}/cast-list?sort=popular`,
      ariaLabel: '人気キャスト一覧・お気に入り確認',
    },
  ];

  return (
    <footer
      className={`footer-nav sm:relative sm:mt-10 ${className}`}
      role="navigation"
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

      <nav className="footer-nav__container">
        <ul className="footer-nav__list">
          {footerItems.map((item) => (
            <li key={item.id} className="footer-nav__item">
              <a
                href={item.href}
                className={`footer-nav__link ${item.highlighted ? 'footer-nav__link--highlighted' : ''} ${item.urgent ? 'footer-nav__link--urgent' : ''}`}
                aria-label={item.ariaLabel}
              >
                <div className="footer-nav__icon-container">
                  <item.icon className="footer-nav__icon" aria-hidden="true" />
                  {item.urgent && <span className="footer-nav__urgent-indicator">🔥</span>}
                </div>
                <span className="footer-nav__text">{item.label}</span>
                {item.badge && <span className="footer-nav__badge">{item.badge}</span>}
              </a>
            </li>
          ))}
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
