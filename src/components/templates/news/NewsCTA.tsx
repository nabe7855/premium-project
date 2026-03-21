'use client';
import { useStore } from '@/contexts/StoreContext';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NewsCTAProps {
  storeSlug: string;
  lineUrl?: string; // ✅ 追加
}

const NewsCTA: React.FC<NewsCTAProps> = ({ storeSlug, lineUrl: propLineUrl }) => {
  const { store } = useStore();
  
  // ✅ Normalizing Line URL (Support for both ID and Full URL)
  const rawLineUrl = propLineUrl || store.contact?.line || 'https://line.me';
  const lineUrl = (rawLineUrl.startsWith('http') || rawLineUrl.startsWith('/') || rawLineUrl.includes(':'))
    ? rawLineUrl
    : `https://line.me/R/ti/p/${rawLineUrl.startsWith('@') ? rawLineUrl : '@' + rawLineUrl}`;

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Net Reservation Button */}
        <Link
          href={`/store/${storeSlug}/reservation`}
          className="group flex flex-col items-center justify-center gap-4 rounded-[40px] bg-[#E62E69] py-8 text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-95"
        >
          <div className="rounded-full bg-white/20 p-4">
            <Calendar className="h-8 w-8" />
          </div>
          <span className="text-xl font-black tracking-wider">ネット予約はこちら</span>
        </Link>

        {/* LINE Button (Matching provided image design) */}
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-between overflow-hidden rounded-[40px] bg-[#21C64B] py-8 text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-95"
        >
          <div className="flex flex-col items-center gap-4">
            {/* LINE White Icon Wrapper */}
            <div className="rounded-[18px] bg-white p-2 shadow-sm">
              <svg className="h-10 w-10 text-[#21C64B]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 10.304c0-4.587-4.704-8.318-10.485-8.318-5.78 0-10.485 3.731-10.485 8.318 0 4.111 3.73 7.558 8.769 8.216.342.062.801.224.913.513.104.281.066.721.033 1.006-.118.913-.42 3.656-.525 4.542-.045.385.207.424.385.281 1.057-.84 4.885-3.132 6.666-5.362 1.258-.02 2.441-.183 3.518-.501 2.656-.787 4.411-2.457 4.411-4.7z" />
              </svg>
            </div>
            {/* Main Text */}
            <h3 className="text-center text-[19px] font-black tracking-tight leading-none md:text-[21px]">
              LINEで簡単予約・お問い合わせ
            </h3>
          </div>

          {/* Subtext area - more closely matched to the pill look */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 text-center">
            <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold">
              スタンプ1つでもOK
            </span>
            <span className="text-[10px] font-bold leading-tight">
              こちらをクリックして友達登録
            </span>
          </div>
        </a>
      </div>

      <p className="mt-8 text-center text-sm font-medium text-slate-400">
        Web予約は24時間受付中です。お気軽にご連絡ください。
      </p>
    </section>
  );
};

export default NewsCTA;
