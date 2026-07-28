import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '本指名とフリー指名の違い｜女性用風俗・女風 ストロベリーボーイズ',
  description: '女風での「本指名」と「フリー指名」の違いを解説。初めて利用する方や指名方法に迷っている方向けのわかりやすいガイドです。',
};

export default function NominationGuidePage() {
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
            NOMINATION GUIDE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2b181c] leading-tight mb-6">
            本指名とフリー指名、<span className="text-[#d64567]">どう違うの？</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
            初めてご予約される際によくある「指名方法」の違いについて解説します。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-rose-100/80 space-y-4">
          <div className="inline-block rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
            ✨ 本指名（ほんしめい）
          </div>
          <h2 className="text-xl font-bold text-slate-900">写真やプロフィールで特定のキャストを指定する</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            「このセラピストにお願いしたい！」と特定のキャストをご指名いただく方法です。ご希望のセラピストのスケジュールに合わせてご予約枠を確保します。お気に入りのセラピストがいる場合や2回目以降のご利用に最適です。
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm border border-rose-100/80 space-y-4">
          <div className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            💡 フリー指名（ふりーしめい）
          </div>
          <h2 className="text-xl font-bold text-slate-900">希望日時や好みに応じて店舗側がマッチング</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            特定のキャストを指定せず、お客様のご希望日時やお好みのタイプに合わせて店舗側がおすすめのセラピストを手配する方法です。「初めてで誰を選べばいいか分からない」「今すぐ予約したい」という方におすすめです。
          </p>
        </div>
      </section>

      <div className="text-center pt-4">
        <Link
          href="/#stores"
          className="inline-block rounded-full bg-[#d64567] px-8 py-3.5 text-xs font-bold text-white shadow-lg hover:brightness-105 transition"
        >
          店舗一覧を見てみる →
        </Link>
      </div>
    </main>
  );
}
