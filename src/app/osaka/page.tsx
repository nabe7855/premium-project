// src/app/osaka/page.tsx
import Link from "next/link";

const OsakaPage = () => {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-pink-700">🌀 大阪店</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <Link href="/tokyo" className="text-blue-600 underline">
            東京店へ
          </Link>
        </li>
        <li>
          <Link href="/nagoya" className="text-blue-600 underline">
            名古屋店へ
          </Link>
        </li>
        <li>
          <Link href="/" className="text-gray-600 underline">
            全店舗一覧へ
          </Link>
        </li>
      </ul>
    </main>
  );
};

export default OsakaPage;
