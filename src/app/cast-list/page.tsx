import type { Cast } from "@/types/cast";
import { getAllCasts } from "@/lib/getAllCasts";
import CastCard from "@/components/cards/CastCard";

export default async function CastListPage() {
  const casts: Cast[] = await getAllCasts();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">キャスト一覧（テスト表示）</h1>
      <div className="flex flex-wrap gap-4">
        {casts.map((cast) => (
          <CastCard key={cast.id} {...cast} />
        ))}
      </div>
    </div>
  );
}