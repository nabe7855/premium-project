'use client';
import { useStore } from '@/contexts/StoreContext';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NewsCTAProps {
  storeSlug: string;
}

const NewsCTA: React.FC<NewsCTAProps> = ({ storeSlug }) => {
  const { store } = useStore();
  const lineUrl = store.contact?.line || 'https://line.me';

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href={`/store/${storeSlug}/reservation`}
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#E62E69] py-8 text-white shadow-lg transition-all hover:bg-rose-500 hover:shadow-xl active:scale-95"
        >
          <div className="rounded-full bg-white/20 p-3">
            <Calendar className="h-6 w-6" />
          </div>
          <span className="text-lg font-black tracking-wider">ネット予約はこちら</span>
        </Link>

        {/* LINE button */}
        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-[#06C755] py-5 text-white shadow-lg transition-all hover:bg-[#05b34d] hover:shadow-xl active:scale-95"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-xl bg-white p-1 shadow-sm">
              <svg className="h-8 w-8 text-[#06C755]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 10.304c0-4.587-4.704-8.318-10.485-8.318-5.78 0-10.485 3.731-10.485 8.318 0 4.111 3.73 7.558 8.769 8.216.342.062.801.224.913.513.104.281.066.721.033 1.006-.118.913-.42 3.656-.525 4.542-.045.385.207.424.385.281 1.057-.84 4.885-3.132 6.666-5.362 1.258-.02 2.441-.183 3.518-.501 2.656-.787 4.411-2.457 4.411-4.7z" />
              </svg>
            </div>
            <div className="text-center">
              <span className="block text-base font-black tracking-tight leading-tight">
                LINEで簡単予約・お問い合わせ
              </span>
              <div className="mt-2 flex items-center justify-center gap-2 flex-wrap px-2">
                <span className="rounded bg-black/10 px-1.5 py-0.5 text-[9px] font-bold">
                  スタンプ1つでもOK
                </span>
                <span className="text-[9px] font-bold">
                  こちらをクリックして友達登録
                </span>
              </div>
            </div>
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
