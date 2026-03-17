'use client';

import { 
  Home, 
  Camera, 
  User, 
  Calendar, 
  ExternalLink,
  ChevronUp,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface NavStore {
  name: string;
  slug: string;
}

interface CastFooterNavProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  stores: NavStore[];
  castSlug?: string;
}

const CastFooterNav: React.FC<CastFooterNavProps> = ({ 
  activeTab, 
  onTabChange, 
  stores,
  castSlug 
}) => {
  const [showStoreSelector, setShowStoreSelector] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'ホーム', icon: Home },
    { id: 'diary', label: '写メ日記', icon: Camera },
    { id: 'profile', label: 'プロフィール', icon: User },
    { id: 'schedule', label: 'スケジュール', icon: Calendar },
  ];

  const handleUserPageClick = () => {
    if (stores.length === 1) {
      window.open(`/store/${stores[0].slug}/cast/${castSlug}`, '_blank');
    } else if (stores.length > 1) {
      setShowStoreSelector(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-pink-100 bg-white/95 pb-safe-area-inset-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${
                  isActive ? 'text-pink-600' : 'text-gray-400'
                }`}
              >
                <div className={`rounded-xl p-1.5 transition-colors ${isActive ? 'bg-pink-50' : ''}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="text-[10px] font-bold">{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={handleUserPageClick}
            className="flex flex-col items-center gap-1 text-gray-400 transition-all active:scale-95"
          >
            <div className="rounded-xl p-1.5 bg-gray-50">
              <ExternalLink size={22} strokeWidth={2} />
            </div>
            <span className="text-[10px] font-bold">ユーザーページ</span>
          </button>
        </div>
      </div>

      {/* Store Selector Overlay */}
      <AnimatePresence>
        {showStoreSelector && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm md:hidden" onClick={() => setShowStoreSelector(false)}>
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-sm overflow-hidden rounded-t-[2rem] bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-800">公開ページを表示</h3>
                <button 
                  onClick={() => setShowStoreSelector(false)}
                  className="rounded-full bg-gray-100 p-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {stores.map((store) => (
                  <a
                    key={store.slug}
                    href={`/store/${store.slug}/cast/${castSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 p-4 transition-all active:scale-[0.98]"
                    onClick={() => setShowStoreSelector(false)}
                  >
                    <span className="font-bold text-gray-700">{store.name}</span>
                    <ChevronUp className="rotate-90 text-pink-400" size={18} />
                  </a>
                ))}
              </div>

              <p className="mt-6 text-center text-xs font-medium text-gray-400">
                表示したい店舗を選択してください
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CastFooterNav;
