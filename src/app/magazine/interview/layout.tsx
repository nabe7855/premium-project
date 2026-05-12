import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | ストロベリーボーイズ インタビュー',
    default: 'キャストインタビュー | ストロベリーボーイズ',
  },
  description:
    'ストロベリーボーイズのキャストへのインタビュー記事。キャストの素顔や想いを深掘りします。',
};

// インタビューセクション専用レイアウト
// amolab/layout.tsx と同様のパターン・既存ファイルには触れない
export default function InterviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: '#FAFAF8', color: '#1a1a1a' }}
    >
      {/* インタビュー専用ヘッダー */}
      <header
        className="sticky top-0 z-40 border-b shadow-sm backdrop-blur-md"
        style={{
          background: 'rgba(255,255,255,0.95)',
          borderColor: '#F9D1DA',
        }}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          {/* ロゴ */}
          <Link
            href="/magazine/interview"
            className="flex items-center gap-2 text-sm font-bold tracking-widest"
            style={{ color: '#E8567A' }}
          >
            <span className="text-lg">♡</span>
            <span>INTERVIEW</span>
          </Link>

          {/* ナビ */}
          <nav className="hidden items-center gap-6 text-[11px] font-bold tracking-widest text-gray-400 md:flex">
            <Link
              href="/magazine/interview"
              className="transition-colors hover:text-pink-500"
            >
              一覧
            </Link>
            <Link
              href="/store/fukuoka"
              className="transition-colors hover:text-pink-500"
            >
              店舗情報
            </Link>
          </nav>

          {/* CTA */}
          <a
            href="/store/fukuoka"
            className="rounded-full px-4 py-1.5 text-[10px] font-bold text-white shadow-sm transition-opacity hover:opacity-80"
            style={{ background: '#E8567A' }}
          >
            ご予約
          </a>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="min-h-[60vh]">{children}</main>

      {/* フッター */}
      <footer
        className="mt-20 border-t py-12"
        style={{ borderColor: '#F9D1DA', background: '#fff' }}
      >
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="mb-4 text-[11px] tracking-widest" style={{ color: '#E8567A' }}>
            ♡ STRAWBERRY BOYS INTERVIEW
          </p>
          <div className="mb-6 flex flex-wrap justify-center gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            <Link href="/terms" className="transition-colors hover:text-pink-500">
              利用規約
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-pink-500">
              プライバシーポリシー
            </Link>
            <Link href="/store/fukuoka" className="transition-colors hover:text-pink-500">
              店舗情報
            </Link>
            <Link href="/amolab" className="transition-colors hover:text-pink-500">
              アモラボ
            </Link>
          </div>
          <p className="text-[10px] tracking-widest text-gray-300">
            © 2026 STRAWBERRY BOYS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
