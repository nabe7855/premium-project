import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const MobileStickyButton: React.FC = () => {
  const pathname = usePathname();
  const match = pathname.match(/^\/store\/([^/]+)/);
  const storeSlug = match?.[1] || '';

  return (
    <div className="border-primary-50 fixed bottom-0 left-0 z-40 w-full border-t bg-white/95 p-4 shadow-lg backdrop-blur-md md:hidden">
      <Link
        href={`/store/${storeSlug}/reservation`}
        className="from-primary-500 to-primary-600 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r py-4 text-sm font-bold tracking-widest text-white shadow-lg transition-transform active:scale-95"
      >
        <Calendar className="mr-2" size={18} /> WEB RESERVATION
      </Link>
    </div>
  );
};

export default MobileStickyButton;
