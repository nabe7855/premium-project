"use client";

import { useState } from "react";
import Link from "next/link";

const stores = [
  { name: "東京店", slug: "tokyo", emoji: "🗼" },
  { name: "大阪店", slug: "osaka", emoji: "🌀" },
  { name: "名古屋店", slug: "nagoya", emoji: "🍤" },
];

export default function StoreTabPage() {
  const [activeStore, setActiveStore] = useState(stores[0]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">🏪 店舗を選んでください</h1>

      {/* タブ */}
      <div className="flex space-x-4 mb-6 border-b pb-2">
        {stores.map((store) => (
          <button
            key={store.slug}
            onClick={() => setActiveStore(store)}
            className={`px-4 py-2 rounded-t font-semibold border ${
              activeStore.slug === store.slug
                ? "bg-pink-100 text-pink-800 border-pink-400"
                : "bg-white text-gray-600 border-gray-300"
            }`}
          >
            {store.emoji} {store.name}
          </button>
        ))}
      </div>

      {/* アクティブ店舗の情報 */}
      <div className="p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-2 text-pink-700">
          {activeStore.emoji} {activeStore.name}
        </h2>
        <p className="text-gray-600 mb-4">この店舗のキャスト一覧を確認できます。</p>
        <Link
          href={`/store/${activeStore.slug}/cast-list`}
          className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded"
        >
          キャスト一覧を見る
        </Link>
      </div>
    </main>
  );
}
