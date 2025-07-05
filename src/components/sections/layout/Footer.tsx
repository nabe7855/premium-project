'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, CreditCard, Phone, MessageCircle, Heart } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isBusinessHours, setIsBusinessHours] = useState(true);

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
    return () => clearInterval(interval);
  }, []);

  if (!isMounted) return null;

  const footerItems = [
    {
      id: 'schedule',
      label: '出勤',
      icon: Calendar,
      href: '/schedule',
      ariaLabel: '今日明日の出勤スケジュール確認',
    },
    {
      id: 'pricing',
      label: '料金',
      icon: CreditCard,
      href: '/guide#price',
      ariaLabel: '料金システム・予算確認',
      badge: isFirstVisit ? '初' : null,
    },
    {
      id: 'phone',
      label: '電話',
      icon: Phone,
      href: 'tel:050-5212-5818',
      ariaLabel: isBusinessHours
        ? '今すぐ電話で予約・相談'
        : '営業時間外のためLINEをご利用ください',
      urgent: isBusinessHours,
    },
    {
      id: 'line',
      label: 'LINE',
      icon: MessageCircle,
      href: 'https://lin.ee/xxxxx',
      ariaLabel: 'LINEで手軽に予約・相談',
      highlighted: !isBusinessHours,
    },
    {
      id: 'cast',
      label: '推し',
      icon: Heart,
      href: '/cast-list?sort=popular',
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
      <meta itemProp="telephone" content="050-5212-5818" />

      <nav className="footer-nav__container">
        <ul className="footer-nav__list">
          {footerItems.map((item, index) => (
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
