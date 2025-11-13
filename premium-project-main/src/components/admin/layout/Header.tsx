
import React from 'react';
import { Bars3Icon } from '../admin-assets/Icons';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

// Header component for the main content area
export default function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="flex-shrink-0 bg-brand-secondary shadow-md">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <button
          className="md:hidden text-brand-text-secondary hover:text-white"
          onClick={onMenuClick}
        >
          <Bars3Icon />
        </button>
        <h2 className="text-lg md:text-xl font-semibold text-white">{title}</h2>
        <div>
          {/* Placeholder for user profile/actions */}
          <div className="w-8 h-8 bg-brand-accent rounded-full"></div>
        </div>
      </div>
    </header>
  );
}
