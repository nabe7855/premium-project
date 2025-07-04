// src/app/not-found.tsx

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center">
      <div>
        <h1 className="mb-4 text-4xl font-bold text-pink-600">404 - ページが見つかりません</h1>
        <p className="text-gray-600">URLをご確認のうえ、もう一度お試しください。</p>
      </div>
    </div>
  );
}
