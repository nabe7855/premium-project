'use client';
import React from 'react';
import Link from 'next/link';
import { MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { TodayCast } from '@/lib/getTodayCastsByStore';

interface TopPageSeoBlockProps {
  storeSlug: string;
  todayCasts?: TodayCast[];
}

export default function TopPageSeoBlock({ storeSlug, todayCasts = [] }: TopPageSeoBlockProps) {
  const isFukuoka = storeSlug === 'fukuoka';
  const cityName = isFukuoka ? '福岡' : '横浜';
  const areas = isFukuoka ? '博多・天神・中洲' : 'みなとみらい・関内・桜木町';

  return (
    <section className="w-full bg-gradient-to-b from-rose-50/20 via-white to-white py-6 md:py-8 border-b border-rose-100/50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        
        {/* 背景とエレガントに同化したシームレスSEOブロック (元のUIバナーと100%調和) */}
        <div className="text-left space-y-4">
          
          {/* 見出し ＆ 公式エリアバッジ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-rose-100">
            <h2 className="font-serif text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <MapPin className="h-4.5 w-4.5 text-rose-500 shrink-0" />
              <span>{cityName}の女性用風俗・女風なら「ストロベリーボーイズ{cityName}店」</span>
            </h2>
            <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-600 border border-rose-100 shrink-0">
              <Sparkles className="h-3 w-3 text-rose-500" />
              <span>【{cityName}公式】女性専用出張サービス</span>
            </div>
          </div>

          {/* 自然な読み心地のSEO本文 */}
          <div className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed space-y-2.5">
            <p>
              {cityName}の女性用風俗（女風）「ストロベリーボーイズ{cityName}店」は、{areas}をはじめ{cityName}エリア全域のホテルやご自宅へ出張する完全予約制の女性専用リラクゼーションです。在籍するのは、容姿・接客マナー・人柄の厳格な審査と講習をクリアした人気イケメンセラピストのみ。
            </p>
            <p>
              初めて女性用風俗をご利用になる方にも安心していただけるよう、追加料金のない明確な明朗会計と無料事前相談をご用意しております。当日のご予約にも対応しておりますので、まずは
              <Link href={`/store/${storeSlug}/schedule`} className="text-rose-600 font-bold underline hover:text-rose-700 mx-1">
                本日の出勤セラピスト
              </Link>
              をご覧いただくか、
              <a href="https://line.me" target="_blank" rel="noopener noreferrer" className="text-rose-600 font-bold underline hover:text-rose-700 mx-1">
                LINE公式アカウント
              </a>
              よりお気軽にご相談ください。
            </p>
          </div>

          {/* 直下エリアLPクイックリンク */}
          <div className="pt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="text-slate-400 text-[11px] font-bold">【{cityName}案内】:</span>
            {isFukuoka ? (
              <>
                <Link href="/store/fukuoka/first-time" className="rounded-full bg-rose-50 px-3 py-1 text-rose-600 border border-rose-200 hover:bg-rose-500 hover:text-white transition flex items-center gap-1">
                  <span>初めての方へ</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link href="/store/fukuoka/price" className="rounded-full bg-rose-50 px-3 py-1 text-rose-600 border border-rose-200 hover:bg-rose-500 hover:text-white transition flex items-center gap-1">
                  <span>コース・料金</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link href="/store/fukuoka/area/hakata" className="rounded-full bg-white px-3 py-1 text-slate-700 border border-slate-200 hover:border-rose-300 hover:text-rose-600 transition">
                  ＃博多エリアガイド
                </Link>
                <Link href="/store/fukuoka/area/tenjin" className="rounded-full bg-white px-3 py-1 text-slate-700 border border-slate-200 hover:border-rose-300 hover:text-rose-600 transition">
                  ＃天神エリアガイド
                </Link>
                <Link href="/store/fukuoka/area/nakasu" className="rounded-full bg-white px-3 py-1 text-slate-700 border border-slate-200 hover:border-rose-300 hover:text-rose-600 transition">
                  ＃中洲エリアガイド
                </Link>
              </>
            ) : (
              <>
                <Link href="/store/yokohama/first-time" className="rounded-full bg-rose-50 px-3 py-1 text-rose-600 border border-rose-200 hover:bg-rose-500 hover:text-white transition flex items-center gap-1">
                  <span>初めての方へ</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link href="/store/yokohama/price" className="rounded-full bg-rose-50 px-3 py-1 text-rose-600 border border-rose-200 hover:bg-rose-500 hover:text-white transition flex items-center gap-1">
                  <span>コース・料金</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link href="/store/yokohama/area/kannai" className="rounded-full bg-white px-3 py-1 text-slate-700 border border-slate-200 hover:border-rose-300 hover:text-rose-600 transition">
                  ＃関内エリアガイド
                </Link>
                <Link href="/store/yokohama/area/minatomirai" className="rounded-full bg-white px-3 py-1 text-slate-700 border border-slate-200 hover:border-rose-300 hover:text-rose-600 transition">
                  ＃みなとみらいガイド
                </Link>
                <Link href="/store/yokohama/area/sakuragicho" className="rounded-full bg-white px-3 py-1 text-slate-700 border border-slate-200 hover:border-rose-300 hover:text-rose-600 transition">
                  ＃桜木町エリアガイド
                </Link>
              </>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
