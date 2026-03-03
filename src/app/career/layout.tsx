import { ShieldCheckIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    template: '%s | セラピスト採用・キャリアメディア',
    default: '未経験から稼げるセラピストへ | キャリアメディア',
  },
  description:
    '女性用風俗のセラピスト・出張ホストとして稼ぐためのノウハウ、面接対策、給与シミュレーションを公開しています。',
};

import AgeVerificationModal from '@/components/career/AgeVerificationModal';

// メディア専用の独立したレイアウト（クリーンな青基調）
export default function CareerMediaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-800">
      <AgeVerificationModal />

      {/* メディア専用ヘッダー */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/career" className="flex items-center gap-2">
            {/* クリーンな印象を与えるロゴアイコン */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <ShieldCheckIcon size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              THERAPIST <span className="text-blue-600">CAREER</span>
            </span>
          </Link>

          <nav className="hidden space-x-6 text-sm font-medium text-gray-600 md:flex">
            <Link href="/career" className="hover:text-blue-600">
              トップ
            </Link>
            <Link href="/career?category=beginner" className="hover:text-blue-600">
              初心者ガイド
            </Link>
            <Link href="/career?category=income" className="hover:text-blue-600">
              給料・稼ぎ方
            </Link>
            <Link href="/career?category=interview" className="hover:text-blue-600">
              面接・採用
            </Link>
          </nav>

          <a
            href="https://line.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-green-500 px-5 py-2 text-sm font-bold text-white shadow transition-colors hover:bg-green-600"
          >
            LINEで相談
          </a>
        </div>
      </header>

      {/* メインコンテンツ領域 */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">{children}</main>

      {/* メディア専用フッター */}
      <footer className="mt-20 border-t border-gray-200 bg-white py-10">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-gray-500 sm:px-6">
          <p className="mb-4">
            当メディアは、これからセラピストを目指す男性のためのクリーンなキャリア支援プラットフォームです。
            <br />
            法令を遵守し、健全な店舗運営のもとでの働き方を提案しています。
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <Link href="/terms" className="hover:text-gray-800">
              利用規約
            </Link>
            <Link href="/privacy" className="hover:text-gray-800">
              プライバシーポリシー
            </Link>
            <Link
              href="/store/fukuoka/recruit"
              className="font-bold text-blue-600 hover:text-gray-800"
            >
              採用・求人情報を見る
            </Link>
          </div>
          <p className="mt-8">© 2026 THERAPIST CAREER Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
