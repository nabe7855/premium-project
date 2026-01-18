import { HeaderConfig } from '@/lib/store/storeTopConfig';
import { Camera, Menu, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface HeaderProps {
  config?: HeaderConfig;
  isEditing?: boolean;
  onUpdate?: (section: string, key: string, value: any) => void;
  onImageUpload?: (section: string, file: File, index?: number, key?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ config, isEditing, onUpdate, onImageUpload }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!config || (!config.isVisible && !isEditing)) return null;

  const navLinks = config.navLinks;

  const triggerImageUpload = (index: number) => {
    if (!isEditing || !onImageUpload) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImageUpload('header', file, index, 'navLinks');
      }
    };
    input.click();
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? 'bg-white/95 py-2 shadow-sm backdrop-blur-md'
          : 'bg-transparent py-4'
      } ${!config.isVisible && isEditing ? 'opacity-40' : ''}`}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="group z-50 flex cursor-pointer items-center">
          <span
            className={`font-serif text-xl font-bold italic tracking-widest transition-colors md:text-2xl ${
              isScrolled || isMenuOpen ? 'text-primary-500' : 'text-slate-800'
            } outline-none`}
            contentEditable={isEditing}
            suppressContentEditableWarning={isEditing}
            onBlur={(e) => onUpdate?.('header', 'logoText', e.currentTarget.innerText)}
          >
            {config.logoText}
          </span>
        </div>

        <nav className="hidden space-x-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`hover:text-primary-500 text-xs font-bold tracking-widest transition-colors ${
                isScrolled ? 'text-slate-600' : 'text-slate-700'
              }`}
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
            {config.reserveButtonText}
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
        <div className="bg-white/98 absolute left-0 top-0 z-40 flex h-[100dvh] w-full flex-col items-center overflow-y-auto bg-white/95 px-4 pb-10 pt-20 backdrop-blur-xl duration-300 animate-in slide-in-from-top-10 lg:hidden">
          <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-4">
            {navLinks.map((link, idx) => (
              <div
                key={link.name}
                className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <a
                  href={link.href}
                  className="flex items-center gap-4 p-4"
                  onClick={() => !isEditing && setIsMenuOpen(false)}
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    {link.imageUrl ? (
                      <img
                        src={link.imageUrl}
                        alt={link.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="bg-primary-50 flex h-full w-full items-center justify-center">
                        <span className="text-primary-300 font-bold">{link.name.charAt(0)}</span>
                      </div>
                    )}
                    {isEditing && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          triggerImageUpload(idx);
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Camera size={20} />
                      </button>
                    )}
                  </div>
                  <div className="flex-grow">
                    <span
                      className="font-serif text-lg font-bold tracking-widest text-slate-700 outline-none"
                      contentEditable={isEditing}
                      suppressContentEditableWarning={isEditing}
                      onBlur={(e) => {
                        if (!isEditing) return;
                        const newLinks = [...navLinks];
                        newLinks[idx] = { ...newLinks[idx], name: e.currentTarget.innerText };
                        onUpdate?.('header', 'navLinks', newLinks);
                      }}
                    >
                      {link.name}
                    </span>
                  </div>
                </a>
              </div>
            ))}
            <div
              className="bg-primary-500 shadow-primary-200 mt-4 block w-full rounded-2xl py-5 text-center text-lg font-bold tracking-widest text-white shadow-xl outline-none transition-transform active:scale-95"
              contentEditable={isEditing}
              suppressContentEditableWarning={isEditing}
              onBlur={(e) => onUpdate?.('header', 'reserveButtonText', e.currentTarget.innerText)}
            >
              {config.reserveButtonText}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
