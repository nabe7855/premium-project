import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import AgeVerificationGuard from '@/components/common/AgeVerificationGuard';
import FooterGuard from '@/components/sections/layout/FooterGuard';
import HeaderGuard from '@/components/sections/layout/HeaderGuard';
import '@/styles/Footer.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP, Noto_Serif_JP, Lora, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import AttributionTracker from '@/components/recruit2/AttributionTracker';
import './globals.css';
import Providers from './providers';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const notoVariant = Noto_Sans_JP({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
});

const notoSerif = Noto_Serif_JP({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif',
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sutoroberrys.jp'),
  title: {
    default: '福岡の女性用風俗・出張ホストなら｜ストロベリーボーイズ',
    template: '%s｜ストロベリーボーイズ福岡店',
  },
  description: '福岡で女性用風俗・出張ホストをお探しならストロベリーボーイズへ。完全審査制の厳選されたイケメンセラピストが、ホテルやご自宅で極上の癒しを提供します。天神・博多エリア対応。',
  keywords: '女性用風俗,出張ホスト,福岡,天神,博多,女性向け,イケメン派遣',
  authors: [{ name: 'ストロベリーボーイズ' }],
  creator: 'ストロベリーボーイズ',
  applicationName: 'ストロベリーボーイズ',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://www.sutoroberrys.jp',
    siteName: 'ストロベリーボーイズ',
    title: '福岡の女性用風俗・出張ホストなら｜ストロベリーボーイズ',
    description: '福岡で女性用風俗・出張ホストをお探しならストロベリーボーイズへ。完全審査制の厳選されたイケメンセラピストが、ホテルやご自宅で極上の癒しを提供します。天神・博多エリア対応。',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'c7c614cd66f2c9b7',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="ja" 
      className={`${inter.variable} ${notoVariant.variable} ${notoSerif.variable} ${lora.variable} ${poppins.variable} antialiased`} 
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://vkrztvkpjcpejccyiviw.supabase.co" crossOrigin="anonymous" />
      </head>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      <body>
        <Providers>
          {/* ⚠️ AI & HUMAN GUARD: DO NOT REMOVE OR MODIFY. Handles landing source attribution & Analytics. */}
          <AttributionTracker />
          {/* HeaderGuard と FooterGuard でヘッダー・フッターの表示/非表示を制御 */}
          <AgeVerificationGuard>
            <HeaderGuard>
              <FooterGuard>{children}</FooterGuard>
            </HeaderGuard>
          </AgeVerificationGuard>
          <SpeedInsights />
          <Analytics />
        </Providers>
        <Toaster
          position="top-center"
          richColors
          duration={4000}
          toastOptions={{
            style: { fontFamily: 'inherit' },
          }}
        />

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
        {/* ✅ JSON-LD構造化データ（Organization） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ストロベリーボーイズ",
              "url": "https://www.sutoroberrys.jp",
              "logo": "https://www.sutoroberrys.jp/logo.png"
            }),
          }}
        />
        {/* ✅ JSON-LD構造化データ（WebSite） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ストロベリーボーイズ",
              "url": "https://www.sutoroberrys.jp",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.sutoroberrys.jp/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </body>
    </html>
  );
}
