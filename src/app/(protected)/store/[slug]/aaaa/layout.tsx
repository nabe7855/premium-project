import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strawberry Match',
  description: 'キャストマッチング体験アプリ',
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-sans bg-gradient-to-br from-pink-200 via-red-200 to-rose-300 min-h-screen">
      {children}
    </div>
  );
}
