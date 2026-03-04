import SweetStayLayout from '@/components/sweetstay/SweetStayLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Sweet Stay by Strawberry Boys',
    default: 'Sweet Stay - 現役セラピストが選ぶ、大人のラブホテルメディア',
  },
  description:
    'Strawberry Boysが贈る、本物のプロが選んだ「本当に使いやすい」ホテルのまとめメディア。大人の上質なライフスタイルと愛の形を提案します。',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SweetStayLayout>{children}</SweetStayLayout>;
}
