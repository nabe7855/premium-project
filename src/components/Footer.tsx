import React from 'react';
import { Phone, Calendar, Bot, MessageCircle } from 'lucide-react';
import { Store } from '@/types/store';

interface FooterProps {
  store: Store;
}

const Footer: React.FC<FooterProps> = ({ store }) => {
  const footerActions = [
    {
      icon: Phone,
      label: '電話',
      href: `tel:03-1234-5678`,
      color: 'bg-green-500',
    },
    {
      icon: Calendar,
      label: 'スケジュール',
      href: `/${store.id}/schedule`,
      color: `bg-${store.colors.primary}`,
    },
    {
      icon: Bot,
      label: 'AI診断',
      href: `/${store.id}/ai-matching`,
      color: 'bg-blue-500',
    },
    {
      icon: MessageCircle,
      label: 'LINE相談',
      href: 'https://line.me/',
      color: 'bg-emerald-500',
    },
  ];

  return (
    <>
      {/* Main footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Store info */}
            <div>
              <h3 className="text-xl font-bold mb-4 font-noto">{store.name}</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                {store.description}
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <p>営業時間: 18:00 - 翌5:00</p>
                <p>定休日: 年中無休</p>
                <p>TEL: 03-1234-5678</p>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 font-noto">クイックリンク</h4>
              <nav className="space-y-2">
                {[
                  { label: 'キャスト一覧', href: `/${store.id}/cast` },
                  { label: 'ご予約', href: `/${store.id}/reservation` },
                  { label: '料金案内', href: `/${store.id}/pricing` },
                  { label: 'ご利用案内', href: `/${store.id}/guide` },
                  { label: 'お問い合わせ', href: `/${store.id}/contact` },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Social & Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4 font-noto">フォロー・お問い合わせ</h4>
              <div className="space-y-4">
                <a
                  href="#"
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>LINE公式アカウント</span>
                </a>
                <div className="pt-4">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    ご不明点やご相談がございましたら、お気軽にお問い合わせください。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Strawberry Boys. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Fixed bottom navigation for mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="grid grid-cols-4">
            {footerActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <a
                  key={index}
                  href={action.href}
                  className="flex flex-col items-center justify-center py-3 px-2 text-center hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-full ${action.color} mb-1`}>
                    <IconComponent className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {action.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;