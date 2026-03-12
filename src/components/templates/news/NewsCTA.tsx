'use client';

import { Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface NewsCTAProps {
  storeSlug: string;
}

const NewsCTA: React.FC<NewsCTAProps> = ({ storeSlug }) => {
  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href={`/store/${storeSlug}/reserve`}
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl bg-rose-600 py-8 text-white shadow-lg transition-all hover:bg-rose-500 hover:shadow-xl active:scale-95"
        >
          <div className="rounded-full bg-white/20 p-3">
            <Calendar className="h-6 w-6" />
          </div>
          <span className="text-lg font-black tracking-wider">ネット予約はこちら</span>
        </Link>

        <Link
          href={`/store/${storeSlug}/cast`}
          className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-slate-900 bg-white py-8 text-slate-900 transition-all hover:bg-slate-50 active:scale-95"
        >
          <div className="rounded-full bg-slate-100 p-3">
            <Users className="h-6 w-6" />
          </div>
          <span className="text-lg font-black tracking-wider">キャスト一覧を見る</span>
        </Link>
      </div>

      <p className="mt-8 text-center text-sm font-medium text-slate-400">
        Web予約は24時間受付中です。お気軽にご連絡ください。
      </p>
    </section>
  );
};

export default NewsCTA;
