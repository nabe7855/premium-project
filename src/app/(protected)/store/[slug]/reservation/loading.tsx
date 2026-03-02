export default function ReservationLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 py-20 md:py-32">
      <div className="container mx-auto max-w-4xl px-4">
        {/* ヘッダーのスケルトン */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 h-10 w-48 animate-pulse rounded-full bg-rose-200" />
          <div className="mx-auto mb-4 h-12 w-3/4 animate-pulse rounded-2xl bg-gray-200 md:h-16" />
          <div className="mx-auto h-6 w-1/2 animate-pulse rounded-lg bg-gray-100" />
        </div>

        {/* 連絡先カードのスケルトン */}
        <div className="mb-12 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 rounded-2xl border-2 border-rose-50 bg-white p-6 shadow-sm"
            >
              <div className="h-14 w-14 animate-pulse rounded-full bg-rose-100" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
              <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        {/* フォームのスケルトン */}
        <div className="rounded-3xl border-2 border-rose-50 bg-white p-8 shadow-xl md:p-12">
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div className="mb-2 h-5 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-12 w-full animate-pulse rounded-xl bg-gray-50" />
              </div>
            ))}
            <div className="h-16 w-full animate-pulse rounded-2xl bg-rose-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
