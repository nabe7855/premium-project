import { UserCheckIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    template: '%s | イケオラボ by ストロベリーボーイズ',
    default:
      '「イケてる男」になるための自己研鑽とモテるノウハウ｜イケオラボ by ストロベリーボーイズ',
  },
  description:
    '女性用風俗店がプロの目線で「女性を本当に喜ばせる方法」や垢抜け術を解説。自分磨きから会話術、女性を喜ばせるラブグッズの活用法まで、自信をつけて「選ばれる男」になるための情報と、その魅力を活かせる求人情報をお届けします。',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'イケオラボ',
  url: 'https://www.sutoroberrys.jp/ikeo',
  description: '「イケてる男」になるための自己研鑽とモテるノウハウメディア',
  publisher: {
    '@type': 'Organization',
    name: 'ストロベリーボーイズ',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.sutoroberrys.jp/logo.png', // 仮のロゴURL
    },
  },
};

// 男性向け自己研鑽メディア専用レイアウト（洗練されたダーク＆クリーン）
export default function CareerMediaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fcfdff] font-sans text-slate-800 selection:bg-blue-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* メディア専用ヘッダー */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/ikeo" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-lg">
              <UserCheckIcon size={20} />
            </div>
            <span className="font-serif text-xl font-bold tracking-tighter text-slate-900">
              イケオ<span className="text-blue-600">ラボ</span>
            </span>
          </Link>

          <nav className="hidden space-x-8 text-xs font-bold uppercase tracking-widest text-slate-500 md:flex">
            <Link href="/ikeo" className="transition-colors hover:text-blue-600">
              Top
            </Link>
            <Link
              href="/ikeo?tag=ファッション・美容"
              className="transition-colors hover:text-blue-600"
            >
              Style
            </Link>
            <Link href="/ikeo?tag=会話・コミュ力" className="transition-colors hover:text-blue-600">
              Commu.
            </Link>
            <Link href="/ikeo?tag=恋愛・デート" className="transition-colors hover:text-blue-600">
              Romance
            </Link>
            <Link
              href="/ikeo/recruit"
              className="text-blue-600 transition-opacity hover:opacity-70"
            >
              Career
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/ikeo/diagnostic"
              className="hidden text-xs font-bold text-slate-400 transition-colors hover:text-blue-600 sm:block"
            >
              Potetial Check
            </Link>
            <a
              href="https://line.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-slate-700"
            >
              Consultant
            </a>
          </div>
        </div>
      </header>

      {/* メインコンテンツ領域 */}
      <main className="mx-auto max-w-none">{children}</main>

      {/* 紳士向けフッター */}
      <footer className="mt-20 border-t border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <div className="mb-8 flex justify-center text-slate-300">
            <UserCheckIcon size={32} strokeWidth={1} />
          </div>
          <p className="mx-auto mb-10 max-w-2xl text-[13px] leading-relaxed text-slate-400">
            イケオラボは、男性の「自信」と「魅力」を科学し、行動で現実を変えるためのプラットフォームです。
            <br />
            洗練された知識を通じて、すべての男性が自分らしい輝きを放てる社会を目指しています。
          </p>
          <div className="flex justify-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <Link href="/terms" className="hover:text-blue-600">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-blue-600">
              Privacy
            </Link>
            <Link href="/store/fukuoka/recruit" className="text-blue-600 hover:opacity-70">
              Recruit Info
            </Link>
          </div>
          <p className="mt-12 text-[10px] tracking-widest text-slate-300">
            © 2026 IKEO LABO / Premium Media Group.
          </p>
        </div>
      </footer>
    </div>
  );
}
