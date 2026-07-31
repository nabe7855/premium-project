import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プランと料金の完全解説｜女性用風俗・女風 ストロベリーボーイズ',
  description: '女性用風俗ストロベリーボーイズの料金システム解説。基本コース料金、指名料、交通費、オプション料金まで明朗・明快に説明いたします。',
  alternates: {
    canonical: 'https://www.sutoroberrys.jp/plan',
  },
};

export default function PlanGuidePage() {
  return (
    <main className="min-h-screen bg-[#fffafb] text-slate-800 font-sans pb-20">
      <header className="border-b border-rose-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-lg font-bold tracking-widest text-[#331c21]">
            🍓 STRAWBERRY BOYS
          </Link>
          <Link href="/" className="text-xs font-bold text-slate-500 hover:text-rose-500 transition">
            ← トップへ戻る
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 to-transparent py-16 text-center px-6">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold text-rose-600 mb-4">
            PRICE & PLAN GUIDE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2b181c] leading-tight mb-6">
            安心の明朗会計！<span className="text-[#d64567]">プランと料金の解説</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
            ストロベリーボーイズでは、追加料金なしの明朗な料金設定を行っています。<br className="hidden sm:inline" />
            事前にお伝えした料金以外に不透明な請求は一切ございません。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-rose-100/80 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-rose-100 pb-3">
            💰 ご利用料金の内訳（トータル金額）
          </h2>
          <div className="bg-rose-50/50 rounded-2xl p-6 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">
              [ コース料金 ] ＋ [ 指名料 ] ＋ [ 実費交通費 ] ＝ 合計金額
            </p>
            <p className="text-xs text-slate-500">※入会金・年会費・謎のオプション自動追加などは一切ありません。</p>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-base text-slate-800">1. 基本コース料金</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              90分、120分、180分、ロングコースなど、ご希望の滞在時間に応じた時間制の基本料金です。お試しに最適なショートコースから、ゆっくりお喋りと癒やしを楽しめるお泊まりコースまでご用意しています。
            </p>

            <h3 className="font-bold text-base text-slate-800 pt-2">2. 指名料</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              特定のお気に入りのセラピストをご指名いただく場合にかかる料金です（店舗やキャストのランクにより1,000円〜2,000円程度）。
            </p>

            <h3 className="font-bold text-base text-slate-800 pt-2">3. 交通費</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ご指定の待ち合わせ場所・ホテル・ご自宅までのセラピストの実費交通費（電車代・タクシー代）です。事前に目安金額をご提示いたします。
            </p>
          </div>
        </div>
      </section>

      <div className="text-center pt-4">
        <Link
          href="/store/fukuoka/price"
          className="inline-block rounded-full bg-[#d64567] px-8 py-3.5 text-xs font-bold text-white shadow-lg hover:brightness-105 transition"
        >
          料金表ページで詳しく見る →
        </Link>
      </div>
    </main>
  );
}
