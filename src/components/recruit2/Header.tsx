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
    <header className="fixed left-0 right-0 top-0 z-50 py-2 md:py-3 transition-all duration-300 bg-white shadow-sm">
      <div className="container mx-auto px-2 lg:px-6">
        <div className="flex items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm h-12 md:h-14">
          <Link to="/" className="group relative flex flex-shrink-0 items-center border-r border-slate-200 bg-white px-3 transition-colors hover:bg-slate-50 md:px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#D43D6F] to-[#FF6B9D] shadow-inner transition-transform group-hover:scale-105">
              <span className="text-lg font-bold text-white">{storeName.charAt(0)}</span>
            </div>
            <div className="ml-3 flex flex-col">
              <span className="font-serif text-xs font-bold tracking-wider text-slate-800 sm:text-sm">
                {groupName} {storeName}
              </span>
              <span className="text-[10px] font-bold text-[#D43D6F] sm:text-xs">
                {pageTitleSuffix}
              </span>
            </div>
          </Link>

          <div className="flex flex-grow items-center justify-end px-2 md:px-4">
            <button
              onClick={onOpenForm}
              className="transform whitespace-nowrap rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-xs font-black text-white shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 sm:px-6 sm:text-sm"
            >
              簡単応募
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
