'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const BeginnerGuideBanner = () => {
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <div className="relative z-30 w-full bg-slate-950 px-2 py-3">
      <div className="mx-auto max-w-7xl">
        <Link
          href={`/store/${slug}/guide/guide`}
          className="group relative block w-full overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-cyan-900/50 active:scale-[0.99]"
        >
          <img
            src="/女性用風俗初体験の方はこちら.png"
            alt="女性用風俗初体験の方はこちら"
            className="h-auto w-full object-contain"
          />
          {/* Shine effect */}
          <div className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </Link>
      </div>
    </div>
  );
};

export default BeginnerGuideBanner;
