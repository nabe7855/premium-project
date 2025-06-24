import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <Link
        href="/store"
        className="bg-pink-600 text-white px-6 py-3 rounded-lg text-xl hover:bg-pink-700 transition"
      >
        入店する
      </Link>
    </main>
  );
}
