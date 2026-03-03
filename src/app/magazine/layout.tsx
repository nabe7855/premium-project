import MagazineAgeModal from '@/components/magazine/MagazineAgeModal';
import { HeartIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    template: '%s | 女性のための心とからだのケアメディア',
    default: '心とからだを満たす特別な体験 | 女性向けケアメディア',
  },
  description:
    '女性のデリケートな悩み、セルフケア、そして日常から少し離れた特別なリラクゼーション体験に関する情報を発信しています。',
};

// 女性向けメディア専用レイアウト（白と淡いピンク・ベージュ基調）
export default function MagazineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFDFD] font-sans text-gray-800 selection:bg-pink-100">
      <MagazineAgeModal />

      {/* 女性向けクリーンヘッダー */}
      <header className="sticky top-0 z-40 border-b border-pink-50 bg-white/95 shadow-[0_2px_10px_rgba(255,192,203,0.1)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/magazine" className="flex items-center gap-2">
            <div className="flex items-center text-pink-400">
              <HeartIcon fill="currentColor" size={24} />
            </div>
            <span className="font-serif text-xl tracking-widest text-gray-800">
              Lumiere<span className="ml-2 font-sans text-xs text-gray-400">magazine</span>
            </span>
          </Link>

          <nav className="hidden space-x-8 text-sm font-medium text-gray-500 md:flex">
            <Link href="/magazine" className="transition-colors hover:text-pink-500">
              ホーム
            </Link>
            <Link
              href="/magazine?category=beginner"
              className="transition-colors hover:text-pink-500"
            >
              初めての方へ
            </Link>
            <Link href="/magazine?category=care" className="transition-colors hover:text-pink-500">
              セルフケア
            </Link>
            <Link
              href="/magazine?category=report"
              className="transition-colors hover:text-pink-500"
            >
              体験談
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/store/fukuoka"
              className="hidden text-xs font-bold text-gray-400 hover:text-pink-500 sm:block"
            >
              店舗一覧へ
            </Link>
            <a
              href="https://line.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gray-800 px-5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-gray-700 hover:shadow-md"
            >
              無料相談コンシェルジュ
            </a>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">{children}</main>

      {/* 女性向けフッター */}
      <footer className="mt-20 border-t border-pink-50 bg-[#FFFafb] py-12">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs leading-relaxed text-gray-400 sm:px-6">
          <div className="mb-6 flex justify-center text-pink-200">
            <HeartIcon size={24} />
          </div>
          <p className="mb-6">
            Lumiere
            Magazineは、女性の心とからだの健康、そして日常を彩る特別な体験をご提案するメディアです。
            <br />
            すべての女性が自分らしく、心地よい時間を過ごせるようサポートいたします。
          </p>
          <div className="flex justify-center gap-6 font-medium text-gray-500">
            <Link href="/terms" className="hover:text-pink-500">
              利用規約
            </Link>
            <Link href="/privacy" className="hover:text-pink-500">
              プライバシーポリシー
            </Link>
            <Link href="/store/fukuoka" className="hover:text-pink-500">
              提携サロン（店舗情報）
            </Link>
          </div>
          <p className="mt-8 text-[10px]">© 2026 Lumiere Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
