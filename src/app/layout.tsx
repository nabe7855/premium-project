import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import AgeVerificationGuard from '@/components/common/AgeVerificationGuard';
import FooterGuard from '@/components/sections/layout/FooterGuard';
import HeaderGuard from '@/components/sections/layout/HeaderGuard';
import '@/styles/Footer.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_JP, Noto_Serif_JP, Lora, Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
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
  title: 'ストロベリーボーイズ - 女性向け癒しサービス',
  description: '20代後半〜40代女性に選ばれる上質な癒し体験をお届けします。',
  keywords: 'イケメン派遣,癒し,女性向け,マッチング,ホスト,エンターテイメント',
  authors: [{ name: 'ストロベリーボーイズ' }],
  creator: 'ストロベリーボーイズ',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://www.sutoroberrys.jp', // This URL is for the root layout, not dynamic. Dynamic URLs should be handled in page.tsx or generateMetadata.
    siteName: 'ストロベリーボーイズ',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'c7c614cd66f2c9b7',
  },
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
      <GoogleTagManager gtmId="GTM-xxxxx" />
      <body>
        <Providers>
          {/* HeaderGuard と FooterGuard でヘッダー・フッターの表示/非表示を制御 */}
          <AgeVerificationGuard>
            <HeaderGuard>
              <FooterGuard>{children}</FooterGuard>
            </HeaderGuard>
          </AgeVerificationGuard>
          <SpeedInsights />
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
      </body>
    </html>
  );
}
