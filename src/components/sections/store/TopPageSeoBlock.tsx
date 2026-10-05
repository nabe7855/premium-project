'use client';
import React from 'react';
import Link from 'next/link';
import { MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { TodayCast } from '@/lib/getTodayCastsByStore';

import { useOptionalStore } from '@/contexts/StoreContext';

interface TopPageSeoBlockProps {
  storeSlug: string;
  todayCasts?: TodayCast[];
  lineUrl?: string;
}

// 店舗ごとの公式LINEアカウントURL（未指定・フォールバック用）
const STORE_OFFICIAL_LINE_URLS: Record<string, string> = {
  fukuoka: 'https://lin.ee/PgPw5yE',
  yokohama: 'https://lin.ee/UozTcN6',
};
const DEFAULT_OFFICIAL_LINE_URL = 'https://lin.ee/PgPw5yE';

export default function TopPageSeoBlock({
  storeSlug,
  todayCasts = [],
  lineUrl,
}: TopPageSeoBlockProps) {
  const isFukuoka = storeSlug === 'fukuoka';
  const cityName = isFukuoka ? '福岡' : '横浜';
  const areas = isFukuoka ? '博多・天神・中洲' : 'みなとみらい・関内・桜木町';

  // StoreContextが存在する場合はコンテキスト内のLINE URLを取得
  const storeContext = useOptionalStore();
  const contextLineUrl = storeContext?.store?.contact?.line;

  // 優先順位: props指定 > DB/Contextのline_url > 店舗別公式LINE URL > デフォルト公式LINE URL
  const targetLineUrl =
    lineUrl || contextLineUrl || STORE_OFFICIAL_LINE_URLS[storeSlug] || DEFAULT_OFFICIAL_LINE_URL;

  return (
    <section className="w-full border-b border-rose-100/50 bg-gradient-to-b from-rose-50/20 via-white to-white py-6 md:py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* 背景とエレガントに同化したシームレスSEOブロック (元のUIバナーと100%調和) */}
        <div className="space-y-4 text-left">
          {/* 見出し ＆ 公式エリアバッジ */}
          <div className="flex flex-col justify-between gap-2 border-b border-rose-100 pb-3 sm:flex-row sm:items-center">
            <h2 className="flex items-center gap-2 font-serif text-lg font-black text-slate-900 sm:text-xl">
              <MapPin className="h-4.5 w-4.5 shrink-0 text-rose-500" />
              <span>
                {cityName}の女性用風俗・女風なら「ストロベリーボーイズ{cityName}店」
              </span>
            </h2>
            <div className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-600 sm:self-auto">
              <Sparkles className="h-3 w-3 text-rose-500" />
              <span>【{cityName}公式】女性専用出張サービス</span>
            </div>
          </div>

          {/* 自然な読み心地のSEO本文 */}
          <div className="space-y-2.5 text-xs font-medium leading-relaxed text-slate-600 sm:text-sm">
            <p>
              {cityName}の女性用風俗（女風）「ストロベリーボーイズ{cityName}店」は、{areas}をはじめ
              {cityName}
              エリア全域のホテルやご自宅へ出張する完全予約制の女性専用リラクゼーションです。在籍するのは、容姿・接客マナー・人柄の厳格な審査と講習をクリアした人気イケメンセラピストのみ。
            </p>
            <p>
              初めて女性用風俗をご利用になる方にも安心していただけるよう、追加料金のない明確な明朗会計と無料事前相談をご用意しております。当日のご予約にも対応しておりますので、まずは
              <Link
                href={`/store/${storeSlug}/schedule`}
                className="mx-1 font-bold text-rose-600 underline hover:text-rose-700"
              >
                本日の出勤セラピスト
              </Link>
              をご覧いただくか、
              <a
                href={targetLineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-1 font-bold text-rose-600 underline hover:text-rose-700"
              >
                LINE公式アカウント
              </a>
              よりお気軽にご相談ください。
            </p>
          </div>

          {/* 直下エリアLPクイックリンク */}
          <div className="flex flex-wrap items-center gap-2 pt-3 text-xs font-bold">
            <span className="text-[11px] font-bold text-slate-400">【{cityName}案内】:</span>
            {isFukuoka ? (
              <>
                <Link
                  href="/store/fukuoka/first-time"
                  className="flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-600 transition hover:bg-rose-500 hover:text-white"
                >
                  <span>初めての方へ</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/store/fukuoka/price"
                  className="flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-600 transition hover:bg-rose-500 hover:text-white"
                >
                  <span>コース・料金</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/store/fukuoka/area/hakata"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                >
                  ＃博多エリアガイド
                </Link>
                <Link
                  href="/store/fukuoka/area/tenjin"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                >
                  ＃天神エリアガイド
                </Link>
                <Link
                  href="/store/fukuoka/area/nakasu"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                >
                  ＃中洲エリアガイド
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/store/yokohama/first-time"
                  className="flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-600 transition hover:bg-rose-500 hover:text-white"
                >
                  <span>初めての方へ</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/store/yokohama/price"
                  className="flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-rose-600 transition hover:bg-rose-500 hover:text-white"
                >
                  <span>コース・料金</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link
                  href="/store/yokohama/area/kannai"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                >
                  ＃関内エリアガイド
                </Link>
                <Link
                  href="/store/yokohama/area/minatomirai"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                >
                  ＃みなとみらいガイド
                </Link>
                <Link
                  href="/store/yokohama/area/sakuragicho"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition hover:border-rose-300 hover:text-rose-600"
                >
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
