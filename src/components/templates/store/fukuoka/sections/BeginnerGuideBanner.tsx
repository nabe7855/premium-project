'use client';
import { ChevronRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const BeginnerGuideBanner = () => {
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <div className="relative z-30 w-full bg-white px-2 py-3">
      <div className="mx-auto max-w-7xl">
        <Link
          href={`/store/${slug}/guide/guide`}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 py-5 text-white shadow-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-rose-200/50 active:scale-[0.99]"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <HelpCircle size={24} className="animate-bounce-slow" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-widest md:text-xl">
                女性用風俗初体験の方はこちら
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                Guide for beginners
              </span>
            </div>
            <ChevronRight
              size={24}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BeginnerGuideBanner;
