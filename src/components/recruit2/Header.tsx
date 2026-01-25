import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenForm: () => void;
  groupName?: string;
  storeName?: string;
  pageTitleSuffix?: string;
}

const Header: React.FC<HeaderProps> = ({
  onOpenForm,
  groupName = 'ストロベリーボーイズグループ',
  storeName = '福岡店',
  pageTitleSuffix = 'キャスト採用ページ',
}) => {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center border-b border-slate-800 bg-slate-900/95 shadow-lg backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="group flex shrink-0 items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 shadow-inner transition-transform group-hover:scale-105">
            <span className="text-lg font-bold text-white">{storeName.charAt(0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xs font-bold tracking-wider text-slate-100 sm:text-sm">
              {groupName} {storeName}
            </span>
            <span className="text-[10px] font-bold text-amber-500 sm:text-xs">
              {pageTitleSuffix}
            </span>
          </div>
        </Link>

        <nav className="flex items-center">
          <button
            onClick={onOpenForm}
            className="transform whitespace-nowrap rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-bold text-black shadow-md transition-all hover:scale-105 hover:bg-yellow-500 sm:px-4 sm:py-2 sm:text-sm"
          >
            簡単相談
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
