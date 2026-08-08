import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import AgeVerificationGuard from '@/components/common/AgeVerificationGuard';
import FooterGuard from '@/components/sections/layout/FooterGuard';
import HeaderGuard from '@/components/sections/layout/HeaderGuard';
import '@/styles/Footer.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google';
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
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
});

const notoSerif = Noto_Serif_JP({
  weight: ['500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sutoroberrys.jp'),
  title: {
    default: '女性用風俗・女風・出張ホスト｜ストロベリーボーイズ【福岡・横浜】',
    template: '%s｜ストロベリーボーイズ',
  },
  description: '女性用風俗・女風の専門店「ストロベリーボーイズ」。福岡・横浜で完全審査制のイケメンセラピストがご指定ホテル・ご自宅で最高級の癒やしをお届け。',
  keywords: '女性用風俗,女性向け風俗,女風,出張ホスト,福岡,博多,天神,横浜,関内,セラピスト,女性専用',
  authors: [{ name: 'ストロベリーボーイズ' }],
  creator: 'ストロベリーボーイズ',
  applicationName: 'ストロベリーボーイズ',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://www.sutoroberrys.jp',
    siteName: 'ストロベリーボーイズ',
    title: '女性用風俗・出張ホスト｜ストロベリーボーイズ【福岡・横浜】',
    description: '福岡（博多・天神）・横浜（関内・みなとみらい）で展開。完全審査制のイケメンセラピストが極上の癒やしを提供する女性専用出張サロン。グループ店舗（東京・大阪・名古屋）とも連携。',
    images: [{ url: 'https://www.sutoroberrys.jp/ogp/default-v2.png', width: 1200, height: 630, alt: 'ストロベリーボーイズ' }],
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
      className={`${inter.variable} ${notoVariant.variable} ${notoSerif.variable} antialiased`} 
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

        {/* ✅ 固定のJSON-LD構造化データ（FAQ）は削除済 */}
        {/* ✅ JSON-LD構造化データ（Organization） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ストロベリーボーイズ",
              "alternateName": "Strawberry Boys",
              "url": "https://www.sutoroberrys.jp",
              "logo": "https://www.sutoroberrys.jp/logo.png",
              "foundingDate": "2018",
              "sameAs": [
                "https://twitter.com/oden0713",
                "https://www.instagram.com/sutoroberrys/",
                "https://sutoroberrys.com/main/",
                "https://sutoroberrys-osaka.com/main.html",
                "https://sutoroberrys-aichi.com/main.html"
              ],
              "description": "福岡（博多・天神）・横浜（関内・みなとみらい）を中心に展開する女性用風俗・出張サロン。グループ店舗（東京・大阪・名古屋）とも連携。"
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
              "alternateName": "女性用風俗 ストロベリーボーイズ",
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
