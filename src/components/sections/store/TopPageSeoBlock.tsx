'use client';
import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Clock, Award, Phone, MessageSquare, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { TodayCast } from '@/lib/getTodayCastsByStore';

interface TopPageSeoBlockProps {
  storeSlug: string;
  todayCasts?: TodayCast[];
}

export default function TopPageSeoBlock({ storeSlug, todayCasts = [] }: TopPageSeoBlockProps) {
  const isFukuoka = storeSlug === 'fukuoka';
  const cityName = isFukuoka ? '福岡' : '横浜';
  const areas = isFukuoka ? '博多・天神・中洲' : 'みなとみらい・関内・桜木町';
  const castCount = todayCasts.length > 0 ? todayCasts.length : (isFukuoka ? 12 : 16);

  return (
    <section className="w-full bg-gradient-to-b from-rose-50/40 via-white to-white py-6 md:py-10 border-b border-rose-100/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* 1. 可視H1 ＆ リアルタイム出勤鮮度バッジ */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-600 border border-rose-100">
              <Sparkles className="h-3.5 w-3.5 text-rose-500" />
              <span>女性用風俗・女風 出張専門【{cityName}店公式】</span>
            </div>
            <h1 className="font-serif text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-snug">
              {cityName}（{areas}）の女性用風俗・女風｜ストロベリーボーイズ{cityName}店
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              完全審査制イケメンセラピスト在籍｜明朗会計・当日予約OK｜ご指定ホテル・ご自宅へスピーディー出張
            </p>
          </div>

          {/* リアルタイム鮮度バッジ */}
          <div className="flex items-center gap-3 shrink-0 bg-rose-500 text-white px-4 py-2.5 rounded-xl shadow-md">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-rose-100 uppercase tracking-wider">本日受付中</div>
              <div className="text-sm font-black flex items-baseline gap-1">
                本日出勤 <span className="text-lg font-black underline">{castCount}名</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. FV直下地域特化SEOテキストブロック (H2 + 350文字解説 + 内部リンクバッジ) */}
        <div className="rounded-3xl border border-rose-100 bg-[#FAF6F3] p-6 sm:p-8 shadow-xs text-left mb-6">
          <h2 className="font-serif text-xl sm:text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-rose-500" />
            {cityName}の女性用風俗・女風なら「ストロベリーボーイズ{cityName}店」
          </h2>
          
          <div className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed space-y-3">
            <p>
              {cityName}の女性用風俗（女風）「ストロベリーボーイズ{cityName}店」は、{areas}をはじめ{cityName}エリア全域のホテルやご自宅へ出張する完全予約制の女性専用リラクゼーションサービスです。在籍するのは、容姿・接客マナー・人柄の厳格な審査と講習をクリアしたイケメンセラピストのみ。
            </p>
            <p>
              初めて女性用風俗をご利用になる方にも安心して心からときめいていただけるよう、事前見積もり通りの明朗会計と丁寧な無料事前相談をご用意しております。当日のご予約や深夜の出張にも対応しておりますので、まずは[本日の出勤セラピスト]をご覧いただくか、[LINE公式アカウント]よりお気軽にご相談ください。
            </p>
          </div>

          {/* 直下内部リンクSEOアンカーバッジ */}
          <div className="mt-6 pt-5 border-t border-rose-200/60 flex flex-wrap items-center gap-2.5 text-xs font-bold">
            <span className="text-slate-400 text-[11px] font-bold">【クイック案内】:</span>
            {isFukuoka ? (
              <>
                <Link href="/store/fukuoka/first-time" className="rounded-full bg-white px-3.5 py-1.5 text-rose-600 border border-rose-200 shadow-2xs hover:bg-rose-500 hover:text-white transition flex items-center gap-1">
                  <span>初めての方へ</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link href="/store/fukuoka/price" className="rounded-full bg-white px-3.5 py-1.5 text-rose-600 border border-rose-200 shadow-2xs hover:bg-rose-500 hover:text-white transition flex items-center gap-1">
                  <span>コース・料金</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link href="/store/fukuoka/area/hakata" className="rounded-full bg-white px-3.5 py-1.5 text-slate-700 border border-slate-200 hover:border-rose-300 transition">
                  ＃博多エリアガイド
                </Link>
                <Link href="/store/fukuoka/area/tenjin" className="rounded-full bg-white px-3.5 py-1.5 text-slate-700 border border-slate-200 hover:border-rose-300 transition">
                  ＃天神エリアガイド
                </Link>
                <Link href="/store/fukuoka/area/nakasu" className="rounded-full bg-white px-3.5 py-1.5 text-slate-700 border border-slate-200 hover:border-rose-300 transition">
                  ＃中洲エリアガイド
                </Link>
              </>
            ) : (
              <>
                <Link href="/store/yokohama/first-time" className="rounded-full bg-white px-3.5 py-1.5 text-rose-600 border border-rose-200 shadow-2xs hover:bg-rose-500 hover:text-white transition flex items-center gap-1">
                  <span>初めての方へ</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link href="/store/yokohama/price" className="rounded-full bg-white px-3.5 py-1.5 text-rose-600 border border-rose-200 shadow-2xs hover:bg-rose-500 hover:text-white transition flex items-center gap-1">
                  <span>コース・料金</span> <ChevronRight className="h-3 w-3" />
                </Link>
                <Link href="/store/yokohama/area/kannai" className="rounded-full bg-white px-3.5 py-1.5 text-slate-700 border border-slate-200 hover:border-rose-300 transition">
                  ＃関内エリアガイド
                </Link>
                <Link href="/store/yokohama/area/minatomirai" className="rounded-full bg-white px-3.5 py-1.5 text-slate-700 border border-slate-200 hover:border-rose-300 transition">
                  ＃みなとみらいガイド
                </Link>
                <Link href="/store/yokohama/area/sakuragicho" className="rounded-full bg-white px-3.5 py-1.5 text-slate-700 border border-slate-200 hover:border-rose-300 transition">
                  ＃桜木町エリアガイド
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 3. 信頼・安心バッジ帯 (横並び4機能) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-rose-100/80 shadow-2xs">
            <ShieldCheck className="h-5 w-5 text-rose-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">完全審査制セラピスト</div>
              <div className="text-[10px] text-slate-400">面接・講習クリア</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-rose-100/80 shadow-2xs">
            <Award className="h-5 w-5 text-rose-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">安心の明朗会計</div>
              <div className="text-[10px] text-slate-400">事前料金・追加なし</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-rose-100/80 shadow-2xs">
            <Clock className="h-5 w-5 text-rose-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">当日・即日出張OK</div>
              <div className="text-[10px] text-slate-400">ホテル・ご自宅対応</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-white p-3 border border-rose-100/80 shadow-2xs">
            <CheckCircle2 className="h-5 w-5 text-rose-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">秘密厳守・プライバシー</div>
              <div className="text-[10px] text-slate-400">完全個室エスコート</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
