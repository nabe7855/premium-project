import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'キャストの選び方ガイド｜女性用風俗・女風 ストロベリーボーイズ',
  description: '自分にぴったりのセラピストはどう選ぶ？タイプ別・目的別・雰囲気別の選び方のコツを分かりやすく解説します。',
};

export default function CastSelectGuidePage() {
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
            CHOICE GUIDE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#2b181c] leading-tight mb-6">
            失敗しない！<span className="text-[#d64567]">キャストの選び方ガイド</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
            どのようなセラピストを選べばいいか迷っていませんか？<br className="hidden sm:inline" />
            あなたの希望や気分にぴったりのパートナーを見つける3つのチェックポイントをご紹介します。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 space-y-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-rose-100/80 space-y-4">
          <div className="inline-flex items-center gap-2 text-rose-500 font-bold text-xs">
            <span>POINT 01</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">雰囲気・タイプで選ぶ（癒やし系 / お兄さん系 / 王道イケメン）</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            話を聞いてほしい方には聞き上手な「癒やし系・聞き上手タイプ」、リードしてほしい方には包容力のある「大人のお兄さんタイプ」がおすすめです。各セラピストの「性格タグ」や「写メ日記」で実際の雰囲気を確認してみましょう。
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm border border-rose-100/80 space-y-4">
          <div className="inline-flex items-center gap-2 text-rose-500 font-bold text-xs">
            <span>POINT 02</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">「写メ日記」や「インタビュー」で素顔をチェック</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            プロフィール写真だけでなく、日常の思いや趣味を綴った「写メ日記」を読むと、そのキャストの人柄や優しさがよく伝わります。言葉遣いや雰囲気が自分にしっくりくるか確認するのが成功のコツです。
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm border border-rose-100/80 space-y-4">
          <div className="inline-flex items-center gap-2 text-rose-500 font-bold text-xs">
            <span>POINT 03</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">迷ったときは「フリー指名」や「LINE相談」</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            「どうしても自分で決められない…」という場合は、スタッフにお気軽にご相談ください。ご希望の雰囲気やお悩みに合わせて、最適なセラピストをご提案・マッチングいたします。
          </p>
        </div>
      </section>

      <div className="text-center pt-4">
        <Link
          href="/#stores"
          className="inline-block rounded-full bg-[#d64567] px-8 py-3.5 text-xs font-bold text-white shadow-lg hover:brightness-105 transition"
        >
          セラピストを探してみる →
        </Link>
      </div>
    </main>
  );
}
