'use client';
import { ChevronRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const BeginnerGuideSection = () => {
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <section className="relative overflow-hidden bg-white py-12 md:py-16">
      {/* Background Decoration */}
      <div className="absolute left-0 top-0 h-full w-full opacity-[0.03]">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-rose-500 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-rose-500 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="group relative overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/30 p-8 shadow-sm transition-all duration-500 hover:shadow-md md:p-12">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1 text-xs font-bold tracking-wider text-rose-600">
                  <HelpCircle size={14} />
                  GUIDE FOR BEGINNERS
                </div>
                <h2 className="mb-4 font-serif text-2xl font-bold tracking-tight text-slate-800 md:text-3xl lg:text-4xl">
                  女性風俗 <span className="text-rose-600">初体験</span>の方はこちら
                </h2>
                <p className="max-w-xl text-balance text-sm leading-relaxed text-slate-500 md:text-base">
                  初めてのご利用で不安をお持ちの皆様へ。安心して一歩を踏み出していただけるよう、システムや流れを詳しく解説したガイドをご用意いたしました。
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link
                  href={`/store/${slug}/guide/guide`}
                  className="group/btn relative flex items-center gap-2 overflow-hidden rounded-full bg-rose-600 px-8 py-4 text-sm font-bold tracking-widest text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-rose-700 hover:shadow-rose-200/50"
                >
                  <span className="relative z-10">もっと詳しく見る</span>
                  <ChevronRight
                    size={18}
                    className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
                  />

                  {/* Button Reflection Effect */}
                  <div className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full" />
                </Link>
              </div>
            </div>

            {/* Accent Line */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-rose-200 via-rose-500 to-rose-200 opacity-20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeginnerGuideSection;
