import { Menu, X } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, toggleMenu }) => {
  return (
    <header className="sticky top-0 z-[60] flex h-16 items-center justify-between border-b border-pink-50 bg-white/95 px-6 shadow-sm backdrop-blur-md transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 rotate-3 items-center justify-center rounded-2xl bg-[#D14D72] shadow-lg shadow-pink-100 transition-transform active:rotate-0">
          <span className="-rotate-3 font-serif text-xl font-black text-white">S</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-black leading-none tracking-tight text-[#4A2B2F]">
            Strawberry Boys
          </h1>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#C5A059]">
            Premium Female Service
          </p>
        </div>
      </div>

      <button
        onClick={toggleMenu}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50/50 text-[#D14D72] transition-all hover:bg-pink-100 active:scale-90"
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        {isMenuOpen && (
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#D14D72]"></span>
        )}
      </button>
    </header>
  );
};

export default Header;
