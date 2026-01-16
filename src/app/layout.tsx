import FooterGuard from '@/components/sections/layout/FooterGuard';
import HeaderGuard from '@/components/sections/layout/HeaderGuard';
import '@/styles/Footer.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers'; // 👈 React Query 用のラッパー

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ストロベリーボーイ - 女性向け癒しサービス',
  description: '20代後半〜40代女性に選ばれる上質な癒し体験をお届けします。',
  keywords: 'イケメン派遣,癒し,女性向け,マッチング,ホスト,エンターテイメント',
  authors: [{ name: 'ストロベリーボーイ' }],
  creator: 'ストロベリーボーイ',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://strawberry-boy.com',
    siteName: 'ストロベリーボーイ',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${inter.className} antialiased`} suppressHydrationWarning>
      <body>
        <Providers>
          {/* HeaderGuard と FooterGuard でヘッダー・フッターの表示/非表示を制御 */}
          <HeaderGuard>
            <FooterGuard>{children}</FooterGuard>
          </HeaderGuard>
        </Providers>

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
