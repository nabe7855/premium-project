
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenChat }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 h-16 flex items-center shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <span className="text-slate-100 font-serif font-bold text-sm sm:text-lg tracking-wider">
            LIFE CHANGE <span className="text-amber-500">FUKUOKA</span>
          </span>
        </Link>
        
        <nav className="flex items-center">
          <button 
            onClick={onOpenChat}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all transform hover:scale-105 shadow-md whitespace-nowrap"
          >
            30秒で応募
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
