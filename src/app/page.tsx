'use client';

import { stores } from '@/data/storeData';
import StoreCard from '@/components/store/StoreCard';

export default function StoreSelectPage() {
  console.log('📦 StoreSelectPage レンダリング開始');
  console.log('🧩 stores データ:', stores);

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-8 sm:px-6">
      <header className="mb-10 text-center">
        <h1 className="mb-3 font-serif text-2xl font-bold text-gray-800 sm:text-3xl">
          いちご一会の招待状
        </h1>
        <p className="text-base text-gray-700">
          今日のあなたは、どんな特別な時間をお過ごしになりますか？
        </p>
        <p className="mt-2 text-sm text-gray-500">3つの招待状から、お選びください</p>

        <div className="mt-4 flex justify-center sm:mt-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-pink-300 shadow-md sm:h-12 sm:w-12">
            <span className="text-lg sm:text-xl">🍓</span>
          </div>
        </div>
      </header>

      <section className="space-y-12">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </section>
    </main>
  );
}
