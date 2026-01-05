
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: '特徴', href: '#features' },
    { name: '仕事内容', href: '#details' },
    { name: '給与シミュレーション', href: '#salary' },
    { name: 'Q&A', href: '#faq' },
    { name: '応募フォーム', href: '#apply' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex flex-col">
          <span className={`text-xl md:text-2xl font-bold font-serif ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
            FUKUOKA <span className="text-amber-500">PREMIUM</span>
          </span>
          <span className={`text-[10px] md:text-xs font-medium tracking-widest ${isScrolled ? 'text-slate-500' : 'text-slate-300'}`}>
            THERAPIST RECRUIT
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className={`text-sm font-medium hover:text-amber-500 transition-colors ${isScrolled ? 'text-slate-700' : 'text-white'}`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        <a 
          href="#apply" 
          className="hidden md:block bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-md active:scale-95"
        >
          エントリー
        </a>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className={isScrolled ? 'text-slate-900' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-slate-900' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div className={`fixed inset-0 bg-slate-900 z-40 transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="flex flex-col h-full justify-center items-center space-y-8 p-4">
          {navItems.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="text-2xl text-white font-medium hover:text-amber-500"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <a 
            href="#apply" 
            className="w-full bg-amber-500 text-white py-4 rounded-full text-center text-lg font-bold"
            onClick={() => setIsMenuOpen(false)}
          >
            今すぐ応募する
          </a>
        </div>
        <button 
          className="absolute top-6 right-6 p-2 text-white" 
          onClick={() => setIsMenuOpen(false)}
        >
          <X size={32} />
        </button>
      </div>
    </header>
  );
};

export default Header;
