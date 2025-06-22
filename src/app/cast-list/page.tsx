// src/app/cast-list/page.tsx
import { getAllCasts } from "@/lib/getAllCasts";

const CastListPage = async () => {
  const casts = await getAllCasts();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">キャスト一覧</h1>
      <ul className="space-y-2">
        {casts.map((cast: { id: number; name: string }) => (
          <li key={cast.id} className="border p-2 rounded">
            {cast.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CastListPage;
