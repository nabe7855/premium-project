import { CONTENT_ITEMS, GUIDE_ITEMS, INFO_ITEMS, SHOP_ITEMS } from '@/data/test2';
import {
  ChevronDown,
  ChevronRight,
  MessageCircle as LineIcon,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import React, { useState } from 'react';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const BackgroundDecoration = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    {/* Elegant Top Garland / Lace */}
    <div className="absolute left-0 top-0 h-32 w-full opacity-[0.15]">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="h-full w-full fill-[#D14D72]"
      >
        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,155.19-9.22,234,70,361.6,60.6,140-10.3,161.8-101.9,313.6-101.9h160V0Z"></path>
      </svg>
      <div className="-mt-24 flex justify-around px-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-16 w-[1px] bg-[#D14D72] opacity-30"></div>
            <div className="h-2 w-2 rounded-full bg-[#D14D72] opacity-40"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Subtle Floating Strawberry Watermarks */}
    <div className="absolute right-[-10%] top-[20%] h-64 w-64 rotate-12 opacity-[0.03]">
      <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#D14D72]">
        <path d="M50 15 C35 15 20 25 20 45 C20 70 50 90 50 90 C50 90 80 70 80 45 C80 25 65 15 50 15 Z" />
      </svg>
    </div>
    <div className="absolute bottom-[10%] left-[-15%] h-80 w-80 -rotate-12 text-[#D14D72] opacity-[0.02]">
      <svg viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 15 C35 15 20 25 20 45 C20 70 50 90 50 90 C50 90 80 70 80 45 C80 25 65 15 50 15 Z" />
      </svg>
    </div>

    {/* Elegant Dot Pattern Overlay */}
    <div
      className="absolute inset-0 opacity-[0.4]"
      style={{
        backgroundImage: 'radial-gradient(#D14D72 0.5px, transparent 0.5px)',
        backgroundSize: '24px 24px',
      }}
    ></div>
  </div>
);

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose: _onClose }) => {
  const [isShopOpen, setIsShopOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#FFF5F5] via-white to-[#FFF5F5] transition-all duration-500 animate-in slide-in-from-top-full"
      style={{ top: '64px' }}
    >
      <BackgroundDecoration />

      <div className="relative z-10 mx-auto max-w-md space-y-10 px-5 py-8 pb-40">
        {/* Section 1: Shop Selection (Collapsible) */}
        <section>
          <button
            onClick={() => setIsShopOpen(!isShopOpen)}
            className="flex w-full items-center justify-between rounded-2xl border border-pink-100 bg-white px-5 py-4 text-[#4A2B2F] shadow-md transition-colors active:bg-pink-50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 text-[#D14D72] shadow-inner">
                <MapPin size={18} />
              </div>
              <span className="text-[15px] font-black tracking-wider">店舗を選ぶ</span>
            </div>
            <ChevronDown
              size={20}
              className={`text-[#D14D72] transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${isShopOpen ? 'mt-3 max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="grid grid-cols-2 gap-2 px-1">
              {SHOP_ITEMS.map((shop) => (
                <a
                  key={shop.id}
                  href={shop.link}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-pink-200 active:scale-[0.98]"
                >
                  <span className="text-xl">{shop.emoji}</span>
                  <span className="text-sm font-bold text-[#4A2B2F]">{shop.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Guide (Side-by-side Card Buttons) */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            {GUIDE_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.link}
                className="relative flex flex-col items-center justify-center gap-4 rounded-[28px] border border-pink-100 bg-white px-2 py-8 shadow-[0_4px_12px_rgba(209,77,114,0.08)] transition-all hover:shadow-lg active:scale-95 active:bg-pink-50/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF5F7] text-[#D14D72]">
                  {item.icon}
                </div>
                <span className="text-sm font-black tracking-tight text-[#4A2B2F]">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Section 3: Cast & Content (Refined 2x2 Grid with Card Button UI) */}
        <section>
          <div className="grid grid-cols-2 gap-4">
            {CONTENT_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.link}
                className="relative flex flex-col items-center justify-center gap-4 rounded-[28px] border border-pink-100 bg-white px-2 py-8 shadow-[0_4px_12px_rgba(209,77,114,0.08)] transition-all hover:shadow-lg active:scale-95 active:bg-pink-50/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF5F7] text-[#D14D72]">
                  {item.icon}
                </div>
                <span className="px-1 text-center text-sm font-black tracking-tight text-[#4A2B2F]">
                  {item.label}
                </span>
                {item.isLogo && (
                  <div className="absolute right-4 top-4 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-white bg-[#D14D72] shadow-sm"></div>
                )}
              </a>
            ))}
          </div>
        </section>

        {/* Section 4: Information (Full-width buttons) */}
        <section className="space-y-2">
          {INFO_ITEMS.filter((item) => !['media', 'privacy'].includes(item.id)).map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="group flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className="text-[#C5A059] group-hover:text-[#D14D72]">{item.icon}</div>
                <span className="text-sm font-bold text-[#4A2B2F]">{item.label}</span>
                {item.isLogo && <span className="h-1.5 w-1.5 rounded-full bg-pink-200"></span>}
              </div>
              <ChevronRight size={16} className="text-gray-200 group-hover:text-[#D14D72]" />
            </a>
          ))}
        </section>

        {/* Image Inspired CTA Section */}
        <section className="space-y-3 pt-6">
          {/* Recruitment */}
          <a
            href="#"
            className="flex w-full items-center gap-4 rounded-lg bg-[#F2D34E] px-6 py-4 text-[#4A2B2F] shadow-md transition-all active:scale-95"
          >
            <div className="rounded-lg bg-white/40 p-1.5">
              <User size={24} />
            </div>
            <span className="flex-1 text-center text-lg font-black tracking-widest">
              女風求人情報
            </span>
          </a>

          {/* LINE */}
          <a
            href="#"
            className="flex w-full items-center gap-4 rounded-lg bg-[#06C755] px-6 py-3 text-white shadow-md transition-all active:scale-95"
          >
            <div className="rounded-lg bg-white/20 p-2">
              <LineIcon size={24} fill="white" />
            </div>
            <div className="flex-1 text-center">
              <p className="mb-1 text-[13px] font-bold leading-none opacity-90">
                ラインで問い合わせる
              </p>
              <div className="flex items-center justify-center gap-1">
                <span className="rounded bg-white px-1.5 py-0.5 text-[9px] font-black text-[#06C755]">
                  ID
                </span>
                <span className="text-sm font-black tracking-tight">best.follows</span>
              </div>
            </div>
          </a>

          {/* Media Contact (Rich Style) */}
          <a
            href="#"
            className="flex w-full items-center gap-4 rounded-lg bg-[#C5A059] px-6 py-4 text-white shadow-md transition-all active:scale-95"
          >
            <div className="rounded-lg bg-white/20 p-1.5">
              <Mail size={24} />
            </div>
            <span className="flex-1 text-center text-lg font-black tracking-widest">
              メディア取材のご連絡
            </span>
          </a>

          {/* Privacy Policy (Rich Style) */}
          <a
            href="#"
            className="flex w-full items-center gap-4 rounded-lg bg-[#9CA3AF] px-6 py-4 text-white shadow-md transition-all active:scale-95"
          >
            <div className="rounded-lg bg-white/20 p-1.5">
              <ShieldCheck size={24} />
            </div>
            <span className="flex-1 text-center text-lg font-black tracking-widest">
              プライバシーポリシー
            </span>
          </a>

          {/* Email */}
          <a
            href="#"
            className="flex w-full items-center gap-4 rounded-lg border border-gray-200 bg-white px-6 py-4 text-[#3C8296] shadow-md transition-all active:scale-95"
          >
            <div className="p-1">
              <Mail size={24} />
            </div>
            <span className="flex-1 text-center text-lg font-black tracking-widest">
              メールで問い合わせる
            </span>
          </a>

          {/* Phone & Time Block */}
          <div className="space-y-3 rounded-lg border-2 border-[#3C8296]/30 bg-white p-4 shadow-md">
            <div className="flex items-center justify-center gap-3 text-[#3C8296]">
              <Phone size={24} fill="#3C8296" />
              <span className="text-3xl font-black tracking-tighter">03-6356-3860</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex w-full max-w-[240px] border border-gray-300 text-[11px] font-bold">
                <span className="w-1/3 border-r border-gray-300 bg-gray-50 py-1 text-center">
                  電話受付
                </span>
                <span className="w-2/3 bg-white py-1 text-center">12:00〜23:00</span>
              </div>
              <div className="flex w-full max-w-[240px] border border-gray-300 text-[11px] font-bold">
                <span className="w-1/3 border-r border-gray-300 bg-gray-50 py-1 text-center">
                  営業時間
                </span>
                <span className="w-2/3 bg-white py-1 text-center">12:00〜翌朝4時</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Banner */}
        <section className="pb-12 pt-4">
          <a
            href="#"
            className="group relative block aspect-[16/6] overflow-hidden rounded-2xl shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?q=80&w=800&auto=format&fit=crop"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Special Banner"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#4A2B2F]/90 via-[#4A2B2F]/20 to-transparent p-5">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white opacity-90">
                Strawberry Boys Premium
              </p>
              <h3 className="text-lg font-black tracking-tight text-white drop-shadow-md">
                甘い誘惑を、今夜貴女に。
              </h3>
            </div>
          </a>
          <div className="mt-8 text-center">
            <span className="font-serif text-[9px] uppercase tracking-[0.5em] text-gray-300">
              Strawberry Boys Group
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MenuOverlay;
