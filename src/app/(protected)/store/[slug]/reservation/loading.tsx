import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <div className="mb-4">
        <Loader2 className="h-12 w-12 animate-spin text-rose-500" />
      </div>
      <p className="text-lg font-bold text-gray-600">ご予約ページを読み込んでいます...</p>
    </div>
  );
}
