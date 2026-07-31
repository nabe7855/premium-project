import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '初めての方へ完全ガイド｜女性用風俗・女風 ストロベリーボーイズ',
  description: '女性用風俗（女風）を初めてご利用いただく方へ。ご予約から当日の流れ、ホテル・ご自宅での過ごし方までステップ別に分かりやすく解説いたします。',
  alternates: {
    canonical: 'https://www.sutoroberrys.jp/guide',
  },
};

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#fffafb] text-slate-800 font-sans pb-20">
      {/* 🌸 ヘッダーナビ */}
      <header className="border-b border-rose-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-serif text-lg font-bold tracking-widest text-[#331c21]">
            🍓 STRAWBERRY BOYS
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-slate-500 hover:text-rose-500 transition"
          >
            ← トップへ戻る
          </Link>
        </div>
      </header>

      {/* 👑 ヒーローエリア */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 to-transparent py-16 text-center px-6">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold text-rose-600 mb-4">
            BEGINNER'S GUIDE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2b181c] leading-tight mb-6">
            初めての方へ、<span className="text-[#d64567]">安心完全ガイド</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
            「興味はあるけれど少し不安…」「当日はどんな流れなの？」<br className="hidden sm:inline" />
            そんな初めての女性のお客様へ、ご予約からご利用当日までの流れを優しく解説します。
          </p>
        </div>
      </section>

      {/* 📋 ステップ別ガイド */}
      <section className="mx-auto max-w-4xl px-6 py-12 space-y-12">
        {/* Step 1 */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-rose-100/80 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white font-serif text-2xl font-bold shadow-md">
            1
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">STEP 01</span>
            <h2 className="text-xl font-bold text-slate-900">店舗・セラピストをお選びください</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              ご希望のエリア（東京・横浜・名古屋・大阪・福岡）の店舗ページから、セラピストのプロフィールや写メ日記、雰囲気をお確かめの上、お好みのセラピストをお探しください。お悩みの場合はフリー指名でのご予約も可能です。
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-rose-100/80 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white font-serif text-2xl font-bold shadow-md">
            2
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">STEP 02</span>
            <h2 className="text-xl font-bold text-slate-900">WebまたはLINEで簡単ご予約</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              予約フォームまたは各店舗の公式LINEより、ご希望の日時・コース時間・利用場所（ホテルまたはご自宅）をお知らせください。女性スタッフまたは専用システムが丁寧に対応いたします。
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-rose-100/80 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white font-serif text-2xl font-bold shadow-md">
            3
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">STEP 03</span>
            <h2 className="text-xl font-bold text-slate-900">当日の待ち合わせ・合流</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              ご指定のホテルまたはお約束の待ち合わせ場所にてセラピストと合流します。清潔感とおもてなしのマナーを徹底したイケメンセラピストが優しくエスコートいたします。
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-rose-100/80 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white font-serif text-2xl font-bold shadow-md">
            4
          </div>
          <div className="space-y-3">
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">STEP 04</span>
            <h2 className="text-xl font-bold text-slate-900">心解き放たれる極上のサロンタイム</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              お部屋に入られたら、まず明朗な会計（ご利用料金の確認）を行い施術・エスコートタイムが始まります。あなたのペースやご希望を最優先に、心身ともに癒やされる特別な時間をお過ごしください。
            </p>
          </div>
        </div>
      </section>

      {/* 🎀 CTA */}
      <section className="mx-auto max-w-2xl px-6 pt-8 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-rose-500 to-rose-600 p-8 text-white shadow-xl space-y-4">
          <h3 className="font-serif text-2xl font-bold">あなただけの特別な時間をお届けします</h3>
          <p className="text-xs text-rose-100 leading-relaxed">
            ご不安な点やご質問がございましたら、いつでもLINEにて気軽にお問合せください。
          </p>
          <div className="pt-2">
            <Link
              href="/#stores"
              className="inline-block rounded-full bg-white px-8 py-3.5 text-xs font-bold text-rose-600 shadow-md hover:bg-rose-50 transition"
            >
              店舗一覧から探す →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
