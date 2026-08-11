import { UserCheckIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    template: '%s | イケオラボ by ストロベリーボーイズ',
    default: '女性用風俗セラピストという働き方を、取材と記録で伝えるメディア | イケオラボ',
  },
  description:
    '女性用風俗セラピストという働き方を、取材と記録で伝える求人メディア。実際の体験談や面接・研修のガイドラインを通じて、リアルな情報をお届けします。',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'イケオラボ',
  url: 'https://www.sutoroberrys.jp/ikeo',
  description: '女性用風俗セラピストという働き方を、取材と記録で伝えるメディア',
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
              仕事を知る
            </Link>
            <Link
              href="/ikeo/recruit"
              className="transition-colors hover:text-blue-600"
            >
              応募と面接
            </Link>
            <Link href="/ikeo?tag=インタビュー" className="transition-colors hover:text-blue-600">
              働く人の記録
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Potential Check (Diagnostic) link removed per user request */}
            {/* Consultant (LINE) link hidden for now as URL is not confirmed */}
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
          <div className="flex justify-center gap-8 text-[11px] font-bold tracking-widest text-slate-500">
            <Link href="/terms" className="hover:text-blue-600">
              利用規約
            </Link>
            <Link href="/privacy" className="hover:text-blue-600">
              プライバシーポリシー
            </Link>
            <Link href="/store/fukuoka/recruit" className="text-blue-600 hover:opacity-70">
              求人情報
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
