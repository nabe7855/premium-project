import SweetStayLayout from '@/components/sweetstay/SweetStayLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | SweetStay by ストロベリーボーイズ',
    default:
      '女性目線で選ぶ！おすすめラブホテルと極上デートプラン｜SweetStay by ストロベリーボーイズ',
  },
  description:
    'ラブホテルのプロである女性用風俗店が運営するデートプラン＆ホテル体験メディア。カタログ情報だけでは分からない「実際の居心地」から、周辺のデートスポット、おすすめのご飯屋さんまで、失敗しない極上のデートをプロデュースします。',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SweetStay',
  url: 'https://www.sutoroberrys.jp/sweetstay',
  description: '女性目線で選ぶ！おすすめラブホテルと極上デートプランメディア',
  publisher: {
    '@type': 'Organization',
    name: 'ストロベリーボーイズ',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.sutoroberrys.jp/logo.png', // 仮のロゴURL
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SweetStayLayout>{children}</SweetStayLayout>
    </>
  );
}
