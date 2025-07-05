// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_JP, Noto_Serif_JP, Dancing_Script } from 'next/font/google';
import HeaderGuard from '@/components/sections/layout/HeaderGuard';
import Head from 'next/head';

// ✅ Google Fonts 設定
const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

const notoSerif = Noto_Serif_JP({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

// ✅ SEO & OGP
export const metadata: Metadata = {
  title: '【公式】ストロベリーボーイ｜AIで出会う癒しの女性用風俗',
  description:
    '毎日頑張るあなたに、甘くとろけるいちご一会なひとときを。創業7年の安心とAIによる最適マッチングで、あなただけの"ストロベリー"と出会える女性用風俗です。',
  keywords: 'イケメン派遣,癒し,女性向け,AIマッチング,ストロベリーボーイズ',
  openGraph: {
    title: '【公式】ストロベリーボーイ｜AIで出会う癒しの女性用風俗',
    description:
      '毎日頑張るあなたに、甘くとろけるいちご一会なひとときを。創業7年の安心とAIによる最適マッチングで、あなただけの"ストロベリー"と出会える女性用風俗です。',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${notoSans.variable} ${notoSerif.variable} ${dancingScript.variable} bg-background font-sans text-foreground antialiased`}
    >
      <Head>
        {/* ✅ Google Fonts 最適化用 preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <HeaderGuard>{children}</HeaderGuard>

        {/* ✅ JSON-LD構造化データ（FAQ） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: '初めてでも大丈夫ですか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'はい、初回の方には専任のコンシェルジュが丁寧にサポートいたします。不安なことがあれば何でもお気軽にご相談ください。',
                  },
                },
                {
                  '@type': 'Question',
                  name: '料金システムはどうなっていますか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: '時間制の明確な料金システムです。追加料金等は一切発生いたしません。詳細はプランページをご確認ください。',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'キャンセルはできますか？',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'ご予約の24時間前まででしたら無料でキャンセル可能です。それ以降はキャンセル料が発生する場合がございます。',
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
