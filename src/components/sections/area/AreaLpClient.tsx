'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Hotel, Sparkles, Clock, CheckCircle2, ChevronRight, MessageCircle } from 'lucide-react';
import CastCard from '@/components/sections/casts/casts/CastCard';
import { Cast } from '@/types/cast';

export interface AreaDetailInfo {
  slug: string;
  areaSlug: string;
  name: string;
  cityName: string;
  description: string;
  features: string[];
  recommendedHotels: string[];
  faqs: { question: string; answer: string }[];
}

interface AreaLpClientProps {
  areaInfo: AreaDetailInfo;
  casts: Cast[];
  storeSlug: string;
}

export default function AreaLpClient({ areaInfo, casts, storeSlug }: AreaLpClientProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-neutral-800">
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-900 via-rose-800 to-pink-900 pt-28 pb-16 text-white sm:pt-36 sm:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent"></div>
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wider text-rose-200 backdrop-blur-md mb-4 border border-white/20">
            {areaInfo.cityName}エリア出張対応拠点
          </span>
          <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl tracking-tight text-white mb-6 leading-tight">
            {areaInfo.name}の女性用風俗・女風<br />
            <span className="bg-gradient-to-r from-rose-200 via-pink-100 to-white bg-clip-text text-transparent">
              ストロベリーボーイズ{areaInfo.cityName}店
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-rose-100/90 font-medium mb-8 leading-relaxed">
            {areaInfo.name}のご指定ホテル・ご自宅へ、厳選された人気イケメンセラピストを派遣。<br className="hidden sm:inline" />
            完全個室・秘密厳守・安心の明朗会計で極上の癒やしをお届けいたします。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link
              href={`/store/${storeSlug}/reservation`}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-rose-950/30 transition-all hover:scale-105 hover:from-rose-600 hover:to-pink-600"
            >
              <Sparkles className="h-5 w-5" />
              <span>{areaInfo.name}でWeb予約する</span>
            </Link>
            <Link
              href={`/store/${storeSlug}/cast-list`}
              className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-4 text-base font-bold text-white border border-white/30 backdrop-blur-md transition-all hover:bg-white/20"
            >
              <span>出勤セラピストを見る</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 特長セクション */}
      <section className="py-12 bg-white sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {areaInfo.name}出張サービスの3つの安心ポイント
            </h2>
            <p className="text-sm text-gray-500 mt-2">初めての方も安心してご利用いただけます</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md">
                <Hotel className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{areaInfo.name}ホテル・自宅へ即対応</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {areaInfo.name}周辺のラブホテル・ビジネスホテル・ご自宅へセラピストが直接お伺いします。
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">完全明朗会計・追加料金なし</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                表示料金と出張交通費以外、不当な追加費用は一切かかりません。当日現金・各種決済対応。
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-md">
                <Clock className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">当日予約・24時間受付対応</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                「今すぐ癒やされたい」当日急なご予約も大歓迎。LINE・Web予約からスピーディーにご案内。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* エリア対応キャスト一覧 */}
      {casts && casts.length > 0 && (
        <section className="py-12 bg-slate-50 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">THERAPISTS</span>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mt-1">
                  {areaInfo.name}対応のセラピスト一覧
                </h2>
              </div>
              <Link
                href={`/store/${storeSlug}/cast-list`}
                className="mt-4 sm:mt-0 text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                全員を見る <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {casts.slice(0, 8).map((cast, index) => (
                <CastCard
                  key={cast.id}
                  cast={cast}
                  index={index}
                  storeSlug={storeSlug}
                  isFavorite={false}
                  onCastSelect={() => {}}
                  onToggleFavorite={() => {}}
                  sortBy="default"
                  currentlyPlayingId={null}
                  setCurrentlyPlayingId={() => {}}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* おすすめ出張エリア・ホテル案内 */}
      <section className="py-12 bg-white sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-pink-50/50 p-6 sm:p-10 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-rose-500" />
              <span>{areaInfo.name}エリアの主な出張対応スポット・ホテル</span>
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {areaInfo.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {areaInfo.recommendedHotels.map((hotel, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-xl bg-white p-3 text-xs font-bold text-gray-700 shadow-sm border border-rose-100">
                  <Hotel className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{hotel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* エリア特化FAQ */}
      <section className="py-12 bg-slate-50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {areaInfo.name}利用についてのよくある質問
            </h2>
          </div>

          <div className="space-y-4">
            {areaInfo.faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="text-rose-500 font-extrabold">Q.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 pl-6 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
