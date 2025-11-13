'use client';
import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X } from 'lucide-react';

const SideNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const navigationItems = [
    { id: 'hero', label: 'トップ', href: '#hero' },
    { id: 'statistics', label: '数字で見る信頼', href: '#statistics' },
    { id: 'message', label: 'メッセージ', href: '#message' },
    { id: 'why-choose', label: '選ばれる理由', href: '#why-choose' },
    { id: 'career', label: 'キャリアパス', href: '#career' },
    { id: 'voices', label: '先輩の声', href: '#voices' },
    { id: 'diagnosis', label: '働き方診断', href: '#diagnosis' },
    { id: 'requirements', label: '募集要項', href: '#requirements' },
    { id: 'faq', label: 'よくある質問', href: '#faq' },
    { id: 'contact', label: '応募・相談', href: '#contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map((item) => document.querySelector(item.href));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && (section as HTMLElement).offsetTop <= scrollPosition) {
          setActiveSection(navigationItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Floating Navigation Button */}
      <div className="fixed bottom-6 right-4 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="transform rounded-full bg-pink-500 p-4 text-white shadow-lg transition-all hover:scale-105 hover:bg-pink-600"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Side Navigation - Minimizable */}
      <nav className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 transform lg:block">
        <div
          className={`rounded-2xl bg-white/95 shadow-lg backdrop-blur-sm transition-all duration-300 ${
            isMinimized ? 'w-12' : 'w-64'
          }`}
        >
          {/* Minimize/Expand Button */}
          <div className="border-b border-gray-100 p-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="flex w-full items-center justify-center rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <ChevronRight
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  isMinimized ? 'rotate-0' : 'rotate-180'
                }`}
              />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-2">
            {isMinimized ? (
              // Minimized view - dots only
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.href)}
                    className={`h-8 w-full rounded-lg transition-all ${
                      activeSection === item.id ? 'bg-pink-500' : 'bg-gray-200 hover:bg-pink-200'
                    }`}
                    title={item.label}
                  />
                ))}
              </div>
            ) : (
              // Expanded view
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.href)}
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      activeSection === item.id
                        ? 'bg-pink-500 text-white'
                        : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    <ChevronRight
                      className={`ml-2 h-3 w-3 flex-shrink-0 transition-transform ${
                        activeSection === item.id
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-pink-500'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Full Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-3xl bg-white shadow-xl">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-rounded text-lg font-bold text-gray-800">
                  ページナビゲーション
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Current Section Indicator */}
              <div className="mb-4 rounded-lg bg-pink-50 p-3">
                <div className="text-xs font-medium text-pink-600">現在の位置</div>
                <div className="text-sm font-semibold text-gray-800">
                  {navigationItems.find((item) => item.id === activeSection)?.label || 'トップ'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.href)}
                    className={`rounded-xl p-4 text-left transition-all ${
                      activeSection === item.id
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                    }`}
                  >
                    <div className="text-sm font-medium">{item.label}</div>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => scrollToSection('#contact')}
                    className="rounded-lg bg-pink-500 p-3 text-sm font-medium text-white transition-colors hover:bg-pink-600"
                  >
                    応募・相談
                  </button>
                  <button
                    onClick={() => scrollToSection('#diagnosis')}
                    className="rounded-lg bg-gray-100 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    働き方診断
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideNavigation;
