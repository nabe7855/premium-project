import { HeartIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    template: '%s | アモラボ (AmoLab) by ストロベリーボーイズ',
    default: '女性のための性のお悩み解決とリアルな体験談｜アモラボ by ストロベリーボーイズ',
  },
  description:
    '女性用風俗店がプロの目線で女性の性の悩みやリアルな体験談を解説。セルフケアからラブグッズの活用法、パートナーとの関係構築まで、女性の性生活をより豊かで安心できるものにするための情報をお届けします。',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'アモラボ',
  url: 'https://www.sutoroberrys.jp/amolab',
  description: '女性のための性のお悩み解決とリアルな体験談メディア',
  publisher: {
    '@type': 'Organization',
    name: 'ストロベリーボーイズ',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.sutoroberrys.jp/logo.png', // 仮のロゴURL
    },
  },
};

// 女性向けメディア専用レイアウト（白と淡いピンク・ベージュ基調）
export default function MagazineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFDFD] font-sans text-gray-800 selection:bg-pink-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* 女性向けクリーンヘッダー */}
      <header className="sticky top-0 z-40 border-b border-pink-50 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/amolab" className="flex items-center gap-2">
            <div className="flex items-center text-pink-300">
              <HeartIcon fill="currentColor" size={20} />
            </div>
            <span className="font-serif text-lg tracking-[0.2em] text-gray-800">アモラボ</span>
          </Link>

          <nav className="hidden space-x-6 text-[11px] font-bold text-gray-400 md:flex">
            <Link
              href="/amolab"
              className="uppercase tracking-widest transition-colors hover:text-pink-500"
            >
              Magazine Top
            </Link>
            <Link
              href="/store/fukuoka"
              className="uppercase tracking-widest transition-colors hover:text-pink-500"
            >
              Store info
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://line.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-pink-500 px-4 py-1.5 text-[10px] font-bold text-white shadow-sm transition-all hover:bg-pink-600"
            >
              LINE Reservation
            </a>
          </div>
        </div>
      </header>

      {/* メインコンテンツ - 各ページ側で幅を制御できるようにラップを外す */}
      <main className="min-h-[60vh]">{children}</main>

      {/* 女性向けフッター */}
      <footer className="mt-20 border-t border-pink-50 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 text-center text-[11px] leading-relaxed text-gray-400 sm:px-6">
          <div className="mb-6 flex justify-center text-pink-200">
            <HeartIcon size={24} />
          </div>
          <p className="mx-auto mb-10 max-w-2xl">
            アモラボは、女性の心とからだの健康、そして日常を彩る特別な体験をご提案するメディアです。
            <br />
            すべての女性が自分らしく、心地よい時間を過ごせるようサポートいたします。
          </p>
          <div className="flex flex-wrap justify-center gap-8 font-bold uppercase tracking-widest text-gray-400">
            <Link href="/terms" className="transition-colors hover:text-pink-500">
              利用規約
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-pink-500">
              プライバシーポリシー
            </Link>
            <Link href="/store/fukuoka" className="transition-colors hover:text-pink-500">
              店舗情報
            </Link>
            <Link href="/ikeo" className="text-pink-300 transition-opacity hover:opacity-70">
              採用特設メディア
            </Link>
          </div>
          <p className="mt-12 text-[10px] tracking-widest">
            © 2026 AMOLAB MEDIA GROUP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
