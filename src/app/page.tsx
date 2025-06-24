import Link from "next/link";

const HomePage = () => {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-pink-700 mb-6">🏠 店舗一覧</h1>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <Link href="/tokyo" className="text-blue-600 underline text-lg">🗼 東京店</Link>
        </li>
        <li>
          <Link href="/osaka" className="text-blue-600 underline text-lg">🌀 大阪店</Link>
        </li>
        <li>
          <Link href="/nagoya" className="text-blue-600 underline text-lg">🏯 名古屋店</Link>
        </li>
      </ul>
    </main>
  );
};

export default HomePage;