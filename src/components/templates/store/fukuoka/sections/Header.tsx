'use client';
import { Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const navLinks = [
  { name: 'HOME', href: '#home' },
  { name: '最新情報', href: '#campaign' },
  { name: 'セラピスト', href: '#cast' },
  { name: '料金', href: '#price' },
  { name: 'ご利用の流れ', href: '#flow' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? 'bg-white/95 py-2 shadow-sm backdrop-blur-md'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="group z-50 flex cursor-pointer items-center">
          <span
            className={`font-serif text-xl font-bold italic tracking-widest transition-colors md:text-2xl ${isScrolled || isMenuOpen ? 'text-primary-500' : 'text-slate-800'}`}
          >
            LUMIÈRE
          </span>
        </div>

        <nav className="hidden space-x-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`hover:text-primary-500 text-xs font-bold tracking-widest transition-colors ${isScrolled ? 'text-slate-600' : 'text-slate-700'}`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="z-50 flex items-center gap-4">
          <a
            href="#reserve"
            className="from-primary-400 to-primary-500 hover:from-primary-500 hover:to-primary-600 shadow-primary-200 hidden transform rounded-full bg-gradient-to-r px-6 py-2 text-xs font-bold tracking-wider text-white shadow-lg transition-all hover:-translate-y-0.5 md:block"
          >
            WEB予約
          </a>
          <button
            className="p-1 text-slate-600 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="bg-white/98 absolute left-0 top-0 z-40 flex h-[100dvh] w-full flex-col items-center justify-center space-y-8 backdrop-blur-xl duration-300 animate-in slide-in-from-top-10 lg:hidden">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-primary-500 font-serif text-xl font-bold tracking-widest text-slate-700 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#reserve"
            onClick={() => setIsMenuOpen(false)}
            className="bg-primary-500 mt-4 rounded-full px-10 py-4 text-center text-lg font-bold tracking-widest text-white shadow-xl"
          >
            予約する
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
